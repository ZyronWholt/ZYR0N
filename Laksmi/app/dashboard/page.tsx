"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TurtleMascot } from "@/components/turtle-mascot"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WalletConnector from "@/components/wallet-connector"
import CustomizeMascot from "@/components/customize-mascot"
import BackgroundCustomizer from "@/components/background-customizer"
import DailyChallenges from "@/components/daily-challenges"
import { ArrowLeft, Award, BookOpen, Wallet, PaintBucket, Target } from "lucide-react"
import type { UserData } from "@/components/user-manager"

export default function DashboardPage() {
  const router = useRouter()
  const [userPoints, setUserPoints] = useState(0)
  const [userName, setUserName] = useState("")
  const [mascotMessage, setMascotMessage] = useState(
    "¡Bienvenido a tu panel de control! Aquí puedes ver tu progreso, personalizar tu mascota y conectar tu wallet.",
  )
  const [currentUser, setCurrentUser] = useState<UserData | null>(null)
  const [backgroundImage, setBackgroundImage] = useState("/images/coral-bg.png")

  // Cargar datos del usuario
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
            setUserPoints(user.points)
            setUserName(user.name)

            // Cargar fondo personalizado
            const backgroundId = user.customization.background || "coral"
            setBackgroundImage(getBackgroundImage(backgroundId))
          }
        }
      } else {
        // Fallback para compatibilidad con código existente
        const userData = localStorage.getItem("lakshmi_user_data")
        if (userData) {
          const parsedData = JSON.parse(userData)
          setUserPoints(parsedData.points || 0)
        }

        const userInfo = localStorage.getItem("lakshmi_user")
        if (userInfo) {
          const parsedInfo = JSON.parse(userInfo)
          setUserName(parsedInfo.name || "")
        }

        // Cargar fondo personalizado
        const savedMascot = localStorage.getItem("lakshmi_mascot")
        if (savedMascot) {
          const parsedMascot = JSON.parse(savedMascot)
          if (parsedMascot.background) {
            setBackgroundImage(getBackgroundImage(parsedMascot.background))
          }
        }
      }
    }
  }, [])

  const getBackgroundImage = (backgroundId: string) => {
    switch (backgroundId) {
      case "deep-sea":
        return "/images/deep-sea-bg.png"
      case "tropical":
        return "/images/tropical-bg.png"
      case "shipwreck":
        return "/images/shipwreck-bg.png"
      case "underwater-city":
        return "/images/underwater-city-bg.png"
      default:
        return "/images/coral-bg.png"
    }
  }

  const handleTabChange = (value: string) => {
    if (value === "progress") {
      setMascotMessage("Aquí puedes ver tu progreso en las lecciones. ¡Sigue aprendiendo para desbloquear más niveles!")
    } else if (value === "customize-mascot") {
      setMascotMessage(
        "¡Personalízame con los puntos que has ganado! Puedes cambiarme de animal o añadirme accesorios.",
      )
    } else if (value === "customize-bg") {
      setMascotMessage("¡Personaliza el fondo de la aplicación! Elige entre diferentes ambientes submarinos.")
    } else if (value === "wallet") {
      setMascotMessage(
        "Conecta tu wallet para guardar tus logros en la blockchain. Puedes elegir entre Scroll y Mantle para tus contratos inteligentes.",
      )
    } else if (value === "challenges") {
      setMascotMessage("¡Completa retos diarios para ganar puntos extra y mantener tu racha!")
    }
  }

  const handlePointsEarned = (points: number) => {
    setUserPoints((prevPoints) => prevPoints + points)
  }

  const handleCustomizationSaved = () => {
    // Recargar la página para aplicar los cambios de fondo
    window.location.reload()
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center p-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm z-0"></div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/levels")}
            className="border-teal-300 text-teal-700 bg-white/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a niveles
          </Button>

          <div className="bg-white/90 p-3 rounded-lg border border-teal-200 flex items-center">
            <img src="/images/pirate-coin.png" alt="Puntos" className="w-8 h-8 mr-2" />
            <div>
              <p className="text-xs text-teal-600">Tus puntos</p>
              <p className="text-lg font-bold text-teal-800">{userPoints}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 p-4 rounded-lg border border-teal-200 mb-6">
          <div className="flex items-center gap-4">
            <TurtleMascot className="w-20 h-20" message={mascotMessage} />
            <div>
              <h1 className="text-2xl font-bold text-teal-800">¡Hola, {userName || "Navegante"}!</h1>
              <p className="text-teal-600">Bienvenido a tu panel de control de Lakshmi</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="progress" onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-5 mb-6 bg-white/80">
            <TabsTrigger value="progress" className="data-[state=active]:bg-teal-100">
              <BookOpen className="h-4 w-4 mr-2" />
              Progreso
            </TabsTrigger>
            <TabsTrigger value="challenges" className="data-[state=active]:bg-teal-100">
              <Target className="h-4 w-4 mr-2" />
              Retos
            </TabsTrigger>
            <TabsTrigger value="customize-mascot" className="data-[state=active]:bg-teal-100">
              <Award className="h-4 w-4 mr-2" />
              Mascota
            </TabsTrigger>
            <TabsTrigger value="customize-bg" className="data-[state=active]:bg-teal-100">
              <PaintBucket className="h-4 w-4 mr-2" />
              Fondo
            </TabsTrigger>
            <TabsTrigger value="wallet" className="data-[state=active]:bg-teal-100">
              <Wallet className="h-4 w-4 mr-2" />
              Wallet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress">
            <Card className="border-teal-200 shadow-lg bg-white/90">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                    <h3 className="font-medium text-teal-800 mb-2">Nivel Principiante</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-3 border border-teal-300">
                          1
                        </div>
                        <div className="flex-grow">
                          <p className="text-teal-700">Primeros pasos para ahorrar</p>
                        </div>
                        <img src="/images/pirate-coin.png" alt="Completado" className="w-6 h-6" />
                      </div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-3 border border-teal-300">
                          2
                        </div>
                        <div className="flex-grow">
                          <p className="text-teal-700">Creando un presupuesto simple</p>
                        </div>
                        <div className="w-6 h-6 rounded-full border-2 border-dashed border-teal-300"></div>
                      </div>
                      <div className="flex items-center opacity-60">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 border border-gray-300">
                          3
                        </div>
                        <div className="flex-grow">
                          <p className="text-gray-700">Identificando gastos hormiga</p>
                        </div>
                        <div className="w-6 h-6 rounded-full border-2 border-dashed border-gray-300"></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 opacity-60">
                    <h3 className="font-medium text-blue-800 mb-2">Nivel Medio</h3>
                    <p className="text-blue-700 text-sm">Completa el nivel Principiante para desbloquear</p>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 opacity-60">
                    <h3 className="font-medium text-indigo-800 mb-2">Nivel Avanzado</h3>
                    <p className="text-indigo-700 text-sm">Completa el nivel Medio para desbloquear</p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 opacity-60">
                    <h3 className="font-medium text-purple-800 mb-2">Nivel Experto</h3>
                    <p className="text-purple-700 text-sm">Completa el nivel Avanzado para desbloquear</p>
                  </div>

                  <Button onClick={() => router.push("/levels")} className="w-full bg-teal-600 hover:bg-teal-700">
                    Continuar aprendiendo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="challenges">
            <DailyChallenges onPointsEarned={handlePointsEarned} />
          </TabsContent>

          <TabsContent value="customize-mascot">
            <CustomizeMascot userPoints={userPoints} />
          </TabsContent>

          <TabsContent value="customize-bg">
            <BackgroundCustomizer userPoints={userPoints} onCustomizationSaved={handleCustomizationSaved} />
          </TabsContent>

          <TabsContent value="wallet">
            <WalletConnector />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
