'use client';

import { useState } from 'react';
import { useCalendarContext } from '@contexts';
import {
  Box,
  CalendarType,
  Professional,
  ResourceMode,
  ResourceType,
} from '@models';
import { ToggleButton, ToggleButtonChangeEvent } from 'primereact/togglebutton';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';

const FilterBar = () => {
  // Calendar context
  const {
    calendarScheduler,
    professionals,
    boxes,
    setResourceMode,
    setResourceType,
    setCalendarType,
  } = useCalendarContext();
  // Toggles buttons
  const [checkedMode, setCheckedMode] = useState(false);
  const [checkedCalendarType, setCheckedCalendarType] = useState(false);
  const [checkedResourceType, setCheckedResourceType] = useState(false);
  // Professionals fields
  const [selectedProfessional, setSelectedProfessional] =
    useState<Professional>(professionals[0]);
  const [selectedProfessionals, setSelectedProfessionals] = useState<
    Professional[] | null
  >(professionals);
  // Boxes fields
  const [selectedBox, setSelectedBox] = useState<Box>(boxes[0]);
  const [selectedBoxes, setSelectedBoxes] = useState<Box[] | null>(boxes);

  const scheduler = calendarScheduler?.current?.scheduler!;

  const handleCalendarTypeChange = (e: ToggleButtonChangeEvent) => {
    setCheckedCalendarType(e.value);
    setCalendarType(
      checkedCalendarType ? CalendarType.INDIVIDUAL : CalendarType.MULTIPLE
    );
    setSchedulerResources(!checkedCalendarType, !checkedResourceType);
  };

  const handleModeChange = (e: ToggleButtonChangeEvent) => {
    const modeToggle = checkedMode ? ResourceMode.DEFAULT : ResourceMode.TABS;
    setCheckedMode(e.value);
    setResourceMode(modeToggle);
    scheduler.handleState(modeToggle, 'resourceViewMode');
  };

  const handleResourceTypeChange = (e: ToggleButtonChangeEvent) => {
    setCheckedResourceType(e.value);
    setResourceType(
      checkedResourceType ? ResourceType.PROFESSIONAL : ResourceType.BOX
    );
    setSchedulerResources(checkedCalendarType, checkedResourceType);
  };

  const setSchedulerResources = (
    calendarType: boolean,
    resourceType: boolean
  ) => {
    const selProfessionals = calendarType
      ? selectedProfessionals?.length
        ? selectedProfessionals
        : professionals
      : [selectedProfessional];

    const selBoxes = calendarType
      ? selectedBoxes?.length
        ? selectedBoxes
        : boxes
      : [selectedBox];

    scheduler.handleState(
      resourceType ? selProfessionals : selBoxes,
      'resources'
    );
  };

  return (
    <section className="flex flex-col gap-2 p-2 md:!flex-row md:justify-center">
      <div className="calendar-filters-container">
        <ToggleButton
          onLabel="Ver agenda individual"
          offLabel="Ver agenda multiple"
          checked={checkedCalendarType}
          onChange={handleCalendarTypeChange}
          className={'p-button-sm sm:w-52'}
        />
        <ToggleButton
          onLabel="Ver completo"
          offLabel="Ver por pestañas"
          checked={checkedMode}
          onChange={handleModeChange}
          className={'p-button-sm sm:w-40'}
        />
        <ToggleButton
          onLabel="Ver por profesional"
          offLabel="Ver por box"
          checked={checkedResourceType}
          onChange={handleResourceTypeChange}
          className={'p-button-sm sm:w-40'}
        />
      </div>
      <div className="calendar-filters-container h-[5.1rem] sm:h-[2.3rem]">
        {checkedCalendarType ? (
          checkedResourceType ? (
            <MultiSelect
              value={selectedBoxes}
              onChange={(e: MultiSelectChangeEvent) => {
                const boxesValues: Box[] = e.value;
                setSelectedBoxes(boxesValues);
                scheduler.handleState(
                  boxesValues.length ? boxesValues : boxes,
                  'resources'
                );
              }}
              options={boxes}
              optionLabel="name"
              filter
              maxSelectedLabels={1}
              selectedItemsLabel="{0} boxes"
              placeholder="Seleccione boxes"
              className="p-multiselect-sm sm:w-56"
            />
          ) : (
            <MultiSelect
              value={selectedProfessionals}
              onChange={(e: MultiSelectChangeEvent) => {
                const professionalsValues: Professional[] = e.value;
                setSelectedProfessionals(professionalsValues);
                scheduler.handleState(
                  professionalsValues.length
                    ? professionalsValues
                    : professionals,
                  'resources'
                );
              }}
              options={professionals}
              optionLabel="name"
              filter
              maxSelectedLabels={1}
              selectedItemsLabel="{0} profesionales"
              placeholder="Seleccione profesionales"
              className="p-multiselect-sm sm:w-56"
            />
          )
        ) : checkedResourceType ? (
          <Dropdown
            value={selectedBox}
            onChange={(e: DropdownChangeEvent) => {
              const boxValue: Box = e.value;
              setSelectedBox(boxValue);
              scheduler.handleState([boxValue], 'resources');
            }}
            options={boxes}
            optionLabel="name"
            filter
            placeholder="Seleccione un box"
            className="p-inputtext-sm sm:w-56"
          />
        ) : (
          <Dropdown
            value={selectedProfessional}
            onChange={(e: DropdownChangeEvent) => {
              const professionalValue: Professional = e.value;
              setSelectedProfessional(professionalValue);
              scheduler.handleState([professionalValue], 'resources');
            }}
            options={professionals}
            optionLabel="name"
            filter
            placeholder="Seleccione un profesional"
            className="p-inputtext-sm sm:w-56"
          />
        )}
      </div>
    </section>
  );
};

export default FilterBar;
