"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TurtleMascot } from "@/components/turtle-mascot"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Anchor, Compass, Map, Skull, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

function LevelsPage() {
  const router = useRouter()
  const [mascotMessage, setMascotMessage] = useState(
    "¡Elige tu nivel de aventura financiera! Cada nivel tiene tesoros de conocimiento por descubrir.",
  )
  const [userPoints, setUserPoints] = useState(0)

  // Obtener los datos del usuario del localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("lakshmi_user_data")
      if (userData) {
        const parsedData = JSON.parse(userData)
        setUserPoints(parsedData.points || 0)
      }
    }
  }, [])

  // Estado para controlar qué niveles están desbloqueados
  const [unlockedLevels, setUnlockedLevels] = useState({
    principiante: true, // El nivel principiante siempre está desbloqueado
    medio: false,
    avanzado: false,
    experto: false,
  })

  // Verificar niveles completados al cargar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const completedLevels = localStorage.getItem("lakshmi_completed_levels")
      if (completedLevels) {
        const parsedLevels = JSON.parse(completedLevels)
        setUnlockedLevels({
          principiante: true,
          medio: parsedLevels.includes("principiante"),
          avanzado: parsedLevels.includes("medio"),
          experto: parsedLevels.includes("avanzado"),
        })
      }
    }
  }, [])

  const levels = [
    {
      id: "principiante",
      title: "Nivel Principiante",
      description: "Primeros pasos en el mar de las finanzas",
      icon: <Anchor className="h-8 w-8 text-teal-600" />,
      color: "from-teal-100 to-blue-100",
      borderColor: "border-teal-300",
      hoverColor: "hover:bg-teal-100",
    },
    {
      id: "medio",
      title: "Nivel Medio",
      description: "Navegando con confianza",
      icon: <Compass className="h-8 w-8 text-blue-600" />,
      color: "from-blue-100 to-teal-100",
      borderColor: "border-blue-300",
      hoverColor: "hover:bg-blue-100",
    },
    {
      id: "avanzado",
      title: "Nivel Avanzado",
      description: "Explorando aguas profundas",
      icon: <Map className="h-8 w-8 text-indigo-600" />,
      color: "from-indigo-100 to-blue-100",
      borderColor: "border-indigo-300",
      hoverColor: "hover:bg-indigo-100",
    },
    {
      id: "experto",
      title: "Nivel Experto",
      description: "Capitán del tesoro financiero",
      icon: <Skull className="h-8 w-8 text-purple-600" />,
      color: "from-purple-100 to-indigo-100",
      borderColor: "border-purple-300",
      hoverColor: "hover:bg-purple-100",
    },
  ]

  const handleLevelSelect = (levelId: string) => {
    // Verificar si el nivel está desbloqueado
    if (unlockedLevels[levelId as keyof typeof unlockedLevels]) {
      // Guardar el nivel actual en localStorage
      localStorage.setItem("lakshmi_current_level", levelId)
      router.push(`/lessons/${levelId}`)
    } else {
      // Mostrar mensaje de nivel bloqueado
      setMascotMessage(`¡Este nivel está bloqueado! Debes completar el nivel anterior primero para desbloquearlo.`)
    }
  }

  const handleHover = (levelId: string) => {
    if (!unlockedLevels[levelId as keyof typeof unlockedLevels]) {
      setMascotMessage(`Este nivel está bloqueado. Completa el nivel anterior para desbloquearlo.`)
      return
    }

    const messages: Record<string, string> = {
      principiante:
        "Perfecto para quienes están comenzando su viaje financiero. ¡Todos fuimos principiantes alguna vez!",
      medio: "Ya conoces lo básico, ahora vamos a profundizar en estrategias más efectivas.",
      avanzado: "Para navegantes experimentados que buscan optimizar sus finanzas personales.",
      experto: "¡Arrr! Solo los más valientes se aventuran en estas aguas. Conocimientos avanzados te esperan.",
    }
    setMascotMessage(messages[levelId])
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center justify-center p-4 bg-[url('/images/coral-bg.png')] bg-cover bg-center">
      <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm z-0"></div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="border-teal-300 bg-white/90 text-teal-700 hover:bg-teal-50"
            >
              Volver al Menú
            </Button>
            <div className="flex justify-center">
              <TurtleMascot className="w-24 h-24" message={mascotMessage} />
            </div>
          </div>

          <div className="bg-white/90 p-3 rounded-lg border border-teal-200 flex items-center">
            <img src="/images/pirate-coin.png" alt="Puntos" className="w-8 h-8 mr-2" />
            <div>
              <p className="text-xs text-teal-600">Tus puntos</p>
              <p className="text-lg font-bold text-teal-800">{userPoints}</p>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-teal-800 mb-8">Elige tu Nivel de Aventura</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {levels.map((level, index) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: unlockedLevels[level.id as keyof typeof unlockedLevels] ? 1.03 : 1 }}
              onMouseEnter={() => handleHover(level.id)}
            >
              <Card
                className={`cursor-pointer border-2 ${level.borderColor} bg-gradient-to-br ${level.color} 
                  ${unlockedLevels[level.id as keyof typeof unlockedLevels] ? level.hoverColor : "opacity-60"} 
                  transition-all duration-300`}
                onClick={() => handleLevelSelect(level.id)}
              >
                <CardContent className="p-6 flex items-center">
                  <div className="bg-white p-3 rounded-full mr-4">{level.icon}</div>
                  <div>
                    <h2 className="text-xl font-bold text-teal-800">{level.title}</h2>
                    <p className="text-teal-600">{level.description}</p>
                    {!unlockedLevels[level.id as keyof typeof unlockedLevels] && (
                      <Badge className="mt-2 bg-red-100 text-red-800 border-red-300">
                        <Lock className="h-3 w-3 mr-1" /> Bloqueado
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center text-teal-700 bg-white/80 p-4 rounded-lg border border-teal-200">
          <p>Debes completar cada nivel antes de poder avanzar al siguiente.</p>
        </div>
      </div>
    </div>
  )
}

export default LevelsPage
