"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { getRepublicas, getOccupants, getExpenses, type Republica, type Occupant, type Expense } from "@/lib/data-store"

export function DashboardOverview() {
  const { user } = useAuth()
  const [republica, setRepublica] = useState<Republica | null>(null)
  const [occupants, setOccupants] = useState<Occupant[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])

  useEffect(() => {
    if (user?.role === "owner") {
      const republicas = getRepublicas(user.id)
      if (republicas.length > 0) {
        setRepublica(republicas[0])
        setOccupants(getOccupants(republicas[0].id))
        setExpenses(getExpenses(republicas[0].id))
      }
    }
  }, [user])

  const currentMonth = new Date()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

  const monthExpenses = expenses.filter((e) => {
    const expenseDate = new Date(e.date)
    return expenseDate >= firstDayOfMonth && expenseDate <= lastDayOfMonth
  })

  const totalExpenses = monthExpenses.reduce((sum, e) => sum + e.amount, 0)
  const avgPerPerson = occupants.length > 0 ? totalExpenses / occupants.length : 0

  // Group expenses by category for pie chart
  const categoryData = Array.from(
    monthExpenses.reduce((acc, e) => {
      acc.set(e.categoryId, (acc.get(e.categoryId) || 0) + e.amount)
      return acc
    }, new Map<string, number>()),
  ).map(([categoryId, amount]) => ({
    name: categoryId || "Sem categoria",
    value: Number.parseFloat(amount.toFixed(2)),
  }))

  const COLORS = ["#0f172a", "#1e293b", "#475569", "#64748b", "#94a3b8"]

  const monthlyData = [
    { month: "Jan", value: 0 },
    { month: "Fev", value: 0 },
    { month: "Mar", value: 0 },
    { month: "Abr", value: 0 },
    { month: "Mai", value: 0 },
    { month: "Jun", value: 0 },
  ]

  // Calculate monthly expenses for last 6 months
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)

  for (let i = 0; i < 6; i++) {
    const checkDate = new Date(sixMonthsAgo)
    checkDate.setMonth(sixMonthsAgo.getMonth() + i)
    const monthExpense = expenses
      .filter((e) => {
        const expenseDate = new Date(e.date)
        return expenseDate.getMonth() === checkDate.getMonth() && expenseDate.getFullYear() === checkDate.getFullYear()
      })
      .reduce((sum, e) => sum + e.amount, 0)
    monthlyData[i].value = Number.parseFloat(monthExpense.toFixed(2))
  }

  if (user?.role !== "owner") {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Bem-vindo, {user?.name}!</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Morador Ativo</p>
              <p className="text-xs text-muted-foreground mt-1">Acesso ao portal da república</p>
            </CardContent>
          </Card>
        </div>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Próximos Passos</CardTitle>
            <CardDescription>Veja seus relatórios na seção de Relatórios</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            {republica ? `Bem-vindo, ${republica.name}` : "Crie sua primeira república"}
          </p>
        </div>
      </div>

      {!republica ? (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="pt-12 text-center">
            <h2 className="text-xl font-semibold mb-2">Nenhuma república cadastrada</h2>
            <p className="text-muted-foreground mb-4">Crie sua primeira república para começar</p>
            <a href="/dashboard/republicas">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                Cadastrar República
              </button>
            </a>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total de Despesas (Mês)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">R$ {totalExpenses.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Média por Morador</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">R$ {avgPerPerson.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total de Moradores</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{occupants.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Quartos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{republica.rooms}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Despesas por Categoria</CardTitle>
                <CardDescription>Mês atual</CardDescription>
              </CardHeader>
              <CardContent>
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: R$${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `R$${value.toFixed(2)}`} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">Nenhuma despesa registrada neste mês</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Últimos 6 Meses</CardTitle>
                <CardDescription>Total de despesas por mês</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `R$${value.toFixed(2)}`} />
                    <Bar dataKey="value" fill="#0f172a" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
