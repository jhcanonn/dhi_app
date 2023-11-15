'use client'

import {
  BUDGET_CODE,
  GET_BUDGETS,
  PAGE_PATH,
  budgetInitialDataMapper,
  budgetsMapper,
  parseUrl,
} from '@utils'
import ClientBudgetForm from './ClientBudgetForm'
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

const footerContent = (setVisible: (v: boolean) => void, formId?: string) => (
  <div className='flex flex-col md:flex-row gap-2 justify-center'>
    <Button
      type='button'
      label='Cerrar'
      icon='pi pi-times'
      severity='danger'
      className='w-full md:w-fit'
      onClick={() => setVisible(false)}
    />
    <Button
      label='Guardar'
      icon='pi pi-save'
      severity='success'
      className='w-full md:w-fit'
      form={formId}
      // loading={savingBudget}
    />
  </div>
)

const ClientBudget = () => {
  const [visibleData, setVisibleData] = useState<boolean>(false)
  const [visibleEdit, setVisibleEdit] = useState<boolean>(false)
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
              setVisibleEdit(true)
              setCurrentBudget(budget)
            }}
          />
          <Button
            icon='pi pi-file-edit'
            severity='help'
            tooltip='Datos'
            tooltipOptions={{ position: 'bottom' }}
            outlined
            onClick={() => {
              setVisibleData(true)
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
        visible={visibleData}
        onHide={() => setVisibleData(false)}
        header={headerContent}
        footer={footerContent(setVisibleData)}
        className='w-[90vw] max-w-[100rem]'
      >
        <h2>Data budget id: {currentBudget?.id}</h2>
      </Dialog>
      <Dialog
        draggable={false}
        visible={visibleEdit}
        onHide={() => setVisibleEdit(false)}
        header={headerContent}
        footer={footerContent(setVisibleEdit, `form_${BUDGET_CODE}create_edit`)}
        className='w-[90vw] max-w-[100rem]'
      >
        <ClientBudgetForm
          initialData={
            currentBudget ? budgetInitialDataMapper(currentBudget) : undefined
          }
        />
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
        removableSort
        sortField='created_date.timestamp'
        sortOrder={-1}
      >
        <Column
          key='created_date'
          field='created_date.timestamp'
          header='Fecha Creación'
          body={createdDateBodyTemplate}
          style={{ minWidth: '7rem', width: '11rem' }}
          sortable
        />
        <Column
          key='due_date'
          field='due_date.timestamp'
          header='Fecha Vencimiento'
          body={dueDateBodyTemplate}
          style={{ minWidth: '7rem', width: '11rem' }}
          sortable
        />
        <Column
          key='name'
          field='name'
          header='Nombre'
          style={{ minWidth: '11rem', width: '13rem' }}
          sortable
        />
        <Column
          key='value'
          field='value.formated'
          header='Valor'
          body={valueBodyTemplate}
          style={{ minWidth: '6rem' }}
          sortable
        />
        <Column
          key='payed'
          field='payed.formated'
          header='Pagado'
          body={payedBodyTemplate}
          style={{ minWidth: '6rem' }}
          sortable
        />
        <Column
          key='state_budget'
          field='state_budget'
          header='Estado Presupuesto'
          sortable
        />
        <Column
          key='state_payed'
          field='state_payed'
          header='Estado Pago'
          sortable
        />
        <Column
          key='state_track'
          field='state_track'
          header='Estado Seguimiento'
          sortable
        />
        <Column
          key='cost'
          field='cost.formated'
          header='Costos'
          body={costBodyTemplate}
          style={{ minWidth: '6rem' }}
          sortable
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
