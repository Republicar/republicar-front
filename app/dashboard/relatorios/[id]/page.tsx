"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import { getReportLines, getOccupants, type Report } from "@/lib/data-store"
import { Download, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ReportDetailsPage() {
  const { id } = useParams()
  const [report, setReport] = useState<Report | null>(null)
  const [reportLines, setReportLines] = useState<any[]>([])
  const [occupants, setOccupants] = useState<any[]>([])

  useEffect(() => {
    // Find the report - need to search across all republicas
    const allReports: Report[] = []
    const reportLinesData = getReportLines(id as string)
    setReportLines(reportLinesData)

    if (reportLinesData.length > 0) {
      // Reconstruct report info from report lines
      const reportData = localStorage.getItem("republicar_reports")
      if (reportData) {
        const reports = JSON.parse(reportData)
        const foundReport = reports.find((r: Report) => r.id === id)
        if (foundReport) {
          setReport(foundReport)
          setOccupants(getOccupants(foundReport.republicaId))
        }
      }
    }
  }, [id])

  const handleExportPDF = () => {
    if (!report) return

    const content = `
RELATÓRIO DE DIVISÃO DE CONTAS
${report.title}

Período: ${new Date(report.startDate).toLocaleDateString("pt-BR")} a ${new Date(report.endDate).toLocaleDateString("pt-BR")}
Método: ${report.divisionMethod === "equal" ? "Igualitária" : "Proporcional à Renda"}

Total de Despesas: R$ ${report.totalExpenses.toFixed(2)}

DIVISÃO POR MORADOR:
${reportLines
  .map((line) => {
    const occupant = occupants.find((o) => o.id === line.occupantId)
    return `${occupant?.name}: R$ ${line.amountToPay.toFixed(2)}`
  })
  .join("\n")}

---
Gerado em: ${new Date().toLocaleDateString("pt-BR")}
    `

    const element = document.createElement("a")
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content))
    element.setAttribute("download", `relatorio_${report.id}.txt`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  const totalAPagar = reportLines.reduce((sum: number, line: any) => sum + line.amountToPay, 0)

  return (
    <div>
      <Link
        href="/dashboard/relatorios"
        className="text-primary hover:underline text-sm mb-4 inline-flex items-center gap-1"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">{report.title}</h1>
        <p className="text-muted-foreground mt-2">
          {new Date(report.startDate).toLocaleDateString("pt-BR")} a{" "}
          {new Date(report.endDate).toLocaleDateString("pt-BR")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">R$ {report.totalExpenses.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Método de Divisão</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {report.divisionMethod === "equal" ? "Igualitária" : "Proporcional à Renda"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Moradores</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{occupants.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Divisão por Morador</CardTitle>
          <div className="flex justify-end">
            <Button size="sm" onClick={handleExportPDF} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium">Morador</th>
                    <th className="px-6 py-3 text-left font-medium">Renda Mensal</th>
                    <th className="px-6 py-3 text-right font-medium">Valor a Pagar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {reportLines.map((line, index) => {
                    const occupant = occupants.find((o) => o.id === line.occupantId)
                    const percentage = ((line.amountToPay / report.totalExpenses) * 100).toFixed(1)
                    return (
                      <tr key={index} className="hover:bg-muted/50">
                        <td className="px-6 py-4">{occupant?.name || "Desconhecido"}</td>
                        <td className="px-6 py-4">R$ {occupant?.monthlyIncome.toFixed(2) || "0.00"}</td>
                        <td className="px-6 py-4 text-right font-semibold">
                          R$ {line.amountToPay.toFixed(2)} ({percentage}%)
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot className="bg-primary/5 border-t border-border">
                  <tr>
                    <td colSpan={2} className="px-6 py-4 font-semibold">
                      Total
                    </td>
                    <td className="px-6 py-4 text-right font-bold">R$ {totalAPagar.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
