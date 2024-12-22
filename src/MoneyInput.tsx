import { useState } from "react"

export type ChangeHandler = (name: string, value: number) => void

export const formatValue = (val: string) => {
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

const MoneyInput = ({
  name,
  onChange,
}: {
  name: string
  onChange: ChangeHandler
}) => {
  const [displayValue, setDisplayValue] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9.]/g, "")
    const formattedValue = formatValue(rawValue)
    setDisplayValue(formattedValue)

    // Convert to number for onChange handler
    const numericValue = parseFloat(rawValue) || 0
    onChange(e.target.name, numericValue)
  }

  const handleBlur = () => {
    // Ensure two decimal places on blur
    if (displayValue) {
      const parts = displayValue.split(".")
      if (parts.length === 1) {
        setDisplayValue(displayValue + ".00")
      } else if (parts[1].length === 1) {
        setDisplayValue(displayValue + "0")
      }
    }
  }

  return (
    <div className="relative">
      <input
        name={name}
        type="text"
        className="mt-1 block w-full rounded-md border bg-gray-800 border-gray-300 p-2"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="0.0"
      />
    </div>
  )
}

export default MoneyInput
