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

export function formatDateToCustomFullString(date: string) {
  const dateInTimeZone = formatInTimeZone(
    new Date(date),
    'America/Sao_Paulo',
    "yyyy-MM-dd'T'HH:mm:ssXXX",
  )

  return dateInTimeZone
}
