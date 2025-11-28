import type React from "react"
import { LayoutWithAuth } from "@/app/layout-with-auth"
import { AuthProvider } from "@/lib/auth-context"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <LayoutWithAuth>{children}</LayoutWithAuth>
    </AuthProvider>
  )
}
