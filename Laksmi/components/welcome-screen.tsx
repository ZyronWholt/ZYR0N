"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TurtleMascot } from "@/components/turtle-mascot"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import UserRegistrationForm from "@/components/user-registration-form"
import Tutorial from "@/components/tutorial"

export default function WelcomeScreen() {
  const [step, setStep] = useState<"welcome" | "registration" | "tutorial">("welcome")

  return (
    <div className="p-6 flex flex-col items-center">
      {step === "welcome" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-20 h-20">
              <motion.div
                animate={{
                  y: [0, -5, 0],
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 5,
                  ease: "easeInOut",
                }}
              >
                <img src="/images/bubbles.png" alt="Burbujas" className="w-full h-full object-contain" />
              </motion.div>
            </div>
            <TurtleMascot className="w-32 h-32 mb-4" />
            <div className="absolute -bottom-5 -right-10 w-20 h-20">
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  x: [0, 5, 0],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 6,
                  ease: "easeInOut",
                }}
              >
                <img src="/images/seaweed.png" alt="Algas" className="w-full h-full object-contain" />
              </motion.div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-teal-800 mb-2">¡Bienvenido a Lakshmi!</h1>
          <p className="text-teal-700 mb-6">
            Tu compañera para aprender finanzas personales de manera sencilla y sin complicaciones.
          </p>
          <Button onClick={() => setStep("registration")} className="bg-teal-600 hover:bg-teal-700">
            Comenzar mi viaje financiero
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      )}

      {step === "registration" && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <UserRegistrationForm onComplete={() => setStep("tutorial")} />
        </motion.div>
      )}

      {step === "tutorial" && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <Tutorial />
        </motion.div>
      )}
    </div>
  )
}
