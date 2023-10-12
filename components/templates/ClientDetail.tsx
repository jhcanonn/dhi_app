'use client'

import { UploadProfileImage } from '@components/organisms'
import { useClientContext } from '@contexts'
import {
  PAGE_PATH,
  calcularEdadConMeses,
  civilStatus,
  genders,
  getOnlyDate,
  idTypes,
  parseUrl,
} from '@utils'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import { Button } from 'primereact/button'
import { Image } from 'primereact/image'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'

const ClientDetail = () => {
  const router = useRouter()
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
      <div className='flex flex-col gap-4 text-sm'>
        <div className='flex flex-col lg:flex-row gap-4'>
          <div className='w-full lg:!w-[25%] flex flex-col items-center gap-4 justify-center'>
            {clientInfo?.avatar[0]?.directus_files_id ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL}/assets/${clientInfo.avatar[0].directus_files_id.id}?fit=cover`}
                alt={clientInfo.avatar[0].directus_files_id.title}
                width='450'
                preview
                className='[&_img]:rounded-lg'
              />
            ) : (
              <div className='flex align-items-center flex-column rounded-2xl w-full border-brand border-[1px]'>
                <i
                  className='pi pi-image mt-4 p-5 bg-brand/30 text-white rounded-full'
                  style={{ fontSize: '5em' }}
                ></i>
                <span className='my-4 text-brand text-lg'>No tiene imagen</span>
              </div>
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
          </div>
          <div className='w-full lg:!w-[37.5%]'>
            <table className='border [&_td]:px-3 [&_td]:py-2 w-full'>
              <tbody>
                <tr>
                  <td className='border w-[45%] md:w-[35%] font-bold'>
                    Número de ficha:
                  </td>
                  <td className='border w-[55%] md:w-[65%]'></td>
                </tr>
                <tr>
                  <td className='border font-bold'>Tipo de identificación:</td>
                  <td className='border'>
                    {clientInfo?.tipo_documento
                      ? idTypes.find(
                          (t) => t.type === clientInfo.tipo_documento,
                        )?.name
                      : ''}
                  </td>
                </tr>
                <tr>
                  <td className='border font-bold'>Identificación:</td>
                  <td className='border'>{clientInfo?.documento}</td>
                </tr>
                <tr>
                  <td className='border font-bold'>Primer nombre:</td>
                  <td className='border'>{clientInfo?.primer_nombre}</td>
                </tr>
                <tr>
                  <td className='border font-bold'>Segundo nombre:</td>
                  <td className='border'>{clientInfo?.segundo_nombre}</td>
                </tr>
                <tr>
                  <td className='border font-bold'>Apellido paterno:</td>
                  <td className='border'>{clientInfo?.apellido_paterno}</td>
                </tr>
                <tr>
                  <td className='border font-bold'>Apellido materno:</td>
                  <td className='border'>{clientInfo?.apellido_materno}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className='w-full lg:!w-[37.5%]'>
            <table className='border [&_td]:px-3 [&_td]:py-2 w-full'>
              <tbody>
                <tr>
                  <td className='border w-[45%] md:w-[35%] font-bold'>
                    Género:
                  </td>
                  <td className='border w-[55%] md:w-[65%]'>
                    {clientInfo?.genero
                      ? genders.find((g) => g.type === clientInfo.genero)?.name
                      : ''}
                  </td>
                </tr>
                <tr>
                  <td className='border font-bold'>Fecha de nacimiento:</td>
                  <td className='border'>
                    {birthDate && getOnlyDate(birthDate)}
                  </td>
                </tr>
                <tr>
                  <td className='border font-bold'>Edad:</td>
                  <td className='border'>
                    {age ? `${age?.anios} años, ${age?.meses} meses` : ''}
                  </td>
                </tr>
                <tr>
                  <td className='border font-bold'>Correo electrónico:</td>
                  <td className='border'>{clientInfo?.correo}</td>
                </tr>
                <tr>
                  <td className='border font-bold'>Telefono 1:</td>
                  <td className='border'>
                    {clientInfo?.indicativo}
                    {clientInfo?.telefono}
                  </td>
                </tr>
                <tr>
                  <td className='border font-bold'>Telefono 2:</td>
                  <td className='border'>
                    {clientInfo?.indicativo_2}
                    {clientInfo?.telefono_2}
                  </td>
                </tr>
                <tr>
                  <td className='border font-bold'>Estado civil:</td>
                  <td className='border'>
                    {clientInfo?.estado_civil
                      ? civilStatus.find(
                          (c) => c.type === clientInfo.estado_civil,
                        )?.name
                      : ''}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className='flex gap-2 flex-wrap mb-4 justify-end'>
          <Button
            className='text-sm w-full md:w-auto'
            label={'Asociar'}
            type='button'
            severity='success'
            rounded
            onClick={(e: any) => showNotification(e.target.textContent)}
          />
          <Button
            className='text-sm w-full md:w-auto'
            label={'Editar'}
            type='button'
            severity='warning'
            rounded
            onClick={() => {
              clientInfo &&
                router.push(
                  parseUrl(PAGE_PATH.clientEdit, { id: clientInfo.id }),
                )
            }}
          />
          <Button
            className='text-sm w-full md:w-auto'
            label={'Eliminar'}
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
