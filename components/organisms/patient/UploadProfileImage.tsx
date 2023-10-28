'use client'

import { MAX_MB_GALLERY, PATIENTS_GALLERY } from '@utils'
import {
  deleteFileToDirectus,
  patchAvatarWithPatient,
  refreshToken,
  uploadFileToDirectus,
} from '@utils/api'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload'
import { Toast } from 'primereact/toast'
import { useEffect, useRef, useState } from 'react'
import { Cookies, withCookies } from 'react-cookie'
import { classNames as cx } from 'primereact/utils'
import { ClientDirectus, PatientAvatar, ProfileAvatar } from '@models'
import { Image } from 'primereact/image'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Message } from 'primereact/message'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { generateURLAssetsWithToken } from '@utils/url-img-access'

type Props = {
  clientInfo: ClientDirectus | null
  buttonLabel?: string
  onUploadAvatars?: (avatars: ProfileAvatar[]) => void
  cookies: Cookies
}

const UploadProfileImage = ({
  cookies,
  clientInfo,
  buttonLabel,
  onUploadAvatars,
}: Props) => {
  const [uploadLoading, setUploadLoading] = useState<boolean>(false)
  const [avatars, setAvatars] = useState<ProfileAvatar[]>(
    clientInfo ? clientInfo.avatar : [],
  )
  const [visible, setVisible] = useState<boolean>(false)
  const toast = useRef<Toast>(null)

  const showError = (status: string, message: string) => {
    toast.current?.show({
      severity: 'error',
      summary: status,
      detail: message,
      sticky: true,
    })
  }

  const showSuccess = (summary: string, detail: string) => {
    toast.current?.show({
      severity: 'success',
      summary,
      detail,
      life: 3000,
    })
  }

  const uploadFile = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('folder', PATIENTS_GALLERY)
      formData.append('file', file)

      const access_token = await refreshToken(cookies)
      const res = await uploadFileToDirectus(formData, access_token)

      if (res?.id && clientInfo) {
        const patientId = clientInfo.id.toString()
        const avatar: PatientAvatar = {
          avatar: {
            create: [
              {
                pacientes_id: patientId,
                directus_files_id: {
                  id: res.id,
                },
              },
            ],
            delete: [],
          },
        }
        const resAvatar = await patchAvatarWithPatient(
          patientId,
          avatar,
          access_token,
        )
        const newAvatar: ProfileAvatar = {
          id: resAvatar.avatar[resAvatar.avatar.length - 1],
          directus_files_id: {
            id: res.id,
            title: res.title,
          },
        }
        setAvatars((prevAvatar) => {
          const refreshedAvatars = [...prevAvatar, newAvatar]
          onUploadAvatars && onUploadAvatars(refreshedAvatars)
          return refreshedAvatars
        })
      }

      showSuccess(
        'Carga exitosa!',
        `Archivo ${res.filename_download} cargado exitosamente.`,
      )
    } catch (error: any) {
      showError(
        'Error en la carga',
        `No se pudo cargar el archivo ${file.name}. ${error.message}`,
      )
    }
  }

  const uploadHandler = async (event: FileUploadHandlerEvent) => {
    setUploadLoading(true)
    const uploadFiles = event.files.map(async (file: File) => {
      await uploadFile(file)
    })
    Promise.all(uploadFiles).then(() => {
      event.options.clear()
      setUploadLoading(false)
    })
  }

  const deleteImage = async (avatarId: number, fileId: string) => {
    if (clientInfo) {
      setUploadLoading(true)
      const patientId = clientInfo.id.toString()
      const avatar: PatientAvatar = {
        avatar: {
          create: [],
          delete: [avatarId],
        },
      }
      const access_token = await refreshToken(cookies)
      await deleteFileToDirectus(fileId, access_token)
      const resDeleteAvatar = await patchAvatarWithPatient(
        patientId,
        avatar,
        access_token,
      )
      if (resDeleteAvatar) {
        setAvatars((prevAvatars) => {
          const refreshedAvatars = prevAvatars.filter((a) => +a.id !== avatarId)
          onUploadAvatars && onUploadAvatars(refreshedAvatars)
          return refreshedAvatars
        })
      }
      setUploadLoading(false)
    }
  }

  const deleteImageHandler = async (avatarId: string, fileId: string) => {
    confirmDialog({
      tagKey: fileId,
      message: 'Está seguro de eliminar la imagen?',
      header: 'Confirmación',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      draggable: false,
      accept: async () => {
        await deleteImage(+avatarId, fileId)
      },
    })
  }

  const footerContent = (
    <div className='flex gap-2 justify-end'>
      <Button
        label='Cerrar'
        severity='danger'
        onClick={() => setVisible(false)}
      />
      <FileUpload
        mode='basic'
        name='demo[]'
        url='/api/upload'
        accept='image/*'
        maxFileSize={MAX_MB_GALLERY * 1000000}
        auto
        customUpload
        multiple
        uploadHandler={uploadHandler}
        chooseLabel='Cargar imagen(es)'
      />
    </div>
  )

  const headerContent = (
    <div className='flex gap-2'>
      <h2>Subir fotos de perfil</h2>
      {uploadLoading && (
        <>
          <Message
            text='Actualizando imagen(es)...'
            className='[&_.p-inline-message-text]:text-xs ml-3'
          />
          <div className='flex items-center'>
            <ProgressSpinner
              style={{ width: '25px', height: '25px' }}
              strokeWidth='8'
              fill='var(--surface-ground)'
              animationDuration='.5s'
            />
          </div>
        </>
      )}
    </div>
  )

  useEffect(() => {
    setAvatars(clientInfo ? clientInfo.avatar : [])
  }, [clientInfo])

  return (
    <>
      <Toast ref={toast} />
      <Button
        label={buttonLabel}
        icon='pi pi-camera'
        onClick={() => setVisible(true)}
        className={cx(
          '[&_.pi-camera:before]:text-lg flex justify-center [&_.p-button-label]:grow-0 !w-auto py-1',
          {
            'px-4': buttonLabel,
          },
          { '!rounded-full px-2': !buttonLabel },
          { '!w-full md:!w-auto': buttonLabel },
        )}
        rounded={!!buttonLabel}
      />
      <Dialog
        header={headerContent}
        draggable={false}
        visible={visible}
        onHide={() => setVisible(false)}
        footer={footerContent}
        className='w-[90vw] lg:w-[45rem]'
      >
        <div className='flex gap-2 justify-center items-center flex-wrap'>
          {avatars.length > 0 && avatars[0].directus_files_id ? (
            avatars.map((a) => (
              <div key={a.directus_files_id.id}>
                <ConfirmDialog tagKey={a.directus_files_id.id} />
                <article className='flex flex-col gap-2 items-center'>
                  <Image
                    src={generateURLAssetsWithToken(a.directus_files_id.id, {
                      quality: '15',
                      fit: 'cover',
                    })}
                    alt={a.directus_files_id.title}
                    width='200'
                    preview
                    className='[&_img]:rounded-lg'
                  />
                  <Button
                    className='w-fit'
                    type='button'
                    severity='danger'
                    text
                    onClick={() =>
                      deleteImageHandler(a.id, a.directus_files_id.id)
                    }
                  >
                    <i className='pi pi-trash' style={{ fontSize: '1rem' }}></i>
                  </Button>
                </article>
              </div>
            ))
          ) : (
            <p>No tiene imagen(es) de perfil</p>
          )}
        </div>
      </Dialog>
    </>
  )
}

export default withCookies(UploadProfileImage)
