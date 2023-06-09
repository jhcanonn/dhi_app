'use client';

import { useState } from 'react';
import { useCalendarContext } from '@contexts';
import { ToggleButton, ToggleButtonChangeEvent } from 'primereact/togglebutton';
import { classNames } from 'primereact/utils';
import { ResourceMode, ResourceType } from '@models';
import { BOXES, PROFESSIONALS } from '@utils';

const FilterBar = () => {
  const [checkedMode, setCheckedMode] = useState(false);
  const [checkedResourceType, setCheckedResourceType] = useState(false);
  const { multipleCalendarScheduler, setResourceMode, setResourceType } =
    useCalendarContext();

  const scheduler = multipleCalendarScheduler?.current?.scheduler!;

  const handlerModeChange = (e: ToggleButtonChangeEvent) => {
    const modeToggle = checkedMode ? ResourceMode.DEFAULT : ResourceMode.TABS;
    setCheckedMode(e.value);
    setResourceMode(modeToggle);
    scheduler.handleState(modeToggle, 'resourceViewMode');
  };

  const handlerResourceTypeChange = (e: ToggleButtonChangeEvent) => {
    setCheckedResourceType(e.value);
    setResourceType(
      checkedResourceType ? ResourceType.PROFESSIONAL : ResourceType.BOX
    );
    scheduler.handleState(
      checkedResourceType ? PROFESSIONALS : BOXES,
      'resources'
    );
  };

  return (
    <section className="flex gap-2 justify-center pt-2">
      <ToggleButton
        onLabel="Ver Completo"
        offLabel="Ver por pestañas"
        checked={checkedMode}
        onChange={handlerModeChange}
        className={classNames(
          'p-button-sm p-button-rounded justify-center w-40'
        )}
      />
      <ToggleButton
        onLabel="Ver profesionales"
        offLabel="Ver boxes"
        checked={checkedResourceType}
        onChange={handlerResourceTypeChange}
        className={classNames(
          'p-button-sm p-button-rounded justify-center w-40'
        )}
      />
    </section>
  );
};

export default FilterBar;
