import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { directusSystemClient } from '@components/templates/Providers'
import { Commercial, CommercialDirectus } from '@models'
import { GET_COMMERCIALS, ROLES } from '@utils'
import { UUID } from 'crypto'

const useGetCommercials = () => {
  const [commercials, setCommercials] = useState<Commercial[]>([])

  const { data: dataCommercials, loading: loadingCommercials } = useQuery(
    GET_COMMERCIALS,
    {
      client: directusSystemClient,
      variables: {
        roleName: ROLES.dhi_comercial,
      },
    },
  )

  useEffect(() => {
    if (!loadingCommercials) {
      const commercials: CommercialDirectus[] = dataCommercials?.users ?? []
      setCommercials(
        commercials.map((comm) => ({
          name: `${comm.first_name} ${comm.last_name}`.trim(),
          value: comm.id as UUID,
        })),
      )
    }
  }, [dataCommercials])

  return { commercials, setCommercials }
}

export default useGetCommercials
