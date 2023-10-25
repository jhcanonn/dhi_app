'use client'

import { DataSheet } from '@models'
import { PanelForm } from '../panel'
import { useGlobalContext } from '@contexts'
import { ScrollPanel } from 'primereact/scrollpanel'
import { classNames as cx } from 'primereact/utils'

type Props = {
  data: DataSheet
}

const RowExpansionDataSheet = ({ data }: Props) => {
  const { panels } = useGlobalContext()
  const panel = panels.find((p) => p.code === data.type.code)

  return (
    <ScrollPanel className={cx('custombar2', { 'h-[30rem]': panel })}>
      <section className='border border-brandFieldBorder rounded-[4px] p-4'>
        <PanelForm
          formId={`detail_${data.id}`}
          panel={panel}
          initialData={data.data}
          disabledData
          hideSubmitButton
        />
      </section>
    </ScrollPanel>
  )
}
export default RowExpansionDataSheet
