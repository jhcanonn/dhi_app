'use client'

import { UUID } from 'crypto'
import { useQuery } from '@apollo/client'
import { DropdownValid, InputNumberValid } from '@components/atoms'
import { useClientContext, useGlobalContext } from '@contexts'
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
import { useGoTo } from '@hooks'
import {
  BudgetItemsBoxService,
  BudgetItemsDirectus,
  BudgetItemsProducts,
  BudgetItemsTherapies,
  FieldsCodeBudgetItems,
  PanelsDirectus,
  UsersDirectus,
} from '@models'
import {
  BUDGET_CODE,
  GET_BUDGET_ITEMS,
  GET_USERS,
  PAGE_PATH,
  PanelTags,
  budgetServicesMapper,
  budgetProductsMapper,
  parseUrl,
  budgetTherapiesMapper,
} from '@utils'

type Users = {
  name: string
  value: UUID
}

enum BudgetItem {
  SERVICES = 'Servicios',
  PRODUCTS = 'Productos',
  THERAPIES = 'Terapias',
}

const getSelectedPanelFields = (selectedPanel: PanelsDirectus | undefined) =>
  selectedPanel?.agrupadores_id.flatMap((g) =>
    g.agrupadores_code.campos_id.map((c) => c.campos_id),
  ) || []

const ClientBudgetCreate = () => {
  const { goToPage } = useGoTo()
  const { panels } = useGlobalContext()
  const { clientInfo } = useClientContext()
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
          {selectedPanel?.budget_items.includes(BudgetItem.THERAPIES) && (
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
                rowId: UUID,
              ) => handleListChange(+value.terapias_id.valor, tag, rowId)}
            />
          )}
          {selectedPanel?.budget_items.includes(BudgetItem.PRODUCTS) && (
            <BudgetItems
              key={`${BUDGET_CODE}products_items`}
              handleForm={handleForm}
              legend={BudgetItem.PRODUCTS}
              buttonLabel='Agregar producto'
              list={budgetProductsMapper(budgetItems?.productos || [])}
              onListChange={(
                value: BudgetItemsProducts,
                tag: string,
                rowId: UUID,
              ) => handleListChange(+value.valor, tag, rowId)}
            />
          )}
          {selectedPanel?.budget_items.includes(BudgetItem.SERVICES) && (
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
                rowId: UUID,
              ) => handleListChange(+value.servicios_id.precio, tag, rowId)}
            />
          )}
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
        <div className='flex flex-col md:flex-row gap-2 justify-center mt-3'>
          <Button
            type='button'
            label='Cerrar'
            icon='pi pi-times'
            severity='danger'
            className='w-full md:w-fit'
            onClick={() =>
              clientInfo &&
              goToPage(parseUrl(PAGE_PATH.clientBudget, { id: clientInfo.id }))
            }
          />
          <Button
            type='submit'
            label='Guardar'
            icon='pi pi-save'
            severity='success'
            className='w-full md:w-fit'
          />
        </div>
      </form>
    </Card>
  )
}

export default ClientBudgetCreate