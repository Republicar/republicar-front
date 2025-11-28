'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { getOccupants, getReports, getReportLines, getRepublicas, Occupant, Report } from '@/lib/data-store'
import { Eye } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useParams } from "next/navigation"
import {
  addOccupant,
  updateOccupant,
  removeOccupant,
} from "@/lib/data-store"
import { Plus, Trash2, Edit2 } from "lucide-react"

interface ReportWithOccupant {
  report: Report
  amountToPay: number
  percentage: number
}

export default function OcupantesPage() {
  const { user } = useAuth()
  const [reportsForOccupant, setReportsForOccupant] = useState<ReportWithOccupant[]>([])
  const [totalDue, setTotalDue] = useState(0)
  const [republicaName, setRepublicaName] = useState('')

  useEffect(() => {
    if (user?.role === 'tenant' && user?.republicaId) {
      // Get all reports for the occupant's república
      const reports = getReports(user.republicaId)

      const occupantReports: ReportWithOccupant[] = []
      let total = 0

      reports.forEach(report => {
        const reportLines = getReportLines(report.id)
        const occupantLine = reportLines.find(line => line.occupantId === user?.id)

        if (occupantLine) {
          const percentage = (occupantLine.amountToPay / report.totalExpenses * 100)
          occupantReports.push({
            report,
            amountToPay: occupantLine.amountToPay,
            percentage,
          })
          total += occupantLine.amountToPay
        }
      })

      setReportsForOccupant(occupantReports)
      setTotalDue(total)

      // Get república name
      const republicas = getRepublicas('')
      const allRepublicas = republicas.concat(
        JSON.parse(localStorage.getItem('republicar_republicas') || '[]')
      )
      const republica = allRepublicas.find(r => r.id === user.republicaId)
      if (republica) {
        setRepublicaName(republica.name)
      }
    }
  }, [user])

  if (user?.role !== 'tenant') {
    return (
      <RepublicaDetailsPage/>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Portal do Morador</h1>
      <p className="text-muted-foreground mb-8">Visualize seus débitos e histórico de pagamentos</p>

      {reportsForOccupant.length === 0 ? (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="pt-12 text-center">
            <h2 className="text-lg font-semibold mb-2">Nenhum relatório disponível</h2>
            <p className="text-muted-foreground">Aguarde o dono da república gerar os relatórios de divisão</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Devido</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">R$ {totalDue.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">República</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{republicaName}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Relatórios</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{reportsForOccupant.length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Histórico de Relatórios */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Relatórios</CardTitle>
              <CardDescription>Todos os relatórios onde você aparece como pagador</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportsForOccupant.map(({ report, amountToPay, percentage }) => (
                  <div
                    key={report.id}
                    className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{report.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(report.startDate).toLocaleDateString('pt-BR')} a {new Date(report.endDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Tipo</p>
                        <p className="text-sm font-medium">
                          {report.divisionMethod === 'equal' ? 'Igualitária' : 'Proporcional'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-3 border-y border-border my-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Total de Despesas</p>
                        <p className="font-semibold">R$ {report.totalExpenses.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Seu Valor</p>
                        <p className="font-bold text-primary">R$ {amountToPay.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Sua Parte</p>
                        <p className="font-semibold">{percentage.toFixed(1)}%</p>
                      </div>
                      <div className="flex items-end justify-end">
                        <Link href={`/dashboard/relatorios/${report.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalhes
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Info de Transparência */}
          <Card className="mt-6 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-base">Transparência nas Contas</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Você pode visualizar todos os detalhes dos relatórios e entender exatamente como sua parte foi calculada. Os valores apresentados são transparentes e baseados nas regras acordadas com o dono da república.</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

function  RepublicaDetailsPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [occupants, setOccupants] = useState<Occupant[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: "", email: "", monthlyIncome: "" })

  useEffect(() => {
    const republicas = getRepublicas(user?.id || "")
    if (republicas[0]) {
      setOccupants(getOccupants(republicas[0].id))
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
    </div>
  )
}
