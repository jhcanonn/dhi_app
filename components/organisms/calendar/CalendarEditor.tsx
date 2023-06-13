'use client';

import { EventActions, SchedulerHelpers } from '@aldabil/react-scheduler/types';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useForm } from 'react-hook-form';
import { InputNumberValid, InputTextValid } from '@components/atoms';
import { DhiEvent } from '@models';
import { fetchingSimulation } from '@hooks';
import { useCalendarContext } from '@contexts';
import { calendarFieldsMapper } from '@utils';

type Props = {
  scheduler: SchedulerHelpers;
};

const CalendarEditor = ({ scheduler }: Props) => {
  const { resourceType } = useCalendarContext();
  const resourceField = calendarFieldsMapper(resourceType).idField;

  const event: DhiEvent | undefined = scheduler.edited;
  const eventData: DhiEvent = {
    event_id: event?.event_id || 100,
    title: event?.title || 'Evento por defecto',
    start: event?.start || scheduler.state.start.value,
    end: event?.end || scheduler.state.end.value,
    [resourceField]: event
      ? Number(event[resourceField])
      : Number(scheduler[resourceField]),
    identification: event?.identification,
    first_name: event?.first_name,
    middle_name: event?.middle_name,
    last_name: event?.last_name,
    last_name_2: event?.last_name_2,
  };

  const handleForm = useForm({ defaultValues: eventData });
  const { reset, handleSubmit } = handleForm;

  const onSubmit = async (data: DhiEvent) => {
    console.log({ data });

    if (Object.values(data).every(Boolean)) {
      console.log({ data });
      try {
        scheduler.loading(true);
        const addedUpdatedEvent: DhiEvent = await fetchingSimulation(
          data,
          2000
        );
        const action: EventActions = event ? 'edit' : 'create';
        scheduler.onConfirm(addedUpdatedEvent, action);
        scheduler.close();
      } finally {
        scheduler.loading(false);
      }
    } else reset();
  };

  const Header = () => (
    <div className="flex justify-between items-center">
      <div className="flex flex-col">
        <h2 className="font-bold">{`${event ? 'Editar' : 'Crear'} cita`}</h2>
        <span className="text-sm">{eventData.title}</span>
      </div>
      <Button
        icon="pi pi-times"
        severity="danger"
        size="small"
        rounded
        onClick={scheduler.close}
        aria-label="Cancel"
      />
    </div>
  );

  return (
    <Card title={<Header />} className="flex [&_.p-card-content]:pb-0">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 [&_input]:w-full"
      >
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <InputNumberValid
              name="identification"
              label="Identificación"
              handleForm={handleForm}
              icon="id-card"
              required
            />
            <InputTextValid
              name="first_name"
              label="1° Nombre"
              handleForm={handleForm}
              icon="user"
              required
            />
            <InputTextValid
              name="middle_name"
              label="2° Nombre"
              handleForm={handleForm}
              icon="user"
              required
            />
            <InputTextValid
              name="last_name"
              label="1° Apellido"
              handleForm={handleForm}
              icon="user"
              required
            />
            <InputTextValid
              name="last_name_2"
              label="2° Apellido"
              handleForm={handleForm}
              icon="user"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <div>More fields</div>
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            label={event ? 'Editar' : 'Crear'}
            type="submit"
            severity="success"
          />
        </div>
      </form>
    </Card>
  );
};

export default CalendarEditor;
