'use client'

import {
  BUDGET_CODE,
  GET_BUDGETS,
  PAGE_PATH,
  budgetsMapper,
  parseUrl,
} from '@utils'
import { useClientContext } from '@contexts'
import { BudgetType } from '@models'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Column } from 'primereact/column'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { useEffect, useState } from 'react'
import { useGoTo } from '@hooks'
import { useQuery } from '@apollo/client'

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

  const {
    data: dataBudges,
    loading: loadingBudges,
    refetch: refetchBudgets,
  } = useQuery(GET_BUDGETS, {
    variables: { patientId: clientInfo?.id },
  })

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
            icon='pi pi-pencil'
            severity='success'
            tooltip='Editar'
            tooltipOptions={{ position: 'bottom' }}
            outlined
            onClick={() => {
              console.log(`Edit budget: ${budget.id}`)
            }}
          />
          <Button
            icon='pi pi-file-edit'
            severity='help'
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
    refetchBudgets({ patientId: clientInfo?.id })
  }, [])

  useEffect(() => {
    !loadingBudges && setBudgets(budgetsMapper(dataBudges.presupuesto || []))
  }, [dataBudges])

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
        loading={loadingBudges}
      >
        <Column
          key='name'
          field='name'
          header='Nombre'
          style={{ minWidth: '11rem', width: '13rem' }}
        />
        <Column
          key='created_date'
          field='created_date.timestamp'
          header='Fecha Creación'
          body={createdDateBodyTemplate}
          style={{ minWidth: '7rem', width: '11rem' }}
        />
        <Column
          key='due_date'
          field='due_date.timestamp'
          header='Fecha Vencimiento'
          body={dueDateBodyTemplate}
          style={{ minWidth: '7rem', width: '11rem' }}
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
          header='Estado Presupuesto'
        />
        <Column key='state_payed' field='state_payed' header='Estado Pago' />
        <Column
          key='state_track'
          field='state_track'
          header='Estado Seguimiento'
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
