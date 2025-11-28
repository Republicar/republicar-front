export interface DivisionResult {
  occupantId: string
  occupantName: string
  monthlyIncome: number
  amountToPay: number
  percentage?: number
}

export function calculateEqualDivision(
  totalExpenses: number,
  occupants: Array<{ id: string; name: string; monthlyIncome: number }>,
): DivisionResult[] {
  const amountPerPerson = totalExpenses / occupants.length
  return occupants.map((occupant) => ({
    occupantId: occupant.id,
    occupantName: occupant.name,
    monthlyIncome: occupant.monthlyIncome,
    amountToPay: Number.parseFloat(amountPerPerson.toFixed(2)),
  }))
}

export function calculateProportionalDivision(
  totalExpenses: number,
  occupants: Array<{ id: string; name: string; monthlyIncome: number }>,
): DivisionResult[] {
  // RN07: Divisão Proporcional à Renda
  const totalIncome = occupants.reduce((sum, o) => sum + o.monthlyIncome, 0)

  // RN07: Check for division by zero
  if (totalIncome === 0) {
    throw new Error("Não é possível fazer divisão proporcional sem renda registrada. Mude para divisão igualitária.")
  }

  // Calculate proportions
  const results: DivisionResult[] = occupants.map((occupant) => {
    const factor = occupant.monthlyIncome / totalIncome
    const amountToPay = totalExpenses * factor
    return {
      occupantId: occupant.id,
      occupantName: occupant.name,
      monthlyIncome: occupant.monthlyIncome,
      amountToPay: Number.parseFloat(amountToPay.toFixed(2)),
      percentage: Number.parseFloat((factor * 100).toFixed(2)),
    }
  })

  // RN08: Handle rounding issues (centavos problem)
  const sumOfParts = results.reduce((sum, r) => sum + r.amountToPay, 0)
  const difference = totalExpenses - sumOfParts

  if (Math.abs(difference) > 0.01) {
    // Add the difference to the occupant with highest income
    const highestIncomeOccupant = results.reduce((prev, current) =>
      current.monthlyIncome > prev.monthlyIncome ? current : prev,
    )
    highestIncomeOccupant.amountToPay += difference
    highestIncomeOccupant.amountToPay = Number.parseFloat(highestIncomeOccupant.amountToPay.toFixed(2))
  }

  return results
}
