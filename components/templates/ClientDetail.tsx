'use client'

import { UploadProfileImage } from '@components/organisms'
import { useClientContext, useGlobalContext } from '@contexts'
import { CamposDirectus, FieldTypeDirectus } from '@models'
import {
  PAGE_PATH,
  calcularEdadConMeses,
  civilStatus,
  getFormatedDateToEs,
  getOnlyDate,
  idTypes,
  parseUrl,
} from '@utils'
import { goToPage } from '@utils/go-to'
import { generateURLAssetsWithToken } from '@utils/url-access-token'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { Image } from 'primereact/image'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Toast } from 'primereact/toast'
import { Fragment, useRef } from 'react'

const Th = ({ children }: { children: React.ReactNode }) => (
  <h2 className='font-bold border-b-2 px-2 py-1'>{children}</h2>
)

const Tr = ({ children }: { children: React.ReactNode }) => (
  <span className='block border-b-2 px-2 py-1'>{children}</span>
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

const WithoutImage = () => (
  <div className='flex align-items-center flex-column rounded-2xl w-full border-brand border-[1px] md:min-w-[330px] max-w-full md:!max-w-[450px]'>
    <i
      className='pi pi-image mt-4 p-5 bg-brand/30 text-white rounded-full'
      style={{ fontSize: '5em' }}
    ></i>
    <span className='my-4 text-brand text-lg'>No tiene imagen</span>
  </div>
)

const ClientDetail = () => {
  const router = useRouter()
  const { panels } = useGlobalContext()
  const { clientInfo, setClientInfo } = useClientContext()

  const birthDate = clientInfo?.fecha_nacimiento
    ? moment(clientInfo?.fecha_nacimiento).toDate()
    : null
  const age = birthDate ? calcularEdadConMeses(birthDate) : null
  const toast = useRef<Toast>(null)

  const showNotification = (text: string) => {
    toast.current?.show({
      severity: 'info',
      summary: text,
      detail: 'Esta funcionalidad estará disponible proximamente.',
      life: 3000,
    })
  }

  return (
    <>
      <Toast ref={toast} />
      <div className='flex flex-col gap-5 text-sm'>
        <div className='w-full flex !flex-col lg:!flex-row gap-4'>
          <section className='flex flex-col grow items-center gap-4 justify-center'>
            {clientInfo?.avatar[0]?.directus_files_id ? (
              <Image
                src={generateURLAssetsWithToken(
                  clientInfo.avatar[0].directus_files_id.id,
                  {
                    quality: '15',
                    fit: 'cover',
                  },
                )}
                alt={clientInfo.avatar[0].directus_files_id.title}
                width='450'
                preview
                className='[&_img]:rounded-lg [&_img]:md:min-w-[450px]'
              />
            ) : (
              <WithoutImage />
            )}
            <UploadProfileImage
              clientInfo={clientInfo}
              buttonLabel='Foto de perfil'
              onUploadAvatars={(avatars) => {
                setClientInfo((prevInfo) =>
                  prevInfo ? { ...prevInfo, avatar: avatars } : prevInfo,
                )
              }}
            />
          </section>
          <section className='grow'>
            <div className='!grid grid-cols-2 md:grid-cols-4 gap-y-1 h-fit'>
              <Th>Historia Clínica:</Th>
              <Tr>{clientInfo?.ficha_id?.id ?? 'Sin historia clínica'}</Tr>
              <Th>Tipo de identificación:</Th>
              <Tr>
                {clientInfo?.tipo_documento
                  ? idTypes.find((t) => t.type === clientInfo.tipo_documento)
                      ?.name
                  : ''}
              </Tr>
              <Th>Identificación:</Th>
              <Tr>{clientInfo?.documento}</Tr>
              <Th>Primer nombre:</Th>
              <Tr>{clientInfo?.primer_nombre}</Tr>
              <Th>Segundo nombre:</Th>
              <Tr>{clientInfo?.segundo_nombre}</Tr>
              <Th>Primer apellido:</Th>
              <Tr>{clientInfo?.apellido_paterno}</Tr>
              <Th>Segundo apellido:</Th>
              <Tr>{clientInfo?.apellido_materno}</Tr>
              <Th>Fecha de nacimiento:</Th>
              <Tr>{birthDate && getOnlyDate(birthDate)}</Tr>
              <Th>Edad:</Th>
              <Tr>{age ? `${age?.anios} años, ${age?.meses} meses` : ''}</Tr>
              <Th>Correo electrónico:</Th>
              <Tr>{clientInfo?.correo}</Tr>
              <Th>Telefono 1:</Th>
              <Tr>
                {clientInfo?.indicativo} {clientInfo?.telefono}
              </Tr>
              <Th>Telefono 2:</Th>
              <Tr>
                {clientInfo?.indicativo_2} {clientInfo?.telefono_2}
              </Tr>
              <Th>Estado civil:</Th>
              <Tr>
                {clientInfo?.estado_civil
                  ? civilStatus.find((c) => c.type === clientInfo.estado_civil)
                      ?.name
                  : ''}
              </Tr>
            </div>
            <Divider
              align='left'
              className='[&_.p-divider-content]:bg-transparent mt-4 mb-3'
            >
              <h2 className='text-2xl font-extrabold text-brand bg-surfaceGround px-2'>
                Datos extra
              </h2>
            </Divider>
            {clientInfo ? (
              <div className='!grid grid-cols-2 md:grid-cols-4 gap-y-1 h-fit'>
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
                            <Tr>
                              {getFieldValue(field, clientInfo?.datos_extra)}
                            </Tr>
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
          </section>
        </div>
        <div className='flex gap-2 flex-wrap justify-end'>
          <Button
            className='text-sm w-full md:w-auto'
            label='Asociar'
            type='button'
            severity='success'
            rounded
            onClick={(e: any) => showNotification(e.target.textContent)}
          />
          <Button
            className='text-sm w-full md:w-auto'
            label='Editar'
            type='button'
            severity='warning'
            rounded
            onClick={() => {
              clientInfo &&
                goToPage(
                  parseUrl(PAGE_PATH.clientEdit, { id: clientInfo.id }),
                  router,
                )
            }}
          />
          <Button
            className='text-sm w-full md:w-auto'
            label='Eliminar'
            type='button'
            severity='danger'
            rounded
            onClick={(e: any) => showNotification(e.target.textContent)}
          />
        </div>
      </div>
    </>
  )
}

export default ClientDetail
