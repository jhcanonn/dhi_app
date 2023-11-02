import { Toast } from 'primereact/toast'
import { ComponentType, ReactNode, useRef } from 'react'

type ToastProps = {
  showSuccess?: (summary: ReactNode, detail: ReactNode) => void
  showError?: (summary: ReactNode, detail: ReactNode) => void
  showWarning?: (summary: ReactNode, detail: ReactNode) => void
  showInfo?: (summary: ReactNode, detail: ReactNode) => void
}

const withToast = <T extends ToastProps>(
  WrappedComponent: ComponentType<T & ToastProps>,
) => {
  const ComponentWithToast = (props: Omit<T, keyof ToastProps>) => {
    const toast = useRef<Toast>(null)

    const showSuccess = (summary: ReactNode, detail: ReactNode) => {
      toast.current?.show({
        severity: 'success',
        summary,
        detail,
      })
    }

    const showError = (summary: ReactNode, detail: ReactNode) => {
      toast.current?.show({
        severity: 'error',
        summary,
        detail,
        sticky: true,
      })
    }

    const showWarning = (summary: ReactNode, detail: ReactNode) => {
      toast.current?.show({
        severity: 'warn',
        summary,
        detail,
      })
    }

    const showInfo = (summary: ReactNode, detail: ReactNode) => {
      toast.current?.show({
        severity: 'info',
        summary,
        detail,
      })
    }

    return (
      <>
        <Toast ref={toast} />
        <WrappedComponent
          {...(props as T)}
          showSuccess={showSuccess}
          showError={showError}
          showWarning={showWarning}
          showInfo={showInfo}
        />
      </>
    )
  }

  return ComponentWithToast
}

export default withToast
