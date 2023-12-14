'use client'

import {
  GET_SCHEDULES,
  SCHEDULE_DELETE,
  getCurrencyCOP,
  removeDuplicates,
  schedulesMapper,
} from '@utils'
import { useMutation, useQuery } from '@apollo/client'
import { EventStateItemColor } from '@components/molecules'
import { useClientContext } from '@contexts'
import { withToast } from '@hooks'
import { BudgetItemsBoxServiceId, OptionType, ScheduleType } from '@models'
import { FilterMatchMode, PrimeIcons } from 'primereact/api'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { DataTable, DataTableFilterMeta } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect'
import { ReactNode, useEffect, useState } from 'react'

const dateBodyTemplate = (schedule: ScheduleType) => (
  <p>{schedule.date.formated}</p>
)

const scheduleStateBodyTemplate = (schedule: ScheduleType) => (
  <div className='flex items-center'>
    <EventStateItemColor color={schedule.schedule_state.color} />
    <div>{schedule.schedule_state.name}</div>
  </div>
)

const paymentStateBodyTemplate = (schedule: ScheduleType) => (
  <p>{schedule.payment_state.name}</p>
)

const servicesBodyTemplate = (schedule: ScheduleType) => (
  <p>
    {schedule.services
      .map((s) => {
        const serviceId = s.salas_servicios_id
          .servicios_id as BudgetItemsBoxServiceId
        return serviceId.nombre
      })
      .join(', ')}
  </p>
)

const optionTemplate = (option: OptionType) => <p>{option.name}</p>

const columnFilterTemplate = (
  options: ColumnFilterElementTemplateOptions,
  optionsList: OptionType[],
) => (
  <MultiSelect
    value={options.value}
    options={optionsList}
    itemTemplate={optionTemplate}
    onChange={(e: MultiSelectChangeEvent) => options.filterCallback(e.value)}
    optionLabel='name'
    placeholder='Seleccionar'
    className='p-column-filter'
  />
)

const defaultFilters: DataTableFilterMeta = {
  schedule_state: { value: null, matchMode: FilterMatchMode.IN },
  payment_state: { value: null, matchMode: FilterMatchMode.IN },
}

type Props = {
  showSuccess: (summary: ReactNode, detail: ReactNode) => void
}

const ClientHistorySchedule = ({ showSuccess }: Props) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [schedules, setSchedules] = useState<ScheduleType[]>([])
  const [currentSchedule, setCurrentSchedule] = useState<ScheduleType | null>(
    null,
  )
  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters)
  const [scheduleStates, setScheduleStates] = useState<OptionType[]>([])
  const [paymentStates, setPaymentStates] = useState<OptionType[]>([])
  const { clientInfo } = useClientContext()

  const [scheduleDelete] = useMutation(SCHEDULE_DELETE)

  const {
    data: dataSchedules,
    loading: loadingSchedules,
    refetch: refetchSchedules,
  } = useQuery(GET_SCHEDULES, {
    variables: { patientId: clientInfo?.id },
  })

  const footerDialog = (
    <div className='flex flex-col md:flex-row gap-2 justify-center'>
      <Button
        type='button'
        label='Cerrar'
        icon={PrimeIcons.TIMES}
        severity='danger'
        className='w-full md:w-fit'
        onClick={() => setVisible(false)}
      />
    </div>
  )

  const deleteSchedule = async (schedule: ScheduleType) => {
    const deletedSchedule: any = await scheduleDelete({
      variables: { scheduleId: schedule.id },
    })
    if (deletedSchedule?.data) {
      await refreshDataTable()
      showSuccess('Cita eliminada', 'La cita ha sido eliminada exitosamente.')
    }
  }

  const confirmDelete = async (tagKey: string, schedule: ScheduleType) =>
    confirmDialog({
      tagKey,
      acceptLabel: 'Si',
      rejectLabel: 'No',
      message: 'Está seguro de eliminar la cita?',
      header: 'Confirmación',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      draggable: false,
      async accept() {
        await deleteSchedule(schedule)
      },
    })

  const actionsBodyTemplate = (schedule: ScheduleType) => {
    const tagKey = `schedule_item_${schedule.id}`
    return (
      <div key={tagKey}>
        <ConfirmDialog tagKey={tagKey} />
        <section className='flex gap-2 justify-center'>
          <Button
            icon={PrimeIcons.EYE}
            severity='help'
            tooltip='Ver'
            tooltipOptions={{ position: 'bottom' }}
            outlined
            onClick={() => {
              setVisible(true)
              setCurrentSchedule(schedule)
            }}
          />
          <Button
            icon={PrimeIcons.TRASH}
            severity='danger'
            tooltip='Eliminar'
            tooltipOptions={{ position: 'bottom' }}
            onClick={() => confirmDelete(tagKey, schedule)}
            outlined
          />
        </section>
      </div>
    )
  }

  const initFilters = () => {
    setFilters(defaultFilters)
  }

  const refreshDataTable = async () =>
    clientInfo &&
    (await refetchSchedules({ variables: { patientId: clientInfo.id } }))

  useEffect(() => {
    initFilters()
    if (!loadingSchedules) {
      const schedules = schedulesMapper(dataSchedules?.citas || [])
      setSchedules(schedules)
      setScheduleStates(
        removeDuplicates(schedules.map((s) => s.schedule_state)),
      )
      setPaymentStates(removeDuplicates(schedules.map((s) => s.payment_state)))
    }
  }, [dataSchedules])

  return (
    <>
      <Dialog
        draggable={false}
        visible={visible}
        onHide={() => setVisible(false)}
        header={currentSchedule && scheduleStateBodyTemplate(currentSchedule)}
        footer={footerDialog}
        className='w-[90vw] max-w-[100rem]'
      >
        <h2>
          <strong>Fecha:</strong>
          <span className=' ml-2'>{currentSchedule?.date.formated}</span>
        </h2>
        <hr />
        <p>
          <strong>Hora de inicio: </strong>
          {currentSchedule?.init_time}
        </p>
        <hr />
        <p>
          <strong>Hora de fin: </strong>
          {currentSchedule?.end_time}
        </p>
        <hr />
        <p>
          <strong>Estado pagado: </strong>
          {currentSchedule?.payment_state.name}
        </p>
        <hr />
        <p>
          <strong>Profesional: </strong>
          {currentSchedule?.professional}
        </p>
        <hr />
        <p>
          <strong>Comentarios: </strong>
          {currentSchedule?.comment}
        </p>
        <hr />
        <h2 className='font-bold text-md'>Servicios:</h2>
        <div>
          <ol className='list-decimal pl-12'>
            {currentSchedule?.services.map((s) => {
              const serviceId = s.salas_servicios_id
                .servicios_id as BudgetItemsBoxServiceId
              return (
                <li key={s.id}>
                  {serviceId.nombre}
                  <span className='ml-2'>
                    {getCurrencyCOP(serviceId.precio)}
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
      </Dialog>
      <Card className='custom-table-card my-4'>
        <DataTable
          value={schedules}
          dataKey='id'
          paginator
          stripedRows
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          size='small'
          emptyMessage='No se encontraron resultados'
          className='custom-table'
          removableSort
          sortField='date.timestamp'
          sortOrder={-1}
          filters={filters}
          loading={loadingSchedules}
        >
          <Column
            key='date'
            field='date.timestamp'
            header='Fecha'
            body={dateBodyTemplate}
            style={{ minWidth: '7rem', width: '9rem' }}
            sortable
          />
          <Column
            key='init_time'
            field='init_time'
            header='Inicio'
            style={{ minWidth: '6rem' }}
          />
          <Column
            key='end_time'
            field='end_time'
            header='Fin'
            style={{ minWidth: '6rem' }}
          />
          <Column
            key='comment'
            field='comment'
            header='Comentario'
            style={{ minWidth: '10rem' }}
            sortable
          />
          <Column
            key='schedule_state'
            header='Estado cita'
            body={scheduleStateBodyTemplate}
            style={{ minWidth: '9rem' }}
            filter
            filterField='schedule_state'
            filterMenuStyle={{ width: '15rem' }}
            filterElement={(options) =>
              columnFilterTemplate(options, scheduleStates)
            }
            showFilterMatchModes={false}
          />
          <Column
            key='payment_state'
            header='Estado pago'
            body={paymentStateBodyTemplate}
            style={{ minWidth: '9rem' }}
            filter
            filterField='payment_state'
            filterMenuStyle={{ width: '15rem' }}
            filterElement={(options) =>
              columnFilterTemplate(options, paymentStates)
            }
            showFilterMatchModes={false}
          />
          <Column
            key='professional'
            field='professional'
            header='Profesional'
            style={{ minWidth: '10rem', width: '10rem' }}
            sortable
          />
          <Column
            key='sucursal'
            field='sucursal'
            header='Sucursal'
            style={{ minWidth: '11rem', width: '16rem' }}
          />
          <Column
            key='services'
            header='Servicio(s)'
            body={servicesBodyTemplate}
            style={{ minWidth: '11rem', width: '13rem' }}
          />
          <Column
            key='actions'
            header='Acciones'
            align={'center'}
            body={actionsBodyTemplate}
          />
        </DataTable>
      </Card>
    </>
  )
}

export default withToast(ClientHistorySchedule)
