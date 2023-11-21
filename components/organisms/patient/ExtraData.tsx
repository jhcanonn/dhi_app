'use client'

import { Fragment } from 'react'
import { useGlobalContext } from '@contexts'
import { Divider } from 'primereact/divider'
import { getFormatedDateToEs } from '@utils'
import { ProgressSpinner } from 'primereact/progressspinner'
import { CamposDirectus, ClientDirectus, FieldTypeDirectus } from '@models'
import { classNames as cx } from 'primereact/utils'

export const Th = ({ children }: { children: React.ReactNode }) => (
  <h2 className='font-bold border-b-2 border-gray-100 px-2 py-1'>{children}</h2>
)

export const Tr = ({ children }: { children: React.ReactNode }) => (
  <span className='block border-b-2 border-gray-100 px-2 py-1'>{children}</span>
)

const ExtraDataTitle = () => (
  <Divider
    align='left'
    className='[&_.p-divider-content]:bg-transparent mt-4 mb-3'
  >
    <h2 className='text-2xl font-extrabold text-brand bg-white px-2'>
      Datos extra
    </h2>
  </Divider>
)

const getFieldValue = (field: CamposDirectus, dataExtra: any) => {
  let value = null
  const fieldValue =
    dataExtra && dataExtra[field.codigo] ? dataExtra[field.codigo] : ''
  if (fieldValue) {
    switch (field.tipo) {
      case FieldTypeDirectus.DATE:
      case FieldTypeDirectus.DATETIME:
        value = getFormatedDateToEs(fieldValue)
        break
      case FieldTypeDirectus.DROPDOWN: {
        const options = field.opciones
        value = options?.find((o) => o.value === fieldValue)?.name
        break
      }
      case FieldTypeDirectus.PHONE: {
        const indicativoCode = `indicativo_${field.codigo}`
        value = `${dataExtra[indicativoCode]?.dialling} ${fieldValue}`
        break
      }
      default:
        value = fieldValue
        break
    }
  }

  return value
}

type Props = {
  clientInfo: ClientDirectus | null
  hideHeader?: boolean
  large?: boolean
}

const ExtraData = ({ clientInfo, hideHeader, large }: Props) => {
  const { panels } = useGlobalContext()

  return (
    <div className='text-sm'>
      {!hideHeader && <ExtraDataTitle />}
      {clientInfo ? (
        <div
          className={cx(
            '!grid gap-y-1 h-fit',
            {
              'grid-cols-2 md:grid-cols-4 xl:grid-cols-6': large,
            },
            {
              'grid-cols-2 md:grid-cols-4': !large,
            },
          )}
        >
          {panels
            .find((p) => p.code === 'patient')
            ?.agrupadores_id.sort((a, b) => a.orden - b.orden)
            .map((g) =>
              g.agrupadores_code.campos_id
                .sort((a, b) => a.orden - b.orden)
                .map((c) => {
                  const field = c.campos_id
                  return (
                    <Fragment key={field.id}>
                      <Th>{field.etiqueta}:</Th>
                      <Tr>{getFieldValue(field, clientInfo?.datos_extra)}</Tr>
                    </Fragment>
                  )
                }),
            )}
        </div>
      ) : (
        <div className='flex justify-center py-4'>
          <ProgressSpinner />
        </div>
      )}
    </div>
  )
}

export default ExtraData
