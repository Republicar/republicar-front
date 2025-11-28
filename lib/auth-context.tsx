"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface User {
  id: string
  email: string
  name: string
  role: "owner" | "tenant"
  republicaId?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is stored in localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("republicar_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem("republicar_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Mock authentication - in production would call an API
    setIsLoading(true)
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Get all stored users from localStorage
      const usersData = localStorage.getItem("republicar_users")
      const users = usersData ? JSON.parse(usersData) : []

      const foundUser = users.find((u: any) => u.email === email && u.password === password)

      if (!foundUser) {
        throw new Error("Email ou senha inválidos")
      }

      const userData: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        republicaId: foundUser.republicaId,
      }

      setUser(userData)
      localStorage.setItem("republicar_user", JSON.stringify(userData))
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Get all stored users from localStorage
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
        role: "owner" as const,
        republicaId: undefined,
      }

      users.push(newUser)
      localStorage.setItem("republicar_users", JSON.stringify(users))

      const userData: User = {
        id: newUser.id,
        email,
        name,
        role: "owner",
      }

      setUser(userData)
      localStorage.setItem("republicar_user", JSON.stringify(userData))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("republicar_user")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
