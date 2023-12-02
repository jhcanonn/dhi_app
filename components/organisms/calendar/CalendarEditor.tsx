'use client'

import { EventActions, SchedulerHelpers } from 'react-scheduler-lib/types'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { useMountEffect } from 'primereact/hooks'
import { useForm } from 'react-hook-form'
import {
  InputTextValid,
  PhoneNumberValid,
  InputSwitchValid,
  DateTimeValid,
  DropdownValid,
  InputTextareaValid,
  MultiSelectValid,
  AutoCompleteValid,
} from '@components/atoms'
import {
  Box,
  DhiEvent,
  EventState,
  Patient,
  Service,
  ServiceDHI,
} from '@models'
import { useCalendarContext, useGlobalContext } from '@contexts'
import {
  GET_INFO_CLIENT,
  PAGE_PATH,
  directusAppointmentMapper,
  calendarFieldsMapper,
  getResourceData,
  idTypes,
  servicesMapper,
  DEFAULT_APPOINTMENT_MINUTES,
  BLOCK_BOX,
  BLOCK_SERVICE,
  errorMessages,
  parseUrl,
  GET_CLIENT_BY_ID,
  regexPatterns,
  COMING_SOON,
  pickObjectProps,
} from '@utils'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { DropdownChangeEvent } from 'primereact/dropdown'
import { useQuery } from '@apollo/client'
import {
  AutoCompleteChangeEvent,
  AutoCompleteCompleteEvent,
} from 'primereact/autocomplete'
import {
  createAppointment,
  createBlock,
  editAppointment,
  refreshToken,
} from '@utils/api'
import { Cookies, withCookies } from 'react-cookie'
import { MultiSelectChangeEvent } from 'primereact/multiselect'
import moment from 'moment'
import {
  EventStateItem,
  EventStateItemColor,
  PatientDataExtra,
} from '@components/molecules'
import { UploadProfileImage } from '../patient'
import { Skeleton } from 'primereact/skeleton'
import { ToggleButton, ToggleButtonChangeEvent } from 'primereact/togglebutton'
import { classNames as cx } from 'primereact/utils'
import { useGoTo, withToast } from '@hooks'
import { Toast } from 'primereact/toast'

const statesView = [2, 7, 8, 9]

type Props = {
  showError: (summary: ReactNode, detail: ReactNode) => void
  showWarning: (summary: ReactNode, detail: ReactNode) => void
  showInfo: (summary: ReactNode, detail: ReactNode) => void
  cookies: Cookies
  scheduler: SchedulerHelpers
}

const showAlertsPatient = (alertsShow: any[] | undefined, toast: Toast) => {
  alertsShow
    ?.filter((al) => al.visible_agenda)
    .forEach(
      (a) =>
        toast?.show({
          severity: 'warn',
          summary: a.descripcion,
          sticky: true,
          closable: false,
        }),
    )
}

const CalendarEditor = ({
  showError,
  showWarning,
  showInfo,
  cookies,
  scheduler,
}: Props) => {
  const [desabledFields, setDesabledFields] = useState<boolean>(false)
  const [blocked, setBlocked] = useState<boolean>(false)
  const [patients, setPatients] = useState<Patient[]>([])
  const [showDataExtra, setShowDataExtra] = useState(false)
  const { refetch } = useQuery(GET_INFO_CLIENT)

  const { goToPage } = useGoTo()
  const { professionals, boxes, countries, setEvents } = useGlobalContext()
  const { resourceType, eventStates, pays } = useCalendarContext()

  const toast = useRef<Toast>(null)

  const resourceField = calendarFieldsMapper(resourceType).idField
  const event = scheduler.edited as DhiEvent | undefined
  const isEvent = !!event
  const isOldDate = isEvent ? moment(event?.start).isBefore() : false
  const resourceId = event
    ? Number(event[resourceField])
    : Number(scheduler[resourceField])

  useMountEffect(() => {
    showAlertsPatient(event?.alerts, toast.current!)
  })

  const eventData: DhiEvent = {
    event_id: event?.event_id!,
    title: event?.title!,
    start: event?.start || scheduler.state.start.value,
    end: event?.end || scheduler.state.end.value,
    box_id: event?.box_id,
    professional_id: event?.professional_id,
    [resourceField]: resourceId,
    professional: event?.professional
      ? getResourceData(
          professionals,
          'professional_id',
          event.professional.professional_id,
        )
      : getResourceData(professionals, resourceField, resourceId),
    box: event?.box
      ? getResourceData(boxes, 'box_id', event.box.box_id)
      : getResourceData(boxes, resourceField, resourceId),
    services: event?.services || [],
    client_id: event?.client_id,
    state: event?.state || eventStates.find((es) => es.state_id === 3),
    pay: event?.pay || pays.find((p) => p.pay_id === 3),
    data_sheet: event?.data_sheet || 'Sin historia clínica',
    id_type: event?.id_type! || idTypes[0],
    identification: event?.identification,
    first_name: event?.first_name,
    middle_name: event?.middle_name,
    last_name: event?.last_name,
    last_name_2: event?.last_name_2,
    phone: event?.phone || null,
    phone_2: event?.phone_2 || null,
    dialling: event?.dialling,
    dialling_2: event?.dialling_2,
    email: event?.email,
    sent_email: event?.sent_email || false,
    description: event?.description,
    eventStates,
    data_extra: event?.data_extra || undefined,
    alerts: event?.alerts || [],
  }

  const {
    data: patientInfo,
    loading: patientLoading,
    refetch: patientRefetch,
  } = useQuery(GET_CLIENT_BY_ID, { variables: { id: eventData.client_id } })

  const getServices = (boxId: number) =>
    boxes.find((b) => b.box_id === boxId)?.services!

  const [services, setServices] = useState<ServiceDHI[]>(
    getServices(eventData.box?.box_id!),
  )
  const handleForm = useForm({ defaultValues: eventData })
  const { handleSubmit, resetField, setValue, getValues, trigger, unregister } =
    handleForm

  const blockAppointment = async (data: DhiEvent) => {
    try {
      scheduler.loading(true)
      const serviceBlock = boxes
        .find((b) => b.name === BLOCK_BOX)
        ?.services.find((s) => s.nombre === BLOCK_SERVICE)
      if (serviceBlock)
        data.services = [
          {
            service_id: serviceBlock.box_service_id,
            name: serviceBlock.nombre,
            time: serviceBlock.tiempo,
          },
        ]
      data.state = eventStates.find((es) => es.name === BLOCK_BOX)
      data.title = data.title ?? 'Bloqueo'
      const appointment = directusAppointmentMapper(data)
      const access_token = await refreshToken(cookies)
      const block = await createBlock(appointment, access_token)
      if (block) data.event_id = +block.event_id
      scheduler.onConfirm(data, 'create')
      setEvents((preEvents) => [...preEvents, data])
      scheduler.close()
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.msg ||
        error?.message
      showError(error?.response?.data?.status, message)
    } finally {
      scheduler.loading(false)
    }
  }

  const createEditAppointment = async (data: DhiEvent) => {
    try {
      scheduler.loading(true)
      data['professional_id'] = data.professional?.professional_id
      data['box_id'] = data.box?.box_id
      data['data_extra'] = pickObjectProps(data, 'patient_extra_')
      const appointment = directusAppointmentMapper(data)
      const access_token = await refreshToken(cookies)
      if (event) {
        await editAppointment(+data.event_id, appointment, access_token)
      } else {
        const addedEvent = await createAppointment(appointment, access_token)
        if (addedEvent) {
          data.title = appointment.title
          data.event_id = +addedEvent.event_id
          data.client_id = +addedEvent.client_id || +addedEvent.client_id.id
          data.data_sheet = addedEvent.data_sheet
        }
      }
      const action: EventActions = event ? 'edit' : 'create'
      scheduler.onConfirm(data, action)
      setEvents((preEvents) => [...preEvents, data])
      scheduler.close()
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.msg ||
        error?.message
      showError(error?.response?.data?.status, message)
    } finally {
      scheduler.loading(false)
    }
  }

  const onSubmit = async () => {
    const data = getValues()
    const hs = moment(data.start).hour()
    const he = moment(data.end).hour()
    const me = moment(data.end).minute()
    if (hs < 7 || he > 19 || (he === 19 && me > 0)) {
      showWarning(errorMessages.statusOutRange, errorMessages.hoursOutRange)
    } else {
      if (blocked) await blockAppointment(data)
      else await createEditAppointment(data)
    }
  }

  const handleBoxChange = (e: DropdownChangeEvent) => {
    const box: Box = e.value
    setValue('services', [])
    resetField('end')
    const servicesByBox = getServices(box.box_id)
    setServices(servicesByBox)
    if (servicesByBox?.length === 1) {
      setValue('services', [servicesMapper(servicesByBox)[0]])
    }
  }

  const handleMultiselectService = (e: MultiSelectChangeEvent) => {
    const services: Service[] = e.value
    const minutes = services.reduce(
      (a, c) => a + (c.time || DEFAULT_APPOINTMENT_MINUTES),
      0,
    )
    setValue(
      'end',
      moment(getValues('start'))
        .add(minutes || DEFAULT_APPOINTMENT_MINUTES, 'minutes')
        .toDate(),
    )
  }

  const handleCleanForm = () => {
    setDesabledFields(false)
    setValue('client_id', undefined)
    setValue('identification', '')
    setValue('first_name', '')
    setValue('middle_name', '')
    setValue('last_name', '')
    setValue('last_name_2', '')
    setValue('dialling', undefined)
    setValue('phone', '')
    setValue('email', '')
    trigger('identification', { shouldFocus: true })
  }

  const handleSetFieldsForm = (e: AutoCompleteChangeEvent) => {
    const patient: Patient = e.value
    if (patient && typeof patient === 'object') {
      const options = { shouldValidate: true }
      setDesabledFields(true)
      setShowDataExtra(false)
      setValue('client_id', +patient.id)
      setValue('identification', patient.documento, options)
      setValue('first_name', patient.primer_nombre, options)
      setValue('middle_name', patient.segundo_nombre, options)
      setValue('last_name', patient.apellido_paterno, options)
      setValue('last_name_2', patient.apellido_materno, options)
      setValue(
        'dialling',
        countries.find((c) => c.dialling === patient.indicativo),
        options,
      )
      setValue('phone', patient.telefono, options)
      setValue('email', patient.correo, options)
      showAlertsPatient(patient.alertas, toast.current!)
    } else {
      setDesabledFields(false)
    }
  }

  const idSearcher = (event: AutoCompleteCompleteEvent) => {
    refetch({ text: event.query }).then((res) =>
      setPatients(res?.data?.pacientes),
    )
  }

  const Header = () => (
    <div className='flex justify-between items-center'>
      <div className='flex justify-start items-center gap-2'>
        <h2 className='font-bold'>
          {blocked ? 'Bloquear horario' : `${event ? 'Editar' : 'Crear'} cita`}
        </h2>
        {desabledFields && (
          <Button
            severity='success'
            size='small'
            rounded
            text
            onClick={handleCleanForm}
            label='Limpiar'
            aria-label='Limpiar'
            className='h-[2rem]'
          />
        )}
      </div>
      <div className='flex justify-end items-center gap-2'>
        {!event && !blocked && (
          <Button
            severity='secondary'
            size='small'
            rounded
            onClick={() => setBlocked(true)}
            label='Bloquear'
            aria-label='Bloquear'
            className='h-[2rem]'
          />
        )}
        {event &&
          (patientLoading ? (
            <Skeleton shape='circle' size='2.4rem'></Skeleton>
          ) : (
            <UploadProfileImage clientInfo={patientInfo.pacientes_by_id} />
          ))}
        <Button
          icon='pi pi-times'
          severity='danger'
          size='small'
          rounded
          onClick={scheduler.close}
          aria-label='Cancel'
        />
      </div>
    </div>
  )

  const stateValueTemplate = (option: EventState) => (
    <div className='flex items-center'>
      {option ? (
        <>
          <EventStateItemColor color={option.color} />
          <div>{option.name}</div>
        </>
      ) : (
        <div>&nbsp;</div>
      )}
    </div>
  )

  const stateItemTemplate = (option: EventState) => (
    <EventStateItem {...option} />
  )

  const idItemTemplate = (item: Patient) => (
    <p className='text-[0.8rem]'>
      {item.documento} - {item.primer_nombre} {item.apellido_paterno}
    </p>
  )

  const fetchData = async () =>
    eventData?.client_id && (await patientRefetch({ id: eventData.client_id }))

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <Toast ref={toast} />
      <Card title={<Header />} className='flex [&_.p-card-content]:pb-0'>
        <form
          id='form_calendar_appointment'
          autoComplete='off'
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col gap-2'
        >
          <div className='flex flex-col md:flex-row gap-1 md:gap-3 w-full sm:[&>div]:w-96 md:[&>div]:!w-72'>
            {!blocked && (
              <div className='flex flex-col gap-2 w-full'>
                {event && (
                  <InputTextValid
                    name='data_sheet'
                    label='Historia clínica'
                    handleForm={handleForm}
                    icon='book'
                    disabled
                  />
                )}
                <DropdownValid
                  name='id_type'
                  label='Tipo de identificación'
                  handleForm={handleForm}
                  list={idTypes}
                  disabled={desabledFields || isEvent}
                  required={!blocked}
                />
                <AutoCompleteValid
                  name='identification'
                  label='Identificación'
                  handleForm={handleForm}
                  icon='id-card'
                  field='documento'
                  suggestions={patients}
                  itemTemplate={idItemTemplate}
                  completeMethod={idSearcher}
                  onCustomChange={handleSetFieldsForm}
                  disabled={desabledFields || isEvent}
                  required={!blocked}
                />
                <InputTextValid
                  name='first_name'
                  label='1° Nombre'
                  handleForm={handleForm}
                  icon='user'
                  disabled={desabledFields || isEvent}
                  required={!blocked}
                  pattern={regexPatterns.onlyEmpty}
                />
                <InputTextValid
                  name='middle_name'
                  label='2° Nombre'
                  handleForm={handleForm}
                  disabled={desabledFields || isEvent}
                  icon='user'
                  pattern={regexPatterns.onlyEmpty}
                />
                <InputTextValid
                  name='last_name'
                  label='1° Apellido'
                  handleForm={handleForm}
                  icon='user'
                  disabled={desabledFields || isEvent}
                  required={!blocked}
                  pattern={regexPatterns.onlyEmpty}
                />
                <InputTextValid
                  name='last_name_2'
                  label='2° Apellido'
                  handleForm={handleForm}
                  disabled={desabledFields || isEvent}
                  icon='user'
                  pattern={regexPatterns.onlyEmpty}
                />
              </div>
            )}
            <div className='flex flex-col gap-2 w-full'>
              {blocked && (
                <InputTextValid
                  name='title'
                  label='Nombre de bloqueo'
                  handleForm={handleForm}
                  icon='comment'
                />
              )}
              <DateTimeValid
                name='start'
                label='Fecha inicio'
                handleForm={handleForm}
                required={!blocked}
                disabled={isOldDate}
              />
              <DateTimeValid
                name='end'
                label='Fecha fin'
                handleForm={handleForm}
                required={!blocked}
                disabled={isOldDate}
              />
              {!blocked && (
                <>
                  <DropdownValid
                    name='professional'
                    label='Profesional'
                    handleForm={handleForm}
                    list={professionals}
                    required={!blocked}
                    disabled={isOldDate}
                  />
                  <DropdownValid
                    name='box'
                    label='Box'
                    handleForm={handleForm}
                    list={boxes.filter((b) => b.name !== BLOCK_BOX)}
                    required={!blocked}
                    disabled={isOldDate}
                    onCustomChange={handleBoxChange}
                  />
                  <MultiSelectValid
                    name='services'
                    label='Servicios'
                    handleForm={handleForm}
                    list={servicesMapper(services)}
                    selectedItemsLabel='{0} servicios'
                    placeholder='Seleccione servicios'
                    onCustomChange={handleMultiselectService}
                    required={!blocked}
                    disabled={isOldDate}
                  />
                  {event && (
                    <DropdownValid
                      name='pay'
                      label='Pago'
                      handleForm={handleForm}
                      list={pays}
                      required={!blocked}
                      disabled={isOldDate}
                    />
                  )}
                </>
              )}
            </div>
            {!blocked && (
              <div className='flex flex-col gap-2 w-full'>
                {event && (
                  <DropdownValid
                    name='state'
                    label='Estado'
                    handleForm={handleForm}
                    list={eventStates.filter((es) => es.name !== BLOCK_BOX)}
                    required={!blocked}
                    itemTemplate={stateItemTemplate}
                    valueTemplate={stateValueTemplate}
                    disabled={isOldDate}
                  />
                )}
                <PhoneNumberValid
                  name='phone'
                  diallingName='dialling'
                  label='Teléfono'
                  handleForm={handleForm}
                  icon='phone'
                  minLength={6}
                  required={!blocked}
                  disabled={isOldDate}
                />
                {(event || showDataExtra) && (
                  <PhoneNumberValid
                    name='phone_2'
                    diallingName='dialling_2'
                    label='Teléfono 2'
                    handleForm={handleForm}
                    icon='phone'
                    minLength={6}
                    disabled={isOldDate}
                  />
                )}
                <InputTextValid
                  name='email'
                  label='Correo electrónico'
                  handleForm={handleForm}
                  icon='envelope'
                  required={!blocked}
                  pattern={regexPatterns.email}
                  disabled={isOldDate}
                />
                <InputSwitchValid
                  name='sent_email'
                  handleForm={handleForm}
                  acceptMessage='Enviar correo.'
                  disabled={isOldDate}
                />
                <InputTextareaValid
                  name='description'
                  label='Comentario'
                  handleForm={handleForm}
                  rows={4}
                  disabled={isOldDate}
                  pattern={regexPatterns.onlyEmpty}
                />
              </div>
            )}
          </div>
          {showDataExtra && (
            <div className='mt-2'>
              <PatientDataExtra id='calendar_extra' handleForm={handleForm} />
            </div>
          )}
          <section
            className={cx(
              'flex justify-center gap-2 flex-wrap [&>button]:text-[0.8rem] [&>button]:w-full [&>button]:md:w-auto mt-1',
              { 'mt-3': showDataExtra },
            )}
          >
            {(isEvent || (!isEvent && desabledFields)) && (
              <Button
                label={'Perfil'}
                type='button'
                severity='info'
                rounded
                onClick={() => {
                  goToPage(
                    parseUrl(PAGE_PATH.clientDetail, {
                      id: getValues('client_id')!,
                    }),
                  )
                }}
              />
            )}
            {event && (
              <>
                <Button
                  label={'Historico'}
                  type='button'
                  severity='warning'
                  rounded
                  onClick={(e: any) =>
                    showInfo(e.target.textContent, COMING_SOON)
                  }
                />
                <Button
                  label={'Pagar'}
                  type='button'
                  severity='danger'
                  rounded
                  onClick={() => {
                    goToPage(
                      parseUrl(PAGE_PATH.finance, {
                        id: getValues('client_id')!,
                      }),
                    )
                  }}
                />

                {console.log(getValues())}
                {statesView.includes(event.state?.state_id!) && (
                  <Button
                    label={'Realizar Atención'}
                    type='button'
                    severity='secondary'
                    rounded
                    onClick={() => {
                      goToPage(
                        parseUrl(PAGE_PATH.clientDataSheetService, {
                          id: getValues('client_id')!,
                          serviceId: getValues('services')![0].service_id,
                        }),
                      )
                    }}
                  />
                )}
              </>
            )}
            {!isOldDate && (
              <>
                {!event && !desabledFields && !blocked && (
                  <ToggleButton
                    checked={showDataExtra}
                    onLabel='Eliminar datos extra'
                    offLabel='Incluir datos extra'
                    onChange={(e: ToggleButtonChangeEvent) => {
                      setShowDataExtra(e.value)
                      showDataExtra &&
                        Object.keys(getValues())
                          .filter((key) => key.startsWith('patient_extra_'))
                          .forEach((key) => unregister(key))
                    }}
                    className='!text-[0.8rem] !rounded-full !w-full md:!w-fit'
                  />
                )}
                <Button
                  label={blocked ? 'Bloquear' : event ? 'Guardar' : 'Agendar'}
                  type='submit'
                  severity='success'
                  rounded
                />
              </>
            )}
          </section>
        </form>
      </Card>
    </>
  )
}

export default withCookies(withToast(CalendarEditor))
