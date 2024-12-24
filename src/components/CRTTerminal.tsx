import { useEffect, useState } from "react"

export const CRTTerminal = ({ children, color = "#39ff14" }: any) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div
      style={{
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: "1.1rem",
        color: color,
        textShadow: `0 0 5px ${color}, 0 0 10px ${color}`,
      }}
    >
      {children}
    </div>
  )
}
