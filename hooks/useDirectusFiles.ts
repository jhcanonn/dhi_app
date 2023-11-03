import {
  DHI_SESSION,
  deleteFileToDirectus,
  refreshToken,
  uploadFileToDirectus,
} from '@utils'
import { UUID } from 'crypto'
import { Cookies, useCookies } from 'react-cookie'

const useDirectusFiles = () => {
  const [cookies] = useCookies([DHI_SESSION])

  const getToken = async () => await refreshToken(new Cookies(cookies))

  const uploadFile = async (file: File, folderId: UUID) => {
    const formData = new FormData()
    formData.append('folder', folderId)
    formData.append('file', file)
    return await uploadFileToDirectus(formData, await getToken())
  }

  const deleteFile = async (fileId: string) =>
    await deleteFileToDirectus(fileId, await getToken())

  return {
    uploadFile,
    deleteFile,
  }
}

export default useDirectusFiles
