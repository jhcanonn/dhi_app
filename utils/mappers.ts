import {
  AppointmentDirectus,
  AppointmentQuery,
  Box,
  BoxDirectus,
  Country,
  DhiEvent,
  EventState,
  EventStateDirectus,
  Pay,
  PaysDirectus,
  Professional,
  ProfessionalDirectus,
  Service,
  ServiceDHI,
  StatusDirectus,
} from '@models'
import moment from 'moment'
import { idTypes } from './settings'

export const professionalsMapper = (professionals: ProfessionalDirectus[]) => {
  return professionals
    ?.filter((p) => p.estado === StatusDirectus.PUBLISHED)
    ?.map(
      (p) =>
        ({
          professional_id: +p.id,
          name: p.nombre,
          mobile: p.telefono,
          avatar: p.avatar?.filename_download
            ? `/assets/${p.avatar?.filename_download}`
            : null,
        }) as Professional,
    )
}

export const boxesMapper = (boxes: BoxDirectus[]) => {
  return boxes
    ?.filter((b) => b.estado === StatusDirectus.PUBLISHED)
    ?.map(
      (b) =>
        ({
          box_id: +b.id,
          name: b.nombre,
          color: b.color,
          services: b.services
            ?.filter((s) => s.servicios_id.estado === StatusDirectus.PUBLISHED)
            .map((s) => ({
              box_service_id: s.id,
              ...s.servicios_id,
            })),
        }) as Box,
    )
}

export const servicesMapper = (services: ServiceDHI[]) => {
  return services
    ?.filter((s) => s.estado === StatusDirectus.PUBLISHED)
    ?.map(
      (s) =>
        ({
          service_id: +s.box_service_id,
          name: s.nombre,
          time: s.tiempo,
        }) as Service,
    )
}

export const eventStateMapper = (eventState: EventStateDirectus[]) => {
  return eventState
    ?.filter((e) => e.estado === StatusDirectus.PUBLISHED)
    ?.map(
      (e) =>
        ({
          state_id: +e.id,
          name: e.nombre,
          color: e.color,
        }) as EventState,
    )
}

export const paysMapper = (pays: PaysDirectus[]) => {
  return pays
    ?.filter((p) => p.estado === StatusDirectus.PUBLISHED)
    ?.map(
      (p) =>
        ({
          pay_id: +p.id,
          name: p.nombre,
          code: p.code,
        }) as Pay,
    )
}

export const directusAppointmentMapper = (data: DhiEvent) => {
  return {
    title: `${data?.first_name} ${data?.last_name}`,
    start: data.start.toISOString(),
    end: data.end.toISOString(),
    client_id: data.client_id,
    professional_id: data.professional_id,
    service_id: data.services?.map((s) => s.service_id),
    data_sheet: data.data_sheet,
    identification_type: data.id_type?.type,
    identification: data.identification,
    first_name: data.first_name,
    middle_name: data.middle_name || '',
    last_name: data.last_name,
    last_name_2: data.last_name_2 || '',
    dialling: data.dialling?.dialling,
    phone: data.phone,
    dialling_2: data.dialling_2?.dialling || '',
    phone_2: data.phone_2 || '',
    email: data.email,
    sent_email: data.sent_email,
    description: data.description || '',
    state_id: data.state?.state_id,
    pay_id: data.pay?.pay_id,
  } as AppointmentDirectus
}

export const dhiAppointmentMapper = (
  data: AppointmentQuery,
  countries: Country[],
) => {
  const servicesInfo = data.servicios
  const stateInfo = data.estado
  const payInfo = data.estado_pago
  const clientInfo = data.paciente
  const idType = idTypes.find((id) => id.type === clientInfo.tipo_documento)
  const boxInfo = servicesInfo[0].salas_servicios_id.salas_id
  const dialling = countries.find((c) => c.dialling === clientInfo.indicativo)
  const dialling_2 = countries.find(
    (c) => c.dialling === clientInfo.indicativo_2,
  )

  return {
    event_id: +data.id,
    start: moment.utc(data.inicio).toDate(),
    end: moment.utc(data.fin).toDate(),
    title: data.titulo,
    professional_id: +data.profesional.id,
    professional: {
      professional_id: +data.profesional.id,
    },
    box_id: +boxInfo.id,
    box: {
      box_id: +boxInfo.id,
    },
    client_id: +data.paciente.id,
    services: servicesInfo.map((s) => ({
      service_id: +s.salas_servicios_id.servicios_id.id,
      name: s.salas_servicios_id.servicios_id.nombre,
      time: +s.salas_servicios_id.servicios_id.tiempo,
    })),
    state: {
      state_id: +stateInfo.id,
      name: stateInfo.nombre,
      color: stateInfo.color,
    },
    pay: {
      pay_id: +payInfo.id,
      code: payInfo.code,
      name: payInfo.nombre,
    },
    id_type: {
      type: idType?.type,
      name: idType?.name,
    },
    identification: clientInfo.documento,
    first_name: clientInfo.primer_nombre,
    middle_name: clientInfo.segundo_nombre,
    last_name: clientInfo.apellido_paterno,
    last_name_2: clientInfo.apellido_materno,
    phone: clientInfo.telefono,
    phone_2: clientInfo.telefono_2,
    dialling,
    dialling_2,
    email: clientInfo.correo,
    sent_email: data.enviar_correo,
    description: data.comentario,
  } as DhiEvent
}
