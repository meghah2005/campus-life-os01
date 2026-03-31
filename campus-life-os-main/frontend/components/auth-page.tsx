"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowRight,
  Clock3,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react"
import { loginViaGateway, registerViaGateway } from "@/lib/api-gateway"

interface AuthPageProps {
  onLogin: (email: string, name: string, token: string) => void
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const normalizeEmail = (email: string) => email.trim().toLowerCase()
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")

    const normalizedEmail = normalizeEmail(formData.email)

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setAuthError("Passwords do not match.")
      return
    }

    if (!normalizedEmail || !formData.password) {
      setAuthError("Please fill in all required fields.")
      return
    }

    if (!isValidEmail(normalizedEmail)) {
      setAuthError("Please enter a valid email address.")
      return
    }

    if (!isLogin && !formData.name) {
      setAuthError("Please enter your name.")
      return
    }

    try {
      setIsSubmitting(true)
      let data
      if (isLogin) {
        data = await loginViaGateway(normalizedEmail, formData.password)
      } else {
        data = await registerViaGateway(formData.name, normalizedEmail, formData.password)
      }
      onLogin(data.user.email, data.user.name, data.token)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Authentication failed"
      if (isLogin && errorMessage.toLowerCase().includes("invalid credentials")) {
        if (normalizedEmail.includes("985gmail.com")) {
          setAuthError(
            'Invalid credentials. This email looks mistyped (did you mean "@gmail.com"?). You can also click "Sign up" to create an account.',
          )
          return
        }
        setAuthError(
          'Invalid credentials. If this is a new account, click "Sign up" first, or use the demo account: demo@university.edu / demo123.',
        )
        return
      }
      setAuthError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDemoLogin = async () => {
    try {
      setAuthError("")
      setIsSubmitting(true)
      const data = await loginViaGateway("demo@university.edu", "demo123")
      onLogin(data.user.email, data.user.name, data.token)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Demo login failed"
      setAuthError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-cyan-50 to-emerald-100 px-4 py-8 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute -left-20 top-8 h-52 w-52 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/3 h-60 w-60 rounded-full bg-blue-300/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-emerald-300/30 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-2xl backdrop-blur-sm lg:grid lg:grid-cols-[1.15fr_0.85fr]">
        <section className="relative border-b border-slate-200/80 p-6 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-bold tracking-tight text-slate-900">Campus Life OS</p>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Student Productivity Platform</p>
            </div>
          </div>

          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-100/70 px-3 py-1 text-xs font-semibold text-cyan-900">
              <Clock3 className="h-3.5 w-3.5" />
              Your Daily Campus Command Center
            </div>

            <div>
              <h1 className="text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
                Plan.
                <br />
                Learn.
                <br />
                Organize.
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base">
                Track deadlines, attendance, GPA, study sessions, notes, and campus services in one unified workspace.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
                <Clock3 className="h-3.5 w-3.5" />
                All-in-One Workspace
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
                <ArrowRight className="h-3.5 w-3.5" />
                Smart Dashboard
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
                <ShieldCheck className="h-3.5 w-3.5" />
                Microservices Powered
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center p-5 sm:p-8 lg:p-10">
          <Card className="mx-auto w-full max-w-md border-slate-200/80 bg-white/95 shadow-xl">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">Campus Life OS</CardTitle>
              <CardDescription className="text-slate-600">
                {isLogin ? "Sign in to access your campus dashboard" : "Create your account to get started"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {authError ? (
                  <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{authError}</div>
                ) : null}

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@university.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={handleDemoLogin}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in demo..." : "Try Demo Account"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setAuthError("")
                    setFormData({ name: "", email: "", password: "", confirmPassword: "" })
                  }}
                  className="text-primary hover:underline"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>

              <p className="mt-5 text-center text-xs text-slate-500">Trusted by students, faculty, and support teams campus-wide.</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
