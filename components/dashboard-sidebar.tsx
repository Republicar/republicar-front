"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Building2, DollarSign, FileText, Users, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { logout, user } = useAuth()

  const navItems = [
    {
      href: "/dashboard",
      icon: Home,
      label: "Dashboard",
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/minha-republica",
      icon: Building2,
      label: "Minha República",
      active: pathname.startsWith("/dashboard/minha-republica"),
    },
    {
      href: "/dashboard/despesas",
      icon: DollarSign,
      label: "Despesas",
      active: pathname.startsWith("/dashboard/despesas"),
    },
    {
      href: "/dashboard/relatorios",
      icon: FileText,
      label: "Relatórios",
      active: pathname.startsWith("/dashboard/relatorios"),
    },
    ...(user?.role === "owner"
      ? [
          {
            href: "/dashboard/ocupantes",
            icon: Users,
            label: "Moradores",
            active: pathname.startsWith("/dashboard/ocupantes"),
          },
        ]
      : []),
  ]

  return (
    <aside className="w-64 bg-muted/50 border-r border-border min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Republicar</h1>
        <p className="text-xs text-muted-foreground mt-1">{user?.role === "owner" ? "Dono" : "Morador"}</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button variant={item.active ? "default" : "ghost"} className="w-full justify-start">
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>

      <div className="space-y-2 pt-4 border-t border-border">
        <div className="text-xs font-medium text-muted-foreground px-2">{user?.name}</div>
        <Button
          variant="outline"
          className="w-full justify-start bg-transparent"
          onClick={() => {
            logout()
            window.location.href = "/"
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </aside>
  )
}
