import { DhiEvent } from '@models';
import { Tag } from 'primereact/tag';

const EventTags = ({ label, event }: { label?: boolean; event?: DhiEvent }) => {
  return (
    <div className="flex flex-wrap">
      {label && (
        <span className="font-bold mr-2 text-[0.9rem]">Etiquetas:</span>
      )}
      {event?.pay && (
        <Tag
          className="calendar-tag"
          severity="danger"
          value={event.pay.code}
        />
      )}
      {event?.description && (
        <Tag icon="pi pi-comment" severity="info" className="calendar-tag" />
      )}
      <Tag icon="pi pi-check" severity="success" className="calendar-tag" />
      <Tag
        icon="pi pi-exclamation-triangle"
        severity="warning"
        className="calendar-tag"
      />
    </div>
  );
};

export default EventTags;
