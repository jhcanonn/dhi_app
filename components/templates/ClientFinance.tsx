'use client'

import { GET_BUDGETS, budgetInitialDataMapper, budgetsMapper } from '@utils'
import ClientBudgetForm from './ClientBudgetForm'
import { useClientContext } from '@contexts'
import { BudgetType, FieldsCodeBudgetItems } from '@models'
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
import { useEffect, useState } from 'react'
import { withToast } from '@hooks'
//import { useMutation, useQuery } from '@apollo/client'
import { UseFormReturn } from 'react-hook-form'
import { InputNumber } from 'primereact/inputnumber'
import { InputNumberMode } from '@components/atoms/InputNumberValid'
import { Nullable } from 'primereact/ts-helpers'
import { Divider } from 'primereact/divider'
import { MultiSelect } from 'primereact/multiselect'
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

const paymentMethods = [
  { name: 'Efectivo', code: 'efectivo' },
  { name: 'Tarjeta Crédito', code: 'tarjeta credito' },
  { name: 'Tarjeta Débito', code: 'tarjeta debito' },
  { name: 'Transferencia', code: 'transferencia' },
  { name: 'Cheque', code: 'cheque' },
  { name: 'Crédito Domicilio', code: 'credito domicilio' },
]

const ClientFinance = () => {
  const [budgets, setBudgets] = useState<BudgetType[]>([])
  const [totalSale, setTotalSale] = useState<Nullable<number>>(0)
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<[]>([])
  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | DataTableValueArray | undefined
  >(undefined)
  const { clientInfo } = useClientContext()

  const {
    data: dataBudgets,
    loading: loadingBudgets,
    refetch: refetchBudgets,
  } = useQuery(GET_BUDGETS, {
    variables: { patientId: clientInfo?.id },
  })

  const refreshDataTable = async () =>
    clientInfo && (await refetchBudgets({ patientId: clientInfo.id }))

  useEffect(() => {
    refreshDataTable()
  }, [])

  useEffect(() => {
    if (!loadingBudgets) {
      setBudgets(budgetsMapper(dataBudgets.presupuesto || []))
    }
  }, [dataBudgets])

  useEffect(() => {
    expandAll()
  }, [budgets])

  const onPaymentChange = (handleForm: UseFormReturn<any, any, undefined>) => {
    console.log(handleForm.getValues())
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

  const rowExpansionTemplate = (data: BudgetType) => {
    return (
      <>
        {console.log(data.extraData)}
        <ClientBudgetForm
          initialData={data ? budgetInitialDataMapper(data) : undefined}
          paymentForm
          disabledData
          onPaymentChange={onPaymentChange}
        />
      </>
    )
  }

  const expandAll = () => {
    const _expandedRows: DataTableExpandedRows = {}
    budgets.forEach((ds) => (_expandedRows[`${ds.id}`] = true))
    setExpandedRows(_expandedRows)
  }

  return (
    <>
      <Card className='custom-table-card flex flex-col gap-4'>
        <div className='flex flex-col gap-4 md:flex-row flex-wrap justify-between'>
          <div className='w-full md:!w-[20rem]'>
            <span className='p-float-label'>
              <MultiSelect
                id='ms-methods'
                value={selectedPaymentMethods}
                onChange={(e) => setSelectedPaymentMethods(e.value)}
                options={paymentMethods}
                optionLabel='name'
                className='!text-[1rem]'
                panelClassName='[&_input]:!text-[1rem]'
              />
              <label htmlFor='ms-methods'>Formas de pago</label>
            </span>
          </div>
          <div className='w-full md:!w-[20rem]'>
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
                disabled
              />
              <label htmlFor='total-sale-input'>Total a pagar</label>
            </span>
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
        </DataTable>
      </Card>
    </>
  )
}

export default withToast(ClientFinance)
