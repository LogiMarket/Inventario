import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractDateOnly(value: string): string | null {
  if (!value) return null
  const match = value.match(/^(\d{4}-\d{2}-\d{2})/)
  return match ? match[1] : null
}

export function formatDateOnlyEs(value: string): string {
  const dateOnly = extractDateOnly(value)
  if (!dateOnly) return "-"

  const [year, month, day] = dateOnly.split("-").map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))

  return new Intl.DateTimeFormat("es-ES", { timeZone: "UTC" }).format(date)
}

export function isDateOnOrAfterToday(value: string): boolean {
  const dateOnly = extractDateOnly(value)
  if (!dateOnly) return false

  const today = new Date()
  const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

  return dateOnly >= localToday
}
