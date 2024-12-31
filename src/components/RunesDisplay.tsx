import { catsInTheSats, theDonaldTrump } from "../runes"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type RuneEntry = {
  rune: string
  amount: number
  price: string | number
  total: number
  block: string
}

export const RunesDisplay = () => {
  // Transform the data into a flat array of entries with block numbers
  const transformData = (
    data: typeof catsInTheSats | typeof theDonaldTrump
  ) => {
    return Object.entries(data).flatMap(([block, entries]) =>
      entries.map((entry) => ({
        ...entry,
        block,
      }))
    )
  }

  const catsEntries = transformData(catsInTheSats)
  const trumpEntries = transformData(theDonaldTrump)
  const allRunes = [...catsEntries, ...trumpEntries]

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Runes Data</h2>

      <div className="rounded-md border border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-gray-800/70">
              <TableHead className="text-gray-200">Block</TableHead>
              <TableHead className="text-gray-200">Rune</TableHead>
              <TableHead className="text-gray-200 text-right">Amount</TableHead>
              <TableHead className="text-gray-200 text-right">Price</TableHead>
              <TableHead className="text-gray-200 text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allRunes.map((rune, index) => (
              <TableRow
                key={`${rune.block}-${index}`}
                className="hover:bg-gray-800/70"
              >
                <TableCell className="font-medium">{rune.block}</TableCell>
                <TableCell>{rune.rune}</TableCell>
                <TableCell className="text-right">
                  {rune.amount.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">{rune.price}</TableCell>
                <TableCell className="text-right">
                  {rune.total.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
