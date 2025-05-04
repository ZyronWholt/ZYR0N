"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { TurtleMascot } from "@/components/turtle-mascot"
import { motion } from "framer-motion"
import { Anchor, ArrowLeft, Compass, Map, Skull } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function LessonsMapPage() {
  const params = useParams()
  const router = useRouter()
  const level = params.level as string

  const [mascotMessage, setMascotMessage] = useState("")
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null)

  // Datos de ejemplo para las lecciones por nivel
  const levelData: Record<string, { title: string; icon: JSX.Element; color: string }> = {
    principiante: {
      title: "Nivel Principiante",
      icon: <Anchor className="h-6 w-6 text-teal-600" />,
      color: "bg-teal-100",
    },
    medio: {
      title: "Nivel Medio",
      icon: <Compass className="h-6 w-6 text-blue-600" />,
      color: "bg-blue-100",
    },
    avanzado: {
      title: "Nivel Avanzado",
      icon: <Map className="h-6 w-6 text-indigo-600" />,
      color: "bg-indigo-100",
    },
    experto: {
      title: "Nivel Experto",
      icon: <Skull className="h-6 w-6 text-purple-600" />,
      color: "bg-purple-100",
    },
  }

  const currentLevel = levelData[level] || levelData.principiante

  // Lecciones de ejemplo para cada nivel
  const lessonsByLevel: Record<
    string,
    Array<{ id: number; title: string; description: string; completed: boolean }>
  > = {
    principiante: [
      {
        id: 1,
        title: "Primeros pasos para ahorrar",
        description: "Aprende cómo empezar a ahorrar desde cero",
        completed: true,
      },
      {
        id: 2,
        title: "Creando un presupuesto simple",
        description: "Organiza tus ingresos y gastos de forma sencilla",
        completed: false,
      },
      {
        id: 3,
        title: "Identificando gastos hormiga",
        description: "Descubre esos pequeños gastos que suman mucho",
        completed: false,
      },
      {
        id: 4,
        title: "Metas financieras a corto plazo",
        description: "Establece objetivos alcanzables",
        completed: false,
      },
      {
        id: 5,
        title: "Evitando deudas innecesarias",
        description: "Aprende a distinguir entre deudas buenas y malas",
        completed: false,
      },
    ],
    medio: [
      { id: 1, title: "Presupuesto avanzado", description: "Técnicas efectivas de presupuesto", completed: false },
      { id: 2, title: "Ahorro automático", description: "Configura sistemas de ahorro sin esfuerzo", completed: false },
      { id: 3, title: "Fondo de emergencia", description: "Crea tu red de seguridad financiera", completed: false },
      {
        id: 4,
        title: "Reducción de deudas",
        description: "Estrategias para salir de deudas más rápido",
        completed: false,
      },
      {
        id: 5,
        title: "Primeros pasos en inversión",
        description: "Conceptos básicos para comenzar a invertir",
        completed: false,
      },
    ],
    avanzado: [
      {
        id: 1,
        title: "Estrategias de inversión",
        description: "Diversificación y gestión de riesgos",
        completed: false,
      },
      {
        id: 2,
        title: "Planificación para el retiro",
        description: "Prepárate para tu futuro financiero",
        completed: false,
      },
      {
        id: 3,
        title: "Optimización fiscal",
        description: "Aprovecha los beneficios fiscales legales",
        completed: false,
      },
      {
        id: 4,
        title: "Inversiones alternativas",
        description: "Explora opciones más allá de lo tradicional",
        completed: false,
      },
      { id: 5, title: "Protección patrimonial", description: "Asegura tus activos y tu familia", completed: false },
    ],
    experto: [
      {
        id: 1,
        title: "Estrategias avanzadas de inversión",
        description: "Técnicas sofisticadas para maximizar rendimientos",
        completed: false,
      },
      {
        id: 2,
        title: "Planificación patrimonial",
        description: "Gestión y transferencia de riqueza",
        completed: false,
      },
      {
        id: 3,
        title: "Inversiones internacionales",
        description: "Diversificación global de activos",
        completed: false,
      },
      {
        id: 4,
        title: "Estrategias fiscales complejas",
        description: "Optimización fiscal para patrimonios importantes",
        completed: false,
      },
      {
        id: 5,
        title: "Finanzas y tecnología blockchain",
        description: "Oportunidades en el mundo cripto y DeFi",
        completed: false,
      },
    ],
  }

  const lessons = lessonsByLevel[level] || lessonsByLevel.principiante

  useEffect(() => {
    setMascotMessage(
      `¡Bienvenido al mapa de lecciones del ${currentLevel.title}! Selecciona una lección para ver más detalles.`,
    )
  }, [level, currentLevel.title])

  const handleLessonClick = (lessonId: number) => {
    setSelectedLesson(lessonId)
    const lesson = lessons.find((l) => l.id === lessonId)
    if (lesson) {
      setMascotMessage(
        `Lección ${lessonId}: ${lesson.title}. ${lesson.description}. ¡Haz clic en "Comenzar" para iniciar esta aventura!`,
      )
    }
  }

  const startLesson = () => {
    if (selectedLesson) {
      router.push(`/lessons/${level}/${selectedLesson}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center p-4 bg-[url('/images/coral-bg.png')] bg-cover bg-center">
      <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm z-0"></div>

      <div className="w-full max-w-4xl relative z-10 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <div className="bg-white/90 p-4 rounded-lg border border-teal-200 mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${currentLevel.color} mr-3`}>{currentLevel.icon}</div>
              <h1 className="text-2xl font-bold text-teal-800">{currentLevel.title}</h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/levels")}
              className="border-teal-300 text-teal-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>

          <div className="bg-white/90 p-6 rounded-lg border border-teal-200">
            <div className="relative">
              {/* Camino de lecciones con temática pirata */}
              <div className="absolute top-0 bottom-0 left-12 border-l-2 border-dashed border-teal-400 z-0"></div>

              <div className="space-y-8 relative z-10">
                {lessons.map((lesson, index) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`flex ${selectedLesson === lesson.id ? "bg-teal-50" : ""} rounded-lg p-2 transition-colors duration-300`}
                  >
                    <div className="mr-4 relative">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                          lesson.completed ? "bg-teal-500" : "bg-blue-400"
                        } cursor-pointer transition-transform hover:scale-110`}
                        onClick={() => handleLessonClick(lesson.id)}
                      >
                        {lesson.completed ? (
                          <img
                            src="/images/pirate-coin.png"
                            alt="Completado"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          lesson.id
                        )}
                      </div>
                    </div>

                    <div className="flex-1 cursor-pointer" onClick={() => handleLessonClick(lesson.id)}>
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold text-teal-800">{lesson.title}</h3>
                        {lesson.completed && (
                          <Badge className="ml-2 bg-teal-100 text-teal-800 border-teal-300">Completado</Badge>
                        )}
                      </div>
                      <p className="text-teal-600">{lesson.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/3">
          <div className="bg-white/90 p-4 rounded-lg border border-teal-200 sticky top-4">
            <div className="flex justify-center mb-4">
              <TurtleMascot className="w-20 h-20" message={mascotMessage} />
            </div>

            {selectedLesson && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                <h3 className="text-xl font-bold text-teal-800 mb-2">Lección {selectedLesson}</h3>

                <div className="bg-teal-50 p-3 rounded-lg border border-teal-200 mb-4">
                  <h4 className="font-semibold text-teal-700">{lessons.find((l) => l.id === selectedLesson)?.title}</h4>
                  <p className="text-teal-600 text-sm mt-1">
                    {lessons.find((l) => l.id === selectedLesson)?.description}
                  </p>
                </div>

                <Separator className="my-4" />

                <Button onClick={startLesson} className="w-full bg-teal-600 hover:bg-teal-700">
                  Comenzar Lección
                </Button>
              </motion.div>
            )}

            {!selectedLesson && (
              <div className="text-center text-teal-700 p-4">
                <p>Selecciona una lección del mapa para ver más detalles</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
