'use client'

import {
  BudgetState,
  BudgetStateDirectus,
  DropdownOption,
  PayedState,
} from '@models'
import { classNames as cx } from 'primereact/utils'

type Props = {
  state: DropdownOption | undefined
}

const BudgetStateTag = ({ state }: Props) => {
  const stateInfo: BudgetStateDirectus = state ? JSON.parse(state.value) : ''
  const arrWhites = [
    BudgetState.NO_ACEPTADO,
    BudgetState.DECLINADO,
    PayedState.NO_PAGADO,
  ]

  return (
    <div
      className={cx(
        'px-2 py-1 rounded-lg font-semibold opacity-90 text-center',
        {
          'text-white': arrWhites.includes(stateInfo?.codigo as BudgetState),
        },
      )}
      style={{
        border: `1px solid ${stateInfo.color}`,
        backgroundColor: stateInfo.color,
      }}
    >
      <span className='opacity-100'>{state?.name}</span>
    </div>
  )
}

export default BudgetStateTag
