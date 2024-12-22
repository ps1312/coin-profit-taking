import { FormatOptions } from "./types"

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
    // Remove all non-digit characters except decimal point
    let number = val.replace(/[^\d.]/g, "")
  
    // Ensure only one decimal point
    const parts = number.split(".")
    if (parts.length > 2) {
      number = parts[0] + "." + parts.slice(1).join("")
    }
  
    // Add commas for thousands
    const integerPart = parts[0]
    const decimalPart = parts[1] || ""
  
    if (integerPart) {
      const formatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      return decimalPart ? `${formatted}.${decimalPart}` : formatted
    }
  
    return number
  }