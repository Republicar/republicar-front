"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import { getRepublicaByOwnerId, updateRepublica, type Republica } from "@/lib/data-store"
import { Users, MapPin, Home, Pencil } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function MinhaRepublicaPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [republica, setRepublica] = useState<Republica | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [editFormData, setEditFormData] = useState({ name: "", address: "", rooms: "" })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return

    // If user doesn't have a república, redirect to onboarding
    if (!user.republicaId) {
      router.push("/onboarding")
      return
    }

    // Get the única república for this owner
    const rep = getRepublicaByOwnerId(user.id)
    if (rep) {
      setRepublica(rep)
      setEditFormData({ name: rep.name, address: rep.address, rooms: rep.rooms.toString() })
    }
    setLoading(false)
  }, [user, router])

  const handleUpdateRepublica = () => {
    if (republica && editFormData.name && editFormData.address && editFormData.rooms) {
      const updatedRepublica = {
        ...republica,
        name: editFormData.name,
        address: editFormData.address,
        rooms: Number.parseInt(editFormData.rooms),
      }
      updateRepublica(updatedRepublica)
      setRepublica(updatedRepublica)
      setShowDialog(false)
    }
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!republica) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Nenhuma república cadastrada</p>
        <Link href="/onboarding">
          <Button>Cadastrar República</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Minha República</h1>
          <p className="text-muted-foreground mt-1">Gerenciar informações da república</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Nome</p>
              <p className="text-lg font-semibold">{republica.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Endereço
              </p>
              <p className="text-lg font-semibold">{republica.address}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Número de Quartos</p>
              <p className="text-lg font-semibold">{republica.rooms}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Criada em</p>
              <p className="text-lg font-semibold">{new Date(republica.createdAt).toLocaleDateString("pt-BR")}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Atalhos Rápidos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/ocupantes">
              <Button className="w-full justify-start" variant="ghost">
                <Users className="mr-2 h-4 w-4" />
                Gerenciar Moradores
              </Button>
            </Link>
            <Link href="/dashboard/despesas">
              <Button className="w-full justify-start" variant="ghost">
                <Home className="mr-2 h-4 w-4" />
                Adicionar Despesas
              </Button>
            </Link>
            <Link href="/dashboard/relatorios">
              <Button className="w-full justify-start" variant="ghost">
                <Home className="mr-2 h-4 w-4" />
                Ver Relatórios
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar República</DialogTitle>
            <DialogDescription>Atualize as informações da sua república</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Nome da República</label>
              <Input
                placeholder="Ex: República da Alegria"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Endereço</label>
              <Input
                placeholder="Ex: Rua das Flores, 123"
                value={editFormData.address}
                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Número de Quartos</label>
              <Input
                type="number"
                placeholder="Ex: 4"
                value={editFormData.rooms}
                onChange={(e) => setEditFormData({ ...editFormData, rooms: e.target.value })}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowDialog(false)}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={handleUpdateRepublica}>
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
