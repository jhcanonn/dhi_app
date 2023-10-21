'use client'

import { DataSheet, UpdatedAttention } from '@models'
import PanelForm from '../PanelForm'
import { useClientContext, useGlobalContext } from '@contexts'
import { useMutation } from '@apollo/client'
import { UPDATE_ATTENTION } from '@utils'

type Props = {
  data: DataSheet
  onHide: () => void
}

const EditDataSheet = ({ data, onHide }: Props) => {
  const { panels } = useGlobalContext()
  const { dataSheets, setDataSheets, setSavingDataSheet } = useClientContext()
  const [updateAttention] = useMutation(UPDATE_ATTENTION)

  const panel = panels.find((p) => p.code === data.type.code)

  const updateAttentionOnTable = (attention: UpdatedAttention) => {
    const updatedDataSheets = dataSheets.map((ds) =>
      ds.id === attention.id ? { ...ds, data: attention.valores } : ds,
    )
    setDataSheets(updatedDataSheets)
    onHide()
  }

  const onEdit = async (formData: any) => {
    try {
      setSavingDataSheet(true)
      const result: any = await updateAttention({
        variables: {
          atentionId: data.id,
          valores: formData,
        },
      })
      const attention: UpdatedAttention =
        result.data.update_historico_atenciones_item
      if (attention) updateAttentionOnTable(attention)
    } catch (error: any) {
      console.error(error.message)
    }
  }

  return (
    <PanelForm
      formId={`edit_${data.id}`}
      panel={panel}
      initialData={data.data}
      onFormData={(formData: any) => onEdit(formData)}
      hideSubmitButton
    />
  )
}

export default EditDataSheet
