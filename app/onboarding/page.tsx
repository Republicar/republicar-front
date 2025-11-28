"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { addRepublica } from "@/lib/data-store"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    rooms: "",
  })

  // Redirect if no user or already has a república
  if (!user) {
    router.push("/login")
    return null
  }

  if (user.republicaId) {
    router.push("/dashboard")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!formData.name || !formData.address || !formData.rooms) {
        throw new Error("Todos os campos são obrigatórios")
      }

      const newRepublica = {
        id: Date.now().toString(),
        name: formData.name,
        address: formData.address,
        rooms: Number.parseInt(formData.rooms),
        ownerId: user.id,
        createdAt: new Date().toISOString(),
      }

      addRepublica(newRepublica)

      // Update user with républicaId
      const updatedUser = { ...user, republicaId: newRepublica.id }
      localStorage.setItem("republicar_user", JSON.stringify(updatedUser))

      // Initialize default categories for this república
      const defaultCategories = [
        { id: "1", name: "Aluguel", type: "parent" as const },
        { id: "2", name: "Água e Esgoto", type: "parent" as const },
        { id: "3", name: "Energia", type: "parent" as const },
        { id: "4", name: "Internet", type: "parent" as const },
        { id: "5", name: "Limpeza", type: "parent" as const },
        { id: "6", name: "Manutenção", type: "parent" as const },
        { id: "7", name: "Outros", type: "parent" as const },
      ]

      const categoriesData = localStorage.getItem("republicar_categories")
      const categories = categoriesData ? JSON.parse(categoriesData) : []
      const newCategories = defaultCategories.map((cat) => ({
        ...cat,
        id: `${newRepublica.id}-${cat.id}`,
        republicaId: newRepublica.id,
      }))
      localStorage.setItem("republicar_categories", JSON.stringify([...categories, ...newCategories]))

      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar república")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary mb-2">Republicar</h1>
          </div>
          <CardTitle>Configure sua República</CardTitle>
          <CardDescription>Dados básicos para começar a gerenciar despesas</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nome da República
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Ex: República da Alegria"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">
                Endereço
              </label>
              <Input
                id="address"
                type="text"
                placeholder="Ex: Rua das Flores, 123"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="rooms" className="text-sm font-medium">
                Número de Quartos
              </label>
              <Input
                id="rooms"
                type="number"
                placeholder="Ex: 4"
                value={formData.rooms}
                onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Criando..." : "Criar República"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
