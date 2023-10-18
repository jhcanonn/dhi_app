'use client'

import { ComingSoon } from '@components/templates'
import { useClientContext, useGlobalContext } from '@contexts'
import {
  AccordionLabels,
  CreatedAttention,
  DataSheet,
  PanelsDirectus,
} from '@models'
import { getPanelsFromDirectus, refreshToken } from '@utils/api'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { Button } from 'primereact/button'
import { ProgressSpinner } from 'primereact/progressspinner'
import { useEffect, useRef, useState } from 'react'
import { Cookies, withCookies } from 'react-cookie'
import { PanelForm } from '@components/molecules'
import { CREATE_ATTENTION, DHI_SUCRUSAL, getFormatedDateToEs } from '@utils'
import { useMutation } from '@apollo/client'
import { Toast } from 'primereact/toast'

type Props = {
  cookies: Cookies
}

const DataSheetAccordion = ({ cookies }: Props) => {
  const toast = useRef<Toast>(null)
  const [accordionIndex, setAccordionIndex] = useState<number[]>([0])
  const { clientInfo, setDataSheets, dataSheetPanels, setDataSheetPanels } =
    useClientContext()
  const { user } = useGlobalContext()

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

  const getPanels = async () => {
    const access_token = await refreshToken(cookies)
    const panels: PanelsDirectus[] = await getPanelsFromDirectus(access_token)
    setDataSheetPanels(panels)
  }

  const addAttentionOnTable = (attention: CreatedAttention) => {
    const newAttention: DataSheet = {
      id: attention.id,
      date: getFormatedDateToEs(attention.date_created),
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
    getPanels()
  }, [])

  return (
    <>
      <Toast ref={toast} />
      <Accordion
        multiple
        activeIndex={accordionIndex}
        onTabChange={(e: any) => setAccordionIndex(e.index)}
      >
        <AccordionTab header={AccordionLabels.CONSULTA_PRIMERA_VEZ}>
          {dataSheetPanels.length ? (
            <PanelForm
              formId='accordion'
              panel={dataSheetPanels.find(
                (p) => p.code === 'consulta_primera_vez',
              )}
              onFormData={(formData: any) => {
                closeAccordionTab(0)
                onSaveAttention(formData, 'consulta_primera_vez')
              }}
            />
          ) : (
            <div className='flex justify-center'>
              <ProgressSpinner />
            </div>
          )}
        </AccordionTab>
        <AccordionTab header={AccordionLabels.CONSULTA_CONTROL}>
          <div className='flex flex-col gap-4 items-center'>
            <ComingSoon />
            <Button
              label='Guardar atención'
              className='text-sm w-fit'
              onClick={() => closeAccordionTab(1)}
            />
          </div>
        </AccordionTab>
        <AccordionTab header={AccordionLabels.COTIZACION}>
          <div className='flex flex-col gap-4 items-center'>
            <ComingSoon />
            <Button
              label='Guardar atención'
              className='text-sm w-fit'
              onClick={() => closeAccordionTab(2)}
            />
          </div>
        </AccordionTab>
        <AccordionTab header={AccordionLabels.RISP_AC}>
          <div className='flex flex-col gap-4 items-center'>
            <ComingSoon />
            <Button
              label='Guardar atención'
              className='text-sm w-fit'
              onClick={() => closeAccordionTab(3)}
            />
          </div>
        </AccordionTab>
      </Accordion>
    </>
  )
}

export default withCookies(DataSheetAccordion)
