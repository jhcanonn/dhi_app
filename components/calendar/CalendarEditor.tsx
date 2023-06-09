'use client';

import { useState } from 'react';
import {
  ProcessedEvent,
  SchedulerHelpers,
} from '@aldabil/react-scheduler/types';
import { TextField } from '@mui/material';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

type Props = {
  scheduler: SchedulerHelpers;
};

const CalendarEditor = ({ scheduler }: Props) => {
  const event = scheduler.edited;
  console.log(event);

  // Make your own form/state
  const [state, setState] = useState({
    title: event?.title || '',
    description: event?.description || '',
  });
  const [error, setError] = useState('');

  const handleChange = (value: string, name: string) => {
    setState((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleSubmit = async () => {
    // Your own validation
    if (state.title.length < 3) {
      return setError('Min 3 letters');
    }

    try {
      scheduler.loading(true);

      /**Simulate remote data saving */
      const added_updated_event = (await new Promise((res) => {
        /**
         * Make sure the event have 4 mandatory fields
         * event_id: string|number
         * title: string
         * start: Date|string
         * end: Date|string
         */
        setTimeout(() => {
          res({
            event_id: event?.event_id || Math.random(),
            title: state.title,
            start: scheduler.state.start.value,
            end: scheduler.state.end.value,
            description: state.description,
          });
        }, 3000);
      })) as ProcessedEvent;

      scheduler.onConfirm(added_updated_event, event ? 'edit' : 'create');
      scheduler.close();
    } finally {
      scheduler.loading(false);
    }
  };

  const Header = ({ isEdit }: { isEdit: boolean }) => (
    <div className="flex justify-between items-center">
      <h2 className="font-bold">{`${isEdit ? 'Editar' : 'Crear'} cita`}</h2>
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

  const Footer = () => (
    <div className="flex justify-center items-center">
      <Button label="Agendar" severity="success" onClick={handleSubmit} />
    </div>
  );

  return (
    <Card
      title={<Header isEdit={!!event} />}
      footer={<Footer />}
      className="flex justify-between items-center"
    >
      <TextField
        label="Title"
        value={state.title}
        onChange={(e) => handleChange(e.target.value, 'title')}
        error={!!error}
        helperText={error}
        fullWidth
      />
      <TextField
        label="Description"
        value={state.description}
        onChange={(e) => handleChange(e.target.value, 'description')}
        fullWidth
      />
    </Card>
  );
};

export default CalendarEditor;
