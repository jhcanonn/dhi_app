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
import { Box, DhiEvent, EventState, Patient, ServiceDHI } from '@models'
import { fetchingSimulation, eventIdSimulation } from '@hooks'
import { useCalendarContext, useGlobalContext } from '@contexts'
import {
  GET_INFO_CLIENT,
  PAGE_PATH,
  calendarFieldsMapper,
  getResourceData,
  idTypes,
  mandatoryAppointmentFields,
  servicesMapper,
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

type Props = {
  scheduler: SchedulerHelpers
}

const CalendarEditor = ({ scheduler }: Props) => {
  const [desabledFields, setDesabledFields] = useState<boolean>(false)
  const [patients, setPatients] = useState<Patient[]>([])
  const { refetch } = useQuery(GET_INFO_CLIENT)

  const toast = useRef<Toast>(null)
  const router = useRouter()
  const { professionals, boxes, countries, setEvents } = useGlobalContext()
  const { resourceType, eventStates, pays } = useCalendarContext()

  const resourceField = calendarFieldsMapper(resourceType).idField
  const event: DhiEvent | undefined = scheduler.edited
  const resourceId = event
    ? Number(event[resourceField])
    : Number(scheduler[resourceField])

  const eventData: DhiEvent = {
    event_id: event?.event_id!,
    title: event?.title!,
    start: event?.start || scheduler.state.start.value,
    end: event?.end || scheduler.state.end.value,
    [resourceField]: resourceId,
    professional:
      event?.professional ||
      getResourceData(professionals, resourceField, resourceId),
    box: event?.box || getResourceData(boxes, resourceField, resourceId),
    service: event?.service,
    client_id: event?.client_id,
    state: event?.state,
    pay: event?.pay,
    data_sheet: event?.data_sheet || 'Sin ficha',
    id_type: event?.id_type! || idTypes[0],
    identification: event?.identification,
    first_name: event?.first_name,
    middle_name: event?.middle_name,
    last_name: event?.last_name,
    last_name_2: event?.last_name_2,
    phone: event?.phone,
    phone_2: event?.phone_2,
    dialling: event?.dialling,
    dialling_2: event?.dialling_2,
    email: event?.email,
    sent_email: event?.sent_email,
    description: event?.description,
  }

  const getServices = (boxId: number) =>
    boxes.find((b) => b.box_id === boxId)?.services!

  const [services, setServices] = useState<ServiceDHI[]>(
    getServices(eventData.box?.box_id!),
  )
  const handleForm = useForm({ defaultValues: eventData })
  const { reset, handleSubmit, resetField, setValue } = handleForm

  const onSubmit = async (data: DhiEvent) => {
    if (mandatoryAppointmentFields.map((f) => data[f]).every(Boolean)) {
      try {
        scheduler.loading(true)
        data['professional_id'] = data.professional?.professional_id
        data['box_id'] = data.box?.box_id
        const addedUpdatedEvent: DhiEvent = await fetchingSimulation(data, 500)
        /** Esto deberia hacerse en el backend */
        if (!addedUpdatedEvent.event_id)
          addedUpdatedEvent.event_id = eventIdSimulation(11, 1000)
        if (!addedUpdatedEvent.client_id)
          addedUpdatedEvent.client_id = eventIdSimulation(11, 1000)
        if (!addedUpdatedEvent.title)
          addedUpdatedEvent.title = `${addedUpdatedEvent?.first_name} ${addedUpdatedEvent?.last_name}`
        /***/
        const action: EventActions = event ? 'edit' : 'create'
        // console.log({ addedUpdatedEvent })
        scheduler.onConfirm(addedUpdatedEvent, action)
        setEvents((preEvents) => [...preEvents, addedUpdatedEvent])
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
    resetField('service')
    setServices(getServices(box.box_id))
  }

  const handleBlock = (e: React.MouseEvent<HTMLElement>) => {
    console.log('block!', e)
  }

  const handleCleanForm = () => {
    setDesabledFields(false)
    setValue('identification', '')
    setValue('first_name', '')
    setValue('middle_name', '')
    setValue('last_name', '')
    setValue('last_name_2', '')
    setValue('dialling', { name: '', dialling: '', image_url: '' })
    setValue('phone', '')
    setValue('email', '')
  }

  const handleSetFieldsForm = (e: AutoCompleteChangeEvent) => {
    const patient: Patient = e.value
    if (patient && typeof patient === 'object') {
      setDesabledFields(true)
      setValue('first_name', patient.primer_nombre)
      setValue('middle_name', patient.segundo_nombre)
      setValue('last_name', patient.apellido_paterno)
      setValue('last_name_2', patient.apellido_materno)
      setValue(
        'dialling',
        countries.find((c) => c.dialling === patient.indicativo),
      )
      setValue('phone', patient.telefono)
      setValue('email', patient.correo)
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

  const ItemColor = ({ color }: { color: string }) => (
    <div
      className='!w-[0.8rem] !h-[0.8rem] rounded-full mr-2'
      style={{
        border: `1px solid ${color}`,
        backgroundColor: color,
      }}
    />
  )

  const stateValueTemplate = (option: EventState) => (
    <div className='flex items-center'>
      {option ? (
        <>
          <ItemColor color={option.color} />
          <div>{option.name}</div>
        </>
      ) : (
        <div>&nbsp;</div>
      )}
    </div>
  )

  const stateItemTemplate = (option: EventState) => (
    <div className='flex items-center'>
      <ItemColor color={option.color} />
      <div>{option.name}</div>
    </div>
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
            <div className='flex flex-col gap-1 w-full'>
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
                disabled={desabledFields}
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
                disabled={desabledFields}
                required
              />
              <InputTextValid
                name='first_name'
                label='1° Nombre'
                handleForm={handleForm}
                icon='user'
                disabled={desabledFields}
                required
              />
              <InputTextValid
                name='middle_name'
                label='2° Nombre'
                handleForm={handleForm}
                disabled={desabledFields}
                icon='user'
              />
              <InputTextValid
                name='last_name'
                label='1° Apellido'
                handleForm={handleForm}
                icon='user'
                disabled={desabledFields}
                required
              />
              <InputTextValid
                name='last_name_2'
                label='2° Apellido'
                handleForm={handleForm}
                disabled={desabledFields}
                icon='user'
              />
            </div>
            <div className='flex flex-col gap-1 w-full'>
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
                name='service'
                label='Servicios'
                handleForm={handleForm}
                list={servicesMapper(services)}
                selectedItemsLabel='{0} servicios'
                placeholder='Seleccione servicios'
                required
              />
              {event && (
                <DropdownValid
                  name='pay'
                  label='Pago'
                  handleForm={handleForm}
                  list={pays}
                  required
                />
              )}
            </div>
            <div className='flex flex-col gap-1 w-full'>
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

export default CalendarEditor
