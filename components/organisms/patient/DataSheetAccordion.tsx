'use client'

import { ComingSoon } from '@components/templates'
import { useClientContext } from '@contexts'
import { DataSheetEnum, PanelsDirectus } from '@models'
import { getPanelsFromDirectus, refreshToken } from '@utils/api'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { Button } from 'primereact/button'
import { ProgressSpinner } from 'primereact/progressspinner'
import { useEffect, useState } from 'react'
import { Cookies, withCookies } from 'react-cookie'
import { PanelForm } from '@components/molecules'

type Props = {
  cookies: Cookies
}

const DataSheetAccordion = ({ cookies }: Props) => {
  const [accordionIndex, setAccordionIndex] = useState<number[]>([0])
  const { dataSheetPanels, setDataSheetPanels } = useClientContext()

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

  useEffect(() => {
    getPanels()
  }, [])

  return (
    <Accordion
      multiple
      activeIndex={accordionIndex}
      onTabChange={(e: any) => setAccordionIndex(e.index)}
    >
      <AccordionTab header={DataSheetEnum.CONSULTA_PRIMERA_VEZ}>
        {dataSheetPanels.length ? (
          <PanelForm
            panel={
              dataSheetPanels.filter(
                (p) => p.code === 'consulta_primera_vez',
              )[0]
            }
            onCustom={() => closeAccordionTab(0)}
          />
        ) : (
          <div className='flex justify-center'>
            <ProgressSpinner />
          </div>
        )}
      </AccordionTab>
      <AccordionTab header={DataSheetEnum.CONSULTA_CONTROL}>
        <div className='flex flex-col gap-4 items-center'>
          <ComingSoon />
          <Button
            label='Guardar atención'
            className='text-sm w-fit'
            onClick={() => closeAccordionTab(1)}
          />
        </div>
      </AccordionTab>
      <AccordionTab header={DataSheetEnum.COTIZACION}>
        <div className='flex flex-col gap-4 items-center'>
          <ComingSoon />
          <Button
            label='Guardar atención'
            className='text-sm w-fit'
            onClick={() => closeAccordionTab(2)}
          />
        </div>
      </AccordionTab>
      <AccordionTab header={DataSheetEnum.RISP_AC}>
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
  )
}

export default withCookies(DataSheetAccordion)
