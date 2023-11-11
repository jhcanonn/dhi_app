import { useRouter } from 'next/navigation'
import nProgress from 'nprogress'

const useGoTo = () => {
  const router = useRouter()

  const goToPage = (pagePath: string) => {
    if (window.location.pathname !== pagePath) nProgress.start()
    return router.push(pagePath)
  }

  return { goToPage }
}

export default useGoTo
