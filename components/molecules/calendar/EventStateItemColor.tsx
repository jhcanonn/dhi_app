const EventStateItemColor = ({ color }: { color: string }) => (
  <div
    className='!w-[0.8rem] !h-[0.8rem] rounded-full mr-2'
    style={{
      border: `1px solid ${color}`,
      backgroundColor: color,
    }}
  />
)

export default EventStateItemColor
