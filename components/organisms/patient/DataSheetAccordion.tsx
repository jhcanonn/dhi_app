'use client'

import { ComingSoon } from '@components/templates'
import { DataSheetEnum } from '@models'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { Button } from 'primereact/button'
import { useState } from 'react'

const DataSheetAccordion = () => {
  const [accordionIndex, setAccordionIndex] = useState<number[]>([0])

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

  return (
    <Accordion
      multiple
      activeIndex={accordionIndex}
      onTabChange={(e: any) => setAccordionIndex(e.index)}
    >
      <AccordionTab header={DataSheetEnum.CONSULTA_PRIMERA_VEZ}>
        <div className='flex flex-col gap-4 items-center'>
          <p className='m-0'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <Button
            label='Guardar atención'
            className='text-sm w-fit'
            onClick={() => closeAccordionTab(0)}
          />
        </div>
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

export default DataSheetAccordion
