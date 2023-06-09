/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useCalendarContext } from '@contexts';
import { useFormattedEventInfo } from '@hooks';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { EventTags } from '.';
import { DhiEvent, EditFn } from '@models';
import { BOXES, PROFESSIONALS } from '@utils';

type Props = {
  event: DhiEvent;
  closeFn: () => void;
};

const CalendarEventViewer = ({ event, closeFn }: Props) => {
  const { multipleCalendarScheduler } = useCalendarContext();
  const { formatedTime } = useFormattedEventInfo(event);

  const { professional_id, box_id } = event;
  const scheduler = multipleCalendarScheduler?.current?.scheduler!;
  const editFn: EditFn = scheduler.triggerDialog!;

  const professionalName = PROFESSIONALS.find(
    (p) => p.professional_id === +professional_id!
  )?.name!;

  const boxName = BOXES.find((b) => b.box_id === +box_id!)?.name!;

  const confirmDelete = () => {
    confirmDialog({
      acceptLabel: 'Si',
      rejectLabel: 'No',
      message: 'Quieres eliminar esta cita?',
      header: 'Confirmación',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      async accept() {
        await handlerDelete();
      },
    });
  };

  const handlerDelete = async () => {
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

  const handlerEdit = () => {
    editFn(true, event);
    closeFn();
  };

  const rowInfo = (text: string, iconName: string) =>
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
              onClick={handlerEdit}
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
          <EventTags label />
          {rowInfo(professionalName, 'user')}
          {rowInfo(boxName, 'box')}
          {rowInfo(formatedTime, 'calendar')}
        </section>
      </div>
    </>
  );
};

export default CalendarEventViewer;
