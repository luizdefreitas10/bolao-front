'use client'

import React from 'react'
import { DatePicker } from '@nextui-org/react'
import { DateValue } from '@internationalized/date'
import { datePickerClassNames } from '@/app/components/form/formClassNames'

type DateTimePickerFieldProps = {
  label?: string
  value?: DateValue | null
  onChange: (value: DateValue | null) => void
  onBlur?: () => void
  name?: string
  isInvalid?: boolean
  errorMessage?: string
  isDisabled?: boolean
}

export default function DateTimePickerField({
  label = 'Data e Hora',
  value,
  onChange,
  onBlur,
  name,
  isInvalid,
  errorMessage,
  isDisabled,
}: DateTimePickerFieldProps) {
  return (
    <DatePicker
      name={name}
      label={label}
      value={value ?? null}
      onChange={onChange}
      onBlur={onBlur}
      hideTimeZone
      hourCycle={24}
      granularity="minute"
      showMonthAndYearPickers
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      isDisabled={isDisabled}
      description="Use o ícone do calendário para escolher data e hora"
      aria-label={label}
      classNames={datePickerClassNames}
    />
  )
}
