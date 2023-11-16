'use client'

import {
  AutoCompleteChangeEvent,
  AutoCompleteCompleteEvent,
} from 'primereact/autocomplete'
import { AutoCompleteValid } from '@components/atoms'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

type Props = {
  name: string
  label: string
  list: any[]
  onChange: (item: any, selectedValue: string) => void
  handleForm: UseFormReturn<any, any, undefined>
  className?: string
  required?: boolean
  disabled?: boolean
}

const PanelFieldAutocomplete = ({
  name,
  label,
  list = [],
  onChange,
  handleForm,
  className,
  required,
  disabled,
}: Props) => {
  const [suggestions, setSuggestions] = useState<any[]>([])

  const keys = list.length ? Object.keys(list[0]) : []

  const getSelectedValue = (item: any) =>
    keys.map((key) => item[key]).join(' - ')

  const itemTemplate = (item: any) => (
    <p className='text-[0.8rem]'>{getSelectedValue(item)}</p>
  )

  const searcher = (event: AutoCompleteCompleteEvent) => {
    const suggestions = list.filter((l) =>
      keys.some((key) =>
        l[key].toLowerCase().includes(event.query.toLowerCase()),
      ),
    )
    setSuggestions(suggestions)
  }

  const handleCustomChange = (e: AutoCompleteChangeEvent) => {
    const item = e.value
    if (item && typeof item === 'object') {
      onChange(item, getSelectedValue(item))
      handleForm.resetField(name)
    }
  }

  return (
    <AutoCompleteValid
      key={name}
      name={name}
      label={label}
      handleForm={handleForm}
      required={required}
      disabled={disabled}
      field={keys.length ? keys[0] : ''}
      suggestions={suggestions}
      itemTemplate={itemTemplate}
      completeMethod={searcher}
      onCustomChange={handleCustomChange}
      className={className}
    />
  )
}

export default PanelFieldAutocomplete
