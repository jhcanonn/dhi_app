import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { DirectusTag, TagType } from '@models'
import { GET_TAGS } from '@utils'

const useTags = (type: TagType) => {
  const [tags, setTags] = useState<DirectusTag[]>([])

  const { data: dataTags, loading: loadingTags } = useQuery(GET_TAGS, {
    variables: { type },
  })

  useEffect(() => {
    !loadingTags && setTags(dataTags?.tags || [])
  }, [dataTags])

  return { tags }
}

export default useTags
