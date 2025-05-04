"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TurtleMascot } from "@/components/turtle-mascot"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface QuizProps {
  lessonId: string
  level: string
  onComplete: (points: number) => void
}

// Datos de ejemplo para las preguntas por lección y nivel
const quizzesByLevel: Record<string, Record<string, any>> = {
  principiante: {
    "1": {
      question: "¿Cuál es una buena estrategia para empezar a ahorrar?",
      options: [
        "Esperar a tener mucho dinero para empezar a ahorrar",
        "Ahorrar pequeñas cantidades de forma constante",
        "Pedir préstamos para ahorrar más rápido",
        "Gastar todo el dinero y ahorrar el próximo mes",
      ],
      correctAnswer: 1,
      explanation:
        "Ahorrar pequeñas cantidades de forma constante es la mejor estrategia para comenzar. No necesitas grandes sumas para empezar a construir tu ahorro.",
    },
    "2": {
      question: "¿Para qué sirve principalmente un presupuesto?",
      options: [
        "Para gastar más dinero",
        "Para impresionar a los amigos",
        "Para ver dónde va tu dinero",
        "Para pedir más préstamos",
      ],
      correctAnswer: 2,
      explanation:
        "Un presupuesto te ayuda a visualizar y controlar dónde va tu dinero, lo que te permite tomar mejores decisiones financieras.",
    },
    "3": {
      question: "¿Qué son los gastos hormiga?",
      options: [
        "Gastos en comida para hormigas",
        "Pequeños gastos diarios que suman mucho al final del mes",
        "Gastos en insecticidas",
        "Grandes compras mensuales",
      ],
      correctAnswer: 1,
      explanation:
        "Los gastos hormiga son esos pequeños gastos diarios (como café, snacks, etc.) que parecen insignificantes pero suman mucho dinero al final del mes.",
    },
  },
  medio: {
    "1": {
      question: "¿Cuál es una ventaja de categorizar tu presupuesto?",
      options: [
        "Hace que gastes más dinero",
        "No tiene ninguna ventaja real",
        "Permite un mejor control de tus finanzas",
        "Complica innecesariamente tu vida financiera",
      ],
      correctAnswer: 2,
      explanation:
        "Categorizar tu presupuesto te permite tener un control más detallado de tus finanzas, identificando áreas donde puedes reducir gastos o aumentar el ahorro.",
    },
  },
  avanzado: {
    "1": {
      question: "¿Qué significa diversificar inversiones?",
      options: [
        "Invertir todo tu dinero en un solo lugar",
        "Repartir tus inversiones en diferentes tipos de activos",
        "Guardar todo tu dinero en efectivo",
        "Gastar todo tu dinero en diferentes cosas",
      ],
      correctAnswer: 1,
      explanation:
        "Diversificar significa distribuir tus inversiones entre diferentes tipos de activos para reducir el riesgo y aumentar las posibilidades de rendimiento.",
    },
  },
  experto: {
    "1": {
      question: "¿Qué es la correlación entre activos en un portafolio de inversión?",
      options: [
        "El precio total de todos los activos",
        "La cantidad de activos que tienes",
        "La relación entre cómo se mueven los precios de diferentes activos",
        "El rendimiento promedio de tus inversiones",
      ],
      correctAnswer: 2,
      explanation:
        "La correlación entre activos se refiere a cómo se relacionan los movimientos de precios entre diferentes inversiones, lo que es crucial para construir un portafolio diversificado.",
    },
  },
}

export default function Quiz({ lessonId, level, onComplete }: QuizProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [mascotMessage, setMascotMessage] = useState(
    "¡Vamos a poner a prueba lo que has aprendido! Selecciona la respuesta correcta.",
  )

  const quiz = quizzesByLevel[level]?.[lessonId]

  const handleSubmit = () => {
    if (selectedOption === null) return

    setIsAnswered(true)
    const correct = selectedOption === quiz.correctAnswer
    setIsCorrect(correct)

    if (correct) {
      setMascotMessage("¡Excelente! Has respondido correctamente. " + quiz.explanation)
      // Asignar puntos por respuesta correcta (10 puntos)
      setTimeout(() => onComplete(10), 3000)
    } else {
      setMascotMessage("¡Ups! Esa no es la respuesta correcta. " + quiz.explanation)
      // Asignar menos puntos por respuesta incorrecta (2 puntos)
      setTimeout(() => onComplete(2), 3000)
    }
  }

  if (!quiz) {
    return (
      <Card className="w-full shadow-lg border-teal-200 bg-white/90">
        <CardContent className="p-6 text-center">
          <p className="text-teal-800">No hay preguntas disponibles para esta lección.</p>
          <Button onClick={() => onComplete(0)} className="mt-4 bg-teal-600 hover:bg-teal-700">
            Continuar
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full shadow-lg border-teal-200 bg-white/90">
      <CardHeader>
        <CardTitle className="text-xl text-teal-800">Comprueba tu conocimiento</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex justify-center mb-6">
          <TurtleMascot className="w-20 h-20" message={mascotMessage} />
        </div>

        <div className="bg-teal-50 p-4 rounded-lg border border-teal-200 mb-6">
          <h3 className="font-medium text-teal-800 mb-3">{quiz.question}</h3>

          <RadioGroup
            value={selectedOption?.toString()}
            onValueChange={(value) => setSelectedOption(Number.parseInt(value))}
            className="space-y-3"
            disabled={isAnswered}
          >
            {quiz.options.map((option: string, index: number) => (
              <div
                key={index}
                className={`flex items-center space-x-2 p-3 rounded-lg border ${
                  isAnswered
                    ? index === quiz.correctAnswer
                      ? "border-green-300 bg-green-50"
                      : index === selectedOption
                        ? "border-red-300 bg-red-50"
                        : "border-teal-200"
                    : "border-teal-200 hover:bg-teal-100 transition-colors"
                }`}
              >
                <RadioGroupItem
                  value={index.toString()}
                  id={`option-${index}`}
                  className={
                    isAnswered && index === quiz.correctAnswer
                      ? "text-green-600"
                      : isAnswered && index === selectedOption
                        ? "text-red-600"
                        : ""
                  }
                />
                <Label
                  htmlFor={`option-${index}`}
                  className={`flex-grow cursor-pointer ${
                    isAnswered && index === quiz.correctAnswer
                      ? "text-green-800"
                      : isAnswered && index === selectedOption
                        ? "text-red-800"
                        : "text-teal-800"
                  }`}
                >
                  {option}
                </Label>
                {isAnswered && index === quiz.correctAnswer && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                {isAnswered && index === selectedOption && index !== quiz.correctAnswer && (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
            ))}
          </RadioGroup>
        </div>

        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg ${isCorrect ? "bg-green-100 border border-green-300" : "bg-amber-100 border border-amber-300"}`}
          >
            <p className={isCorrect ? "text-green-800" : "text-amber-800"}>{quiz.explanation}</p>
          </motion.div>
        )}
      </CardContent>

      <CardFooter>
        {!isAnswered ? (
          <Button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="w-full bg-teal-600 hover:bg-teal-700"
          >
            Comprobar respuesta
          </Button>
        ) : (
          <Button onClick={() => onComplete(isCorrect ? 10 : 2)} className="w-full bg-teal-600 hover:bg-teal-700">
            Continuar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
