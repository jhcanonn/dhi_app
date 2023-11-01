import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import NProgress from 'nprogress'

export const goToPage = (pagePath: string, router: AppRouterInstance) => {
  if (window.location.pathname !== pagePath) {
    NProgress.start()
  }
  return router.push(pagePath)
}
