import { useLazyQuery } from '@apollo/client'
import { useClientContext } from '@contexts'
import { ClientDirectus } from '@models'
import { GET_CLIENT_BY_ID } from '@utils'

const useClientInfo = () => {
  const { clientInfo, setClientInfo } = useClientContext()
  const [refetchClientInfo] = useLazyQuery(GET_CLIENT_BY_ID)

  const refreshClientInfo = async () => {
    const data: any = await refetchClientInfo({
      variables: { id: clientInfo?.id },
    })
    setClientInfo(data.pacientes_by_id as ClientDirectus)
  }

  return { refreshClientInfo }
}

export default useClientInfo
