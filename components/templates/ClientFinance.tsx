'use client'

import {
  BUDGET_CODE,
  GET_BUDGETS,
  GET_BUDGET_ITEMS,
  PAGE_PATH,
  budgetInitialDataMapper,
  budgetProductsMapper,
  budgetServicesMapper,
  budgetStateMapper,
  budgetTherapiesMapper,
  budgetsMapper,
  errorMessages,
  getCurrencyCOP,
  parseUrl,
} from '@utils'
import ClientBudgetForm from './ClientBudgetForm'
import { useClientContext } from '@contexts'
import {
  BudgetItem,
  BudgetItemsBoxService,
  BudgetItemsDirectus,
  BudgetItemsProducts,
  BudgetItemsTherapies,
  BudgetStateDirectus,
  BudgetType,
  DropdownOption,
  FieldsCodeBudgetItems,
  PayedState,
} from '@models'
// import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Column } from 'primereact/column'
// import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import {
  DataTable,
  DataTableExpandedRows,
  DataTableValueArray,
} from 'primereact/datatable'
// import { Dialog } from 'primereact/dialog'
import { ReactNode, useEffect, useState } from 'react'
import { useGoTo, withToast } from '@hooks'
//import { useMutation, useQuery } from '@apollo/client'
import { UseFormReturn, useForm } from 'react-hook-form'
import { InputNumber } from 'primereact/inputnumber'
import { InputNumberMode } from '@components/atoms/InputNumberValid'
import { Nullable } from 'primereact/ts-helpers'
import { Divider } from 'primereact/divider'
import { useQuery } from '@apollo/client'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { BudgetItems } from '@components/organisms'
import { UUID } from 'crypto'
import { getBudgetTotal } from '@components/organisms/patient/BudgetItems'
import { BudgetStateTag } from '@components/molecules'

const createdDateBodyTemplate = (budget: BudgetType) => (
  <p>{budget.created_date.formated}</p>
)

const dueDateBodyTemplate = (budget: BudgetType) => (
  <p>{budget.due_date.formated}</p>
)

const valueBodyTemplate = (budget: BudgetType) => <p>{budget.value.formated}</p>

const payedBodyTemplate = (budget: BudgetType) => <p>{budget.payed.formated}</p>

const paymentMethods = [
  { name: 'Efectivo', code: 'efectivo' },
  { name: 'Tarjeta Crédito', code: 'tarjeta credito' },
  { name: 'Tarjeta Débito', code: 'tarjeta debito' },
  { name: 'Transferencia', code: 'transferencia' },
  { name: 'Cheque', code: 'cheque' },
  { name: 'Crédito Domicilio', code: 'credito domicilio' },
]

type Props = {
  showSuccess: (summary: ReactNode, detail: ReactNode) => void
  showWarning: (summary: ReactNode, detail: ReactNode) => void
}

const findBudgetState = (budgetState: DropdownOption[], findCode: string) =>
  budgetState.find((bs) => {
    const bsInfo = JSON.parse(bs.value) as BudgetStateDirectus
    return bsInfo.codigo === findCode
  })

const ClientFinance = ({ showSuccess, showWarning }: Props) => {
  const [budgetState, setBudgetState] = useState<DropdownOption[]>([])
  const [budgetPaymentState, setBudgetPaymentState] = useState<
    DropdownOption[]
  >([])
  const [budgets, setBudgets] = useState<BudgetType[]>([])
  const [totalSale, setTotalSale] = useState<Nullable<number>>(0)
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<[]>([])
  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | DataTableValueArray | undefined
  >(undefined)
  const [budgetItems, setBudgetItems] = useState<BudgetItemsDirectus | null>(
    null,
  )
  const { clientInfo } = useClientContext()
  const { goToPage } = useGoTo()

  const handleForm = useForm({})
  const { setValue, getValues } = handleForm

  const {
    data: dataBudgets,
    loading: loadingBudgets,
    refetch: refetchBudgets,
  } = useQuery(GET_BUDGETS, {
    variables: { patientId: clientInfo?.id },
  })

  const { data: dataBudgetItems, loading: loadingBudgetItems } =
    useQuery(GET_BUDGET_ITEMS)

  const refreshDataTable = async () =>
    clientInfo && (await refetchBudgets({ patientId: clientInfo.id }))

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

  useEffect(() => {
    refreshDataTable()
  }, [])

  useEffect(() => {
    if (!loadingBudgets) {
      setBudgets(budgetsMapper(dataBudgets.presupuesto || []))
    }
  }, [dataBudgets])

  useEffect(() => {
    !loadingBudgetItems && setBudgetItems(dataBudgetItems)
  }, [dataBudgetItems])

  useEffect(() => {
    if (!loadingBudgets) {
      setBudgets(budgetsMapper(dataBudgets.presupuesto || []))
      setBudgetState(budgetStateMapper(dataBudgets.presupuesto_estado || []))
      setBudgetPaymentState(
        budgetStateMapper(dataBudgets.presupuesto_estado_pago || []),
      )
    }
  }, [dataBudgets])

  const onPaymentChange = (handleForm: UseFormReturn<any, any, undefined>) => {
    const values = handleForm.getValues()
    const keyEvent = `${values['tag']}${FieldsCodeBudgetItems.P}${values['rowId']}`
    const vtCode = Object.keys(values).find((key) =>
      key.endsWith(`${FieldsCodeBudgetItems.VT}${values['rowId']}`),
    )
    const valorTotal = Number(vtCode ? values[vtCode] : 0)
    const totalSaleChange = totalSale
      ? values[keyEvent]
        ? totalSale + valorTotal
        : totalSale - valorTotal
      : valorTotal
    setTotalSale(totalSaleChange)
  }

  const handleListChange = (
    value: number,
    tag: string,
    rowId: UUID | number,
  ) => {
    const cantCode = `${tag}${FieldsCodeBudgetItems.C}${rowId}`
    const valorDctoCode = `${tag}${FieldsCodeBudgetItems.VD}${rowId}`
    const dcto = getValues(`${tag}${FieldsCodeBudgetItems.D}${rowId}`)

    getValues(cantCode) === 0 && setValue(cantCode, 1)
    setValue(`${tag}${FieldsCodeBudgetItems.V}${rowId}`, value)
    setValue(valorDctoCode, value * (1 - dcto / 100))
    setValue(
      `${tag}${FieldsCodeBudgetItems.VT}${rowId}`,
      getValues(cantCode) * getValues(valorDctoCode),
    )
    setValue(`${BUDGET_CODE}total`, getBudgetTotal(getValues()))
  }

  const rowExpansionTemplate = (data: BudgetType) => (
    <ClientBudgetForm
      initialData={data ? budgetInitialDataMapper(data) : undefined}
      paymentForm
      disabledData
      onPaymentChange={onPaymentChange}
    />
  )

  /*const expandAll = () => {
    const _expandedRows: DataTableExpandedRows = {}
    budgets.forEach((ds) => (_expandedRows[`${ds.id}`] = true))
    setExpandedRows(_expandedRows)
  }*/

  return (
    <>
      <Card className='custom-table-card flex flex-col gap-4'>
        <div className='flex flex-col gap-4 md:flex-row flex-wrap justify-between'>
          <div className='w-full md:!w-[20rem] lg:!w-[25rem]'>
            <span className='p-float-label'>
              <Dropdown
                id='ms-methods'
                value={selectedPaymentMethods}
                onChange={(e) => setSelectedPaymentMethods(e.value)}
                options={paymentMethods}
                optionLabel='name'
                filter
                multiple
                placeholder='Seleccione una forma de pago'
                className='!text-[1rem]'
                panelClassName='[&_input]:!text-[1rem]'
                emptyMessage={errorMessages.noBoxes}
                emptyFilterMessage={errorMessages.noExists}
              />
              <label htmlFor='ms-methods'>Formas de pago</label>
            </span>
          </div>
          <div className='flex flex-wrap gap-2 w-full py-0 md:!w-[25rem]'>
            <div className='flex-grow'>
              <span className='p-float-label'>
                <InputNumber
                  id='total-sale-input'
                  min={0}
                  mode={InputNumberMode.CURRENCY}
                  currency='COP'
                  locale='es-CO'
                  useGrouping={true}
                  className='[&_input]:font-bold [&_input]:text-center [&_input]:!text-[1rem] [&_input]:w-full'
                  value={totalSale}
                  onValueChange={(e) => setTotalSale(e.value)}
                />
                <label htmlFor='total-sale-input'>Total a pagar</label>
              </span>
            </div>
            <Button
              label={'Pagar'}
              type='button'
              severity='success'
              onClick={() => {
                if (totalSale && totalSale > 0) {
                  showSuccess(
                    `Total: ${getCurrencyCOP(totalSale)}`,
                    'El pago fue realizado exitosamente, revise su factura en Siigo.',
                  )
                  setTimeout(() => {
                    clientInfo?.id &&
                      goToPage(
                        parseUrl(PAGE_PATH.clientBudget, { id: clientInfo.id }),
                      )
                  }, 1500)
                } else {
                  showWarning(`Total: $0,00`, 'El monto a pagar es $0,00')
                }
              }}
              className='px-4 py-1 font-bold text-md w-full md:w-auto'
            />
          </div>
        </div>
        <Divider
          align='center'
          className='[&_.p-divider-content]:bg-transparent'
        />
        <DataTable
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          dataKey='id'
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
          <Column expander={true} style={{ width: '3%' }} />
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
        </DataTable>
        <div className='flex flex-col gap-4'>
          <BudgetItems
            key={`${BUDGET_CODE}therapies_items`}
            handleForm={handleForm}
            legend={BudgetItem.THERAPIES}
            buttonLabel='Agregar terapia'
            list={budgetTherapiesMapper(
              budgetItems?.terapias_salas_servicios || [],
            )}
            onListChange={(
              value: BudgetItemsTherapies,
              tag: string,
              rowId: UUID | number,
            ) => handleListChange(+value.terapias_id.valor, tag, rowId)}
            onPaymentChange={onPaymentChange}
          />

          <BudgetItems
            key={`${BUDGET_CODE}products_items`}
            handleForm={handleForm}
            legend={BudgetItem.PRODUCTS}
            buttonLabel='Agregar producto'
            list={budgetProductsMapper(budgetItems?.productos || [])}
            onListChange={(
              value: BudgetItemsProducts,
              tag: string,
              rowId: UUID | number,
            ) => handleListChange(+value.valor, tag, rowId)}
            onPaymentChange={onPaymentChange}
          />

          <BudgetItems
            key={`${BUDGET_CODE}services_items`}
            handleForm={handleForm}
            legend={BudgetItem.SERVICES}
            buttonLabel='Agregar servcio'
            listGrouped={budgetServicesMapper(
              budgetItems?.salas_servicios || [],
            )}
            onListChange={(
              value: BudgetItemsBoxService,
              tag: string,
              rowId: UUID | number,
            ) => handleListChange(+value.servicios_id.precio, tag, rowId)}
            onPaymentChange={onPaymentChange}
          />
        </div>
      </Card>
    </>
  )
}

export default withToast(ClientFinance)
