'use client'

import { useEffect, useRef, useState } from 'react'
import { useClientContext, useGlobalContext } from '@contexts'
import { CreatedAttention, DataSheet } from '@models'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { ProgressSpinner } from 'primereact/progressspinner'
import { PanelForm } from '@components/molecules'
import {
  CREATE_ATTENTION,
  DHI_SUCRUSAL,
  PanelTags,
  getFormatedDateToEs,
} from '@utils'
import { useMutation } from '@apollo/client'
import { Toast } from 'primereact/toast'
import moment from 'moment'

const DataSheetAccordion = () => {
  const toast = useRef<Toast>(null)
  const [accordionIndex, setAccordionIndex] = useState<number[]>([])
  const { clientInfo, dataSheets, setDataSheets } = useClientContext()
  const { user, panels } = useGlobalContext()

  const [createAttention] = useMutation(CREATE_ATTENTION)

  const closeAccordionTab = (itemIndex: number) => {
    const _accordionIndex = accordionIndex ? [...accordionIndex] : []

    if (_accordionIndex.length === 0) {
      _accordionIndex.push(itemIndex)
    } else {
      const index = _accordionIndex.indexOf(itemIndex)

      if (index === -1) _accordionIndex.push(itemIndex)
      else _accordionIndex.splice(index, 1)
    }

    setAccordionIndex(_accordionIndex)
  }

  const addAttentionOnTable = (attention: CreatedAttention) => {
    const newAttention: DataSheet = {
      id: attention.id,
      date: {
        date: moment(attention.date_created).toDate(),
        timestamp: moment(attention.date_created).valueOf(),
        formated: getFormatedDateToEs(attention.date_created, 'ddd ll'),
      },
      professional: attention.user_created.profesional.nombre,
      sucursal: attention.sucursal,
      type: {
        code: attention.panel_id.code,
        name: attention.panel_id.nombre,
      },
      data: attention.valores,
    }
    setDataSheets((prevDS) => [...prevDS, newAttention])
    toast.current?.show({
      severity: 'success',
      summary: 'Atención guardada',
      detail: 'La atención fue guardada correctamente',
      life: 3000,
    })
  }

  const onSaveAttention = async (formData: any, code: string) => {
    try {
      const result: any = await createAttention({
        variables: {
          fichaId: clientInfo?.ficha_id?.id,
          panelCode: code,
          userId: user?.id,
          sucursal: DHI_SUCRUSAL,
          valores: formData,
        },
      })
      const attention: CreatedAttention =
        result.data.create_historico_atenciones_item
      if (attention) addAttentionOnTable(attention)
    } catch (error: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        sticky: true,
      })
    }
  }

  useEffect(() => {
    setAccordionIndex(dataSheets.length === 0 ? [0] : [])
  }, [dataSheets])

  return (
    <>
      <Toast ref={toast} />
      {panels.length ? (
        <Accordion
          multiple
          activeIndex={accordionIndex}
          onTabChange={(e: any) => setAccordionIndex(e.index)}
        >
          {panels
            .filter((p) => p.view_forms.includes(PanelTags.ATENTIONS))
            .sort((a, b) => a.orden - b.orden)
            .map((panel) => (
              <AccordionTab key={panel.code} header={panel.nombre}>
                <PanelForm
                  formId='accordion'
                  panel={panel}
                  onFormData={(formData: any) => {
                    closeAccordionTab(panel.orden - 1)
                    onSaveAttention(formData, panel.code)
                  }}
                />
              </AccordionTab>
            ))}
        </Accordion>
      ) : (
        <div className='flex justify-center'>
          <ProgressSpinner />
        </div>
      )}
    </>
  )
}

export default DataSheetAccordion
