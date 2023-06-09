'use client';

import { ButtonBase } from '@mui/material';
import { Tooltip } from 'primereact/tooltip';
import { EventRendererProps } from '@aldabil/react-scheduler/types';
import { useDragAttributes, useFormattedEventInfo } from '@hooks';
import { bgEventColor } from '@utils';
import { EventTags } from '.';

const CalendarEvent = ({ event, onClick }: EventRendererProps) => {
  const customDragProps = useDragAttributes(event);
  const { formatedTime } = useFormattedEventInfo(event);

  const { title, state_color, event_id } = event;
  const classEventId = 'event-' + event_id;

  return (
    <>
      <Tooltip
        className="event-tooltip"
        target={`.${classEventId}`}
        position="top"
        content={formatedTime}
      />
      <ButtonBase
        style={{ backgroundColor: bgEventColor, color: 'black' }}
        onClick={onClick}
        {...customDragProps}
      >
        <div
          className={`calendar-event ${classEventId}`}
          style={{ border: `3px solid ${state_color ?? 'black'}` }}
        >
          <EventTags />
          <span className="font-bold">{title}</span>
          <span>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Expedita,
            ipsam ratione ipsa magni nulla accusamus, dolorum omnis voluptatum
            voluptas laboriosam eos nemo tempora maxime unde quis ullam impedit
            non reiciendis?
          </span>
        </div>
      </ButtonBase>
    </>
  );
};

export default CalendarEvent;
