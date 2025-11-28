"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import {
  getRepublicas,
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getCategories,
  addCategory,
  type Expense,
  type Category,
  type Republica,
} from "@/lib/data-store"
import { Plus, Trash2, Edit2, Filter } from "lucide-react"

export default function DespesasPage() {
  const { user } = useAuth()
  const [republicas, setRepublicas] = useState<Republica[]>([])
  const [selectedRepublica, setSelectedRepublica] = useState<string>("")
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" })
  const [formData, setFormData] = useState({ description: "", amount: "", date: "", categoryId: "" })
  const [categoryName, setCategoryName] = useState("")

  useEffect(() => {
    if (user?.id) {
      const reps = getRepublicas(user.id)
      setRepublicas(reps)
      if (reps.length > 0) {
        setSelectedRepublica(reps[0].id)
      }
    }
  }, [user])

  useEffect(() => {
    if (selectedRepublica) {
      setExpenses(getExpenses(selectedRepublica))
      const cats = getCategories(selectedRepublica)
      if (cats.length === 0) {
        // Add default categories
        const defaultCategories = ["Contas Fixas", "Alimentação", "Limpeza", "Lazer", "Manutenção"]
        defaultCategories.forEach((cat) => {
          const newCat: Category = {
            id: Date.now().toString() + Math.random(),
            republicaId: selectedRepublica,
            name: cat,
            type: "parent",
          }
          addCategory(newCat)
        })
        setCategories(getCategories(selectedRepublica))
      } else {
        setCategories(cats)
      }
    }
  }, [selectedRepublica])

  const handleAddExpense = () => {
    if (formData.description && formData.amount && formData.date && formData.categoryId) {
      if (editingId) {
        const updated = expenses.find((e) => e.id === editingId)!
        updated.description = formData.description
        updated.amount = Number.parseFloat(formData.amount)
        updated.date = formData.date
        updated.categoryId = formData.categoryId
        updateExpense(updated)
        setExpenses([...expenses])
        setEditingId(null)
      } else {
        const newExpense: Expense = {
          id: Date.now().toString(),
          republicaId: selectedRepublica,
          description: formData.description,
          amount: Number.parseFloat(formData.amount),
          date: formData.date,
          categoryId: formData.categoryId,
          createdAt: new Date().toISOString(),
        }
        addExpense(newExpense)
        setExpenses([...expenses, newExpense])
      }
      setFormData({ description: "", amount: "", date: "", categoryId: "" })
      setShowDialog(false)
    }
  }

  const handleAddCategory = () => {
    if (categoryName && selectedRepublica) {
      const newCategory: Category = {
        id: Date.now().toString(),
        republicaId: selectedRepublica,
        name: categoryName,
        type: "parent",
      }
      addCategory(newCategory)
      setCategories([...categories, newCategory])
      setCategoryName("")
      setShowCategoryDialog(false)
    }
  }

  const handleDelete = (expenseId: string) => {
    deleteExpense(expenseId)
    setExpenses(expenses.filter((e) => e.id !== expenseId))
  }

  const handleEdit = (expense: Expense) => {
    setEditingId(expense.id)
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      date: expense.date,
      categoryId: expense.categoryId,
    })
    setShowDialog(true)
  }

  const filteredExpenses = expenses.filter((e) => {
    if (!dateFilter.start || !dateFilter.end) return true
    const expenseDate = new Date(e.date)
    return expenseDate >= new Date(dateFilter.start) && expenseDate <= new Date(dateFilter.end)
  })

  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Despesas</h1>
          <p className="text-muted-foreground mt-1">Registre e gerencie as despesas da república</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => setShowCategoryDialog(true)}>
            Gerenciar Categorias
          </Button>
          <Button
            onClick={() => {
              setEditingId(null)
              setFormData({ description: "", amount: "", date: "", categoryId: "" })
              setShowDialog(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Despesa
          </Button>
        </div>
      </div>

      {/* Filtros e Seletor de República */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">República</label>
              <select
                value={selectedRepublica}
                onChange={(e) => setSelectedRepublica(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm mt-1"
              >
                {republicas.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Data Início</label>
              <Input
                type="date"
                value={dateFilter.start}
                onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Data Fim</label>
              <Input
                type="date"
                value={dateFilter.end}
                onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => setDateFilter({ start: "", end: "" })}
              >
                <Filter className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo */}
      <Card className="mb-6 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total de Despesas</p>
              <p className="text-3xl font-bold">R$ {totalAmount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Quantidade</p>
              <p className="text-3xl font-bold">{filteredExpenses.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Despesas */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Despesas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium">Descrição</th>
                    <th className="px-6 py-3 text-left font-medium">Categoria</th>
                    <th className="px-6 py-3 text-left font-medium">Data</th>
                    <th className="px-6 py-3 text-right font-medium">Valor</th>
                    <th className="px-6 py-3 text-right font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredExpenses.map((expense) => {
                    const category = categories.find((c) => c.id === expense.categoryId)
                    return (
                      <tr key={expense.id} className="hover:bg-muted/50">
                        <td className="px-6 py-4">{expense.description}</td>
                        <td className="px-6 py-4">{category?.name || "Sem categoria"}</td>
                        <td className="px-6 py-4">{new Date(expense.date).toLocaleDateString("pt-BR")}</td>
                        <td className="px-6 py-4 text-right">R$ {expense.amount.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(expense)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(expense.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog para Nova Despesa */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Despesa" : "Registrar Nova Despesa"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Atualize as informações da despesa" : "Adicione uma nova despesa à república"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Descrição</label>
              <Input
                placeholder="Ex: Conta de Água"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Categoria</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Valor (R$)</label>
              <Input
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Data</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowDialog(false)}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={handleAddExpense}>
                {editingId ? "Atualizar" : "Registrar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para Gerenciar Categorias */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerenciar Categorias</DialogTitle>
            <DialogDescription>Adicione novas categorias de despesas</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {categories.map((cat) => (
                <div key={cat.id} className="p-3 border border-border rounded-md flex justify-between items-center">
                  <span className="font-medium">{cat.name}</span>
                </div>
              ))}
            </div>
            <div>
              <label className="text-sm font-medium">Nova Categoria</label>
              <Input
                placeholder="Ex: Contas de Internet"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowCategoryDialog(false)}>
                Fechar
              </Button>
              <Button className="flex-1" onClick={handleAddCategory}>
                Adicionar Categoria
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
