export type FormatOptions = {
  decimals?: number
  currency?: boolean
}

export const formatLargeNumber = (
  num: number,
  options: FormatOptions = {}
): string => {
  const { decimals = 1, currency = false } = options
  const prefix = currency ? "$" : ""
  const absNum = Math.abs(num)
  const sign = num < 0 ? "-" : ""

  if (absNum >= 1_000_000_000) {
    const value = (absNum / 1_000_000_000).toFixed(decimals)
    return `${sign}${prefix}${value}B`
  }

  if (absNum >= 1_000_000) {
    const value = (absNum / 1_000_000).toFixed(decimals)
    return `${sign}${prefix}${value}M`
  }

  return `${sign}${prefix}${absNum.toLocaleString()}`
}

export const formatStringToValue = (val: string) => {
  let number = val.replace(/[^\d.]/g, "")

  if (number.startsWith(".")) {
    number = "0" + number
  }

  const parts = number.split(".")

  if (parts.length > 2) {
    number = parts[0] + "." + parts.slice(1).join("")
  }

  const integerPart = parts[0]
  const decimalPart = parts[1] || ""

  if (!integerPart && !decimalPart) {
    return ""
  }

  if (integerPart) {
    const formatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return decimalPart || val.endsWith(".")
      ? `${formatted}.${decimalPart}`
      : formatted
  }

  return number
}

export const convertToFloat = (formattedValue: string): number => {
  if (!formattedValue) return 0
  const withoutCurrency = formattedValue.replace("$", "")
  return parseFloat(withoutCurrency.replace(/,/g, ""))
}

export const getCurrencyMultiplier = (showInReais: boolean) =>
  showInReais ? 6.1 : 1
export const getCurrencySymbol = (showInReais: boolean) =>
  showInReais ? "R$" : "$"

export const formatCurrency = (value: number, showInReais: boolean) => {
  const multiplier = getCurrencyMultiplier(showInReais)
  return (value * multiplier).toLocaleString(showInReais ? "pt-BR" : "en-US", {
    style: "currency",
    currency: showInReais ? "BRL" : "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}
