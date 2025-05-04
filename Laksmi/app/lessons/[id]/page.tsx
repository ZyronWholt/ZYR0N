"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TurtleMascot } from "@/components/turtle-mascot"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb, Target, Quote } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Datos de ejemplo para las lecciones
const lessons = [
  {
    id: "1",
    title: "Cómo empezar a ahorrar",
    tip: "No necesitas mucho dinero para empezar. Incluso 5 pesos diarios ayudan.",
    challenge: "Intenta ahorrar 10 pesos hoy.",
    quote: "Cada peso ahorrado es un paso hacia tus metas.",
    mascotMessage:
      "¡Bienvenido a tu primera lección! Recuerda que el ahorro no se trata de grandes cantidades, sino de constancia.",
  },
  {
    id: "2",
    title: "Presupuesto básico",
    tip: "Un presupuesto simple te ayuda a ver dónde va tu dinero.",
    challenge: "Anota todos tus gastos de hoy.",
    quote: "Conocer tus gastos es el primer paso para controlarlos.",
    mascotMessage:
      "¡Excelente! Ahora aprenderemos a crear un presupuesto sencillo para tener más control sobre tu dinero.",
  },
  {
    id: "3",
    title: "Reducir gastos hormiga",
    tip: "Los pequeños gastos diarios suman mucho al final del mes.",
    challenge: "Identifica tres gastos pequeños que podrías reducir.",
    quote: "Las pequeñas decisiones de hoy construyen tu futuro financiero.",
    mascotMessage: "¿Sabías que esos pequeños gastos diarios pueden sumar mucho dinero? Vamos a identificarlos juntos.",
  },
]

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = params.id as string

  const [lesson, setLesson] = useState(lessons.find((l) => l.id === lessonId))
  const [challengeCompleted, setChallengeCompleted] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const [mascotMessage, setMascotMessage] = useState("")

  useEffect(() => {
    // Actualizar la lección cuando cambia el ID
    const currentLesson = lessons.find((l) => l.id === lessonId)
    setLesson(currentLesson)

    if (currentLesson) {
      setMascotMessage(currentLesson.mascotMessage)
    }

    // Resetear estados
    setChallengeCompleted(false)
    setShowReward(false)
  }, [lessonId])

  const handleChallengeComplete = () => {
    setChallengeCompleted(true)
    setMascotMessage("¡Excelente trabajo! Has completado el reto. Estoy muy orgullosa de ti.")

    // Mostrar recompensa después de un momento
    setTimeout(() => {
      setShowReward(true)
    }, 1500)
  }

  const goToNextLesson = () => {
    const nextLessonId = String(Number(lessonId) + 1)
    if (lessons.find((l) => l.id === nextLessonId)) {
      router.push(`/lessons/${nextLessonId}`)
    } else {
      // Si no hay más lecciones, volver al inicio
      router.push("/")
    }
  }

  const goToPreviousLesson = () => {
    const prevLessonId = String(Number(lessonId) - 1)
    if (prevLessonId === "0") {
      router.push("/")
    } else if (lessons.find((l) => l.id === prevLessonId)) {
      router.push(`/lessons/${prevLessonId}`)
    }
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-amber-200">
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl font-bold text-amber-800 mb-4">Lección no encontrada</h1>
            <Button onClick={() => router.push("/")} className="bg-amber-600 hover:bg-amber-700">
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-amber-200">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center mb-2">
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
              Lección {lessonId}
            </Badge>
            <Progress value={Number(lessonId) * 33} className="w-32 h-2 bg-amber-100" />
          </div>
          <CardTitle className="text-xl text-amber-800">{lesson.title}</CardTitle>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex justify-center mb-6">
            <TurtleMascot className="w-24 h-24" message={mascotMessage} />
          </div>

          <div className="space-y-6">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800 mb-1">Consejo útil:</h3>
                  <p className="text-amber-700">{lesson.tip}</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800 mb-1">Reto práctico:</h3>
                  <p className="text-amber-700 mb-3">{lesson.challenge}</p>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="challenge"
                      checked={challengeCompleted}
                      onCheckedChange={() => handleChallengeComplete()}
                    />
                    <Label htmlFor="challenge" className="text-sm font-medium text-amber-700">
                      He completado este reto
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-start gap-3">
                <Quote className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800 mb-1">Frase motivadora:</h3>
                  <p className="text-amber-700 italic">"{lesson.quote}"</p>
                </div>
              </div>
            </div>

            {showReward && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Alert className="bg-amber-100 border-amber-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      ¡Has ganado una moneda de oro! Sigue así para desbloquear más recompensas.
                    </AlertDescription>
                  </div>
                </Alert>
              </motion.div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between pt-2">
          <Button
            variant="outline"
            onClick={goToPreviousLesson}
            className="border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>

          <Button onClick={goToNextLesson} disabled={!challengeCompleted} className="bg-amber-600 hover:bg-amber-700">
            Siguiente
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
