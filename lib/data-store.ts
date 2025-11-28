export interface Republica {
  id: string
  name: string
  address: string
  rooms: number
  ownerId: string
  createdAt: string
}

export interface Occupant {
  id: string
  republicaId: string
  name: string
  email: string
  monthlyIncome: number
  active: boolean
  joinedAt: string
}

export interface Category {
  id: string
  republicaId: string
  name: string
  type: "parent" | "child"
  parentId?: string
}

export interface Expense {
  id: string
  republicaId: string
  description: string
  amount: number
  date: string
  categoryId: string
  subcategoryId?: string
  createdAt: string
}

export interface Report {
  id: string
  republicaId: string
  title: string
  startDate: string
  endDate: string
  divisionMethod: "equal" | "proportional"
  totalExpenses: number
  createdAt: string
  status: "draft" | "finalized"
}

export interface ReportLine {
  reportId: string
  occupantId: string
  amountToPay: number
}

// Repúblicas
export const getRepublicas = (ownerId: string): Republica[] => {
  const data = localStorage.getItem("republicar_republicas")
  const republicas = data ? JSON.parse(data) : []
  return republicas.filter((r: Republica) => r.ownerId === ownerId)
}

export const addRepublica = (republica: Republica) => {
  const data = localStorage.getItem("republicar_republicas")
  const republicas = data ? JSON.parse(data) : []
  republicas.push(republica)
  localStorage.setItem("republicar_republicas", JSON.stringify(republicas))
}

export const updateRepublica = (republica: Republica) => {
  const data = localStorage.getItem("republicar_republicas")
  const republicas = data ? JSON.parse(data) : []
  const index = republicas.findIndex((r: Republica) => r.id === republica.id)
  if (index !== -1) {
    republicas[index] = republica
    localStorage.setItem("republicar_republicas", JSON.stringify(republicas))
  }
}

export const getRepublicaByOwnerId = (ownerId: string): Republica | null => {
  const data = localStorage.getItem("republicar_republicas")
  const republicas = data ? JSON.parse(data) : []
  const republica = republicas.find((r: Republica) => r.ownerId === ownerId)
  return republica || null
}

// Ocupantes
export const getOccupants = (republicaId: string): Occupant[] => {
  const data = localStorage.getItem("republicar_occupants")
  const occupants = data ? JSON.parse(data) : []
  return occupants;
}

export const addOccupant = (occupant: Occupant) => {
  const data = localStorage.getItem("republicar_occupants")
  const occupants = data ? JSON.parse(data) : []
  occupants.push(occupant)
  localStorage.setItem("republicar_occupants", JSON.stringify(occupants))
}

export const updateOccupant = (occupant: Occupant) => {
  const data = localStorage.getItem("republicar_occupants")
  const occupants = data ? JSON.parse(data) : []
  const index = occupants.findIndex((o: Occupant) => o.id === occupant.id)
  if (index !== -1) {
    occupants[index] = occupant
    localStorage.setItem("republicar_occupants", JSON.stringify(occupants))
  }
}

export const removeOccupant = (occupantId: string) => {
  const data = localStorage.getItem("republicar_occupants")
  const occupants = data ? JSON.parse(data) : []
  const index = occupants.findIndex((o: Occupant) => o.id === occupantId)
  if (index !== -1) {
    occupants[index].active = false
    localStorage.setItem("republicar_occupants", JSON.stringify(occupants))
  }
}

// Despesas
export const getExpenses = (republicaId: string, startDate?: string, endDate?: string): Expense[] => {
  const data = localStorage.getItem("republicar_expenses")
  let expenses = data ? JSON.parse(data) : []
  expenses = expenses.filter((e: Expense) => e.republicaId === republicaId)

  if (startDate && endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    expenses = expenses.filter((e: Expense) => {
      const expenseDate = new Date(e.date)
      return expenseDate >= start && expenseDate <= end
    })
  }

  return expenses
}

export const addExpense = (expense: Expense) => {
  const data = localStorage.getItem("republicar_expenses")
  const expenses = data ? JSON.parse(data) : []
  expenses.push(expense)
  localStorage.setItem("republicar_expenses", JSON.stringify(expenses))
}

export const updateExpense = (expense: Expense) => {
  const data = localStorage.getItem("republicar_expenses")
  const expenses = data ? JSON.parse(data) : []
  const index = expenses.findIndex((e: Expense) => e.id === expense.id)
  if (index !== -1) {
    expenses[index] = expense
    localStorage.setItem("republicar_expenses", JSON.stringify(expenses))
  }
}

export const deleteExpense = (expenseId: string) => {
  const data = localStorage.getItem("republicar_expenses")
  const expenses = data ? JSON.parse(data) : []
  const filtered = expenses.filter((e: Expense) => e.id !== expenseId)
  localStorage.setItem("republicar_expenses", JSON.stringify(filtered))
}

// Categorias
export const getCategories = (republicaId: string): Category[] => {
  const data = localStorage.getItem("republicar_categories")
  return data ? JSON.parse(data).filter((c: Category) => c.republicaId === republicaId) : []
}

export const addCategory = (category: Category) => {
  const data = localStorage.getItem("republicar_categories")
  const categories = data ? JSON.parse(data) : []
  categories.push(category)
  localStorage.setItem("republicar_categories", JSON.stringify(categories))
}

// Relatórios
export const getReports = (republicaId: string): Report[] => {
  const data = localStorage.getItem("republicar_reports")
  return data ? JSON.parse(data).filter((r: Report) => r.republicaId === republicaId) : []
}

export const addReport = (report: Report) => {
  const data = localStorage.getItem("republicar_reports")
  const reports = data ? JSON.parse(data) : []
  reports.push(report)
  localStorage.setItem("republicar_reports", JSON.stringify(reports))
}

export const getReportLines = (reportId: string): ReportLine[] => {
  const data = localStorage.getItem("republicar_report_lines")
  return data ? JSON.parse(data).filter((rl: ReportLine) => rl.reportId === reportId) : []
}

export const addReportLine = (reportLine: ReportLine) => {
  const data = localStorage.getItem("republicar_report_lines")
  const reportLines = data ? JSON.parse(data) : []
  reportLines.push(reportLine)
  localStorage.setItem("republicar_report_lines", JSON.stringify(reportLines))
}

export const linkOccupantToRepublica = (occupantEmail: string, republicaId: string, occupantId: string) => {
  // Update the user's republicaId in localStorage
  const usersData = localStorage.getItem("republicar_users")
  const users = usersData ? JSON.parse(usersData) : []
  const userIndex = users.findIndex((u: any) => u.email === occupantEmail)
  if (userIndex !== -1) {
    users[userIndex].republicaId = republicaId
    localStorage.setItem("republicar_users", JSON.stringify(users))
  }

  // Update current user if logged in
  const currentUser = localStorage.getItem("republicar_user")
  if (currentUser) {
    const user = JSON.parse(currentUser)
    if (user.email === occupantEmail) {
      user.republicaId = republicaId
      localStorage.setItem("republicar_user", JSON.stringify(user))
    }
  }
}
