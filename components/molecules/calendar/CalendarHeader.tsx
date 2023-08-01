import { DhiResource, ResourceMode } from '@models'
import { useCalendarContext } from '@contexts'
import { Avatar } from 'primereact/avatar'

const CalendarHeader = ({ avatar, name, mobile, color }: DhiResource) => {
  const { resourceMode } = useCalendarContext()
  const isDefault = resourceMode === ResourceMode.DEFAULT

  return (
    <div
      style={{
        border: isDefault ? '1px solid lightgray' : '',
        padding: isDefault ? '1rem' : '0.5rem',
      }}
      className='calendar-custom-header flex gap-3 min-w-[300px] bg-[var(--surface-card)]'
    >
      <Avatar
        image={avatar}
        label={name.slice(0, 1)}
        className='mr-2 !rounded-full'
        size='large'
        shape='circle'
        style={{ backgroundColor: color ?? '#007bff', color: '#ffffff' }}
      />
      <section className='flex flex-col items-start justify-center'>
        <h2 className='font-bold'>{name}</h2>
        <h3>{mobile}</h3>
      </section>
    </div>
  )
}

export default CalendarHeader
