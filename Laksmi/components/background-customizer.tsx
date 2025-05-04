"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TurtleMascot } from "@/components/turtle-mascot"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Lock, Check } from "lucide-react"
import type { UserData } from "./user-manager"

interface BackgroundCustomizerProps {
  userPoints: number
  onCustomizationSaved?: () => void
}

export default function BackgroundCustomizer({ userPoints = 0, onCustomizationSaved }: BackgroundCustomizerProps) {
  const [mascotMessage, setMascotMessage] = useState(
    "¡Personaliza el fondo de la aplicación con los puntos que has ganado!",
  )
  const [selectedBackground, setSelectedBackground] = useState("coral")
  const [currentUser, setCurrentUser] = useState<UserData | null>(null)

  const backgrounds = [
    {
      id: "coral",
      name: "Arrecife de Coral",
      price: 0,
      description: "El clásico arrecife colorido",
      preview: "/images/coral-bg-thumb.png",
    },
    {
      id: "deep-sea",
      name: "Mar Profundo",
      price: 40,
      description: "Misterioso y oscuro",
      preview: "/images/deep-sea-thumb.png",
    },
    {
      id: "tropical",
      name: "Isla Tropical",
      price: 60,
      description: "Aguas cristalinas y arena blanca",
      preview: "/images/tropical-thumb.png",
    },
    {
      id: "shipwreck",
      name: "Barco Hundido",
      price: 100,
      description: "Tesoros y aventuras",
      preview: "/images/shipwreck-thumb.png",
    },
    {
      id: "underwater-city",
      name: "Ciudad Submarina",
      price: 150,
      description: "Civilización bajo el mar",
      preview: "/images/underwater-city-thumb.png",
    },
  ]

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
            setSelectedBackground(user.customization.background || "coral")
          }
        }
      }

      // Para compatibilidad con el código existente
      const savedMascot = localStorage.getItem("lakshmi_mascot")
      if (savedMascot) {
        const parsedMascot = JSON.parse(savedMascot)
        if (parsedMascot.background) {
          setSelectedBackground(parsedMascot.background)
        }
      }
    }
  }, [])

  const handleBackgroundSelect = (backgroundId: string) => {
    const background = backgrounds.find((b) => b.id === backgroundId)
    if (background && (background.price <= userPoints || backgroundId === selectedBackground)) {
      setSelectedBackground(backgroundId)
      setMascotMessage(`¡Excelente elección! El fondo ${background.name} le da un toque especial a tu aventura.`)
    } else if (background) {
      setMascotMessage(
        `Necesitas ${background.price} puntos para desbloquear el fondo ${background.name}. ¡Sigue completando lecciones y retos!`,
      )
    }
  }

  const saveCustomization = () => {
    if (!currentUser) return

    // Actualizar datos del usuario
    if (typeof window !== "undefined") {
      const storedUsers = localStorage.getItem("lakshmi_users")
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers)
        const updatedUsers = parsedUsers.map((user: UserData) => {
          if (user.id === currentUser.id) {
            return {
              ...user,
              customization: {
                ...user.customization,
                background: selectedBackground,
              },
            }
          }
          return user
        })

        localStorage.setItem("lakshmi_users", JSON.stringify(updatedUsers))

        // Para compatibilidad con el código existente
        const savedMascot = localStorage.getItem("lakshmi_mascot") || "{}"
        const parsedMascot = JSON.parse(savedMascot)
        localStorage.setItem(
          "lakshmi_mascot",
          JSON.stringify({
            ...parsedMascot,
            background: selectedBackground,
          }),
        )

        setMascotMessage("¡Personalización guardada! Tu fondo ha sido actualizado.")

        if (onCustomizationSaved) {
          onCustomizationSaved()
        }
      }
    }
  }

  return (
    <Card className="w-full shadow-lg border-teal-200">
      <CardHeader>
        <CardTitle className="text-xl text-teal-800">Personaliza el Fondo</CardTitle>
        <CardDescription>Usa tus puntos para cambiar el fondo de la aplicación</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex justify-center mb-6">
          <TurtleMascot className="w-20 h-20" message={mascotMessage} />
        </div>

        <div className="bg-teal-50 p-3 rounded-lg border border-teal-200 mb-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-teal-700">Tus puntos disponibles</p>
            <p className="text-xl font-bold text-teal-800">{userPoints}</p>
          </div>
          <img src="/images/pirate-coin.png" alt="Puntos" className="w-10 h-10" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {backgrounds.map((background) => (
            <motion.div
              key={background.id}
              whileHover={{ scale: background.price <= userPoints || background.id === selectedBackground ? 1.03 : 1 }}
              className={`rounded-lg border ${
                selectedBackground === background.id ? "border-teal-400" : "border-teal-200"
              } ${
                background.price <= userPoints || background.id === selectedBackground
                  ? "cursor-pointer"
                  : "opacity-60 cursor-not-allowed"
              } overflow-hidden`}
              onClick={() => handleBackgroundSelect(background.id)}
            >
              <div className="relative h-24">
                <img
                  src={background.preview || "/placeholder.svg"}
                  alt={background.name}
                  className="w-full h-full object-cover"
                />
                {selectedBackground === background.id && (
                  <div className="absolute top-2 right-2 bg-teal-500 rounded-full p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
                {background.price > 0 && background.price > userPoints && background.id !== selectedBackground && (
                  <div className="absolute top-2 right-2 bg-red-100 rounded-full p-1">
                    <Lock className="h-4 w-4 text-red-500" />
                  </div>
                )}
              </div>
              <div className="p-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-sm text-teal-800">{background.name}</h3>
                  {background.price > 0 && (
                    <Badge
                      className={`${
                        background.price <= userPoints ? "bg-teal-100 text-teal-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {background.price} pts
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-teal-600 truncate">{background.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={saveCustomization} className="w-full bg-teal-600 hover:bg-teal-700">
          Guardar cambios
        </Button>
      </CardFooter>
    </Card>
  )
}
