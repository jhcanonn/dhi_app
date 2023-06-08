'use client';

import { useMultipleCalendarContext } from '@contexts';
import { MultipleCalendarMode } from '@utils';
import { Button } from 'primereact/button';

const FilterBar = () => {
  const { setMode, scheduler, mode } = useMultipleCalendarContext();
  const isDefault = mode === MultipleCalendarMode.DEFAULT;
  const bColor = isDefault ? 'p-button-secondary' : '';
  const modeToggle = isDefault
    ? MultipleCalendarMode.TABS
    : MultipleCalendarMode.DEFAULT;

  return (
    <section className="flex gap-2 justify-center pt-2">
      <Button
        className={`${bColor} p-button-sm p-button-rounded justify-center w-40`}
        onClick={() => {
          setMode(modeToggle);
          scheduler?.handleState(modeToggle, 'resourceViewMode');
        }}
      >
        {isDefault ? 'Modo Pestañas' : 'Modo Completo'}
      </Button>
    </section>
  );
};

export default FilterBar;
