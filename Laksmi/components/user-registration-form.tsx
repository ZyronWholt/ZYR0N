"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TurtleMascot } from "@/components/turtle-mascot"
import { ArrowRight, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserRegistrationFormProps {
  onComplete: () => void
}

export default function UserRegistrationForm({ onComplete }: UserRegistrationFormProps) {
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [experience, setExperience] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mascotMessage, setMascotMessage] = useState(
    "¡Hola! Me encantaría conocerte mejor. ¿Podrías compartir algunos datos conmigo?",
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMascotMessage("¡Genial! Estoy muy emocionada de comenzar este viaje contigo, " + name + ".")

    // Simular guardado de datos
    setTimeout(() => {
      setIsSubmitting(false)
      // Aquí se guardarían los datos del usuario
      localStorage.setItem("lakshmi_user", JSON.stringify({ name, age, experience }))

      // Esperar un momento para que el usuario lea el mensaje
      setTimeout(onComplete, 2000)
    }, 1500)
  }

  const isFormValid = name.trim() !== "" && age.trim() !== "" && experience !== ""

  return (
    <div className="flex flex-col items-center">
      <TurtleMascot className="w-24 h-24 mb-4" message={mascotMessage} />

      <h2 className="text-xl font-semibold text-teal-800 mb-4">Cuéntame sobre ti</h2>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-teal-700">
            ¿Cómo te llamas?
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            className="border-teal-200 focus:border-teal-400 focus:ring-teal-400"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age" className="text-teal-700">
            ¿Cuántos años tienes?
          </Label>
          <Input
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Tu edad"
            type="number"
            min="1"
            max="120"
            className="border-teal-200 focus:border-teal-400 focus:ring-teal-400"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience" className="text-teal-700">
            ¿Cuál es tu experiencia con finanzas personales?
          </Label>
          <Select value={experience} onValueChange={setExperience}>
            <SelectTrigger id="experience" className="border-teal-200 focus:border-teal-400 focus:ring-teal-400">
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="principiante">Principiante - Estoy empezando desde cero</SelectItem>
              <SelectItem value="medio">Medio - Conozco lo básico</SelectItem>
              <SelectItem value="avanzado">Avanzado - Manejo mis finanzas pero quiero mejorar</SelectItem>
              <SelectItem value="experto">Experto - Busco conocimientos específicos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 mt-6"
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              Continuar
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
