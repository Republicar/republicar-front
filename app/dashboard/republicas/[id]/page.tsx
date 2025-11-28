"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useParams } from "next/navigation"
import {
  getOccupants,
  addOccupant,
  updateOccupant,
  removeOccupant,
  type Occupant,
  getRepublicas,
} from "@/lib/data-store"
import { createInvite } from "@/lib/invites"
import { Plus, Trash2, Edit2, Send } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RepublicaDetailsPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [occupants, setOccupants] = useState<Occupant[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: "", email: "", monthlyIncome: "" })
  const [inviteEmail, setInviteEmail] = useState("")
  const [republicaName, setRepublicaName] = useState("")
  const [inviteSuccess, setInviteSuccess] = useState(false)

  useEffect(() => {
    const republicas = getRepublicas(user?.id || "")
    const republica = republicas.find((r) => r.id === id)
    if (republica) {
      setRepublicaName(republica.name)
      setOccupants(getOccupants(republica.id))
    }
  }, [id, user])

  const handleAddOccupant = () => {
    if (formData.name && formData.email && formData.monthlyIncome) {
      if (editingId) {
        const updatedOccupant = occupants.find((o) => o.id === editingId)!
        updatedOccupant.name = formData.name
        updatedOccupant.email = formData.email
        updatedOccupant.monthlyIncome = Number.parseFloat(formData.monthlyIncome)
        updateOccupant(updatedOccupant)
        setOccupants([...occupants])
        setEditingId(null)
      } else {
        const newOccupant: Occupant = {
          id: Date.now().toString(),
          republicaId: id as string,
          name: formData.name,
          email: formData.email,
          monthlyIncome: Number.parseFloat(formData.monthlyIncome),
          active: true,
          joinedAt: new Date().toISOString(),
        }
        addOccupant(newOccupant)
        setOccupants([...occupants, newOccupant])
      }
      setFormData({ name: "", email: "", monthlyIncome: "" })
      setShowDialog(false)
    }
  }

  const handleSendInvite = () => {
    if (!inviteEmail) return

    const invite = createInvite(inviteEmail, id as string, republicaName, user?.id || "", user?.name || "")

    const inviteLink = `${window.location.origin}/accept-invite?id=${invite.id}`

    // Copy to clipboard
    navigator.clipboard.writeText(inviteLink)

    setInviteSuccess(true)
    setInviteEmail("")

    setTimeout(() => {
      setInviteSuccess(false)
      setShowInviteDialog(false)
    }, 2000)
  }

  const handleDelete = (occupantId: string) => {
    removeOccupant(occupantId)
    setOccupants(occupants.filter((o) => o.id !== occupantId))
  }

  const handleEdit = (occupant: Occupant) => {
    setEditingId(occupant.id)
    setFormData({
      name: occupant.name,
      email: occupant.email,
      monthlyIncome: occupant.monthlyIncome.toString(),
    })
    setShowDialog(true)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/dashboard/republicas" className="text-primary hover:underline text-sm mb-2 inline-block">
            ← Voltar
          </Link>
          <h1 className="text-3xl font-bold">Moradores</h1>
          <p className="text-muted-foreground mt-1">Gerenciar ocupantes da república</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setInviteEmail("")
              setInviteSuccess(false)
              setShowInviteDialog(true)
            }}
          >
            <Send className="mr-2 h-4 w-4" />
            Convidar Morador
          </Button>
          <Button
            onClick={() => {
              setEditingId(null)
              setFormData({ name: "", email: "", monthlyIncome: "" })
              setShowDialog(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Morador
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Nome</th>
                <th className="px-6 py-3 text-left font-medium">Email</th>
                <th className="px-6 py-3 text-left font-medium">Renda Mensal</th>
                <th className="px-6 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {occupants.map((occupant) => (
                <tr key={occupant.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4">{occupant.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{occupant.email}</td>
                  <td className="px-6 py-4">R$ {occupant.monthlyIncome.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(occupant)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(occupant.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog para adicionar morador */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Morador" : "Adicionar Novo Morador"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Atualize as informações do morador" : "Cadastre um novo morador na república"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Nome Completo</label>
              <Input
                placeholder="Ex: João Silva"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="joao@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Renda Mensal (R$)</label>
              <Input
                type="number"
                placeholder="3000.00"
                value={formData.monthlyIncome}
                onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowDialog(false)}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={handleAddOccupant}>
                {editingId ? "Atualizar" : "Adicionar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para convidar morador */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convidar Morador</DialogTitle>
            <DialogDescription>Envie um convite para um morador se cadastrar</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {inviteSuccess && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  Link copiado! Compartilhe este link com o morador.
                </AlertDescription>
              </Alert>
            )}
            <div>
              <label className="text-sm font-medium">Email do Morador</label>
              <Input
                type="email"
                placeholder="morador@email.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowInviteDialog(false)}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={handleSendInvite} disabled={!inviteEmail}>
                Gerar Link de Convite
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
