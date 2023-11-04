import { useClientContext } from '@contexts'
import {
  DirectusTag,
  PatientAvatar,
  PatientFile,
  PatientGallery,
} from '@models'
import { DHI_SESSION, patchPatient, refreshToken } from '@utils'
import { Cookies, useCookies } from 'react-cookie'
import { UUID } from 'crypto'

const usePatchPatient = () => {
  const { clientInfo } = useClientContext()
  const [cookies] = useCookies([DHI_SESSION])
  const patientId = clientInfo?.id.toString()!

  const executePatch = async (payload: any) => {
    const access_token = await refreshToken(new Cookies(cookies))
    return await patchPatient(patientId, payload, access_token)
  }

  const createGalleryPhotos = (tags: DirectusTag[], fileIds: UUID[]) => {
    const payload: PatientGallery = {
      galeria: {
        create: [
          {
            galeria_id: {
              tags: {
                create: tags.map((tag) => ({
                  galeria_id: '+',
                  tags_id: {
                    id: tag.id,
                  },
                })),
                update: [],
                delete: [],
              },
              fotos: {
                create: fileIds.map((fileId) => ({
                  galeria_id: '+',
                  directus_files_id: {
                    id: fileId,
                  },
                })),
                update: [],
                delete: [],
              },
            },
          },
        ],
        update: [],
        delete: [],
      },
    }
    return executePatch(payload)
  }

  const updateGalleryPhotos = (
    galleryRelId: number,
    galleryId: number,
    imageId: number,
  ) => {
    const payload: PatientGallery = {
      galeria: {
        create: [],
        update: [
          {
            id: galleryRelId,
            galeria_id: {
              id: galleryId,
              fotos: {
                create: [],
                update: [],
                delete: [imageId],
              },
            },
          },
        ],
        delete: [],
      },
    }
    return executePatch(payload)
  }

  const deleteGalleryPhotos = (galleryRelId: number) => {
    const payload: PatientGallery = {
      galeria: {
        create: [],
        update: [],
        delete: [galleryRelId],
      },
    }
    return executePatch(payload)
  }

  const createAvatar = (fileId: UUID) => {
    const payload: PatientAvatar = {
      avatar: {
        create: [
          {
            pacientes_id: patientId,
            directus_files_id: {
              id: fileId,
            },
          },
        ],
        delete: [],
      },
    }
    return executePatch(payload)
  }

  const deleteAvatar = (avatarId: number) => {
    const payload: PatientAvatar = {
      avatar: {
        create: [],
        delete: [avatarId],
      },
    }
    return executePatch(payload)
  }

  const createFile = (tag: DirectusTag, fileId: UUID) => {
    const payload: PatientFile = {
      archivos: {
        create: [
          {
            pacientes_id: patientId,
            directus_files_id: {
              id: fileId,
            },
            tag: tag.id,
          },
        ],
        update: [],
        delete: [],
      },
    }
    return executePatch(payload)
  }

  const deleteFile = (id: number) => {
    const payload: PatientFile = {
      archivos: {
        create: [],
        update: [],
        delete: [id],
      },
    }
    return executePatch(payload)
  }

  return {
    createGalleryPhotos,
    updateGalleryPhotos,
    deleteGalleryPhotos,
    createAvatar,
    deleteAvatar,
    createFile,
    deleteFile,
  }
}

export default usePatchPatient
