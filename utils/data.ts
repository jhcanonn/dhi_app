import {
  Box,
  Country,
  DhiEvent,
  EventState,
  Pay,
  Professional,
  Service,
} from '@models';

export const COUNTRIES: Country[] = [
  { name: 'Colombia', code: 'CO', dialling: '+57' },
  { name: 'Australia', code: 'AU', dialling: '+61' },
  { name: 'Brazil', code: 'BR', dialling: '+55' },
  { name: 'China', code: 'CN', dialling: '+86' },
  { name: 'Egypt', code: 'EG', dialling: '+20' },
  { name: 'France', code: 'FR', dialling: '+33' },
  { name: 'Germany', code: 'DE', dialling: '+49' },
  { name: 'India', code: 'IN', dialling: '+91' },
  { name: 'Japan', code: 'JP', dialling: '+81' },
  { name: 'Spain', code: 'ES', dialling: '+34' },
  { name: 'United States', code: 'US', dialling: '+1' },
];

export const PROFESSIONALS: Professional[] = [
  {
    professional_id: 1,
    name: 'John',
    mobile: '555666777',
    avatar: '/assets/avatar-1.png',
  },
  {
    professional_id: 2,
    name: 'Sarah',
    mobile: '545678354',
    color: 'darkgreen',
  },
  {
    professional_id: 3,
    name: 'Joseph',
    mobile: '543678433',
    avatar: '/assets/avatar-3.png',
  },
  {
    professional_id: 4,
    name: 'Mera',
    mobile: '507487620',
    color: 'red',
  },
];

export const BOXES: Box[] = [
  {
    box_id: 1,
    name: 'Consulta primera vez',
    color: 'lightblue',
  },
  {
    box_id: 2,
    name: 'Consulta control',
    color: 'darkgreen',
  },
  {
    box_id: 3,
    name: 'Terapias por sesiones',
    color: 'orange',
  },
  {
    box_id: 4,
    name: 'Otras terapias',
    color: 'orange',
  },
  {
    box_id: 5,
    name: 'Implante capilar',
  },
  {
    box_id: 6,
    name: 'Peluquería',
    color: 'cyan',
  },
];

export const SERVICES: Service[] = [
  {
    service_id: 1,
    box_id: 1,
    name: 'Consulta primera vez',
  },
  {
    service_id: 2,
    box_id: 2,
    name: 'Consulta control implante',
  },
  {
    service_id: 3,
    box_id: 2,
    name: 'Consulta control terapias',
  },
  {
    service_id: 4,
    box_id: 3,
    name: 'Laser',
  },
  {
    service_id: 5,
    box_id: 3,
    name: 'Plasma',
  },
  {
    service_id: 6,
    box_id: 3,
    name: 'Mesoterapia',
  },
  {
    service_id: 7,
    box_id: 4,
    name: 'Mascarilla capilar',
  },
  {
    service_id: 8,
    box_id: 4,
    name: 'Masaje capilar',
  },
  {
    service_id: 9,
    box_id: 4,
    name: 'Sueroterapia capilar',
  },
  {
    service_id: 10,
    box_id: 5,
    name: '0-1.500',
  },
  {
    service_id: 11,
    box_id: 5,
    name: '1.500-2.000',
  },
  {
    service_id: 12,
    box_id: 5,
    name: '1.500-2.000',
  },
  {
    service_id: 13,
    box_id: 5,
    name: '2.000-2.500',
  },
  {
    service_id: 14,
    box_id: 5,
    name: '2.500--3.000',
  },
  {
    service_id: 15,
    box_id: 5,
    name: 'Dutasteride 1 sesión',
  },
  {
    service_id: 16,
    box_id: 5,
    name: 'Laserterapia Capilar',
  },
  {
    service_id: 17,
    box_id: 5,
    name: 'Mesoteria Capilar',
  },
  {
    service_id: 18,
    box_id: 6,
    name: 'Arreglo de Cejas',
  },
  {
    service_id: 19,
    box_id: 6,
    name: 'Corte de Pelo + Blower',
  },
  {
    service_id: 20,
    box_id: 6,
    name: 'Arreglo Barba',
  },
];

export const STATES: EventState[] = [
  { state_id: 1, name: 'Atendido', color: '#FF5733' },
  { state_id: 2, name: 'Confirmado', color: '#9AE51F' },
  { state_id: 3, name: 'Eliminado', color: '#1FC7E5' },
  { state_id: 4, name: 'Lista en espera', color: '#B21FE5' },
  { state_id: 5, name: 'Listo para ser atendido', color: '#A60142' },
  { state_id: 6, name: 'Llegó', color: '#AA854F' },
  { state_id: 7, name: 'No confirmado', color: '#81948B' },
  { state_id: 8, name: 'No pagó', color: '#1708A8' },
  { state_id: 9, name: 'Descartado', color: '#17bbff' },
  { state_id: 10, name: 'Suspendio', color: '#ff23A8' },
];

export const PAYS: Pay[] = [
  { pay_id: 1, name: 'Plan' },
  { pay_id: 2, name: 'Pagado' },
  { pay_id: 3, name: 'Abono' },
];

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
        new Date().getDate() - 1
      )
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
        new Date().getDate() - 2
      )
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(10)).setMinutes(0)).setDate(
        new Date().getDate() - 2
      )
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
        new Date().getDate() - 2
      )
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(11)).setMinutes(0)).setDate(
        new Date().getDate() + 10
      )
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
        new Date().getDate() - 1
      )
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(12)).setMinutes(0)).setDate(
        new Date().getDate() - 1
      )
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
        new Date().getDate() - 1
      )
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(14)).setMinutes(0)).setDate(
        new Date().getDate() - 1
      )
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
        new Date().getDate() + 1
      )
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(15)).setMinutes(30)).setDate(
        new Date().getDate() + 1
      )
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
        new Date().getDate() + 1
      )
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(16)).setMinutes(30)).setDate(
        new Date().getDate() + 1
      )
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
        new Date().getDate() - 1
      )
    ),
    end: new Date(
      new Date(new Date(new Date().setHours(15)).setMinutes(0)).setDate(
        new Date().getDate() - 1
      )
    ),
    professional_id: 1,
    box_id: 5,
    client_id: 11,
    state: STATES[6],
    first_name: 'Richard',
    last_name: 'Wilson',
  },
];
