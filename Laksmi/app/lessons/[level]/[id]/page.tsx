"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TurtleMascot } from "@/components/turtle-mascot"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Lightbulb, Target, Quote } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Quiz from "./quiz"

// Datos de ejemplo para las lecciones por nivel
const lessonsByLevel: Record<string, Record<string, any>> = {
  principiante: {
    "1": {
      title: "Primeros pasos para ahorrar",
      tip: "No necesitas mucho dinero para empezar. Incluso 5 pesos diarios ayudan.",
      challenge: "Intenta ahorrar 10 pesos hoy.",
      quote: "Cada peso ahorrado es un paso hacia tus metas.",
      mascotMessage:
        "¡Bienvenido a tu primera lección! Recuerda que el ahorro no se trata de grandes cantidades, sino de constancia.",
    },
    "2": {
      title: "Creando un presupuesto simple",
      tip: "Un presupuesto simple te ayuda a ver dónde va tu dinero.",
      challenge: "Anota todos tus gastos de hoy.",
      quote: "Conocer tus gastos es el primer paso para controlarlos.",
      mascotMessage:
        "¡Excelente! Ahora aprenderemos a crear un presupuesto sencillo para tener más control sobre tu dinero.",
    },
    "3": {
      title: "Identificando gastos hormiga",
      tip: "Los pequeños gastos diarios suman mucho al final del mes.",
      challenge: "Identifica tres gastos pequeños que podrías reducir.",
      quote: "Las pequeñas decisiones de hoy construyen tu futuro financiero.",
      mascotMessage:
        "¿Sabías que esos pequeños gastos diarios pueden sumar mucho dinero? Vamos a identificarlos juntos.",
    },
  },
  medio: {
    "1": {
      title: "Presupuesto avanzado",
      tip: "Divide tu presupuesto en categorías específicas para un mejor control.",
      challenge: "Crea un presupuesto con al menos 5 categorías diferentes.",
      quote: "Un buen presupuesto es como un mapa del tesoro: te muestra el camino hacia la riqueza.",
      mascotMessage:
        "¡Ahora vamos a profundizar en técnicas más avanzadas de presupuesto! Esto te dará mayor control sobre tu dinero.",
    },
  },
  avanzado: {
    "1": {
      title: "Estrategias de inversión",
      tip: "Diversificar tus inversiones reduce el riesgo y aumenta las posibilidades de rendimiento.",
      challenge: "Investiga sobre tres diferentes tipos de inversiones.",
      quote: "Invertir en conocimiento produce siempre el mejor interés.",
      mascotMessage:
        "¡Es hora de hacer que tu dinero trabaje para ti! Vamos a explorar el fascinante mundo de las inversiones.",
    },
  },
  experto: {
    "1": {
      title: "Estrategias avanzadas de inversión",
      tip: "Considera la correlación entre diferentes clases de activos al construir tu portafolio.",
      challenge: "Analiza la diversificación de tu portafolio actual.",
      quote: "La paciencia es la clave de la inversión exitosa.",
      mascotMessage:
        "¡Bienvenido al nivel experto! Aquí exploraremos estrategias sofisticadas para optimizar tus inversiones.",
    },
  },
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const level = params.level as string
  const lessonId = params.id as string

  const [lesson, setLesson] = useState<any>(null)
  const [challengeCompleted, setChallengeCompleted] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [mascotMessage, setMascotMessage] = useState("")
  const [userPoints, setUserPoints] = useState(0)
  const [lessonCompleted, setLessonCompleted] = useState(false)

  useEffect(() => {
    // Obtener la lección actual
    const currentLesson = lessonsByLevel[level]?.[lessonId]
    setLesson(currentLesson)

    if (currentLesson) {
      setMascotMessage(currentLesson.mascotMessage)
    }

    // Obtener puntos del usuario
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("lakshmi_user_data")
      if (userData) {
        const parsedData = JSON.parse(userData)
        setUserPoints(parsedData.points || 0)
      }
    }

    // Verificar si la lección ya está completada
    if (typeof window !== "undefined") {
      const completedLessons = localStorage.getItem(`lakshmi_completed_lessons_${level}`)
      if (completedLessons) {
        const parsedLessons = JSON.parse(completedLessons)
        if (parsedLessons.includes(lessonId)) {
          setLessonCompleted(true)
        }
      }
    }

    // Resetear estados
    setChallengeCompleted(false)
    setShowReward(false)
    setShowQuiz(false)
  }, [level, lessonId])

  const handleChallengeComplete = () => {
    setChallengeCompleted(true)
    setMascotMessage("¡Excelente trabajo! Has completado el reto. Ahora vamos a poner a prueba lo que has aprendido.")

    // Mostrar recompensa después de un momento
    setTimeout(() => {
      setShowReward(true)

      // Mostrar quiz después de otro momento
      setTimeout(() => {
        setShowQuiz(true)
      }, 2000)
    }, 1500)
  }

  const handleQuizComplete = (points: number) => {
    // Actualizar puntos del usuario
    const newPoints = userPoints + points
    setUserPoints(newPoints)

    // Guardar puntos en localStorage
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("lakshmi_user_data") || "{}"
      const parsedData = JSON.parse(userData)
      parsedData.points = newPoints
      localStorage.setItem("lakshmi_user_data", JSON.stringify(parsedData))

      // Marcar lección como completada
      const completedLessons = localStorage.getItem(`lakshmi_completed_lessons_${level}`) || "[]"
      const parsedLessons = JSON.parse(completedLessons)
      if (!parsedLessons.includes(lessonId)) {
        parsedLessons.push(lessonId)
        localStorage.setItem(`lakshmi_completed_lessons_${level}`, JSON.stringify(parsedLessons))
      }

      // Verificar si se completó todo el nivel
      const allLessonsInLevel = Object.keys(lessonsByLevel[level] || {})
      if (allLessonsInLevel.every((id) => parsedLessons.includes(id))) {
        // Marcar nivel como completado
        const completedLevels = localStorage.getItem("lakshmi_completed_levels") || "[]"
        const parsedLevels = JSON.parse(completedLevels)
        if (!parsedLevels.includes(level)) {
          parsedLevels.push(level)
          localStorage.setItem("lakshmi_completed_levels", JSON.stringify(parsedLevels))
        }
      }
    }

    setLessonCompleted(true)
    setShowQuiz(false)
    setMascotMessage(
      `¡Felicidades! Has completado esta lección y ganado ${points} puntos. Puedes continuar con la siguiente lección o repasar esta.`,
    )
  }

  const goToNextLesson = () => {
    const nextLessonId = String(Number(lessonId) + 1)
    if (lessonsByLevel[level]?.[nextLessonId]) {
      router.push(`/lessons/${level}/${nextLessonId}`)
    } else {
      // Si no hay más lecciones, volver al mapa de lecciones
      router.push(`/lessons/${level}`)
    }
  }

  const goBack = () => {
    router.push(`/lessons/${level}`)
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center justify-center p-4 bg-[url('/images/coral-bg.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm z-0"></div>
        <Card className="w-full max-w-md shadow-lg border-teal-200 relative z-10 bg-white/90">
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl font-bold text-teal-800 mb-4">Lección no encontrada</h1>
            <Button onClick={goBack} className="bg-teal-600 hover:bg-teal-700">
              Volver al mapa de lecciones
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center justify-center p-4 bg-[url('/images/coral-bg.png')] bg-cover bg-center">
      <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm z-0"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Contador de puntos */}
        <div className="absolute top-0 right-0 -mt-12 bg-white/90 p-2 rounded-lg border border-teal-200 flex items-center">
          <img src="/images/pirate-coin.png" alt="Puntos" className="w-6 h-6 mr-2" />
          <div>
            <p className="text-xs text-teal-600">Tus puntos</p>
            <p className="text-lg font-bold text-teal-800">{userPoints}</p>
          </div>
        </div>

        {showQuiz ? (
          <Quiz lessonId={lessonId} level={level} onComplete={handleQuizComplete} />
        ) : (
          <Card className="w-full shadow-lg border-teal-200 bg-white/90">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center mb-2">
                <Badge variant="outline" className="bg-teal-100 text-teal-800 border-teal-300">
                  Lección {lessonId}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goBack}
                  className="text-teal-700 hover:text-teal-800 hover:bg-teal-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </div>
              <CardTitle className="text-xl text-teal-800">{lesson.title}</CardTitle>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex justify-center mb-6">
                <TurtleMascot className="w-24 h-24" message={mascotMessage} />
              </div>

              <div className="space-y-6">
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-teal-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-teal-800 mb-1">Consejo útil:</h3>
                      <p className="text-teal-700">{lesson.tip}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-teal-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-teal-800 mb-1">Reto práctico:</h3>
                      <p className="text-teal-700 mb-3">{lesson.challenge}</p>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="challenge"
                          checked={challengeCompleted || lessonCompleted}
                          onCheckedChange={() => !lessonCompleted && handleChallengeComplete()}
                          disabled={lessonCompleted}
                        />
                        <Label htmlFor="challenge" className="text-sm font-medium text-teal-700">
                          He completado este reto
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                  <div className="flex items-start gap-3">
                    <Quote className="h-5 w-5 text-teal-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-teal-800 mb-1">Frase motivadora:</h3>
                      <p className="text-teal-700 italic">"{lesson.quote}"</p>
                    </div>
                  </div>
                </div>

                {showReward && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Alert className="bg-teal-100 border-teal-300">
                      <div className="flex items-center gap-2">
                        <img src="/images/pirate-coin.png" alt="Moneda pirata" className="w-8 h-8" />
                        <AlertDescription className="text-teal-800">
                          ¡Has ganado una moneda de oro pirata! Sigue así para desbloquear más tesoros.
                        </AlertDescription>
                      </div>
                    </Alert>
                  </motion.div>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex justify-between pt-2">
              <Button variant="outline" onClick={goBack} className="border-teal-300 text-teal-700 hover:bg-teal-100">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>

              <Button
                onClick={goToNextLesson}
                disabled={!challengeCompleted && !lessonCompleted}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {lessonCompleted ? "Siguiente lección" : showReward ? "Continuar" : "Completar"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
