'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useClientContext, useGlobalContext } from '@contexts'
import { CreatedAttention, DataSheet, PanelsDirectus } from '@models'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { ProgressSpinner } from 'primereact/progressspinner'
import { PanelForm } from '@components/molecules'
import {
  CREATE_ATTENTION,
  DHI_SUCRUSAL,
  PanelTags,
  TRICOSCOPIA_URL,
  getFormatedDateToEs,
} from '@utils'
import { useMutation } from '@apollo/client'
import moment from 'moment'
import { withToast } from '@hooks'
import { Button } from 'primereact/button'

type Props = {
  showSuccess: (summary: ReactNode, detail: ReactNode) => void
  showError: (summary: ReactNode, detail: ReactNode) => void
}

const accordionTabHeader = (panel: PanelsDirectus) => (
  <div className='flex flex-wrap gap-3 align-items-center justify-between'>
    <p>{panel.nombre}</p>
    {panel.code === 'calculo_foliculos' && (
      <Button
        label='Ir a Tricoscopia'
        severity='help'
        outlined
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          window.open(TRICOSCOPIA_URL, '_blank')
        }}
        className='w-full md:w-auto'
      />
    )}
  </div>
)

const DataSheetAccordion = ({ showSuccess, showError }: Props) => {
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
      professionalDocument: attention.user_created.profesional?.identificacion,
      profesionalFirma: attention.user_created.profesional?.firma,
      profesionalNumReg: attention.user_created.profesional?.no_registro_medico,
      sucursal: attention.sucursal,
      type: {
        code: attention.panel_id.code,
        name: attention.panel_id.nombre,
      },
      data: attention.valores,
    }
    setDataSheets((prevDS) => [...prevDS, newAttention])
    showSuccess('Atención guardada', 'La atención fue guardada correctamente')
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
      showError('Error', error.message)
    }
  }

  useEffect(() => {
    setAccordionIndex(dataSheets.length === 0 ? [0] : [])
  }, [dataSheets])

  return panels.length ? (
    <Accordion
      multiple
      activeIndex={accordionIndex}
      onTabChange={(e: any) => setAccordionIndex(e.index)}
    >
      {panels
        .filter((p) => p.view_forms.includes(PanelTags.ATENTIONS))
        .sort((a, b) => a.orden - b.orden)
        .map((panel) => (
          <AccordionTab
            key={panel.code}
            header={accordionTabHeader(panel)}
            className='[&_.p-accordion-header-text]:w-full'
          >
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
  )
}

export default withToast(DataSheetAccordion)
