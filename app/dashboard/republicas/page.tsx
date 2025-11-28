"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import { getRepublicas, addRepublica, type Republica } from "@/lib/data-store"
import { Plus, Users } from "lucide-react"
import Link from "next/link"

export default function RepublicasPage() {
  const { user } = useAuth()
  const [republicas, setRepublicas] = useState<Republica[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [formData, setFormData] = useState({ name: "", address: "", rooms: "" })

  useEffect(() => {
    if (user?.id) {
      setRepublicas(getRepublicas(user.id))
    }
  }, [user])

  const handleAddRepublica = () => {
    if (formData.name && formData.address && formData.rooms) {
      const newRepublica: Republica = {
        id: Date.now().toString(),
        name: formData.name,
        address: formData.address,
        rooms: Number.parseInt(formData.rooms),
        ownerId: user!.id,
        createdAt: new Date().toISOString(),
      }
      addRepublica(newRepublica)
      setRepublicas([...republicas, newRepublica])
      setFormData({ name: "", address: "", rooms: "" })
      setShowDialog(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Minhas Repúblicas</h1>
          <p className="text-muted-foreground mt-1">Gerenciar todas as suas repúblicas</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova República
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {republicas.map((republica) => (
          <Link key={republica.id} href={`/dashboard/republicas/${republica.id}`}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>{republica.name}</CardTitle>
                <CardDescription>{republica.address}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Quartos:</span> {republica.rooms}
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Users className="mr-2 h-4 w-4" />
                      Moradores
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar Nova República</DialogTitle>
            <DialogDescription>Adicione uma nova república para começar a gerenciar despesas</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Nome da República</label>
              <Input
                placeholder="Ex: República da Alegria"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Endereço</label>
              <Input
                placeholder="Ex: Rua das Flores, 123"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Número de Quartos</label>
              <Input
                type="number"
                placeholder="Ex: 4"
                value={formData.rooms}
                onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowDialog(false)}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={handleAddRepublica}>
                Cadastrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
