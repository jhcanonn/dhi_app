import { Tag } from 'primereact/tag';

const EventTags = ({ label }: { label?: boolean }) => {
  return (
    <div className="flex flex-wrap">
      {label && (
        <span className="font-bold mr-2 text-[0.9rem]">Etiquetas:</span>
      )}
      <Tag icon="pi pi-user" className="calendar-tag" />
      <Tag icon="pi pi-check" severity="success" className="calendar-tag" />
      <Tag icon="pi pi-info-circle" severity="info" className="calendar-tag" />
      <Tag
        icon="pi pi-exclamation-triangle"
        severity="warning"
        className="calendar-tag"
      />
    </div>
  );
};

export default EventTags;
