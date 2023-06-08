'use client';

import { EventRendererProps } from '@aldabil/react-scheduler/types';
import { useDragAttributes } from '@hooks';
import { bgEventColor } from '@utils';
import { Tooltip } from 'primereact/tooltip';
import { ButtonBase } from '@mui/material';
import { format } from 'date-fns';
import { useMultipleCalendarContext } from '@contexts';

const CalendarEvent = ({ event, onClick }: EventRendererProps) => {
  const { title, state_color, start, end, event_id } = event;

  const customDragProps = useDragAttributes(event);
  const { scheduler } = useMultipleCalendarContext();

  const classEventId = 'event-' + event_id;
  const hFormat = scheduler?.hourFormat === '12' ? 'hh:mm a' : 'HH:mm';
  const eventTime = `${format(start, hFormat, {
    locale: scheduler?.locale,
  })} - ${format(end, hFormat, { locale: scheduler?.locale })}`;

  return (
    <>
      <Tooltip
        className="event-tooltip"
        target={`.${classEventId}`}
        position="top"
        content={`${eventTime}`}
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
          <span className="font-bold">{title}</span>
          <span>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Expedita,
            ipsam ratione ipsa magni nulla accusamus, dolorum omnis voluptatum
            voluptas laboriosam eos nemo tempora maxime unde quis ullam impedit
            non reiciendis? Lorem ipsum dolor sit, amet consectetur adipisicing
            elit. Expedita, ipsam ratione ipsa magni nulla accusamus, dolorum
            omnis voluptatum voluptas laboriosam eos nemo tempora maxime unde
            quis ullam impedit non reiciendis?
          </span>
        </div>
      </ButtonBase>
    </>
  );
};

export default CalendarEvent;
