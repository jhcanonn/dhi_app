'use client'

import { useClientContext } from '@contexts'
import { calcularEdadConMeses, getOnlyDate } from '@utils'
import { Button } from 'primereact/button'
import { FileUpload } from 'primereact/fileupload'
import { Image } from 'primereact/image'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'

const ClientDetail = () => {
  const { clientInfo } = useClientContext()
  const birthDate = clientInfo?.fecha_nacimiento
    ? new Date(clientInfo?.fecha_nacimiento)
    : null
  const age = birthDate ? calcularEdadConMeses(birthDate) : null
  const toast = useRef<Toast>(null)

  const emptyTemplate = () => (
    <div className='flex align-items-center flex-column'>
      <i
        className='pi pi-image mt-2 p-4'
        style={{
          fontSize: '3em',
          borderRadius: '50%',
          backgroundColor: 'var(--surface-b)',
          color: 'var(--surface-d)',
        }}
      ></i>
      <span
        style={{ fontSize: '1em', color: 'var(--text-color-secondary)' }}
        className='my-3'
      >
        Drag and Drop Image Here
      </span>
    </div>
  )

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
          <div className='w-full lg:!w-[25%] flex flex-col sm:md:flex-row lg:flex-col items-center gap-4 justify-center'>
            <Image
              src='https://primefaces.org/cdn/primereact/images/galleria/galleria10.jpg'
              alt='Image'
              width='450'
              preview
              className='[&_img]:rounded-lg'
            />
            <FileUpload
              name='demo[]'
              url={'/api/upload'}
              multiple
              accept='image/*'
              maxFileSize={1000000}
              emptyTemplate={emptyTemplate}
              chooseLabel='Elegir foto(s)'
              uploadLabel='Cargar foto(s)'
              cancelLabel='Cancelar foto(s)'
              className='[&_.p-fileupload-buttonbar_.p-button]:w-full [&_.p-message-wrapper]:text-xs [&_.p-fileupload-buttonbar_.p-button]:!mr-0 max-w-xs [&_button]:bg-[#007bff] [&_button]:border-[#007bff] [&_.p-message.p-message-error]:border-[#ff5757] [&_.p-message.p-message-error]:border-l-[5px] [&_.p-message.p-message-error]:border-y-0 [&_.p-message.p-message-error]:border-r-0 [&_.p-message.p-message-error]:text-[#ff5757] [&_.p-message.p-message-error_.p-message-icon]:text-[#ff5757] [&_.p-message.p-message-error_.p-message-close]:text-[#ff5757]'
            />
          </div>
          <div className='w-full lg:!w-[37.5%]'>
            <table className='border [&_td]:px-3 [&_td]:py-2 w-full'>
              <tbody>
                <tr>
                  <td className='border w-[35%] font-bold'>Número de ficha:</td>
                  <td className='border w-[65%]'></td>
                </tr>
                <tr>
                  <td className='border font-bold'>Tipo de identificación:</td>
                  <td className='border'>{clientInfo?.tipo_documento}</td>
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
                  <td className='border w-[35%] font-bold'>Género:</td>
                  <td className='border w-[65%]'>{clientInfo?.genero}</td>
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
                  <td className='border'>{clientInfo?.estado_civil}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className='flex gap-2 flex-wrap mb-4 justify-end'>
          <Button
            label={'Asociar'}
            type='button'
            severity='success'
            rounded
            onClick={(e: any) => showNotification(e.target.textContent)}
          />
          <Button
            label={'Editar'}
            type='button'
            severity='warning'
            rounded
            onClick={(e: any) => showNotification(e.target.textContent)}
          />
          <Button
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
