'use client'

import { EventActions, SchedulerHelpers } from 'react-scheduler-lib/types'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
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
  mandatoryAppointmentFields,
  servicesMapper,
  DEFAULT_APPOINTMENT_MINUTES,
} from '@utils'
import { useRouter } from 'next/navigation'
import { Toast } from 'primereact/toast'
import { useRef, useState } from 'react'
import { DropdownChangeEvent } from 'primereact/dropdown'
import { useQuery } from '@apollo/client'
import {
  AutoCompleteChangeEvent,
  AutoCompleteCompleteEvent,
} from 'primereact/autocomplete'
import { createAppointment, editAppointment, refreshToken } from '@utils/api'
import { Cookies, withCookies } from 'react-cookie'
import { MultiSelectChangeEvent } from 'primereact/multiselect'
import moment from 'moment'
import { EventStateItem, EventStateItemColor } from '@components/molecules'

type Props = {
  cookies: Cookies
  scheduler: SchedulerHelpers
}

const CalendarEditor = ({ scheduler, cookies }: Props) => {
  const [desabledFields, setDesabledFields] = useState<boolean>(false)
  const [patients, setPatients] = useState<Patient[]>([])
  const { refetch } = useQuery(GET_INFO_CLIENT)

  const toast = useRef<Toast>(null)
  const router = useRouter()
  const { professionals, boxes, countries, setEvents } = useGlobalContext()
  const { resourceType, eventStates, pays } = useCalendarContext()

  const resourceField = calendarFieldsMapper(resourceType).idField
  const event: DhiEvent | undefined = scheduler.edited
  const isEvent = !!event
  const resourceId = event
    ? Number(event[resourceField])
    : Number(scheduler[resourceField])

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
    data_sheet: event?.data_sheet || 'Sin ficha',
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
    sent_email: event?.sent_email,
    description: event?.description,
    eventStates,
  }

  console.log({ event, eventData })

  const getServices = (boxId: number) =>
    boxes.find((b) => b.box_id === boxId)?.services!

  const [services, setServices] = useState<ServiceDHI[]>(
    getServices(eventData.box?.box_id!),
  )
  const handleForm = useForm({ defaultValues: eventData })
  const { reset, handleSubmit, resetField, setValue, getValues, trigger } =
    handleForm

  const onSubmit = async (data: DhiEvent) => {
    if (mandatoryAppointmentFields.map((f) => data[f]).every(Boolean)) {
      try {
        scheduler.loading(true)
        data['professional_id'] = data.professional?.professional_id
        data['box_id'] = data.box?.box_id
        const appointment = directusAppointmentMapper(data)
        const access_token = await refreshToken(cookies)
        if (event) {
          await editAppointment(+data.event_id, appointment, access_token)
        } else {
          const addedEvent = await createAppointment(appointment, access_token)
          if (addedEvent) {
            data.title = appointment.title
            data.event_id = +addedEvent.event_id
            data.client_id = +addedEvent.client_id
          }
        }
        const action: EventActions = event ? 'edit' : 'create'
        scheduler.onConfirm(data, action)
        setEvents((preEvents) => [...preEvents, data])
        scheduler.close()
      } finally {
        scheduler.loading(false)
      }
    } else reset()
  }

  const showNotification = (text: string) => {
    toast.current?.show({
      severity: 'info',
      summary: text,
      detail: 'Esta funcionalidad estará disponible proximamente.',
      life: 3000,
    })
  }

  const handleBoxChange = (e: DropdownChangeEvent) => {
    const box: Box = e.value
    setValue('services', [])
    resetField('end')
    setServices(getServices(box.box_id))
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

  const handleBlock = (e: React.MouseEvent<HTMLElement>) => {
    console.log('block!', e)
  }

  const handleCleanForm = () => {
    setDesabledFields(false)
    setValue('client_id', undefined)
    setValue('identification', '')
    setValue('first_name', '')
    setValue('middle_name', '')
    setValue('last_name', '')
    setValue('last_name_2', '')
    setValue('dialling', { name: '', dialling: '', image_url: '' })
    setValue('phone', '')
    setValue('email', '')
    trigger('identification', { shouldFocus: true })
  }

  const handleSetFieldsForm = (e: AutoCompleteChangeEvent) => {
    const patient: Patient = e.value
    if (patient && typeof patient === 'object') {
      const options = { shouldValidate: true }
      setDesabledFields(true)
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
    } else {
      setDesabledFields(false)
    }
  }

  const idSearcher = (event: AutoCompleteCompleteEvent) => {
    refetch({ id: event.query }).then((res) =>
      setPatients(res?.data?.pacientes),
    )
  }

  const Header = () => (
    <div className='flex justify-between items-center'>
      <div className='flex justify-start items-center gap-2'>
        <h2 className='font-bold'>{`${event ? 'Editar' : 'Crear'} cita`}</h2>
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
        <Button
          severity='secondary'
          size='small'
          rounded
          onClick={handleBlock}
          label='Bloquear'
          aria-label='Bloquear'
          className='h-[2rem]'
        />
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

  return (
    <>
      <Toast ref={toast} />
      <Card title={<Header />} className='flex [&_.p-card-content]:pb-0'>
        <form
          autoComplete='off'
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col gap-2'
        >
          <div className='flex flex-col md:flex-row gap-1 md:gap-3 w-full sm:[&>div]:w-96 md:[&>div]:!w-60'>
            <div className='flex flex-col gap-2 w-full'>
              {event && (
                <InputTextValid
                  name='data_sheet'
                  label='Ficha'
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
                required
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
                required
              />
              <InputTextValid
                name='first_name'
                label='1° Nombre'
                handleForm={handleForm}
                icon='user'
                disabled={desabledFields || isEvent}
                required
              />
              <InputTextValid
                name='middle_name'
                label='2° Nombre'
                handleForm={handleForm}
                disabled={desabledFields || isEvent}
                icon='user'
              />
              <InputTextValid
                name='last_name'
                label='1° Apellido'
                handleForm={handleForm}
                icon='user'
                disabled={desabledFields || isEvent}
                required
              />
              <InputTextValid
                name='last_name_2'
                label='2° Apellido'
                handleForm={handleForm}
                disabled={desabledFields || isEvent}
                icon='user'
              />
            </div>
            <div className='flex flex-col gap-2 w-full'>
              <DateTimeValid
                name='start'
                label='Fecha inicio'
                handleForm={handleForm}
                required
              />
              <DateTimeValid
                name='end'
                label='Fecha fin'
                handleForm={handleForm}
                required
              />
              <DropdownValid
                name='professional'
                label='Profesional'
                handleForm={handleForm}
                list={professionals}
                required
              />
              <DropdownValid
                name='box'
                label='Box'
                handleForm={handleForm}
                list={boxes}
                required
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
                required
              />
              {event && (
                <DropdownValid
                  name='pay'
                  label='Pago'
                  handleForm={handleForm}
                  list={pays}
                  disabled={isEvent}
                  required
                />
              )}
            </div>
            <div className='flex flex-col gap-2 w-full'>
              {event && (
                <DropdownValid
                  name='state'
                  label='Estado'
                  handleForm={handleForm}
                  list={eventStates}
                  required
                  itemTemplate={stateItemTemplate}
                  valueTemplate={stateValueTemplate}
                />
              )}
              <PhoneNumberValid
                name='phone'
                diallingName='dialling'
                label='Teléfono'
                handleForm={handleForm}
                icon='phone'
                minLength={6}
                required
              />
              {event && (
                <PhoneNumberValid
                  name='phone_2'
                  diallingName='dialling_2'
                  label='Teléfono 2'
                  handleForm={handleForm}
                  icon='phone'
                  minLength={6}
                />
              )}
              <InputTextValid
                name='email'
                label='Correo electrónico'
                handleForm={handleForm}
                icon='envelope'
                required
                pattern={/\S+@\S+\.\S+/}
              />
              <InputSwitchValid
                name='sent_email'
                handleForm={handleForm}
                acceptMessage='Enviar correo.'
              />
              <InputTextareaValid
                name='description'
                label='Comentario'
                handleForm={handleForm}
                rows={4}
              />
            </div>
          </div>
          <div className='flex justify-center gap-2 flex-wrap [&>button]:text-[0.8rem]'>
            {event && (
              <>
                <Button
                  label={'Insumos'}
                  type='button'
                  severity='secondary'
                  rounded
                  onClick={(e: any) => showNotification(e.target.textContent)}
                />
                <Button
                  label={'Perfil'}
                  type='button'
                  severity='info'
                  rounded
                  onClick={() =>
                    router.push(
                      `${PAGE_PATH.clientList}/${eventData.client_id}`,
                    )
                  }
                />
                <Button
                  label={'Historico'}
                  type='button'
                  severity='warning'
                  rounded
                  onClick={(e: any) => showNotification(e.target.textContent)}
                />
                <Button
                  label={'Comentarios'}
                  type='button'
                  severity='help'
                  rounded
                  onClick={(e: any) => showNotification(e.target.textContent)}
                />
                <Button
                  label={'Pagar'}
                  type='button'
                  severity='danger'
                  rounded
                  onClick={(e: any) => showNotification(e.target.textContent)}
                />
              </>
            )}
            <Button
              label={event ? 'Guardar' : 'Agendar'}
              type='submit'
              severity='success'
              rounded
            />
          </div>
        </form>
      </Card>
    </>
  )
}

export default withCookies(CalendarEditor)
