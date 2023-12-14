'use client'

import {
  BUDGET_CODE,
  BUDGET_DELETE,
  GET_BUDGETS,
  PAGE_PATH,
  budgetInitialDataMapper,
  budgetStateMapper,
  budgetsMapper,
  clientInfoToHeaderDataPDFMapper,
  parseUrl,
} from '@utils'
import {
  BudgetStateDirectus,
  BudgetType,
  DropdownOption,
  PayedState,
} from '@models'
import ClientBudgetForm from './ClientBudgetForm'
import { useBudgetContext, useClientContext } from '@contexts'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Column } from 'primereact/column'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { ReactNode, useEffect, useState } from 'react'
import { useGoTo, withToast } from '@hooks'
import { useLazyQuery, useMutation } from '@apollo/client'
import { PrimeIcons } from 'primereact/api'
import { BudgetStateTag } from '@components/molecules'
import { generateBudgetToPDF } from '@utils/utils-pdf'

const createdDateBodyTemplate = (budget: BudgetType) => (
  <p>{budget.created_date.formated}</p>
)

const dueDateBodyTemplate = (budget: BudgetType) => (
  <p>{budget.due_date.formated}</p>
)

const valueBodyTemplate = (budget: BudgetType) => <p>{budget.value.formated}</p>

const payedBodyTemplate = (budget: BudgetType) => <p>{budget.payed.formated}</p>

const costBodyTemplate = (budget: BudgetType) => <p>{budget.cost.formated}</p>

const footerDialog = (
  setVisible: (v: boolean) => void,
  disableData?: boolean,
  formId?: string,
  loading?: boolean,
) => (
  <div className='flex flex-col md:flex-row gap-2 justify-center'>
    <Button
      type='button'
      label='Cerrar'
      icon='pi pi-times'
      severity='danger'
      className='w-full md:w-fit'
      onClick={() => setVisible(false)}
    />
    {!disableData && (
      <Button
        label='Guardar'
        icon='pi pi-save'
        severity='success'
        className='w-full md:w-fit'
        form={formId}
        loading={loading}
      />
    )}
  </div>
)

const findBudgetState = (budgetState: DropdownOption[], findCode: string) =>
  budgetState.find((bs) => {
    const bsInfo = JSON.parse(bs.value) as BudgetStateDirectus
    return bsInfo.codigo === findCode
  })

type Props = {
  showSuccess: (summary: ReactNode, detail: ReactNode) => void
}

const ClientBudget = ({ showSuccess }: Props) => {
  const [visibleView, setVisibleView] = useState<boolean>(false)
  const [visibleEdit, setVisibleEdit] = useState<boolean>(false)
  const [budgets, setBudgets] = useState<BudgetType[]>([])
  const [budgetState, setBudgetState] = useState<DropdownOption[]>([])
  const [budgetPaymentState, setBudgetPaymentState] = useState<
    DropdownOption[]
  >([])
  const [currentBudget, setCurrentBudget] = useState<BudgetType | null>(null)
  const { clientInfo } = useClientContext()
  const { loading } = useBudgetContext()
  const { goToPage } = useGoTo()

  const [budgetDelete] = useMutation(BUDGET_DELETE)

  const [refetchBudgets, { data: dataBudgets, loading: loadingBudgets }] =
    useLazyQuery(GET_BUDGETS, {
      variables: { patientId: clientInfo?.id },
    })

  const headerDialog = (
    <h2>
      Nombre: <span className='font-normal'>{currentBudget?.name}</span>
    </h2>
  )

  const stateBudgetBodyTemplate = (budget: BudgetType) => (
    <BudgetStateTag state={findBudgetState(budgetState, budget.state_budget)} />
  )

  const statePayedBodyTemplate = (budget: BudgetType) => (
    <BudgetStateTag
      state={findBudgetState(
        budgetPaymentState,
        budget.state_payed || PayedState.NO_PAGADO,
      )}
    />
  )

  const deleteBudget = async (budget: BudgetType) => {
    const deletedBudget: any = await budgetDelete({
      variables: { budgetId: budget.id },
    })
    if (deletedBudget?.data) {
      await refreshDataTable()
      showSuccess(
        'Presupuesto eliminado',
        'El Presupuesto fue eliminado exitosamente.',
      )
    }
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
              setVisibleView(true)
              setCurrentBudget(budget)
            }}
          />
          <Button
            icon={PrimeIcons.PENCIL}
            severity='success'
            tooltip='Editar'
            tooltipOptions={{ position: 'bottom' }}
            onClick={() => {
              setVisibleEdit(true)
              setCurrentBudget(budget)
            }}
            outlined
          />
          <Button
            icon={PrimeIcons.TRASH}
            severity='danger'
            tooltip='Eliminar'
            tooltipOptions={{ position: 'bottom' }}
            onClick={() => confirmDelete(tagKey, budget)}
            outlined
          />
          <Button
            icon={PrimeIcons.PRINT}
            type='button'
            severity='info'
            tooltip='Imprimir'
            tooltipOptions={{ position: 'bottom' }}
            onClick={() =>
              generateBudgetToPDF(
                budget,
                false,
                clientInfoToHeaderDataPDFMapper(clientInfo as any, {} as any),
              )
            }
            className='text-sm'
            outlined
          />
        </section>
      </div>
    )
  }

  const refreshDataTable = async () =>
    clientInfo &&
    (await refetchBudgets({ variables: { patientId: clientInfo.id } }))

  useEffect(() => {
    refreshDataTable()
  }, [])

  useEffect(() => {
    if (!loadingBudgets) {
      setBudgets(budgetsMapper(dataBudgets.presupuesto || []))
      setBudgetState(budgetStateMapper(dataBudgets.presupuesto_estado || []))
      setBudgetPaymentState(
        budgetStateMapper(dataBudgets.presupuesto_estado_pago || []),
      )
    }
  }, [dataBudgets])

  return (
    <>
      <Dialog
        draggable={false}
        visible={visibleView}
        onHide={() => setVisibleView(false)}
        header={headerDialog}
        footer={footerDialog(setVisibleView, true)}
        className='w-[90vw] max-w-[100rem]'
      >
        <ClientBudgetForm
          initialData={
            currentBudget ? budgetInitialDataMapper(currentBudget) : undefined
          }
          disabledData
        />
      </Dialog>
      <Dialog
        draggable={false}
        visible={visibleEdit}
        onHide={() => setVisibleEdit(false)}
        header={headerDialog}
        footer={footerDialog(
          setVisibleEdit,
          false,
          `form_${BUDGET_CODE}create_edit`,
          loading,
        )}
        className='w-[90vw] max-w-[100rem]'
      >
        <ClientBudgetForm
          initialData={
            currentBudget ? budgetInitialDataMapper(currentBudget) : undefined
          }
          onCloseDialog={async (close: boolean) => {
            setVisibleEdit(close)
            await refreshDataTable()
            showSuccess(
              'Presupuesto actualizado',
              'El Presupuesto fue actualizado exitosamente.',
            )
          }}
        />
      </Dialog>
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
        <DataTable
          value={budgets}
          emptyMessage='No se encontraron resultados'
          size='small'
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: '40rem' }}
          className='custom-table'
          loading={loadingBudgets}
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
            body={stateBudgetBodyTemplate}
            style={{ minWidth: '10rem' }}
            sortable
          />
          <Column
            key='state_payed'
            field='state_payed'
            header='Estado Pago'
            body={statePayedBodyTemplate}
            style={{ minWidth: '10rem' }}
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
            header='Acciones'
            align={'center'}
            body={optionsBodyTemplate}
          />
        </DataTable>
      </Card>
    </>
  )
}

export default withToast(ClientBudget)
