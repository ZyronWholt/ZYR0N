"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TurtleMascot } from "@/components/turtle-mascot"
import { motion } from "framer-motion"
import { ArrowRight, BookOpen, Award, Target, Wallet } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function Tutorial() {
  const [step, setStep] = useState(0)
  const router = useRouter()

  const tutorialSteps = [
    {
      title: "¡Bienvenido a Lakshmi!",
      message:
        "¡Felicidades por tomar la decisión de empezar a ahorrar! Estoy aquí para ayudarte en tu viaje financiero.",
      icon: <BookOpen className="h-10 w-10 text-teal-600" />,
      content:
        "Lakshmi es una app diseñada para enseñarte finanzas personales de manera sencilla y empática. Iremos poco a poco, a tu ritmo, para que puedas aprender sin presiones.",
    },
    {
      title: "Aprenderás paso a paso",
      message: "Esta app está diseñada para ir poco a poco en tu aprendizaje, con estrategias y consejos prácticos.",
      icon: <Target className="h-10 w-10 text-teal-600" />,
      content:
        "Las lecciones están organizadas por niveles: Principiante, Medio, Avanzado y Experto. Cada nivel tiene su propia temática pirata y tesoros por descubrir.",
    },
    {
      title: "Protégete de estafas",
      message: "También aprenderás a identificar y evitar estafas financieras comunes. ¡La seguridad es importante!",
      icon: <Award className="h-10 w-10 text-teal-600" />,
      content:
        "Dependiendo de tu nivel de experiencia, te enseñaré diferentes estrategias para proteger tu dinero y reconocer posibles fraudes financieros.",
    },
    {
      title: "Recompensas y logros",
      message: "¡Cada lección completada te dará una moneda de oro pirata! Colecciónalas todas en tu viaje.",
      icon: <Wallet className="h-10 w-10 text-teal-600" />,
      content:
        "Al completar cada lección, recibirás una moneda de oro con temática pirata. Estas monedas marcarán tu progreso y te motivarán a seguir aprendiendo.",
    },
  ]

  const currentStep = tutorialSteps[step]

  const handleNext = () => {
    if (step < tutorialSteps.length - 1) {
      setStep(step + 1)
    } else {
      // Redirigir a la pantalla de selección de nivel
      router.push("/levels")
    }
  }

  return (
    <div className="flex flex-col items-center">
      <TurtleMascot className="w-24 h-24 mb-4" message={currentStep.message} />

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Card className="border-teal-200 mb-6 bg-gradient-to-br from-blue-50 to-teal-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center mb-4">
              {currentStep.icon}
              <h2 className="text-xl font-semibold text-teal-800 mt-2">{currentStep.title}</h2>
            </div>
            <p className="text-teal-700 text-center">{currentStep.content}</p>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {tutorialSteps.map((_, index) => (
              <div key={index} className={`h-2 w-2 rounded-full ${index === step ? "bg-teal-600" : "bg-teal-200"}`} />
            ))}
          </div>

          <Button onClick={handleNext} className="bg-teal-600 hover:bg-teal-700">
            {step < tutorialSteps.length - 1 ? "Siguiente" : "Comenzar Lecciones"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
