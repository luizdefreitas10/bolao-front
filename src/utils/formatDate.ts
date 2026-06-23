import { format } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import { ptBR } from 'date-fns/locale'

export function formatDateToCustomString(date: Date): string {
  const dateInTimeZone = formatInTimeZone(
    date,
    'America/Sao_Paulo',
    "yyyy-MM-dd'T'HH:mm:ssXXX",
  )

  let formattedDate = format(new Date(dateInTimeZone), "MMMM, HH'h'mm", {
    locale: ptBR,
  })

  formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

  return formattedDate
}

export function formatMatchDateTime(date: Date | string): string {
  const parsed = typeof date === 'string' ? new Date(date) : date

  const datePart = formatInTimeZone(parsed, 'America/Sao_Paulo', 'dd/MM/yyyy', {
    locale: ptBR,
  })

  const timePart = formatInTimeZone(parsed, 'America/Sao_Paulo', 'HH:mm', {
    locale: ptBR,
  })

  return `${datePart} · ${timePart}`
}

export function formatDateToCustomFullString(date: string) {
  const dateInTimeZone = formatInTimeZone(
    new Date(date),
    'America/Sao_Paulo',
    "yyyy-MM-dd'T'HH:mm:ssXXX",
  )

  return dateInTimeZone
}
