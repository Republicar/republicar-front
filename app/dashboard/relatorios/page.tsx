"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import {
  getRepublicas,
  getExpenses,
  getOccupants,
  getReports,
  addReport,
  addReportLine,
  type Report,
  type Republica,
} from "@/lib/data-store"
import { calculateEqualDivision, calculateProportionalDivision, type DivisionResult } from "@/lib/calculation-utils"
import { Plus, Eye } from "lucide-react"
import Link from "next/link"

export default function RelatoriosPage() {
  const { user } = useAuth()
  const [selectedRepublica, setSelectedRepublica] = useState<string>("")
  const [reports, setReports] = useState<Report[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    divisionMethod: "equal" as "equal" | "proportional",
  })

  useEffect(() => {
    if (user?.id) {
      const reps = getRepublicas(user.id)
      if (reps.length > 0) {
        setSelectedRepublica(reps[0].id)
      }
    }
  }, [user])

  useEffect(() => {
    if (selectedRepublica) {
      const reps = getReports(selectedRepublica)
      setReports(reps)
    }
  }, [selectedRepublica])

  const handleGenerateReport = () => {
    if (!formData.title || !formData.startDate || !formData.endDate) {
      alert("Preencha todos os campos")
      return
    }

    try {
      const expenses = getExpenses(selectedRepublica, formData.startDate, formData.endDate)
      const occupants = getOccupants(selectedRepublica)

      if (occupants.length === 0) {
        alert("Adicione moradores à república para gerar relatório")
        return
      }

      const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

      if (totalExpenses === 0) {
        alert("Não há despesas registradas no período")
        return
      }

      // Calculate division
      let divisionResults: DivisionResult[]
      try {
        if (formData.divisionMethod === "equal") {
          divisionResults = calculateEqualDivision(totalExpenses, occupants)
        } else {
          divisionResults = calculateProportionalDivision(totalExpenses, occupants)
        }
      } catch (error) {
        alert(error instanceof Error ? error.message : "Erro ao calcular divisão")
        return
      }

      // Create report
      const newReport: Report = {
        id: Date.now().toString(),
        republicaId: selectedRepublica,
        title: formData.title,
        startDate: formData.startDate,
        endDate: formData.endDate,
        divisionMethod: formData.divisionMethod,
        totalExpenses: Number.parseFloat(totalExpenses.toFixed(2)),
        createdAt: new Date().toISOString(),
        status: "finalized",
      }

      addReport(newReport)

      // Store division results
      divisionResults.forEach((result) => {
        addReportLine({
          reportId: newReport.id,
          occupantId: result.occupantId,
          amountToPay: result.amountToPay,
        })
      })

      setReports([...reports, newReport])
      setFormData({ title: "", startDate: "", endDate: "", divisionMethod: "equal" })
      setShowDialog(false)
    } catch (error) {
      console.error("Erro ao gerar relatório:", error)
      alert("Erro ao gerar relatório")
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Relatórios de Divisão</h1>
          <p className="text-muted-foreground mt-1">Gere relatórios de despesas com cálculos automáticos</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Gerar Relatório
        </Button>
      </div>


      {/* Lista de Relatórios */}
      <div className="grid grid-cols-1 gap-4">
        {reports.length === 0 ? (
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="pt-12 text-center">
              <h2 className="text-lg font-semibold mb-2">Nenhum relatório gerado</h2>
              <p className="text-muted-foreground">Crie seu primeiro relatório para visualizar a divisão de contas</p>
            </CardContent>
          </Card>
        ) : (
          reports.map((report) => (
            <Link key={report.id} href={`/dashboard/relatorios/${report.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{report.title}</CardTitle>
                      <CardDescription>
                        {new Date(report.startDate).toLocaleDateString("pt-BR")} a{" "}
                        {new Date(report.endDate).toLocaleDateString("pt-BR")}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Tipo de Divisão</p>
                      <p className="font-semibold">
                        {report.divisionMethod === "equal" ? "Igualitária" : "Proporcional à Renda"}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Despesas</p>
                      <p className="text-2xl font-bold">R$ {report.totalExpenses.toFixed(2)}</p>
                    </div>
                    <Button variant="outline">
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>

      {/* Dialog para Gerar Relatório */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerar Novo Relatório</DialogTitle>
            <DialogDescription>Crie um relatório com cálculo automático de divisão de despesas</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Título do Relatório</label>
              <Input
                placeholder="Ex: Contas de Dezembro"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Data Início</label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Data Fim</label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Método de Divisão</label>
              <select
                value={formData.divisionMethod}
                onChange={(e) =>
                  setFormData({ ...formData, divisionMethod: e.target.value as "equal" | "proportional" })
                }
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
              >
                <option value="equal">Igualitária (divide igualmente entre todos)</option>
                <option value="proportional">Proporcional à Renda (baseado na renda de cada um)</option>
              </select>
              <p className="text-xs text-muted-foreground mt-2">
                {formData.divisionMethod === "equal"
                  ? "Cada morador pagará a mesma parte"
                  : "Cada morador pagará proporcionalmente à sua renda"}
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowDialog(false)}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={handleGenerateReport}>
                Gerar Relatório
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
