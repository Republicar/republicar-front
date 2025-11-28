"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { getInviteById, acceptInvite, rejectInvite } from "@/lib/invites"
import type { Invite } from "@/lib/invites"

export default function AcceptInvitePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const inviteId = searchParams.get("id")

  const [invite, setInvite] = useState<Invite | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!inviteId) {
      setError("Convite inválido")
      setLoading(false)
      return
    }

    const foundInvite = getInviteById(inviteId)
    if (!foundInvite) {
      setError("Convite não encontrado ou expirado")
      setLoading(false)
      return
    }

    if (foundInvite.status !== "pending") {
      setError("Este convite já foi aceito ou rejeitado")
      setLoading(false)
      return
    }

    setInvite(foundInvite)
    setEmail(foundInvite.email)
    setLoading(false)
  }, [inviteId])

  const handleAcceptInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!invite || !name || !password) {
      setError("Preencha todos os campos")
      return
    }

    setSubmitting(true)
    setError("")

    try {
      // Create the user as a tenant
      const usersData = localStorage.getItem("republicar_users")
      const users = usersData ? JSON.parse(usersData) : []

      // Check if email already exists
      if (users.some((u: any) => u.email === email)) {
        throw new Error("Email já cadastrado")
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        name,
        role: "tenant" as const,
        republicaId: invite.republicaId,
      }

      users.push(newUser)
      localStorage.setItem("republicar_users", JSON.stringify(users))

      // Accept the invite
      acceptInvite(invite.id)

      // Add the occupant to the república
      const occupantsData = localStorage.getItem("republicar_occupants")
      const occupants = occupantsData ? JSON.parse(occupantsData) : []

      const newOccupant = {
        id: newUser.id,
        republicaId: invite.republicaId,
        name,
        email,
        monthlyIncome: 0,
        active: true,
        joinedAt: new Date().toISOString(),
      }

      occupants.push(newOccupant)
      localStorage.setItem("republicar_occupants", JSON.stringify(occupants))

      setSuccess(true)

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao aceitar convite")
    } finally {
      setSubmitting(false)
    }
  }

  const handleRejectInvite = () => {
    if (!invite) return
    rejectInvite(invite.id)
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">Carregando...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error && !invite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button className="w-full mt-4" asChild>
              <Link href="/">Voltar para Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle>Conta Criada com Sucesso!</CardTitle>
            <CardDescription>Redirecionando para login...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary mb-2">Republicar</h1>
          </div>
          <CardTitle>Aceitar Convite</CardTitle>
          <CardDescription>
            Você foi convidado para {invite?.republicaName} por {invite?.ownerName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAcceptInvite} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="bg-muted p-4 rounded-lg border border-border">
              <p className="text-sm font-medium text-foreground">República</p>
              <p className="text-lg font-bold text-primary">{invite?.republicaName}</p>
              <p className="text-sm text-muted-foreground mt-2">Convite de: {invite?.ownerName}</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nome Completo
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input id="email" type="email" value={email} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Este email não pode ser alterado</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={handleRejectInvite}
                disabled={submitting}
              >
                Recusar
              </Button>
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? "Processando..." : "Aceitar Convite"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
