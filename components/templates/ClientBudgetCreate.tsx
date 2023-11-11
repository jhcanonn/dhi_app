'use client'

import { UUID } from 'crypto'
import { useQuery } from '@apollo/client'
import { DropdownValid, InputNumberValid } from '@components/atoms'
import { useGlobalContext } from '@contexts'
import { BUDGET_CODE, GET_BUDGET_ITEMS, GET_USERS, PanelTags } from '@utils'
import { Card } from 'primereact/card'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { directusSystemClient } from './Providers'
import { BudgetItems } from '@components/organisms'
import { Button } from 'primereact/button'
import { PanelForm } from '@components/molecules'
import { ProgressSpinner } from 'primereact/progressspinner'
import { InputNumberMode } from '@components/atoms/InputNumberValid'
import { getBudgetTotal } from '@components/organisms/patient/BudgetItems'
import {
  BudgetItemsDirectus,
  BudgetItemsProducts,
  BudgetItemsService,
  BudgetItemsTherapies,
  FieldsCodeBudgetItems,
  PanelsDirectus,
  UsersDirectus,
} from '@models'

type Users = {
  name: string
  value: UUID
}

enum BudgetItem {
  SERVICES = 'Servicios',
  PRODUCTS = 'Productos',
  THERAPIES = 'Terapias',
}

const getNameValueList = (arr: any) =>
  arr
    ? arr.map((a: any) => ({
        name: a.nombre,
        value: JSON.stringify(a),
      }))
    : []

const getSelectedPanelFields = (selectedPanel: PanelsDirectus | undefined) =>
  selectedPanel?.agrupadores_id.flatMap((g) =>
    g.agrupadores_code.campos_id.map((c) => c.campos_id),
  ) || []

const ClientBudgetCreate = () => {
  const { panels } = useGlobalContext()
  const [selectedPanel, setSelectedPanel] = useState<PanelsDirectus>()
  const [users, setUsers] = useState<Users[]>([])
  const [budgetItems, setBudgetItems] = useState<BudgetItemsDirectus | null>(
    null,
  )

  const { data: dataUsers, loading: loadingUsers } = useQuery(GET_USERS, {
    client: directusSystemClient,
  })

  const { data: dataBudgetItems, loading: loadingBudgetItems } =
    useQuery(GET_BUDGET_ITEMS)

  const budgetPanels = panels
    .filter((p) => p.view_forms.includes(PanelTags.BUDGET))
    .sort((a, b) => a.orden - b.orden)

  const codePlanilla = `${BUDGET_CODE}planilla`

  const defaultValues: any = {}
  const handleForm = useForm({ defaultValues })
  const { handleSubmit, setValue, getValues, unregister } = handleForm

  const onSubmit = async () => {
    console.log(getValues())
  }

  const handleListChange = (value: number, tag: string, rowId: UUID) => {
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

  useEffect(() => {
    if (!loadingUsers) {
      const users: UsersDirectus[] = dataUsers.users
      setUsers(
        users.map((u) => {
          const name = u.profesional
            ? u.profesional.nombre
            : `${u.first_name} ${u.last_name}`
          return { name: name.trim(), value: u.id as UUID }
        }),
      )
    }
  }, [dataUsers])

  useEffect(() => {
    !loadingBudgetItems && setBudgetItems(dataBudgetItems)
  }, [dataBudgetItems])

  useEffect(() => {
    const defaultBudget = `${BUDGET_CODE}vacio`
    !getValues(codePlanilla) && setValue(codePlanilla, defaultBudget)
    !selectedPanel &&
      setSelectedPanel(budgetPanels.find((bp) => bp.code === defaultBudget))
    setValue(`${BUDGET_CODE}total`, 0)
  }, [panels])

  useEffect(() => {
    getSelectedPanelFields(selectedPanel).forEach((field) =>
      setValue(field.codigo, field.valor_predeterminado),
    )
  }, [selectedPanel])

  return (
    <Card className='custom-table-card'>
      <form
        id={`form_${BUDGET_CODE}crate`}
        autoComplete='off'
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-2 text-sm items-center [&>*]:w-full'
      >
        <div className='!grid grid-cols-1 md:grid-cols-3 gap-x-4 px-2 pt-2'>
          <DropdownValid
            name={codePlanilla}
            label='Planilla'
            handleForm={handleForm}
            list={budgetPanels.map((bp) => ({
              name: bp.nombre,
              value: bp.code,
            }))}
            onCustomChange={(e) => {
              setSelectedPanel((prev) => {
                getSelectedPanelFields(prev).forEach((field) =>
                  unregister(field.codigo),
                )
                return budgetPanels.find((bp) => bp.code === e.value)
              })
            }}
            required
          />
          <DropdownValid
            name={`${BUDGET_CODE}comercial`}
            label='Comercial'
            handleForm={handleForm}
            list={users}
            required
          />
          <InputNumberValid
            handleForm={handleForm}
            label='Total'
            name={`${BUDGET_CODE}total`}
            min={0}
            disabled
            mode={InputNumberMode.CURRENCY}
            currency='COP'
            locale='es-CO'
            useGrouping={true}
            className='[&_input]:font-bold [&_input]:text-center [&_input]:!text-[1rem]'
          />
        </div>
        <div className='flex flex-col gap-4'>
          <BudgetItems
            handleForm={handleForm}
            legend={BudgetItem.SERVICES}
            buttonLabel='Agregar servcio'
            list={getNameValueList(budgetItems?.servicios)}
            onListChange={(
              value: BudgetItemsService,
              tag: string,
              rowId: UUID,
            ) => handleListChange(+value.precio, tag, rowId)}
          />
          <BudgetItems
            handleForm={handleForm}
            legend={BudgetItem.THERAPIES}
            buttonLabel='Agregar plan'
            list={getNameValueList(budgetItems?.terapias)}
            onListChange={(
              value: BudgetItemsTherapies,
              tag: string,
              rowId: UUID,
            ) => handleListChange(+value.valor, tag, rowId)}
          />
          <BudgetItems
            handleForm={handleForm}
            legend={BudgetItem.PRODUCTS}
            buttonLabel='Agregar producto'
            list={getNameValueList(budgetItems?.productos)}
            onListChange={(
              value: BudgetItemsProducts,
              tag: string,
              rowId: UUID,
            ) => handleListChange(+value.valor, tag, rowId)}
          />
        </div>
        <div className='mt-4'>
          {selectedPanel ? (
            <PanelForm
              formId={`${BUDGET_CODE}general`}
              panel={selectedPanel}
              handleFormExternal={handleForm}
              hideSubmitButton
            />
          ) : (
            <div className='flex justify-center'>
              <ProgressSpinner />
            </div>
          )}
        </div>
        <Button
          type='submit'
          label='Guardar'
          icon='pi pi-save'
          severity='success'
          className='w-full md:w-fit mt-3'
        />
      </form>
    </Card>
  )
}

export default ClientBudgetCreate
