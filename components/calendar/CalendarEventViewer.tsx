import { Store } from '@aldabil/react-scheduler/store/types';
import { ProcessedEvent } from '@aldabil/react-scheduler/types';
import { EditFn, PROFESSIONALS } from '@utils';
import { Button } from 'primereact/button';

type Props = {
  event: ProcessedEvent;
  closeFn: () => void;
  scheduler: Store;
};

const CalendarEventViewer = ({ event, closeFn, scheduler }: Props) => {
  const { professional_id } = event;
  const editFn: EditFn = scheduler.triggerDialog!;

  const professionalName = PROFESSIONALS.find(
    (p) => p.professional_id === +professional_id
  )?.name;

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

  const rowInfo = (text: string, iconName: string) => (
    <span>
      <i className={`pi pi-${iconName}`} /> {text}
    </span>
  );

  return (
    <div className="flex flex-col sm:w-96">
      <section className="flex text-white items-center justify-between p-1 pl-3 bg-[var(--primary-color)]">
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
            onClick={handleDelete}
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
        {rowInfo(professionalName!, 'user')}
        {rowInfo('10:30am - 11:00am', 'calendar')}
      </section>
    </div>
  );
};

export default CalendarEventViewer;
