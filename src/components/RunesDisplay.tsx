import { catsInTheSats, theDonaldTrump } from "../runes"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"

// First, let's define the structure of a single entry from the runes data
type RuneDataEntry = {
  rune: string
  amount: number
  price: string | number
  total: number
}

// Then define the structure of the runes data object
type RunesData = {
  [key: string]: RuneDataEntry[]
}

// Define the structure of our transformed entry that includes the block
type RuneEntry = RuneDataEntry & {
  block: string
}

export const RunesDisplay = () => {
  const transformData = (data: RunesData) => {
    return Object.entries(data).flatMap(([block, entries]) =>
      entries.map((entry: RuneDataEntry) => ({
        ...entry,
        block,
      }))
    )
  }

  const catsEntries = transformData(catsInTheSats as RunesData)
  const trumpEntries = transformData(theDonaldTrump as RunesData)

  const groupByBlock = (entries: RuneEntry[]) => {
    return entries.reduce<Record<string, RuneEntry[]>>((acc, entry) => {
      const block = entry.block
      if (!acc[block]) {
        acc[block] = []
      }
      acc[block].push(entry)
      return acc
    }, {})
  }

  const groupedCatsEntries = groupByBlock(catsEntries)
  const groupedTrumpEntries = groupByBlock(trumpEntries)

  const calculateTotal = (entries: RuneEntry[]) => {
    return entries.reduce((sum, entry) => sum + entry.total, 0)
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 py-12">
      <div className="max-w-6xl mx-auto p-6 space-y-12">
        {/* CATS IN THE SATS Table */}
        <div className="backdrop-blur-sm bg-black/30 rounded-xl p-6 shadow-xl border border-gray-800">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            CATS•IN•THE•SATS
          </h2>
          <div className="rounded-lg border border-gray-800 divide-y divide-gray-800">
            {Object.entries(groupedCatsEntries).map(([block, entries]) => (
              <details key={block} className="group">
                <summary className="cursor-pointer p-4 font-medium flex items-center justify-between hover:bg-gray-800/30 transition-colors">
                  <span>
                    Account {block}{" "}
                    <span className="text-gray-400 text-sm ml-2">
                      ({entries.length} transactions) •{" "}
                      <span className="text-orange-500">
                        {formatNumber(calculateTotal(entries))}
                      </span>
                    </span>
                  </span>
                  <svg
                    className="w-5 h-5 transform transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="p-4 bg-black/20">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-gray-800/30">
                        <TableHead className="text-gray-300 font-medium">
                          Amount
                        </TableHead>
                        <TableHead className="text-gray-300 font-medium text-right">
                          Price
                        </TableHead>
                        <TableHead className="text-gray-300 font-medium text-right">
                          Total
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entries.map((rune, index) => (
                        <TableRow
                          key={index}
                          className="hover:bg-gray-800/30 transition-colors"
                        >
                          <TableCell className="font-mono">
                            {rune.amount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {rune.price}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {rune.total.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </details>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center text-sm">
            <span className="text-gray-400">Total Value</span>
            <span className="text-xl font-bold text-orange-500">
              {formatNumber(
                Object.values(groupedCatsEntries).reduce(
                  (sum, entries) => sum + calculateTotal(entries),
                  0
                )
              )}
            </span>
          </div>
        </div>

        {/* THE DONALD TRUMP Table */}
        <div className="backdrop-blur-sm bg-black/30 rounded-xl p-6 shadow-xl border border-gray-800">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            THE•DONALD•TRUMP
          </h2>
          <div className="rounded-lg border border-gray-800 divide-y divide-gray-800">
            {Object.entries(groupedTrumpEntries).map(([block, entries]) => (
              <details key={block} className="group">
                <summary className="cursor-pointer p-4 font-medium flex items-center justify-between hover:bg-gray-800/30 transition-colors">
                  <span>
                    Account {block}{" "}
                    <span className="text-gray-400 text-sm ml-2">
                      ({entries.length} transactions) •{" "}
                      <span className="text-blue-500">
                        {formatNumber(calculateTotal(entries))}
                      </span>
                    </span>
                  </span>
                  <svg
                    className="w-5 h-5 transform transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="p-4 bg-black/20">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-gray-800/30">
                        <TableHead className="text-gray-300 font-medium">
                          Amount
                        </TableHead>
                        <TableHead className="text-gray-300 font-medium text-right">
                          Price
                        </TableHead>
                        <TableHead className="text-gray-300 font-medium text-right">
                          Total
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entries.map((rune, index) => (
                        <TableRow
                          key={index}
                          className="hover:bg-gray-800/30 transition-colors"
                        >
                          <TableCell className="font-mono">
                            {rune.amount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {rune.price}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {rune.total.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </details>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center text-sm">
            <span className="text-gray-400">Total Value</span>
            <span className="text-xl font-bold text-blue-500">
              {formatNumber(
                Object.values(groupedTrumpEntries).reduce(
                  (sum, entries) => sum + calculateTotal(entries),
                  0
                )
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
