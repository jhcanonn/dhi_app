'use client'

import { Message } from 'primereact/message'
import { ProgressSpinner } from 'primereact/progressspinner'

const UpdatingFilesProgress = ({ message }: { message: string }) => (
  <section className='flex gap-2 justify-center'>
    <Message
      text={message}
      className='[&_.p-inline-message-text]:text-xs py-0'
    />
    <div className='flex items-center'>
      <ProgressSpinner
        style={{ width: '25px', height: '25px' }}
        strokeWidth='8'
        fill='var(--surface-ground)'
        animationDuration='.5s'
      />
    </div>
  </section>
)

export default UpdatingFilesProgress
