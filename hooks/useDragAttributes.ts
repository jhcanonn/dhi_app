import { DragEvent } from 'react'
import { ProcessedEvent } from 'react-scheduler-lib/types'
import { colors } from '@utils'
import { useTheme } from '@mui/material'

export const useDragAttributes = (event: ProcessedEvent, isDragable?: boolean) => {
  const theme = useTheme()

  return {
    draggable: isDragable ?? true,
    onDragStart: (e: DragEvent<HTMLElement>) => {
      e.stopPropagation()
      e.dataTransfer.setData('text/plain', `${event.event_id}`)
      e.currentTarget.style.backgroundColor = theme.palette.error.main
    },
    onDragEnd: (e: DragEvent<HTMLElement>) => {
      e.currentTarget.style.backgroundColor = colors.bgEventDefault
    },
    onDragOver: (e: DragEvent<HTMLElement>) => {
      e.stopPropagation()
      e.preventDefault()
    },
    onDragEnter: (e: DragEvent<HTMLElement>) => {
      e.stopPropagation()
      e.preventDefault()
    },
  }
}
