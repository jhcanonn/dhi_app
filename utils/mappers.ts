import {
  Box,
  BoxDirectus,
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
          services: b.services.map((s) => ({
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
