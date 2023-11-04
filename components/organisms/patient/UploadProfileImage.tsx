'use client'

import { MAX_MB_GALLERY, PATIENT_GALLERY } from '@utils'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload'
import { ReactNode, useEffect, useState } from 'react'
import { classNames as cx } from 'primereact/utils'
import { ClientDirectus, ProfileAvatar } from '@models'
import { Image } from 'primereact/image'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { generateURLAssetsWithToken } from '@utils/url-access-token'
import { useDirectusFiles, usePatchPatient, withToast } from '@hooks'
import { UUID } from 'crypto'
import { UpdatingFilesProgress } from '@components/molecules'

type Props = {
  clientInfo: ClientDirectus | null
  buttonLabel?: string
  onUploadAvatars?: (avatars: ProfileAvatar[]) => void
  showSuccess: (summary: ReactNode, detail: ReactNode) => void
  showError: (summary: ReactNode, detail: ReactNode) => void
}

const UploadProfileImage = ({
  clientInfo,
  buttonLabel,
  onUploadAvatars,
  showSuccess,
  showError,
}: Props) => {
  const [uploadLoading, setUploadLoading] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)
  const [avatars, setAvatars] = useState<ProfileAvatar[]>(
    clientInfo ? clientInfo.avatar : [],
  )
  const { createAvatar, deleteAvatar } = usePatchPatient()
  const { uploadFile, deleteFile } = useDirectusFiles()

  const uploadFileToDirectus = async (file: File) => {
    try {
      const res = await uploadFile(file, PATIENT_GALLERY)
      if (res?.id) {
        const resAvatar = await createAvatar(res.id as UUID)
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
      await uploadFileToDirectus(file)
    })
    Promise.all(uploadFiles).then(() => {
      event.options.clear()
      setUploadLoading(false)
    })
  }

  const deleteImage = async (avatarId: number, fileId: string) => {
    setUploadLoading(true)
    const resDeleteAvatar = await deleteAvatar(avatarId)
    if (resDeleteAvatar) {
      await deleteFile(fileId)
      setAvatars((prevAvatars) => {
        const refreshedAvatars = prevAvatars.filter((a) => +a.id !== avatarId)
        onUploadAvatars && onUploadAvatars(refreshedAvatars)
        return refreshedAvatars
      })
    }
    setUploadLoading(false)
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
    <div className='flex flex-col md:flex-row gap-2 justify-end'>
      <Button
        label='Cerrar'
        severity='danger'
        onClick={() => setVisible(false)}
        className='w-full md:w-fit'
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
        className='w-full md:w-fit [&_.p-button]:w-full'
      />
    </div>
  )

  const headerContent = (
    <div className='flex gap-2'>
      <h2 className='mr-3'>Subir fotos de perfil</h2>
      {uploadLoading && (
        <UpdatingFilesProgress message='Actualizando imagen(es)...' />
      )}
    </div>
  )

  useEffect(() => {
    setAvatars(clientInfo ? clientInfo.avatar : [])
  }, [clientInfo])

  return (
    <>
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
          {avatars.length > 0 ? (
            avatars
              .filter((a) => a.directus_files_id)
              .map((a) => {
                const avatarFile = a.directus_files_id
                return (
                  <div key={avatarFile.id}>
                    <ConfirmDialog tagKey={avatarFile.id} />
                    <article className='flex flex-col gap-2 items-center'>
                      <Image
                        src={generateURLAssetsWithToken(avatarFile.id, {
                          quality: '15',
                          fit: 'cover',
                        })}
                        alt={avatarFile.title}
                        width='200'
                        preview
                        className='[&_img]:rounded-lg'
                      />
                      <Button
                        className='w-fit'
                        type='button'
                        severity='danger'
                        text
                        onClick={() => deleteImageHandler(a.id, avatarFile.id)}
                      >
                        <i
                          className='pi pi-trash'
                          style={{ fontSize: '1rem' }}
                        ></i>
                      </Button>
                    </article>
                  </div>
                )
              })
          ) : (
            <p>No tiene imagen(es) de perfil</p>
          )}
        </div>
      </Dialog>
    </>
  )
}

export default withToast(UploadProfileImage)
