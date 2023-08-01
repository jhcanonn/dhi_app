import { DragEvent } from 'react'
import { ProcessedEvent } from '@aldabil/react-scheduler/types'
import { bgEventColor } from '@utils'
import { useTheme } from '@mui/material'

export const useDragAttributes = (event: ProcessedEvent) => {
  const theme = useTheme()

  return {
    draggable: true,
    onDragStart: (e: DragEvent<HTMLElement>) => {
      e.stopPropagation()
      e.dataTransfer.setData('text/plain', `${event.event_id}`)
      e.currentTarget.style.backgroundColor = theme.palette.error.main
    },
    onDragEnd: (e: DragEvent<HTMLElement>) => {
      e.currentTarget.style.backgroundColor = bgEventColor
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
