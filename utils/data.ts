import { Box, Country, DhiEvent, Professional, Service } from '@models';

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
    name: 'Consulta Control',
    color: 'darkgreen',
  },
  {
    box_id: 3,
    name: 'Implante',
  },
  {
    box_id: 4,
    name: 'Micropigmentación',
    color: 'cyan',
  },
  {
    box_id: 5,
    name: 'Terapias capilares',
    color: 'darkblue',
  },
];

export const SERVICES: Service[] = [
  {
    service_id: 1,
    name: 'Servicio 1',
  },
  {
    service_id: 2,
    name: 'Servicio 2',
  },
  {
    service_id: 3,
    name: 'Servicio 3',
  },
  {
    service_id: 4,
    name: 'Servicio 4',
  },
  {
    service_id: 5,
    name: 'Servicio 5',
  },
];

export const EVENTS: DhiEvent[] = [
  {
    event_id: 1,
    title: 'Event 1',
    start: new Date(new Date(new Date().setHours(9)).setMinutes(30)),
    end: new Date(new Date(new Date().setHours(10)).setMinutes(30)),
    professional_id: 1,
    box_id: 1,
    state_color: 'red',
  },
  {
    event_id: 2,
    title: 'Event 2',
    start: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
    end: new Date(new Date(new Date().setHours(11)).setMinutes(0)),
    professional_id: 2,
    box_id: 2,
    state_color: 'yellow',
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
    state_color: 'purple',
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
    state_color: 'gray',
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
    state_color: 'darkcyan',
  },
  {
    event_id: 6,
    title: 'Event 6',
    start: new Date(new Date(new Date().setHours(10)).setMinutes(0)),
    end: new Date(new Date(new Date().setHours(12)).setMinutes(0)),
    professional_id: 2,
    box_id: 1,
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
    state_color: 'purple',
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
    state_color: 'gray',
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
    state_color: 'darkcyan',
  },
];
