'use client'

import { DhiResource, ResourceMode } from '@models'
import { useCalendarContext } from '@contexts'
import { Avatar } from 'primereact/avatar'

const CalendarHeader = ({ avatar, name, color }: DhiResource) => {
  const { resourceMode } = useCalendarContext()
  const isDefault = resourceMode === ResourceMode.DEFAULT

  return (
    <div
      style={{
        border: isDefault ? '1px solid lightgray' : '',
        padding: isDefault ? '0.75rem 1rem' : '0 0.5rem',
      }}
      className='calendar-custom-header flex gap-3 h-12 bg-[var(--surface-card)]'
    >
      <div>
        <Avatar
          image={avatar}
          label={name.slice(0, 1)}
          className='!rounded-full'
          size='large'
          shape='circle'
          style={{ backgroundColor: color ?? '#007bff', color: '#ffffff' }}
        />
      </div>
      <section className='flex flex-col items-start grow justify-center'>
        <h2 className='font-bold overflow-x-auto text-left'>{name}</h2>
      </section>
    </div>
  )
}

export default CalendarHeader
