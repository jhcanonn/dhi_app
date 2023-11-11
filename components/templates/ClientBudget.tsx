'use client'

import moment from 'moment'
import { UUID } from 'crypto'
import { useClientContext } from '@contexts'
import { DataTableCurrency, DataTableDate } from '@models'
import { BUDGET_CODE, PAGE_PATH, getFormatedDateToEs, parseUrl } from '@utils'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Column } from 'primereact/column'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { useEffect, useState } from 'react'
import { useGoTo } from '@hooks'

type BudgetType = {
  id: UUID
  name: string
  created_date: DataTableDate
  due_date: DataTableDate
  value: DataTableCurrency
  payed: DataTableCurrency
  state_budget: string
  state_payed: string
  state_track: string
  cost: DataTableCurrency
}

const createdDateBodyTemplate = (budget: BudgetType) => (
  <p>{budget.created_date.formated}</p>
)

const dueDateBodyTemplate = (budget: BudgetType) => (
  <p>{budget.due_date.formated}</p>
)

const valueBodyTemplate = (budget: BudgetType) => <p>{budget.value.formated}</p>

const payedBodyTemplate = (budget: BudgetType) => <p>{budget.payed.formated}</p>

const costBodyTemplate = (budget: BudgetType) => <p>{budget.cost.formated}</p>

const ClientBudget = () => {
  const [visible, setVisible] = useState<boolean>(false)
  const [budgets, setBudgets] = useState<BudgetType[]>([])
  const [currentBudget, setCurrentBudget] = useState<BudgetType | null>(null)
  const { clientInfo } = useClientContext()
  const { goToPage } = useGoTo()

  const headerContent = (
    <h2>
      Nombre: <span className='font-normal'>{currentBudget?.name}</span>
    </h2>
  )

  const deleteBudget = async (budget: BudgetType) => {
    console.log({ budget })
  }

  const confirmDelete = async (tagKey: string, budget: BudgetType) =>
    confirmDialog({
      tagKey,
      acceptLabel: 'Si',
      rejectLabel: 'No',
      message: 'Está seguro de eliminar el presupuesto?',
      header: 'Confirmación',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      draggable: false,
      async accept() {
        await deleteBudget(budget)
      },
    })

  const optionsBodyTemplate = (budget: BudgetType) => {
    const tagKey = `${BUDGET_CODE}item_${budget.id}`
    return (
      <>
        <ConfirmDialog tagKey={tagKey} />
        <section className='flex gap-2 justify-center'>
          <Button
            icon='pi pi-file-edit'
            severity='success'
            tooltip='Datos'
            tooltipOptions={{ position: 'bottom' }}
            outlined
            onClick={() => {
              setVisible(true)
              setCurrentBudget(budget)
            }}
          />
          <Button
            icon='pi pi-trash'
            severity='danger'
            tooltip='Eliminar archivo'
            tooltipOptions={{ position: 'bottom' }}
            outlined
            onClick={() => confirmDelete(tagKey, budget)}
          />
          <Button
            className='text-sm'
            icon='pi pi-print'
            type='button'
            severity='info'
            tooltip='Imprimir'
            tooltipOptions={{ position: 'bottom' }}
            onClick={() => console.log('Generate PDF')}
            outlined
          />
        </section>
      </>
    )
  }

  useEffect(() => {
    const patientId = clientInfo?.id
    const fakeDate = '2023-10-31T21:35:54.173Z'
    patientId &&
      setBudgets([
        {
          id: 'b03a7752-7d92-11ee-b962-0242ac120002',
          name: 'Presupuesto 1',
          created_date: {
            date: moment(fakeDate).toDate(),
            timestamp: moment(fakeDate).valueOf(),
            formated: getFormatedDateToEs(fakeDate, 'ddd ll'),
          },
          due_date: {
            date: moment(fakeDate).toDate(),
            timestamp: moment(fakeDate).valueOf(),
            formated: getFormatedDateToEs(fakeDate, 'ddd ll'),
          },
          value: {
            value: 23000,
            formated: '$ 23.000',
          },
          payed: {
            value: 29000,
            formated: '$ 29.000',
          },
          state_budget: 'Aceptado',
          state_payed: 'Pagado',
          state_track: '',
          cost: {
            value: 0,
            formated: '',
          },
        },
        {
          id: 'b03a7752-7d92-11ee-b962-0242ac120003',
          name: 'Presupuesto 2',
          created_date: {
            date: moment(fakeDate).toDate(),
            timestamp: moment(fakeDate).valueOf(),
            formated: getFormatedDateToEs(fakeDate, 'ddd ll'),
          },
          due_date: {
            date: moment(fakeDate).toDate(),
            timestamp: moment(fakeDate).valueOf(),
            formated: getFormatedDateToEs(fakeDate, 'ddd ll'),
          },
          value: {
            value: 2000,
            formated: '$ 2.000',
          },
          payed: {
            value: 293000,
            formated: '$ 293.000',
          },
          state_budget: 'Aceptado',
          state_payed: 'Pagado',
          state_track: '',
          cost: {
            value: 0,
            formated: '',
          },
        },
      ])
  }, [clientInfo])

  return (
    <Card className='custom-table-card flex flex-col gap-4'>
      <Button
        className='text-sm w-full md:!w-fit min-w-[13rem]'
        icon='pi pi-plus'
        label='Crear presupuesto'
        type='button'
        severity='success'
        onClick={() => {
          clientInfo?.id &&
            goToPage(
              parseUrl(PAGE_PATH.clientBudgetCreate, { id: clientInfo.id }),
            )
        }}
        outlined
      />
      <Dialog
        draggable={false}
        visible={visible}
        onHide={() => setVisible(false)}
        header={headerContent}
        className='w-[90vw] max-w-[100rem]'
      >
        <h2>Data budget id: {currentBudget?.id}</h2>
      </Dialog>
      <DataTable
        value={budgets}
        emptyMessage='No se encontraron resultados'
        size='small'
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: '40rem' }}
        className='custom-table'
        // loading={clientInfo === null}
      >
        <Column
          key='name'
          field='name'
          header='Nombre'
          style={{ minWidth: '8rem' }}
        />
        <Column
          key='created_date'
          field='created_date.timestamp'
          header='Fecha creación'
          body={createdDateBodyTemplate}
          style={{ minWidth: '7rem' }}
        />
        <Column
          key='due_date'
          field='due_date.timestamp'
          header='Fecha vencimiento'
          body={dueDateBodyTemplate}
          style={{ minWidth: '7rem' }}
        />
        <Column
          key='value'
          field='value.formated'
          header='Valor'
          body={valueBodyTemplate}
          style={{ minWidth: '6rem' }}
        />
        <Column
          key='payed'
          field='payed.formated'
          header='Pagado'
          body={payedBodyTemplate}
          style={{ minWidth: '6rem' }}
        />
        <Column
          key='state_budget'
          field='state_budget'
          header='Estado presupuesto'
        />
        <Column key='state_payed' field='state_payed' header='Estado pagado' />
        <Column
          key='state_track'
          field='state_track'
          header='Estado seguimiento'
        />
        <Column
          key='cost'
          field='cost.formated'
          header='Costos'
          body={costBodyTemplate}
          style={{ minWidth: '6rem' }}
        />
        <Column
          key='options'
          header='Opciones'
          align={'center'}
          body={optionsBodyTemplate}
        />
      </DataTable>
    </Card>
  )
}

export default ClientBudget
