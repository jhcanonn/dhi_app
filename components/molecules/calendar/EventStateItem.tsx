import { EventState } from '@models'
import EventStateItemColor from './EventStateItemColor'

const EventStateItem = (option: EventState) => {
  return (
    <div className='flex items-center'>
      <EventStateItemColor color={option.color} />
      <div>{option.name}</div>
    </div>
  )
}

export default EventStateItem
