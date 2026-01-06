"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { apiClient } from "@/lib/api"

// import the image from src/pics
import chipsImg from "@/pics/chips.png" // <-- put your chips image at src/pics/chips.png

export default function PokerLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Mock login for testing: admin / 123456
      const isMockLogin = username === "admin" && password === "123456"
      
      if (isMockLogin) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Mock successful response
        const mockToken = `mock_token_${Date.now()}`
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", mockToken)
          localStorage.setItem("player_name", username)
        }
        router.push("/lobby")
        return
      }

      // Real API call for other credentials
      const response = await apiClient.login(username, password)
      // Store token and basic player info
      if (response.token) {
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", response.token)
          localStorage.setItem("player_name", username)
        }
        router.push("/lobby")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "登录失败，请检查用户名和密码"
      setError(errorMessage)
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="min-h-screen relative overflow-hidden bg-background flex items-center justify-center p-4">
        {/* Background suits (kept as-is) */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl float">♠</div>
          <div className="absolute top-20 right-20 text-9xl float" style={{ animationDelay: "0.5s" }}>♥</div>
          <div className="absolute bottom-20 left-20 text-9xl float" style={{ animationDelay: "1s" }}>♣</div>
          <div className="absolute bottom-10 right-10 text-9xl float" style={{ animationDelay: "1.5s" }}>♦</div>
        </div>

        <Card className="w-full max-w-md relative z-10 bg-card/95 backdrop-blur-sm border-2 border-primary/30 shadow-2xl">
          <div className="p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold text-primary tracking-tight">群u德州</h1>
              <p className="text-muted-foreground text-lg">All In or Fold</p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span>♠</span><span>♥</span><span>♣</span><span>♦</span>
              </div>

              {/* -- Chips image placed directly under the title -- */}

            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary/30"></div>
              </div>
              <div className="relative flex justify-center">
              <span className="bg-card px-4 text-xs text-primary uppercase tracking-widest">
                Player Login
              </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <Input
                    id="username"
                    type="text"
                    placeholder="输入用户名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                />
              </div>

              <Button
                  type="submit"
                  className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-primary/50 relative overflow-hidden group"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  disabled={isLoading}
              >
                <span className="relative z-10">{isLoading ? '登录中...' : '开玩！'}</span>
                {isHovered && !isLoading && <div className="absolute inset-0 shimmer"/>}
              </Button>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm pt-4">
              <button className="text-primary hover:underline">忘记密码? 太笨！</button>
              <button className="text-primary hover:underline">创建账号</button>
            </div>

            {/* Mock Login Hint */}
            <div className="text-center pt-2 border-t border-primary/20">
              <p className="text-xs text-muted-foreground">
                测试账号: <span className="text-primary font-mono">admin</span> / <span className="text-primary font-mono">123456</span>
              </p>
            </div>

            <div className="flex justify-center mt-4">
              <div className="relative w-24 h-24">
                <Image
                    src={chipsImg}
                    alt="Poker chips"
                    fill
                    className="object-contain chip-stack-glow"
                    priority
                />
              </div>
            </div>
          </div>

          {/* Card corners */}
          <div className="absolute top-4 left-4 text-primary text-xl opacity-50">♠</div>
          <div className="absolute top-4 right-4 text-destructive text-xl opacity-50">♥</div>
          <div className="absolute bottom-4 left-4 text-accent text-xl opacity-50">♣</div>
          <div className="absolute bottom-4 right-4 text-primary text-xl opacity-50">♦</div>
        </Card>

        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-muted-foreground text-sm tracking-wider">
            The House Always Wins... Unless You're Better
          </p>
        </div>

      </div>
  )
}
