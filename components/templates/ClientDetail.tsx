'use client'

import moment from 'moment'
import { ExtraData, Th, Tr, UploadProfileImage } from '@components/organisms'
import { useClientContext } from '@contexts'
import { useGoTo, withToast } from '@hooks'
import { generateURLAssetsWithToken } from '@utils/url-access-token'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Image } from 'primereact/image'
import { ReactNode } from 'react'
import {
  COMING_SOON,
  PAGE_PATH,
  civilStatus,
  getAge,
  getOnlyDate,
  idTypes,
  parseUrl,
} from '@utils'

const WithoutImage = () => (
  <div className='flex align-items-center flex-column rounded-2xl w-full border-brand border-[1px] md:min-w-[330px] max-w-full md:!max-w-[350px] [&_.pi]:!text-[5rem]'>
    <i
      className='pi pi-image mt-4 p-5 bg-brand/30 text-white rounded-full'
      style={{ fontSize: '5em' }}
    ></i>
    <span className='my-4 text-brand text-lg'>No tiene imagen</span>
  </div>
)

type Props = {
  showInfo: (summary: ReactNode, detail: ReactNode) => void
}

const ClientDetail = ({ showInfo }: Props) => {
  const { goToPage } = useGoTo()
  const { clientInfo, setClientInfo } = useClientContext()
  const avatars = clientInfo?.avatar.filter((a) => a.directus_files_id)

  return (
    <div className='flex flex-col gap-4 text-sm'>
      <div className='w-full flex !flex-col lg:!flex-row gap-4'>
        <section className='flex flex-col grow items-center gap-4 justify-center'>
          {avatars && avatars[0]?.directus_files_id ? (
            <Image
              src={generateURLAssetsWithToken(avatars[0].directus_files_id.id, {
                quality: '15',
                fit: 'cover',
              })}
              alt={avatars[0].directus_files_id.title}
              width='350'
              preview
              className='[&_img]:rounded-lg [&_img]:md:min-w-[350px]'
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
        <Card className='custom-table-card grow'>
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
            <Tr>
              {clientInfo?.fecha_nacimiento &&
                getOnlyDate(moment(clientInfo?.fecha_nacimiento).toDate())}
            </Tr>
            <Th>Edad:</Th>
            <Tr>{getAge(clientInfo?.fecha_nacimiento)}</Tr>
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
          <ExtraData clientInfo={clientInfo} />
        </Card>
      </div>
      <div className='flex gap-2 flex-wrap justify-end'>
        <Button
          className='text-sm w-full md:w-auto'
          label='Asociar'
          type='button'
          severity='success'
          rounded
          onClick={(e: any) => showInfo(e.target.textContent, COMING_SOON)}
        />
        <Button
          className='text-sm w-full md:w-auto'
          label='Editar'
          type='button'
          severity='warning'
          rounded
          onClick={() => {
            clientInfo &&
              goToPage(parseUrl(PAGE_PATH.clientEdit, { id: clientInfo.id }))
          }}
        />
        <Button
          className='text-sm w-full md:w-auto'
          label='Eliminar'
          type='button'
          severity='danger'
          rounded
          onClick={(e: any) => showInfo(e.target.textContent, COMING_SOON)}
        />
      </div>
    </div>
  )
}

export default withToast(ClientDetail)
