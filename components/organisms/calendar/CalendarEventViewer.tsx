/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useCalendarContext, useGlobalContext } from '@contexts';
import { useFormattedEventInfo } from '@hooks';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { DhiEvent, EditFn } from '@models';
import { EventTags } from '@components/molecules';

type Props = {
  event: DhiEvent;
  closeFn: () => void;
};

const CalendarEventViewer = ({ event, closeFn }: Props) => {
  const { boxes, professionals } = useGlobalContext();
  const { calendarScheduler } = useCalendarContext();
  const { formatedTime, formatedDateTime } = useFormattedEventInfo(event);

  const { professional_id, box_id, allDay, first_name, last_name, pay } = event;
  const scheduler = calendarScheduler?.current?.scheduler!;
  const editFn: EditFn = scheduler.triggerDialog!;

  const professionalName = professionals.find(
    (p) => p.professional_id === +professional_id!
  )?.name!;

  const boxName = boxes.find((b) => b.box_id === +box_id!)?.name!;

  const confirmDelete = () => {
    confirmDialog({
      acceptLabel: 'Si',
      rejectLabel: 'No',
      message: 'Quieres eliminar esta cita?',
      header: 'Confirmación',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      async accept() {
        await handleDelete();
      },
    });
  };

  const handleDelete = async () => {
    try {
      scheduler.triggerLoading(true);
      let deletedId = event.event_id;
      // Trigger custom/remote when provided
      if (scheduler.onDelete) {
        const remoteId = await scheduler.onDelete(deletedId);
        if (remoteId) {
          deletedId = remoteId;
        } else {
          deletedId = '';
        }
      }
      if (deletedId) {
        closeFn();
        const updatedEvents = scheduler.events.filter(
          (e) => e.event_id !== deletedId
        );
        scheduler.handleState(updatedEvents, 'events');
      }
    } catch (error) {
      console.error(error);
    } finally {
      scheduler.triggerLoading(false);
    }
  };

  const handleEdit = () => {
    editFn(true, event);
    closeFn();
  };

  const rowInfo = (text: string | undefined, iconName: string) =>
    text && (
      <span>
        <i className={`pi pi-${iconName}`} /> {text}
      </span>
    );

  return (
    <>
      <ConfirmDialog />
      <div className="flex flex-col sm:w-96">
        <section className="header-event-viewer">
          <h2 className="font-bold">Infomacion de la cita</h2>
          <div className="flex">
            <Button
              onClick={handleEdit}
              className="rounded-full"
              tooltip="Editar"
              tooltipOptions={{
                className: 'tooltip',
                position: 'top',
              }}
            >
              <i className="pi pi-user-edit" />
            </Button>
            <Button
              onClick={confirmDelete}
              className="rounded-full"
              tooltip="Eliminar"
              tooltipOptions={{
                className: 'tooltip',
                position: 'top',
              }}
            >
              <i className="pi pi-trash" />
            </Button>
            <Button
              onClick={closeFn}
              className="rounded-full"
              tooltip="Cerrar"
              tooltipOptions={{
                className: 'tooltip',
                position: 'top',
              }}
            >
              <i className="pi pi-times" />
            </Button>
          </div>
        </section>
        <section className="flex flex-col py-2 px-3">
          <EventTags label event={event} />
          {rowInfo(professionalName, 'user')}
          {rowInfo(`${first_name} ${last_name}`, 'user')}
          {rowInfo(pay?.name, 'dollar')}
          {rowInfo(boxName, 'box')}
          {rowInfo(allDay ? formatedDateTime : formatedTime, 'calendar')}
        </section>
      </div>
    </>
  );
};

export default CalendarEventViewer;
