'use client'

import { UUID } from 'crypto'
import { useMutation, useQuery } from '@apollo/client'
import { DropdownValid, InputNumberValid } from '@components/atoms'
import { useBudgetContext, useClientContext, useGlobalContext } from '@contexts'
import { Card } from 'primereact/card'
import { ReactNode, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { BudgetItems } from '@components/organisms'
import { Button } from 'primereact/button'
import { PanelForm } from '@components/molecules'
import { ProgressSpinner } from 'primereact/progressspinner'
import { InputNumberMode } from '@components/atoms/InputNumberValid'
import { useGetCommercials, useGoTo, withToast } from '@hooks'
import { handleAcceptedChange } from '@components/organisms/patient/BudgetItems'
import {
  BudgetForm,
  BudgetItem,
  BudgetItemsBoxService,
  BudgetItemsBoxServiceId,
  BudgetItemsDirectus,
  BudgetItemsProducts,
  BudgetItemsTherapies,
  FieldsCodeBudgetItems,
  PanelsDirectus,
} from '@models'
import {
  BUDGET_CODE,
  GET_BUDGET_ITEMS,
  PAGE_PATH,
  PanelTags,
  budgetServicesMapper,
  budgetProductsMapper,
  parseUrl,
  budgetTherapiesMapper,
  BUDGET_CREATE,
  BUDGET_CREATE_RELATIONS,
  budgetCreateMapper,
  budgetCreateRelationsMapper,
  BUDGET_EDIT,
  budgetEditMapper,
} from '@utils'

type BudgetProps = {
  initialData?: BudgetForm
  disabledData?: boolean
  onCloseDialog?: (close: boolean) => void
  showWarning: (summary: ReactNode, detail: ReactNode) => void
}

const getSelectedPanelFields = (selectedPanel: PanelsDirectus | undefined) =>
  selectedPanel?.agrupadores_id.flatMap((g) =>
    g.agrupadores_code.campos_id.map((c) => c.campos_id),
  ) || []

const ClientBudgetForm = ({
  initialData,
  disabledData,
  onCloseDialog,
  showWarning,
}: BudgetProps) => {
  const { goToPage } = useGoTo()
  const { panels } = useGlobalContext()
  const { clientInfo } = useClientContext()
  const { loading, setLoading } = useBudgetContext()
  const { commercials } = useGetCommercials()
  const [selectedPanel, setSelectedPanel] = useState<PanelsDirectus>()
  const [budgetItems, setBudgetItems] = useState<BudgetItemsDirectus | null>(
    null,
  )

  const { data: dataBudgetItems, loading: loadingBudgetItems } =
    useQuery(GET_BUDGET_ITEMS)

  const [budgetCreate] = useMutation(BUDGET_CREATE)
  const [budgetCreateRelations] = useMutation(BUDGET_CREATE_RELATIONS)
  const [budgetEdit] = useMutation(BUDGET_EDIT)

  const budgetPanels = panels
    .filter((p) => p.view_forms.includes(PanelTags.BUDGET))
    .sort((a, b) => a.orden - b.orden)

  const codePlanilla = `${BUDGET_CODE}planilla`

  let defaultValues: any = {}
  if (initialData) defaultValues = initialData
  const handleForm = useForm({ defaultValues })
  const { handleSubmit, setValue, getValues, unregister } = handleForm

  const createBudget = async () => {
    setLoading(true)
    const data: BudgetForm = getValues()
    const createdBudget: any = await budgetCreate({
      variables: { budgetData: budgetCreateMapper(data, clientInfo?.id) },
    })
    if (createdBudget?.data?.create_presupuesto_item?.id) {
      const createdRelations = await budgetCreateRelations({
        variables: budgetCreateRelationsMapper(
          data,
          createdBudget.data.create_presupuesto_item.id as UUID,
        ),
      })
      if (createdRelations?.data) {
        setLoading(false)
        clientInfo &&
          goToPage(parseUrl(PAGE_PATH.clientBudget, { id: clientInfo.id }))
      }
    }
  }

  const editBudget = async () => {
    setLoading(true)
    const data: BudgetForm = getValues()
    const editedBudget: any = await budgetEdit({
      variables: {
        budgetId: data.presupuesto_id,
        budgetData: budgetEditMapper(data),
      },
    })
    if (editedBudget?.data) {
      setLoading(false)
      onCloseDialog && onCloseDialog(false)
    }
  }

  const onSubmit = async () => {
    if (getValues(`${BUDGET_CODE}total`) > 0) {
      initialData ? await editBudget() : await createBudget()
    } else {
      showWarning(
        'Total Presupuesto: $0,00',
        'El presupuesto debe ser mayor a cero.',
      )
    }
  }

  const handleListChange = (
    value: number,
    tag: string,
    rowId: UUID | number,
  ) => {
    setValue(`${tag}${FieldsCodeBudgetItems.V}${rowId}`, value)
  }

  useEffect(() => {
    !loadingBudgetItems && setBudgetItems(dataBudgetItems)
  }, [dataBudgetItems])

  useEffect(() => {
    if (initialData) {
      setSelectedPanel(
        budgetPanels.find((bp) => bp.code === defaultValues[codePlanilla]),
      )
    } else {
      const defaultBudget = `${BUDGET_CODE}vacio`
      !getValues(codePlanilla) && setValue(codePlanilla, defaultBudget)
      !selectedPanel &&
        setSelectedPanel(budgetPanels.find((bp) => bp.code === defaultBudget))
      setValue(`${BUDGET_CODE}total`, 0)
    }
  }, [panels])

  useEffect(() => {
    getSelectedPanelFields(selectedPanel).forEach((field) =>
      setValue(
        field.codigo,
        initialData ? initialData[field.codigo] : field.valor_predeterminado,
      ),
    )
  }, [selectedPanel])

  return (
    <Card className='custom-table-card'>
      <form
        id={`form_${BUDGET_CODE}create_edit`}
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
              handleAcceptedChange(handleForm, BUDGET_CODE)
            }}
            required
            disabled={!!initialData || disabledData}
          />
          <DropdownValid
            name={`${BUDGET_CODE}comercial`}
            label='Comercial'
            handleForm={handleForm}
            list={commercials}
            required
            disabled={disabledData}
          />
          <InputNumberValid
            handleForm={handleForm}
            label='Total'
            name={`${BUDGET_CODE}total`}
            min={0}
            mode={InputNumberMode.CURRENCY}
            currency='COP'
            locale='es-CO'
            useGrouping={true}
            className='[&_input]:font-bold [&_input]:text-center [&_label]:font-bold [&_label]:!text-[1rem] [&_input]:!text-[1rem]'
            disabled
          />
        </div>
        <div className='flex flex-col gap-4'>
          {selectedPanel?.budget_items.includes(BudgetItem.THERAPIES) && (
            <BudgetItems
              key={`${BUDGET_CODE}therapies_items`}
              handleForm={handleForm}
              fieldsStartCode={BUDGET_CODE}
              legend={BudgetItem.THERAPIES}
              buttonLabel='Agregar terapia'
              list={budgetTherapiesMapper(
                budgetItems?.terapias_salas_servicios || [],
              )}
              onListChange={(value: BudgetItemsTherapies, tag, rowId) =>
                handleListChange(+value.terapias_id.valor, tag, rowId)
              }
              disabledData={disabledData}
            />
          )}
          {selectedPanel?.budget_items.includes(BudgetItem.PRODUCTS) && (
            <BudgetItems
              key={`${BUDGET_CODE}products_items`}
              handleForm={handleForm}
              fieldsStartCode={BUDGET_CODE}
              legend={BudgetItem.PRODUCTS}
              buttonLabel='Agregar producto'
              list={budgetProductsMapper(budgetItems?.productos || [])}
              onListChange={(value: BudgetItemsProducts, tag, rowId) =>
                handleListChange(+value.valor, tag, rowId)
              }
              disabledData={disabledData}
            />
          )}
          {selectedPanel?.budget_items.includes(BudgetItem.SERVICES) && (
            <BudgetItems
              key={`${BUDGET_CODE}services_items`}
              handleForm={handleForm}
              fieldsStartCode={BUDGET_CODE}
              legend={BudgetItem.SERVICES}
              buttonLabel='Agregar servcio'
              listGrouped={budgetServicesMapper(
                budgetItems?.salas_servicios || [],
              )}
              onListChange={(value: BudgetItemsBoxService, tag, rowId) => {
                const serviceId = value.servicios_id as BudgetItemsBoxServiceId
                handleListChange(+serviceId.precio, tag, rowId)
              }}
              disabledData={disabledData}
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
              disabledData={disabledData}
            />
          ) : (
            <div className='flex justify-center'>
              <ProgressSpinner />
            </div>
          )}
        </div>
        {!initialData && (
          <div className='flex flex-col md:flex-row gap-2 justify-center mt-3'>
            <Button
              type='button'
              label='Cerrar'
              icon='pi pi-times'
              severity='danger'
              className='w-full md:w-fit'
              onClick={() =>
                clientInfo &&
                goToPage(
                  parseUrl(PAGE_PATH.clientBudget, { id: clientInfo.id }),
                )
              }
            />
            <Button
              type='submit'
              label='Guardar'
              icon='pi pi-save'
              severity='success'
              className='w-full md:w-fit'
              loading={loading}
            />
          </div>
        )}
      </form>
    </Card>
  )
}

export default withToast(ClientBudgetForm)
