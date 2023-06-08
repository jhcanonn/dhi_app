'use client';

import { EventRendererProps } from '@aldabil/react-scheduler/types';
import { ButtonBase } from '@mui/material';

const CalendarEvent = ({
  event,
  onClick,
  ...dragProps
}: EventRendererProps) => {
  const { title, state_color } = event;

  return (
    <ButtonBase
      onClick={onClick}
      className={`flex flex-col`}
      style={{ backgroundColor: state_color }}
      {...dragProps}
    >
      <div className={`flex flex-col`}>
        <h3>{title}</h3>
        <h4>Working!!</h4>
      </div>
    </ButtonBase>
  );
};

export default CalendarEvent;
