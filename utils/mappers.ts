import {
  AppointmentDirectus,
  AppointmentQuery,
  Box,
  BoxDirectus,
  BudgetForm,
  BudgetCreateRelationsDirectus,
  BudgetItem,
  BudgetItemsBoxService,
  BudgetItemsProducts,
  BudgetItemsTherapies,
  BudgetPanelCodes,
  BudgetRelationProps,
  BudgetType,
  BudgetsDirectus,
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
  BudgetEditRelationsDirectus,
  SchedulesDirectus,
  ScheduleType,
  BudgetStateDirectus,
  DropdownOption,
  InvoiceTypesDirectus,
  InvoiceItemsDirectus,
  InvoicePaymentWaysDirectus,
  InvoiceSiigoDirectus,
  InvoiceDocumentTypeDirectus,
  User,
  InvoicePriceDirectus,
  InvoiceItemsTaxesDirectus,
  FieldsPaymentWayItems,
  InvoiceType,
} from '@models'
import {
  BLOCK_BOX,
  BLOCK_SERVICE,
  BUDGET_CODE,
  DHI_SUCRUSAL,
  FINANCE_CODE,
  PAYMENT_WAY_CODE,
  budgetFormCodes,
} from './constants'
import {
  calcularEdadConMeses,
  getCurrencyCOP,
  getFormatedDateToEs,
} from './helpers'
import moment from 'moment'
import { idTypes } from './settings'
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
  const alerts = clientInfo?.alertas

  return {
    event_id: +data.id,
    start: moment.utc(data.inicio).toDate(),
    end: moment.utc(data.fin).toDate(),
    title: data.titulo,
    professional_id: +data?.profesional?.id,
    professional: {
      professional_id: +data?.profesional?.id,
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
    alerts,
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

export const getAge = (fecha: string | undefined) => {
  const birthDate = fecha ? moment(fecha).toDate() : null
  const age = birthDate ? calcularEdadConMeses(birthDate) : null
  return age ? `${age?.anios} años, ${age?.meses} meses` : ''
}

export const clientInfoToHeaderDataPDFMapper = (
  client: ClientDirectus,
  dataProfesional: DataSheet | any,
): IDataHeader => {
  const direccion = client?.datos_extra
    ? (client?.datos_extra as any)?.direccion ?? ''
    : ''

  return {
    clienteName: client.full_name,
    clienteEdad: getAge(client?.fecha_nacimiento),
    clienteNumDoc: `${client.tipo_documento} ${client.documento}`,
    ClienteDireccion: direccion,
    profesionalName: dataProfesional?.professional,
    profesionalNumDoc: dataProfesional?.professionalDocument,
    profesionalSignature: dataProfesional?.profesionalFirma?.id,
    direccionOficina: 'AV CALLE 127 No. 14 - 54 OFICINA 616',
  }
}

export const schedulesMapper = (schedules: SchedulesDirectus[]) =>
  schedules.map(
    (s) =>
      ({
        id: s.id,
        date: {
          date: moment(s.inicio).toDate(),
          timestamp: moment(s.inicio).valueOf(),
          formated: getFormatedDateToEs(s.inicio, 'ddd ll'),
        },
        init_time: getFormatedDateToEs(s.inicio, 'hh:mm A'),
        end_time: getFormatedDateToEs(s.fin, 'hh:mm A'),
        comment: s.comentario,
        schedule_state: {
          code: s.estado.id + '',
          name: s.estado.nombre,
          color: s.estado.color,
        },
        payment_state: {
          code: s.estado_pago.code,
          name: s.estado_pago.nombre,
        },
        professional: s.profesional.nombre,
        sucursal: DHI_SUCRUSAL,
        services: s.servicios,
      }) as ScheduleType,
  )

export const budgetsMapper = (budgets: BudgetsDirectus[]) =>
  budgets.map((b) => {
    const { presupuesto_fecha_vencimiento, ...extraData } = b.data_form
    return {
      id: b.id,
      name: b.nombre,
      value: {
        value: b.valor_total,
        formated: getCurrencyCOP(b.valor_total),
      },
      payed: {
        value: 0,
        formated: getCurrencyCOP(0),
      },
      cost: {
        value: 0,
        formated: getCurrencyCOP(0),
      },
      created_date: {
        date: moment(b.date_created).toDate(),
        timestamp: moment(b.date_created).valueOf(),
        formated: getFormatedDateToEs(b.date_created, 'ddd ll'),
      },
      due_date: {
        date: presupuesto_fecha_vencimiento
          ? moment(presupuesto_fecha_vencimiento).toDate()
          : null,
        timestamp: presupuesto_fecha_vencimiento
          ? moment(presupuesto_fecha_vencimiento).valueOf()
          : null,
        formated: presupuesto_fecha_vencimiento
          ? getFormatedDateToEs(presupuesto_fecha_vencimiento, 'ddd ll')
          : null,
      },
      state_budget: b.estado,
      state_payed: '',
      state_track: '',
      extraData: {
        panel_id: b.panel_id,
        comercial: b.comercial,
        servicios: b.servicios,
        terapias: b.terapias,
        productos: b.productos,
        ...extraData,
      },
    } as BudgetType
  })

export const budgetStateMapper = (states: BudgetStateDirectus[]) =>
  states.map(
    (state) =>
      ({
        name: state.nombre,
        value: JSON.stringify(state),
      }) as DropdownOption,
  )

export const budgetTherapiesMapper = (items: BudgetItemsTherapies[]) =>
  items.map(
    (item) =>
      ({
        name: item.terapias_id.nombre,
        value: JSON.stringify(item),
      }) as DropdownOption,
  )

export const budgetProductsMapper = (items: BudgetItemsProducts[]) =>
  items.map(
    (item) =>
      ({
        name: item.nombre,
        value: JSON.stringify(item),
      }) as DropdownOption,
  )

export const invoicePaymentWaysMapper = (items: InvoicePaymentWaysDirectus[]) =>
  items.map(
    (item) =>
      ({
        name: item.name,
        value: JSON.stringify(item),
      }) as DropdownOption,
  )

export const invoiceTypesMapper = (items: InvoiceTypesDirectus[]) =>
  items.map(
    (item) =>
      ({
        name: `${item.type} - ${item.code} - ${item.name}`,
        value: JSON.stringify(item),
      }) as DropdownOption,
  )

export const invoiceItemsMapper = (items: InvoiceItemsDirectus[]) =>
  items.map(
    (item) =>
      ({
        name: `${item.code} - ${item.name}`,
        value: JSON.stringify(item),
      }) as DropdownOption,
  )

export const invoicePriceListMapper = (item: InvoiceItemsDirectus) => {
  const prices = item.prices?.find((price) => price.currency_code === 'COP')
  return prices?.price_list.map(
    (price) =>
      ({
        name: getCurrencyCOP(price.value),
        value: JSON.stringify(price),
      }) as DropdownOption,
  )
}

export const invoiceTaxListMapper = (item: InvoiceItemsDirectus) =>
  item.taxes?.map(
    (tax) =>
      ({
        name: tax.name,
        value: JSON.stringify(tax),
      }) as DropdownOption,
  )

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
          name: (item.servicios_id as any).nombre,
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

const budgetMainData = (data: BudgetForm) => {
  const initCode =
    budgetFormCodes[data.presupuesto_planilla as keyof typeof budgetFormCodes]

  return {
    nombre: data[`${initCode}${BudgetPanelCodes.NAME}`],
    comercial: { id: data.presupuesto_comercial },
    panel_id: { code: data.presupuesto_planilla },
    data_form: {
      presupuesto_fecha_vencimiento:
        data[`${initCode}${BudgetPanelCodes.DUE_DATE}`] || null,
      presupuesto_incluye:
        data[`${initCode}${BudgetPanelCodes.INCLUDES}`] || '',
      presupuesto_formas_pago:
        data[`${initCode}${BudgetPanelCodes.PAYMENT_METHODS}`] || '',
      presupuesto_observaciones:
        data[`${initCode}${BudgetPanelCodes.GENERAL_OBS}`] || '',
    },
    valor_total: data.presupuesto_total,
    estado: data[`${initCode}${BudgetPanelCodes.STATE}`],
  }
}

export const budgetInitialDataMapper = (budget: BudgetType) => {
  const extra = budget.extraData
  const panelCode = extra.panel_id.code
  const initCode = budgetFormCodes[panelCode as keyof typeof budgetFormCodes]
  const groupItems = {}

  Object.values(BudgetItem).forEach((label) => {
    const initCode = `${BUDGET_CODE}${label.trim().toLocaleLowerCase()}`
    const turnedObj = (obj: BudgetRelationProps) => ({
      [`${initCode}${FieldsCodeBudgetItems.C}${obj.id}`]: obj.cantidad,
      [`${initCode}${FieldsCodeBudgetItems.V}${obj.id}`]: obj.valor_unitario,
      [`${initCode}${FieldsCodeBudgetItems.D}${obj.id}`]: obj.descuento,
      [`${initCode}${FieldsCodeBudgetItems.VCD}${obj.id}`]:
        obj.valor_con_descuento,
      [`${initCode}${FieldsCodeBudgetItems.VT}${obj.id}`]: obj.valor_total,
      [`${initCode}${FieldsCodeBudgetItems.A}${obj.id}`]: obj.aceptado,
    })

    switch (label) {
      case BudgetItem.SERVICES: {
        const services = extra.servicios.map((s) => ({
          ...turnedObj(s),
          [`${initCode}${FieldsCodeBudgetItems.L}${s.id}`]: JSON.stringify(
            s.salas_servicios_id,
          ),
        }))
        Object.assign(groupItems, ...services)
        break
      }
      case BudgetItem.PRODUCTS: {
        const products = extra.productos.map((p) => ({
          ...turnedObj(p),
          [`${initCode}${FieldsCodeBudgetItems.L}${p.id}`]: JSON.stringify(
            p.productos_id,
          ),
        }))
        Object.assign(groupItems, ...products)
        break
      }
      case BudgetItem.THERAPIES: {
        const therapies = extra.terapias.map((t) => ({
          ...turnedObj(t),
          [`${initCode}${FieldsCodeBudgetItems.L}${t.id}`]: JSON.stringify(
            t.terapias_salas_servicios_id,
          ),
        }))
        Object.assign(groupItems, ...therapies)
        break
      }
    }
  })

  return {
    presupuesto_id: budget.id,
    presupuesto_planilla: panelCode,
    presupuesto_comercial: extra.comercial.id,
    presupuesto_total: budget.value.value,
    [`${initCode}${BudgetPanelCodes.NAME}`]: budget.name,
    [`${initCode}${BudgetPanelCodes.DUE_DATE}`]: budget.due_date.date,
    [`${initCode}${BudgetPanelCodes.STATE}`]: budget.state_budget,
    [`${initCode}${BudgetPanelCodes.INCLUDES}`]: extra.presupuesto_incluye,
    [`${initCode}${BudgetPanelCodes.PAYMENT_METHODS}`]:
      extra.presupuesto_formas_pago,
    [`${initCode}${BudgetPanelCodes.GENERAL_OBS}`]:
      extra.presupuesto_observaciones,
    ...groupItems,
  } as BudgetForm
}

export const budgetCreateMapper = (
  data: BudgetForm,
  clientId: number | undefined,
) => ({
  paciente: { id: clientId },
  ...budgetMainData(data),
})

export const getItemKeys = (data: Record<string, any>, startWith: string) =>
  Object.keys(data).filter((key) => key.startsWith(startWith))

export const getNumberOrUUID = (key: string) => {
  const rowId = key.split('_').slice(-1)[0]
  return Number.isNaN(+rowId) ? (rowId as UUID) : +rowId
}

export const getRowIds = (data: Record<string, any>, startWith: string) => [
  ...new Set(getItemKeys(data, startWith).map(getNumberOrUUID)),
]

export const budgetCreateRelationsMapper = (
  data: BudgetForm,
  budgetId: UUID,
) => {
  const relationsData: BudgetCreateRelationsDirectus = {
    dataServices: [],
    dataProducts: [],
    dataTherapies: [],
  }

  Object.values(BudgetItem).forEach((code) => {
    const initCode = `${BUDGET_CODE}${code.trim().toLowerCase()}`
    getRowIds(data, `${initCode}_`).forEach((rowId) => {
      const itemId = +JSON.parse(
        data[`${initCode}${FieldsCodeBudgetItems.L}${rowId}`],
      ).id
      const cantidad = data[`${initCode}${FieldsCodeBudgetItems.C}${rowId}`]
      const valor_unitario =
        data[`${initCode}${FieldsCodeBudgetItems.V}${rowId}`]
      const descuento = data[`${initCode}${FieldsCodeBudgetItems.D}${rowId}`]
      const valor_con_descuento =
        data[`${initCode}${FieldsCodeBudgetItems.VCD}${rowId}`]
      const valor_total = data[`${initCode}${FieldsCodeBudgetItems.VT}${rowId}`]
      const aceptado = !!data[`${initCode}${FieldsCodeBudgetItems.A}${rowId}`]

      const relatedProps = {
        presupuesto_id: {
          id: budgetId,
        },
        cantidad,
        valor_unitario,
        descuento,
        valor_con_descuento,
        valor_total,
        aceptado,
      }

      switch (code) {
        case BudgetItem.PRODUCTS:
          relationsData.dataProducts.push({
            productos_id: {
              id: itemId,
            },
            ...relatedProps,
          })
          break
        case BudgetItem.SERVICES:
          relationsData.dataServices.push({
            salas_servicios_id: {
              id: itemId,
            },
            ...relatedProps,
          })
          break
        case BudgetItem.THERAPIES:
          relationsData.dataTherapies.push({
            terapias_salas_servicios_id: {
              id: itemId,
            },
            ...relatedProps,
          })
          break
      }
    })
  })

  return relationsData
}

export const budgetEditMapper = (data: BudgetForm) => {
  const relations: BudgetEditRelationsDirectus = {
    servicios: [],
    productos: [],
    terapias: [],
  }

  Object.values(BudgetItem).forEach((code) => {
    const initCode = `${BUDGET_CODE}${code.trim().toLowerCase()}`
    getRowIds(data, `${initCode}_`).forEach((rowId) => {
      const isEdit = typeof rowId === 'number'
      const itemId = +JSON.parse(
        data[`${initCode}${FieldsCodeBudgetItems.L}${rowId}`],
      ).id
      const cantidad = data[`${initCode}${FieldsCodeBudgetItems.C}${rowId}`]
      const valor_unitario =
        data[`${initCode}${FieldsCodeBudgetItems.V}${rowId}`]
      const descuento = data[`${initCode}${FieldsCodeBudgetItems.D}${rowId}`]
      const valor_con_descuento =
        data[`${initCode}${FieldsCodeBudgetItems.VCD}${rowId}`]
      const valor_total = data[`${initCode}${FieldsCodeBudgetItems.VT}${rowId}`]
      const aceptado = !!data[`${initCode}${FieldsCodeBudgetItems.A}${rowId}`]

      const relatedProps: Omit<BudgetRelationProps, 'id'> = {
        cantidad,
        valor_unitario,
        descuento,
        valor_con_descuento,
        valor_total,
        aceptado,
      }

      switch (code) {
        case BudgetItem.PRODUCTS: {
          relations.productos.push(
            isEdit
              ? { id: rowId, ...relatedProps }
              : {
                  productos_id: { id: itemId },
                  presupuesto_id: { id: data.presupuesto_id },
                  ...relatedProps,
                },
          )
          break
        }
        case BudgetItem.SERVICES:
          relations.servicios.push(
            isEdit
              ? { id: rowId, ...relatedProps }
              : {
                  salas_servicios_id: { id: itemId },
                  presupuesto_id: { id: data.presupuesto_id },
                  ...relatedProps,
                },
          )
          break
        case BudgetItem.THERAPIES:
          relations.terapias.push(
            isEdit
              ? { id: rowId, ...relatedProps }
              : {
                  terapias_salas_servicios_id: { id: itemId },
                  presupuesto_id: { id: data.presupuesto_id },
                  ...relatedProps,
                },
          )
          break
      }
    })
  })

  return { ...budgetMainData(data), ...relations }
}

export const invoiceSiigoMapper = (
  data: Record<string, any>,
  clientInfo: ClientDirectus | null,
  siigoDocumentType: InvoiceDocumentTypeDirectus[],
  user: User | null,
) => {
  const type = JSON.parse(data[`${FINANCE_CODE}type`]) as InvoiceTypesDirectus
  const items: Record<string, any>[] = []
  const payments: Record<string, any>[] = []

  Object.values(BudgetItem).forEach((code) => {
    const initCode = `${FINANCE_CODE}${code.trim().toLowerCase()}`
    getRowIds(data, `${initCode}_`).forEach((rowId) => {
      const item = JSON.parse(
        data[`${initCode}${FieldsCodeBudgetItems.L}${rowId}`],
      ) as InvoiceTypesDirectus
      const cantidad = data[`${initCode}${FieldsCodeBudgetItems.C}${rowId}`]
      const valor_unitario = JSON.parse(
        data[`${initCode}${FieldsCodeBudgetItems.VU}${rowId}`],
      ) as InvoicePriceDirectus
      const descuento = data[`${initCode}${FieldsCodeBudgetItems.D}${rowId}`]
      const valor_descuento =
        data[`${initCode}${FieldsCodeBudgetItems.VD}${rowId}`]
      const impuesto = JSON.parse(
        data[`${initCode}${FieldsCodeBudgetItems.I}${rowId}`],
      ) as InvoiceItemsTaxesDirectus
      const valor_total = data[`${initCode}${FieldsCodeBudgetItems.VT}${rowId}`]

      const siigoItem = {
        code: item.code,
        description: item.description,
        quantity: cantidad,
        price: valor_unitario.value,
        discount_rate: descuento,
        discount: valor_descuento,
        taxes: impuesto.id ? [{ id: impuesto.id }] : [],
        total_value: valor_total,
      }

      items.push(siigoItem)
    })
  })

  const initPaymentCode = `${FINANCE_CODE}${PAYMENT_WAY_CODE}`
  getRowIds(data, `${initPaymentCode}_`).forEach((rowId) => {
    const item = JSON.parse(
      data[`${initPaymentCode}${FieldsPaymentWayItems.L}${rowId}`],
    ) as InvoicePaymentWaysDirectus
    const value = data[`${initPaymentCode}${FieldsPaymentWayItems.V}${rowId}`]
    const dd = data[`${initPaymentCode}${FieldsPaymentWayItems.DD}${rowId}`]
    const due_date = dd ? moment(dd).format('YYYY-MM-DD') : undefined
    payments.push({ id: +item.id, value, due_date })
  })

  return {
    document: { id: Number(type.id) },
    date: moment(data[`${FINANCE_CODE}created_date`]).format('YYYY-MM-DD'),
    customer: {
      id_type: siigoDocumentType.find(
        (dt) => dt.homologo_app === clientInfo?.tipo_documento,
      )?.codigo,
      identification: clientInfo?.documento,
    },
    seller: Number(user?.user_siigo.id),
    stamp: { send: data[`${FINANCE_CODE}send_email_dian`] },
    mail: { send: data[`${FINANCE_CODE}send_email_client`] },
    observations: data[`${FINANCE_CODE}observaciones`],
    items,
    payments,
    paciente: { id: clientInfo?.id },
    comercial: { id: data[`${FINANCE_CODE}comercial`] },
    total_bruto: data[`${FINANCE_CODE}total_bruto`],
    total_descuentos: data[`${FINANCE_CODE}descuentos`],
    sub_total: data[`${FINANCE_CODE}subtotal`],
    total_iva: data[`${FINANCE_CODE}total_iva`],
    total_formas_pago: data[`${FINANCE_CODE}total_formas_de_pago`],
    total_neto: data[`${FINANCE_CODE}total_neto`],
  } as InvoiceSiigoDirectus
}

export const invoicesMapper = (invoices: InvoiceSiigoDirectus[]) => {
  return invoices.map(
    (i) =>
      ({
        id: i.id,
        created_date: {
          date: moment(i.date).toDate(),
          timestamp: moment(i.date).valueOf(),
          formated: getFormatedDateToEs(i.date, 'ddd ll'),
        },
        items: i.items,
        total_neto: {
          value: i.total_neto,
          formated: getCurrencyCOP(i.total_neto),
        },
        payed: {
          value: 0,
          formated: getCurrencyCOP(0),
        },
        debt: {
          value: 0,
          formated: getCurrencyCOP(0),
        },
      }) as InvoiceType,
  )
}
