import { DhiEvent, EventState } from '@models'

export const STATES: EventState[] = [
  { state_id: 1, name: 'Atendido', color: '#FF5733' },
  { state_id: 2, name: 'Confirmado', color: '#9AE51F' },
  { state_id: 3, name: 'No confirmado', color: '#81948B' },
  { state_id: 4, name: 'No llegó', color: '#34df8B' },
  { state_id: 5, name: 'Suspendio', color: '#ff23A8' },
  { state_id: 6, name: 'Pago descartado', color: '#17bbff' },
  { state_id: 7, name: 'Llegó', color: '#AA854F' },
  { state_id: 8, name: 'Lista en espera', color: '#B21FE5' },
  { state_id: 9, name: 'Listo para ser atendido', color: '#A60142' },
]

export const EVENTS: DhiEvent[] = [
  {
    event_id: 1,
    title: 'Event 1',
    start: new Date(new Date(new Date().setHours(9)).setMinutes(30)),
    end: new Date(new Date(new Date().setHours(10)).setMinutes(30)),
    professional_id: 1,
    box_id: 1,
    client_id: 1,
    state: STATES[0],
    first_name: 'Kyle',
    last_name: 'Shelton',
  },
  {
    event_id: 2,
    title: 'Event 2',
    start: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
    end: new Date(new Date(new Date().setHours(11)).setMinutes(0)),
    professional_id: 2,
    box_id: 2,
    client_id: 2,
    state: STATES[1],
    first_name: 'Tiffany',
    last_name: 'Munoz',
  },
  {
    event_id: 3,
    title: 'Event 3',
    start: new Date(
      new Date(new Date(new Date().setHours(9)).setMinutes(0)).setDate(
        new Date().getDate() - 1,
      ),
    ),
    end: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
    professional_id: 1,
    box_id: 3,
    client_id: 3,
    state: STATES[5],
    allDay: true,
    first_name: 'Martin',
    last_name: 'Pierce',
  },
  {
    event_id: 4,
    title: 'Event 4',
    start: new Date(
      new Date(new Date(new Date().setHours(9)).setMinutes(0)).setDate(
        new Date().getDate() - 2,
      ),
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(10)).setMinutes(0)).setDate(
        new Date().getDate() - 2,
      ),
    ),
    professional_id: 2,
    box_id: 4,
    client_id: 4,
    state: STATES[3],
    first_name: 'Alicia',
    last_name: 'Moon',
  },
  {
    event_id: 5,
    title: 'Event 5',
    start: new Date(
      new Date(new Date(new Date().setHours(10)).setMinutes(0)).setDate(
        new Date().getDate() - 2,
      ),
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(11)).setMinutes(0)).setDate(
        new Date().getDate() + 10,
      ),
    ),
    professional_id: 4,
    box_id: 5,
    client_id: 5,
    state: STATES[3],
    allDay: true,
    first_name: 'Sara',
    last_name: 'Copeland',
  },
  {
    event_id: 6,
    title: 'Event 6',
    start: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
    end: new Date(new Date(new Date().setHours(12)).setMinutes(0)),
    professional_id: 2,
    box_id: 1,
    client_id: 6,
    first_name: 'Katherine',
    last_name: 'Perry',
  },
  {
    event_id: 7,
    title: 'Event 7',
    start: new Date(
      new Date(new Date(new Date().setHours(11)).setMinutes(0)).setDate(
        new Date().getDate() - 1,
      ),
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(12)).setMinutes(0)).setDate(
        new Date().getDate() - 1,
      ),
    ),
    professional_id: 3,
    box_id: 2,
    client_id: 7,
    state: STATES[10],
    first_name: 'Kelly',
    last_name: 'Brown',
  },
  {
    event_id: 8,
    title: 'Event 8',
    start: new Date(
      new Date(new Date(new Date().setHours(13)).setMinutes(0)).setDate(
        new Date().getDate() - 1,
      ),
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(14)).setMinutes(0)).setDate(
        new Date().getDate() - 1,
      ),
    ),
    professional_id: 4,
    box_id: 3,
    client_id: 8,
    state: STATES[8],
    first_name: 'Kyle',
    last_name: 'Shelton',
  },
  {
    event_id: 9,
    title: 'Event 11',
    start: new Date(
      new Date(new Date(new Date().setHours(13)).setMinutes(0)).setDate(
        new Date().getDate() + 1,
      ),
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(15)).setMinutes(30)).setDate(
        new Date().getDate() + 1,
      ),
    ),
    professional_id: 1,
    box_id: 4,
    client_id: 9,
    first_name: 'Samuel',
    last_name: 'Franklin',
  },
  {
    event_id: 10,
    title: 'Event 9',
    start: new Date(
      new Date(new Date(new Date().setHours(15)).setMinutes(0)).setDate(
        new Date().getDate() + 1,
      ),
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(16)).setMinutes(30)).setDate(
        new Date().getDate() + 1,
      ),
    ),
    professional_id: 2,
    box_id: 2,
    client_id: 10,
    state: STATES[4],
    first_name: 'Jenny',
    last_name: 'Williams',
  },
  {
    event_id: 11,
    title: 'Event 10',
    start: new Date(
      new Date(new Date(new Date().setHours(11)).setMinutes(0)).setDate(
        new Date().getDate() - 1,
      ),
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(15)).setMinutes(0)).setDate(
        new Date().getDate() - 1,
      ),
    ),
    professional_id: 1,
    box_id: 5,
    client_id: 11,
    state: STATES[6],
    first_name: 'Richard',
    last_name: 'Wilson',
  },
]
