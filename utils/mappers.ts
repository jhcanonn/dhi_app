import {
  AppointmentDirectus,
  AppointmentQuery,
  Box,
  BoxDirectus,
  BudgetCreateForm,
  BudgetCreateRelationsDirectus,
  BudgetItem,
  BudgetItemsBoxService,
  BudgetItemsProducts,
  BudgetItemsTherapies,
  ClientDirectus,
  Country,
  DataSheet,
  DataSheetDirectus,
  DhiEvent,
  DhiPatient,
  EventState,
  EventStateDirectus,
  FieldsCodeBudgetItems,
  Pay,
  PaysDirectus,
  Professional,
  ProfessionalDirectus,
  Service,
  ServiceDHI,
  StatusDirectus,
} from '@models'
import {
  BLOCK_BOX,
  BLOCK_SERVICE,
  BUDGET_CODE,
  budgetFormCodes,
} from './constants'
import moment from 'moment'
import { idTypes } from './settings'
import { calcularEdadConMeses, getFormatedDateToEs } from './helpers'
import { IDataHeader } from './utils-pdf'
import { ListGroupType } from '@components/organisms/patient/BudgetItems'
import { UUID } from 'crypto'

export const professionalsMapper = (professionals: ProfessionalDirectus[]) => {
  return professionals?.map(
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
  return boxes?.map(
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
    ?.filter(
      (s) =>
        s.estado === StatusDirectus.PUBLISHED || s.nombre !== BLOCK_SERVICE,
    )
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
  return eventState?.map(
    (e) =>
      ({
        state_id: +e.id,
        name: e.nombre,
        color: e.color,
      }) as EventState,
  )
}

export const paysMapper = (pays: PaysDirectus[]) => {
  return pays?.map(
    (p) =>
      ({
        pay_id: +p.id,
        name: p.nombre,
        code: p.code,
      }) as Pay,
  )
}

export const directusClientMapper = (data: DhiPatient) => {
  return {
    id: data.id,
    tipo_documento: data.tipo_documento?.type,
    documento: data.documento,
    primer_nombre: data.primer_nombre,
    segundo_nombre: data.segundo_nombre,
    apellido_paterno: data.apellido_paterno,
    apellido_materno: data.apellido_materno,
    fecha_nacimiento: data.fecha_nacimiento?.toISOString(),
    correo: data.correo,
    indicativo: data.indicativo?.dialling,
    telefono: data.telefono,
    indicativo_2: data.indicativo_2?.dialling,
    telefono_2: data.telefono_2,
    estado_civil: data.estado_civil?.type,
    datos_extra: data.datos_extra,
  } as ClientDirectus
}

export const directusAppointmentMapper = (data: DhiEvent) => {
  const title =
    data.title ||
    (data?.first_name && data?.last_name
      ? `${data?.first_name} ${data?.last_name}`
      : '')
  return {
    title,
    start: data.start.toISOString(),
    end: data.end.toISOString(),
    client_id: data.client_id,
    box_id: data.box_id,
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
    data_extra: data.data_extra,
  } as AppointmentDirectus
}

export const dhiAppointmentMapper = (
  data: AppointmentQuery,
  countries: Country[],
  eventStates: EventState[],
) => {
  const servicesInfo = data.servicios
  const stateInfo = data.estado
  const payInfo = data.estado_pago
  const clientInfo = data.paciente
  const idType = idTypes.find((id) => id.type === clientInfo?.tipo_documento)
  const boxInfo = servicesInfo[0].salas_servicios_id.salas_id
  const dialling = countries.find((c) => c.dialling === clientInfo?.indicativo)
  const dialling_2 = countries.find(
    (c) => c.dialling === clientInfo?.indicativo_2,
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
    client_id: +clientInfo?.id,
    services: servicesInfo
      ?.filter(
        (s) =>
          s.salas_servicios_id.servicios_id.estado === StatusDirectus.PUBLISHED,
      )
      .map((s) => ({
        service_id: +s.salas_servicios_id.servicios_id.id,
        name: s.salas_servicios_id.servicios_id.nombre,
        time:
          s.salas_servicios_id.servicios_id.tiempo !== null
            ? +s.salas_servicios_id.servicios_id.tiempo
            : null,
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
    data_sheet: clientInfo?.ficha_id?.id,
    identification: clientInfo?.documento,
    first_name: clientInfo?.primer_nombre,
    middle_name: clientInfo?.segundo_nombre,
    last_name: clientInfo?.apellido_paterno,
    last_name_2: clientInfo?.apellido_materno,
    phone: clientInfo?.telefono,
    phone_2: clientInfo?.telefono_2,
    dialling,
    dialling_2,
    email: clientInfo?.correo,
    sent_email: data.enviar_correo,
    description: data.comentario,
    eventStates,
    data_extra: clientInfo?.datos_extra,
  } as DhiEvent
}

export const dhiDataSheetMapper = (dataSheet: DataSheetDirectus) =>
  ({
    id: dataSheet.id,
    status: dataSheet.status,
    date: {
      date: moment(dataSheet.date_created).toDate(),
      timestamp: moment(dataSheet.date_created).valueOf(),
      formated: getFormatedDateToEs(dataSheet.date_created, 'ddd ll'),
    },
    type: {
      code: dataSheet.panel_id?.code,
      name: dataSheet.panel_id?.nombre,
    },
    professional: dataSheet.user_created.profesional?.nombre,
    professionalDocument: dataSheet.user_created.profesional?.identificacion,
    profesionalFirma: dataSheet.user_created.profesional?.firma,
    profesionalNumReg: dataSheet.user_created.profesional?.no_registro_medico,
    sucursal: dataSheet.sucursal,
    data: dataSheet.valores,
  }) as DataSheet

export const clientInfoToHeaderDataPDFMapper = (
  client: ClientDirectus,
  rowData: DataSheet,
): IDataHeader => {
  const birthDate = client?.fecha_nacimiento
    ? moment(client?.fecha_nacimiento).toDate()
    : null
  const age = birthDate ? calcularEdadConMeses(birthDate) : null

  const direccion = client?.datos_extra
    ? (client?.datos_extra as any)?.direccion ?? ''
    : ''

  return {
    clienteName: client.full_name,
    clienteEdad: age ? `${age?.anios} años, ${age?.meses} meses` : '',
    clienteNumDoc: `${client.tipo_documento} ${client.documento}`,
    ClienteDireccion: direccion,
    profesionalName: rowData?.professional,
    profesionalNumDoc: rowData?.professionalDocument,
    direccionOficina: 'AV CALLE 127 No. 14 - 54 OFICINA 616',
  }
}

export const budgetTherapiesMapper = (items: BudgetItemsTherapies[]) =>
  items.map((item) => ({
    name: item.terapias_id.nombre,
    value: JSON.stringify(item),
  }))

export const budgetProductsMapper = (items: BudgetItemsProducts[]) =>
  items.map((item) => ({
    name: item.nombre,
    value: JSON.stringify(item),
  }))

export const budgetServicesMapper = (
  items: BudgetItemsBoxService[],
): ListGroupType[] => {
  const groupedBoxes: { [boxId: number]: { name: string; value: string }[] } =
    items
      .filter((item) => item.salas_id.nombre !== BLOCK_BOX)
      .reduce((acc, item) => {
        const key = item.salas_id.id
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!acc[key]) acc[key] = []
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        acc[key].push({
          name: item.servicios_id.nombre,
          value: JSON.stringify(item),
        })
        return acc
      }, {})

  return Object.values(groupedBoxes).map((items) => {
    const itemInfo: BudgetItemsBoxService = JSON.parse(items[0].value)
    return {
      label: itemInfo.salas_id.nombre,
      color: itemInfo.salas_id.color,
      items,
    } as ListGroupType
  })
}

export const budgetCreateMapper = (
  data: BudgetCreateForm,
  clientId: number | undefined,
) => {
  const initCode =
    budgetFormCodes[data.presupuesto_planilla as keyof typeof budgetFormCodes]
  return {
    nombre: data[`${initCode}nombre`],
    paciente: { id: clientId },
    comercial: { id: data.presupuesto_comercial },
    panel_id: { code: data.presupuesto_planilla },
    data_form: {
      presupuesto_fecha_vencimiento:
        data[`${initCode}fecha_vencimiento`] || null,
      presupuesto_aceptado: data[`${initCode}aceptado`] || false,
      presupuesto_incluye: data[`${initCode}incluye`] || '',
      presupuesto_formas_pago: data[`${initCode}formas_pago`] || '',
      presupuesto_observaciones: data[`${initCode}observaciones`] || '',
    },
    valor_total: data.presupuesto_total,
  }
}

export const budgetCreateRelationsMapper = (
  data: BudgetCreateForm,
  budgetId: UUID,
) => {
  const dataKeyValue = Object.entries(data)
  const relationsData: BudgetCreateRelationsDirectus = {
    dataServices: [],
    dataProducts: [],
    dataTherapies: [],
  }

  Object.values(BudgetItem).forEach((code) => {
    const listTag = `${BUDGET_CODE}${code.trim().toLowerCase()}${
      FieldsCodeBudgetItems.L
    }`
    dataKeyValue
      .filter(([key]) => key.startsWith(listTag))
      .forEach(([, value]) => {
        const itemId: number = JSON.parse(value).id
        switch (code) {
          case BudgetItem.PRODUCTS:
            relationsData.dataProducts.push({
              presupuesto_id: {
                id: budgetId,
              },
              productos_id: {
                id: itemId,
              },
            })
            break
          case BudgetItem.SERVICES:
            relationsData.dataServices.push({
              presupuesto_id: {
                id: budgetId,
              },
              salas_servicios_id: {
                id: itemId,
              },
            })
            break
          case BudgetItem.THERAPIES:
            relationsData.dataTherapies.push({
              presupuesto_id: {
                id: budgetId,
              },
              terapias_salas_servicios_id: {
                id: itemId,
              },
            })
        }
      })
  })

  return relationsData
}
