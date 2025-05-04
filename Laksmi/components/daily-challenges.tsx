"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TurtleMascot } from "@/components/turtle-mascot"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion } from "framer-motion"
import { Calendar, Clock, Award, Flame } from "lucide-react"
import type { UserData } from "./user-manager"

interface DailyChallengesProps {
  onPointsEarned?: (points: number) => void
}

export default function DailyChallenges({ onPointsEarned }: DailyChallengesProps) {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null)
  const [challenges, setChallenges] = useState<
    Array<{
      id: string
      title: string
      description: string
      reward: number
      deadline: string
      completed: boolean
    }>
  >([])
  const [mascotMessage, setMascotMessage] = useState(
    "¡Completa retos diarios para ganar puntos extra y mantener tu racha!",
  )
  const [showReward, setShowReward] = useState<{ id: string; points: number } | null>(null)

  // Cargar datos del usuario actual
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUserId = localStorage.getItem("lakshmi_current_user_id")
      if (currentUserId) {
        const storedUsers = localStorage.getItem("lakshmi_users")
        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers)
          const user = parsedUsers.find((u: UserData) => u.id === currentUserId)
          if (user) {
            setCurrentUser(user)
            setChallenges(user.challenges.active)
          }
        }
      }
    }
  }, [])

  // Calcular tiempo restante para cada reto
  const getTimeRemaining = (deadline: string) => {
    const total = Date.parse(deadline) - Date.now()
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
    const days = Math.floor(total / (1000 * 60 * 60 * 24))

    if (days > 0) {
      return `${days}d ${hours}h`
    } else if (hours > 0) {
      return `${hours}h`
    } else {
      return "¡Último día!"
    }
  }

  const handleChallengeComplete = (challengeId: string) => {
    if (!currentUser) return

    // Encontrar el reto completado
    const challenge = challenges.find((c) => c.id === challengeId)
    if (!challenge || challenge.completed) return

    // Actualizar el estado local
    const updatedChallenges = challenges.map((c) => (c.id === challengeId ? { ...c, completed: true } : c))
    setChallenges(updatedChallenges)

    // Mostrar recompensa
    setShowReward({ id: challengeId, points: challenge.reward })
    setMascotMessage(
      `¡Excelente trabajo! Has completado el reto "${challenge.title}" y ganado ${challenge.reward} puntos.`,
    )

    // Actualizar datos del usuario
    if (typeof window !== "undefined") {
      const storedUsers = localStorage.getItem("lakshmi_users")
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers)
        const updatedUsers = parsedUsers.map((user: UserData) => {
          if (user.id === currentUser.id) {
            // Actualizar puntos
            const newPoints = user.points + challenge.reward

            // Mover el reto a completados
            const updatedActive = user.challenges.active.map((c) =>
              c.id === challengeId ? { ...c, completed: true } : c,
            )
            const updatedCompleted = [...user.challenges.completed, challengeId]

            // Actualizar localStorage para compatibilidad con el resto de la app
            localStorage.setItem(
              "lakshmi_user_data",
              JSON.stringify({
                points: newPoints,
              }),
            )

            // Notificar puntos ganados
            if (onPointsEarned) {
              onPointsEarned(challenge.reward)
            }

            return {
              ...user,
              points: newPoints,
              challenges: {
                active: updatedActive,
                completed: updatedCompleted,
              },
            }
          }
          return user
        })

        localStorage.setItem("lakshmi_users", JSON.stringify(updatedUsers))

        // Actualizar usuario actual
        const updatedUser = updatedUsers.find((u: UserData) => u.id === currentUser.id)
        if (updatedUser) {
          setCurrentUser(updatedUser)
        }
      }
    }
  }

  return (
    <Card className="w-full shadow-lg border-teal-200">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-teal-800">Retos Diarios</CardTitle>
            <CardDescription>Completa retos para ganar puntos extra</CardDescription>
          </div>
          {currentUser && currentUser.streakDays > 0 && (
            <Badge className="bg-amber-100 text-amber-800 border-amber-300 flex items-center">
              <Flame className="h-3 w-3 mr-1 text-amber-500" />
              Racha: {currentUser.streakDays} {currentUser.streakDays === 1 ? "día" : "días"}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex justify-center mb-6">
          <TurtleMascot className="w-20 h-20" message={mascotMessage} />
        </div>

        <div className="space-y-4">
          {challenges.length === 0 ? (
            <div className="text-center text-teal-700 p-4 bg-teal-50 rounded-lg border border-teal-200">
              No hay retos disponibles en este momento. ¡Vuelve mañana para nuevos desafíos!
            </div>
          ) : (
            challenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`bg-teal-50 p-4 rounded-lg border ${
                  challenge.completed ? "border-green-300" : "border-teal-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${challenge.completed ? "bg-green-100" : "bg-teal-100"}`}>
                    {challenge.id.startsWith("daily") ? (
                      <Calendar className={`h-5 w-5 ${challenge.completed ? "text-green-600" : "text-teal-600"}`} />
                    ) : (
                      <Award className={`h-5 w-5 ${challenge.completed ? "text-green-600" : "text-teal-600"}`} />
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-medium ${challenge.completed ? "text-green-800" : "text-teal-800"}`}>
                        {challenge.title}
                      </h3>
                      <Badge
                        className={`${
                          challenge.completed
                            ? "bg-green-100 text-green-800 border-green-300"
                            : "bg-teal-100 text-teal-800 border-teal-300"
                        }`}
                      >
                        +{challenge.reward} pts
                      </Badge>
                    </div>
                    <p className={`text-sm mb-3 ${challenge.completed ? "text-green-700" : "text-teal-700"}`}>
                      {challenge.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`challenge-${challenge.id}`}
                          checked={challenge.completed}
                          onCheckedChange={() => !challenge.completed && handleChallengeComplete(challenge.id)}
                          disabled={challenge.completed}
                        />
                        <Label
                          htmlFor={`challenge-${challenge.id}`}
                          className={`text-sm font-medium ${challenge.completed ? "text-green-700" : "text-teal-700"}`}
                        >
                          {challenge.completed ? "Completado" : "Marcar como completado"}
                        </Label>
                      </div>

                      <div className="flex items-center text-xs">
                        <Clock className="h-3 w-3 mr-1 text-teal-600" />
                        <span className="text-teal-600">{getTimeRemaining(challenge.deadline)}</span>
                      </div>
                    </div>

                    {showReward && showReward.id === challenge.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mt-3"
                      >
                        <Alert className="bg-green-100 border-green-300">
                          <div className="flex items-center gap-2">
                            <img src="/images/pirate-coin.png" alt="Moneda pirata" className="w-6 h-6" />
                            <AlertDescription className="text-green-800">
                              ¡Has ganado {showReward.points} puntos!
                            </AlertDescription>
                          </div>
                        </Alert>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="w-full">
          <div className="flex justify-between text-xs text-teal-700 mb-1">
            <span>Progreso diario</span>
            <span>
              {challenges.filter((c) => c.completed).length}/{challenges.length} completados
            </span>
          </div>
          <Progress
            value={(challenges.filter((c) => c.completed).length / Math.max(1, challenges.length)) * 100}
            className="h-2 bg-teal-100"
          />
        </div>
      </CardFooter>
    </Card>
  )
}
