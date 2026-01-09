"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import PlayerInfoCard from "@/components/PlayerInfoCard"
import Image from "next/image"
import gamingTableBg from "@/pics/game-table.jpg"

interface SeatPlayer {
  id: string
  name: string
  avatar?: string
  points?: number
  isReady?: boolean
}

interface Seat {
  number: number
  player?: SeatPlayer
  isButton?: boolean
}

export default function GamePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const seatNumber = parseInt(searchParams.get("seat") || "0")
  const [playerName, setPlayerName] = useState<string>("")
  const [points, setPoints] = useState<number>(1000)
  const [isReady, setIsReady] = useState<boolean>(false)

  // Mock seat data - in real app, this would come from API/WebSocket
  // Seat 6 will be assigned to current player in useEffect
  const [seats, setSeats] = useState<Seat[]>([
    { number: 1, player: { id: "1", name: "HighRoller", points: 3250, isReady: true } },
    { number: 2, player: { id: "2", name: "RiverKing", points: 2812, isReady: false } },
    { number: 3, player: { id: "3", name: "John Doe", points: 320, isReady: true } },
    { number: 4, player: { id: "4", name: "AllInQueen", points: 2344, isReady: true } },
    { number: 5, isButton: true, player: { id: "5", name: "SlowPlay", points: 1980, isReady: false } },
    { number: 6 }, // Will be assigned to current player
    { number: 7, player: { id: "7", name: "ChipLeader", points: 1765, isReady: false } },
    { number: 8, player: { id: "8", name: "Tom Dwan", points: 2344, isReady: true } },
    { number: 9, player: { id: "9", name: "Tan Xuan", points: 2344, isReady: true } },
  ])

  const currentPlayers = useMemo(
    () => seats.filter((seat) => seat.player).length,
    [seats]
  )

  const readyPlayers = useMemo(
    () => seats.filter((seat) => seat.player?.isReady).length,
    [seats]
  )

  const allReady = useMemo(
    () => currentPlayers > 0 && readyPlayers === currentPlayers,
    [currentPlayers, readyPlayers]
  )

  useEffect(() => {
    // Simple auth gate: if no token, back to login
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
    if (!token) {
      router.replace("/")
      return
    }

    // Use last login name from storage if available
    const storedName =
      (typeof window !== "undefined" && localStorage.getItem("player_name")) || "Player"
    setPlayerName(storedName)

    // Always assign current player to seat 6
    setSeats((prevSeats) =>
      prevSeats.map((s) =>
        s.number === 6
          ? { ...s, player: { id: "current", name: storedName, points: points, isReady: false } }
          : s
      )
    )

    // TODO: replace with real game state fetch when backend endpoint is ready
    // apiClient.getGameState(gameId).then(...)
  }, [router, points])

  const handleReady = async () => {
    try {
      // Placeholder for real ready call
      // await apiClient.setReady(gameId, 6) // Always seat 6
      
      setIsReady(true)
      setSeats((prevSeats) =>
        prevSeats.map((s) =>
          s.number === 6 && s.player
            ? { ...s, player: { ...s.player, isReady: true } }
            : s
        )
      )
    } catch (error) {
      console.error("Failed to set ready:", error)
    }
  }

  const handleStartGame = async () => {
    if (!allReady) return

    try {
      // Placeholder for real start game call
      // await apiClient.startGame(gameId)
      console.log("Game starting...")
      // TODO: Navigate to actual game play page or start the game
    } catch (error) {
      console.error("Failed to start game:", error)
    }
  }

  const handleLeave = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("player_name")
    }
    router.replace("/lobby")
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground p-4 md:p-8">
      {/* Background suits to match lobby */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute -top-4 left-10 text-8xl md:text-9xl float">♠</div>
        <div
          className="absolute top-20 right-10 text-7xl md:text-8xl float"
          style={{ animationDelay: "0.5s" }}
        >
          ♥
        </div>
        <div
          className="absolute bottom-24 left-6 text-7xl md:text-8xl float"
          style={{ animationDelay: "1s" }}
        >
          ♣
        </div>
        <div
          className="absolute -bottom-4 right-6 text-8xl md:text-9xl float"
          style={{ animationDelay: "1.5s" }}
        >
          ♦
        </div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6">
        {/* Top bar: Game info and controls */}
        <Card className="bg-card/95 border-primary/30 flex items-center justify-between border-2 p-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Game Room</p>
              <p className="text-lg font-semibold text-primary">德州扑克主桌</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Ready:</span>
              <span className="font-bold text-primary">{readyPlayers} / {currentPlayers}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!isReady ? (
              <Button
                onClick={handleReady}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
              >
                Ready
              </Button>
            ) : (
              <div className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg">
                <span className="text-green-400 font-bold text-sm">✓ Ready</span>
              </div>
            )}
            {allReady && (
              <Button
                onClick={handleStartGame}
                className="bg-green-600 hover:bg-green-700 text-white font-bold"
              >
                Start Game
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLeave}
              className="border-primary/40 bg-card/60 text-xs uppercase tracking-wide hover:bg-primary/10"
            >
              Leave
            </Button>
          </div>
        </Card>

        {/* Gaming table with background image */}
        <Card className="relative flex flex-1 flex-col justify-between gap-6 overflow-hidden bg-card/95 border-2 border-primary/30 p-5 shadow-2xl">
          {/* Gaming table background image container - ADJUST SIZE HERE */}
          {/* Change min-h, max-w, or aspect ratio to adjust background box size */}
          <div 
            className="relative w-full mx-auto"
            style={{
              minHeight: "700px", // ADJUST: Change this to make background taller/shorter
              maxWidth: "1300px",  // ADJUST: Change this to make background wider/narrower
              aspectRatio: "16/9",  // ADJUST: Change ratio (e.g., "4/3", "21/9", "16/10")
            }}
          >
            <Image
              src={gamingTableBg}
              alt="Gaming table"
              fill
              className="object-contain" // Changed to object-contain to see full image
              priority
              quality={90}
            />
            {/* Dark overlay for better contrast */}
            <div className="absolute inset-0 bg-black/20"></div>

            {/* Player info cards - MANUAL POSITIONING */}
            {/* Each card position is set manually using percentages (0-100%) */}
            {/* left: 0% = far left, 50% = center, 100% = far right */}
            {/* top: 0% = top, 50% = center, 100% = bottom */}
            {seats.map((seat) => {
              if (!seat.player) return null

              // MANUAL POSITIONING FOR EACH SEAT
              // Adjust these percentages to position each card on the table image
              // Format: { seatNumber: { left: X%, top: Y% } }
              const manualPositions: Record<number, { left: number; top: number }> = {
                1: { left: 25, top: 10 },   // Seat 1 - Top-left area
                2: { left: 50, top: 6 },   // Seat 2 - Top-center
                3: { left: 77, top: 12 },   // Seat 3 - Top-right
                4: { left: 95, top: 40 },   // Seat 4 - Right-top
                5: { left: 85, top: 82 },   // Seat 5 - Right-center (Button)
                6: { left: 52, top: 87 },   // Seat 6 - Right-bottom
                7: { left: 17, top: 82 },   // Seat 7 - Bottom-right
                8: { left: 5, top: 60 },   // Seat 8 - Bottom-center
                9: { left: 7, top: 30 },   // Seat 9 - Bottom-left
              }

              const position = manualPositions[seat.number] || { left: 50, top: 50 }

              return (
                <div
                  key={seat.number}
                  className="absolute"
                  style={{
                    // MANUAL POSITIONING - Change these percentages to move cards
                    left: `${position.left}%`,  // ADJUST: 0-100% (left to right)
                    top: `${position.top}%`,    // ADJUST: 0-100% (top to bottom)
                    transform: "translate(-50%, -50%)", // Centers the card on the position
                    zIndex: 20,
                    minWidth: "140px",
                  }}
                >
                  <PlayerInfoCard
                    player={seat.player}
                    isButton={seat.isButton}
                    isCurrentPlayer={seat.player.id === "current"}
                  />
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

