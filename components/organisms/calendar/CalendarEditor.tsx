'use client';

import { EventActions, SchedulerHelpers } from '@aldabil/react-scheduler/types';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useForm } from 'react-hook-form';
import {
  InputNumberValid,
  InputTextValid,
  PhoneNumberValid,
  InputSwitchValid,
  DateTimeValid,
  DropdownValid,
  InputTextareaValid,
} from '@components/atoms';
import { Box, DhiEvent, Service } from '@models';
import { fetchingSimulation } from '@hooks';
import { useCalendarContext } from '@contexts';
import {
  PAGE_PATH,
  PAYS,
  SERVICES,
  STATES,
  calendarFieldsMapper,
  getResourceData,
  mandatoryAppointmentFields,
} from '@utils';
import { useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';
import { DropdownChangeEvent } from 'primereact/dropdown';

type Props = {
  scheduler: SchedulerHelpers;
};

const CalendarEditor = ({ scheduler }: Props) => {
  const toast = useRef<Toast>(null);
  const router = useRouter();
  const { resourceType, professionals, boxes } = useCalendarContext();

  const resourceField = calendarFieldsMapper(resourceType).idField;
  const event: DhiEvent | undefined = scheduler.edited;
  const resourceId = event
    ? Number(event[resourceField])
    : Number(scheduler[resourceField]);

  const eventData: DhiEvent = {
    event_id: event?.event_id!,
    title: event?.title!,
    start: event?.start || scheduler.state.start.value,
    end: event?.end || scheduler.state.end.value,
    [resourceField]: resourceId,
    professional:
      event?.professional ||
      getResourceData(professionals, resourceField, resourceId),
    box: event?.box || getResourceData(boxes, resourceField, resourceId),
    service: event?.service,
    client_id: event?.client_id,
    state: event?.state,
    pay: event?.pay,
    data_sheet: event?.data_sheet || 'Sin ficha',
    identification: event?.identification,
    first_name: event?.first_name,
    middle_name: event?.middle_name,
    last_name: event?.last_name,
    last_name_2: event?.last_name_2,
    phone: event?.phone,
    phone_2: event?.phone_2,
    dialling: event?.dialling,
    dialling_2: event?.dialling_2,
    email: event?.email,
    sent_email: event?.sent_email,
  };

  const getSubServices = (boxId: number) =>
    SERVICES.filter((s) => s.box_id === boxId);

  const [subServices, setSubServices] = useState<Service[]>(
    getSubServices(eventData.box?.box_id!)
  );
  const handleForm = useForm({ defaultValues: eventData });
  const { reset, handleSubmit } = handleForm;

  const onSubmit = async (data: DhiEvent) => {
    console.log({ data });
    if (mandatoryAppointmentFields.map((f) => data[f]).every(Boolean)) {
      try {
        scheduler.loading(true);
        const addedUpdatedEvent: DhiEvent = await fetchingSimulation(
          data,
          2000
        );
        /** Esto deberia hacerse en el backend */
        if (!addedUpdatedEvent.event_id) addedUpdatedEvent.event_id = 1234;
        if (!addedUpdatedEvent.client_id) addedUpdatedEvent.client_id = 1234;
        if (!addedUpdatedEvent.title)
          addedUpdatedEvent.title = `${addedUpdatedEvent?.first_name} ${addedUpdatedEvent?.last_name}`;
        /***/
        const action: EventActions = event ? 'edit' : 'create';
        scheduler.onConfirm(addedUpdatedEvent, action);
        scheduler.close();
      } finally {
        scheduler.loading(false);
      }
    } else reset();
  };

  const showNotification = (text: string) => {
    toast.current?.show({
      severity: 'info',
      summary: text,
      detail: 'Esta funcionalidad estará disponible proximamente.',
      life: 3000,
    });
  };

  const handleBoxChange = (e: DropdownChangeEvent) => {
    const box: Box = e.value;
    setSubServices(getSubServices(box.box_id));
  };

  const Header = () => (
    <div className="flex justify-between items-center">
      <div className="flex flex-col">
        <h2 className="font-bold">{`${event ? 'Editar' : 'Crear'} cita`}</h2>
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
    <>
      <Toast ref={toast} />
      <Card title={<Header />} className="flex [&_.p-card-content]:pb-0">
        <form
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <div className="flex flex-col md:flex-row gap-4 w-full md:[&>div]:w-80">
            <div className="flex flex-col gap-2">
              {event && (
                <InputTextValid
                  name="data_sheet"
                  label="Ficha"
                  handleForm={handleForm}
                  icon="book"
                  disabled
                />
              )}
              <InputNumberValid
                name="identification"
                label="Identificación"
                handleForm={handleForm}
                icon="id-card"
                minLength={6}
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
              />
              <PhoneNumberValid
                name="phone"
                diallingName="dialling"
                label="Teléfono"
                handleForm={handleForm}
                icon="phone"
                minLength={6}
                required
              />
              {event && (
                <PhoneNumberValid
                  name="phone_2"
                  diallingName="dialling_2"
                  label="Teléfono 2"
                  handleForm={handleForm}
                  icon="phone"
                  minLength={6}
                />
              )}
              <InputTextValid
                name="email"
                label="Correo electrónico"
                handleForm={handleForm}
                icon="envelope"
                required
                pattern={/\S+@\S+\.\S+/}
              />
              <InputSwitchValid
                name="sent_email"
                handleForm={handleForm}
                acceptMessage="Enviar correo."
              />
            </div>
            <div className="flex flex-col gap-2">
              {event && (
                <>
                  <DropdownValid
                    name="state"
                    label="Estado"
                    handleForm={handleForm}
                    list={STATES}
                    required
                  />
                  <DropdownValid
                    name="pay"
                    label="Pago"
                    handleForm={handleForm}
                    list={PAYS}
                    required
                  />
                </>
              )}
              <DateTimeValid
                name="start"
                label="Fecha inicio"
                handleForm={handleForm}
                required
              />
              <DateTimeValid
                name="end"
                label="Fecha fin"
                handleForm={handleForm}
                required
              />
              <DropdownValid
                name="professional"
                label="Profesional"
                handleForm={handleForm}
                list={professionals}
                required
              />
              <DropdownValid
                name="box"
                label="Box"
                handleForm={handleForm}
                list={boxes}
                required
                onCustomChange={handleBoxChange}
              />
              <DropdownValid
                name="service"
                label="Servicio"
                handleForm={handleForm}
                list={subServices!}
                emptyMessage={'Seleccione un Box'}
              />
              <InputTextareaValid
                name="description"
                label="Comentario"
                handleForm={handleForm}
              />
            </div>
          </div>
          <div className="flex justify-center gap-2 flex-wrap [&>button]:w-24">
            {event && (
              <>
                <Button
                  label={'Insumos'}
                  type="button"
                  severity="secondary"
                  rounded
                  onClick={(e: any) => showNotification(e.target.textContent)}
                />
                <Button
                  label={'Perfil'}
                  type="button"
                  severity="info"
                  rounded
                  onClick={() =>
                    router.push(
                      `${PAGE_PATH.clientList}/${eventData.client_id}`
                    )
                  }
                />
                <Button
                  label={'Historico'}
                  type="button"
                  severity="warning"
                  rounded
                  onClick={(e: any) => showNotification(e.target.textContent)}
                />
                <Button
                  label={'Repetir'}
                  type="button"
                  severity="help"
                  rounded
                  onClick={(e: any) => showNotification(e.target.textContent)}
                />
                <Button
                  label={'Pagar'}
                  type="button"
                  severity="danger"
                  rounded
                  onClick={(e: any) => showNotification(e.target.textContent)}
                />
              </>
            )}
            <Button label="Guardar" type="submit" severity="success" rounded />
          </div>
        </form>
      </Card>
    </>
  );
};

export default CalendarEditor;
