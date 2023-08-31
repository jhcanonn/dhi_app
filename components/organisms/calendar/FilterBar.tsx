'use client'

import { useState } from 'react'
import { useCalendarContext, useGlobalContext } from '@contexts'
import {
  Box,
  CalendarType,
  Professional,
  ResourceMode,
  ResourceType,
} from '@models'
import { ToggleButton, ToggleButtonChangeEvent } from 'primereact/togglebutton'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect'
import { useGetResources } from '@hooks'
import { calendarMonth, errorMessages } from '@utils'

const FilterBar = () => {
  // Contexts
  const { professionals, boxes, events } = useGlobalContext()
  const {
    calendarScheduler,
    resourceMode,
    setResourceMode,
    resourceType,
    setResourceType,
    calendarType,
    setCalendarType,
    selectedProfessional,
    setSelectedProfessional,
    selectedProfessionals,
    setSelectedProfessionals,
    selectedBox,
    setSelectedBox,
    selectedBoxes,
    setSelectedBoxes,
  } = useCalendarContext()

  // Toggles buttons
  const isIndividual = calendarType === CalendarType.INDIVIDUAL
  const isProfessional = resourceType === ResourceType.PROFESSIONAL
  const [checkedCalendarType, setCheckedCalendarType] = useState(!isIndividual)
  const [checkedResourceType, setCheckedResourceType] = useState(
    !isProfessional,
  )
  const [checkedMode, setCheckedMode] = useState(
    resourceMode !== ResourceMode.DEFAULT,
  )

  const scheduler = calendarScheduler?.current?.scheduler!

  const calendarTypeChangeResources = useGetResources(
    !isIndividual,
    isProfessional,
  )
  const resourceTypeChangeResources = useGetResources(
    isIndividual,
    !isProfessional,
  )

  const handleCalendarTypeChange = (e: ToggleButtonChangeEvent) => {
    setCheckedCalendarType(e.value)
    setCalendarType(
      checkedCalendarType ? CalendarType.INDIVIDUAL : CalendarType.MULTIPLE,
    )
    scheduler.handleState(calendarTypeChangeResources, 'resources')
  }

  const handleModeChange = (e: ToggleButtonChangeEvent) => {
    const modeToggle = checkedMode ? ResourceMode.DEFAULT : ResourceMode.TABS
    setCheckedMode(e.value)
    setResourceMode(modeToggle)
    scheduler.handleState(modeToggle, 'resourceViewMode')
  }

  const handleResourceTypeChange = (e: ToggleButtonChangeEvent) => {
    setCheckedResourceType(e.value)
    setResourceType(
      checkedResourceType ? ResourceType.PROFESSIONAL : ResourceType.BOX,
    )
    scheduler.handleState(resourceTypeChangeResources, 'resources')
    scheduler.handleState(checkedResourceType ? null : calendarMonth, 'month')
    scheduler.handleState(
      checkedResourceType
        ? scheduler?.view === 'month'
          ? 'week'
          : scheduler?.view
        : scheduler?.view,
      'view',
    )
  }

  return (
    <section className='flex flex-col gap-2 p-2 md:!flex-row md:justify-center'>
      <div className='calendar-filters-container'>
        <ToggleButton
          onLabel='Ver agenda individual'
          offLabel='Ver agenda multiple'
          checked={checkedCalendarType}
          onChange={handleCalendarTypeChange}
          className={'p-button-sm sm:w-52'}
        />
        <ToggleButton
          onLabel='Ver completo'
          offLabel='Ver por pestañas'
          checked={checkedMode}
          onChange={handleModeChange}
          className={'p-button-sm sm:w-40'}
        />
        <ToggleButton
          onLabel='Ver por profesional'
          offLabel='Ver por box'
          checked={checkedResourceType}
          onChange={handleResourceTypeChange}
          className={'p-button-sm sm:w-40'}
        />
      </div>
      <div className='calendar-filters-container h-[5.1rem] sm:h-[2.3rem]'>
        {checkedCalendarType ? (
          checkedResourceType ? (
            <MultiSelect
              value={selectedBoxes}
              onChange={(e: MultiSelectChangeEvent) => {
                const boxesValues: Box[] = e.value
                setSelectedBoxes(boxesValues)
                scheduler.handleState(
                  boxesValues.length ? boxesValues : boxes,
                  'resources',
                )
              }}
              options={boxes}
              optionLabel='name'
              filter
              maxSelectedLabels={1}
              selectedItemsLabel='{0} boxes'
              placeholder='Seleccione boxes'
              className='p-multiselect-sm sm:!w-56'
              emptyFilterMessage={errorMessages.noExists}
            />
          ) : (
            <MultiSelect
              value={selectedProfessionals}
              onChange={(e: MultiSelectChangeEvent) => {
                const professionalsValues: Professional[] = e.value
                setSelectedProfessionals(professionalsValues)
                scheduler.handleState(
                  professionalsValues.length
                    ? professionalsValues
                    : professionals,
                  'resources',
                )
              }}
              options={professionals}
              optionLabel='name'
              filter
              maxSelectedLabels={1}
              selectedItemsLabel='{0} profesionales'
              placeholder='Seleccione profesionales'
              className='p-multiselect-sm sm:!w-56'
              emptyFilterMessage={errorMessages.noExists}
            />
          )
        ) : checkedResourceType ? (
          <Dropdown
            value={selectedBox}
            onChange={(e: DropdownChangeEvent) => {
              const boxValue: Box = e.value
              setSelectedBox(boxValue)
              scheduler.handleState([boxValue], 'resources')
            }}
            options={boxes}
            optionLabel='name'
            filter
            placeholder='Seleccione un box'
            className='p-inputtext-sm sm:!w-56'
            emptyMessage={errorMessages.noBoxes}
            emptyFilterMessage={errorMessages.noExists}
          />
        ) : (
          <Dropdown
            value={selectedProfessional}
            onChange={(e: DropdownChangeEvent) => {
              const professionalValue: Professional = e.value
              setSelectedProfessional(professionalValue)
              scheduler.handleState([professionalValue], 'resources')
              scheduler.handleState(
                events.filter(
                  (e) =>
                    e.professional?.professional_id ===
                    professionalValue.professional_id,
                ),
                'events',
              )
            }}
            options={professionals}
            optionLabel='name'
            filter
            placeholder='Seleccione un profesional'
            emptyMessage={errorMessages.noProfessionals}
            emptyFilterMessage={errorMessages.noExists}
            className='p-inputtext-sm sm:!w-56'
          />
        )}
      </div>
    </section>
  )
}

export default FilterBar
