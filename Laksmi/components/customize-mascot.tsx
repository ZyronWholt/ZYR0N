"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TurtleMascot } from "@/components/turtle-mascot"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Lock } from "lucide-react"

interface CustomizeMascotProps {
  userPoints: number
}

export default function CustomizeMascot({ userPoints = 0 }: CustomizeMascotProps) {
  const [mascotMessage, setMascotMessage] = useState(
    "¡Personalízame con los puntos que has ganado! Puedes cambiarme de animal o añadirme accesorios.",
  )
  const [selectedAnimal, setSelectedAnimal] = useState("turtle")
  const [selectedAccessory, setSelectedAccessory] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState("teal")

  const animals = [
    { id: "turtle", name: "Tortuga", price: 0, description: "Tu amigable guía marina" },
    { id: "fish", name: "Pez", price: 50, description: "Ágil y colorido compañero" },
    { id: "octopus", name: "Pulpo", price: 100, description: "Inteligente y multitarea" },
    { id: "crab", name: "Cangrejo", price: 150, description: "Protector de tesoros" },
    { id: "seahorse", name: "Caballito de mar", price: 200, description: "Elegante y místico" },
  ]

  const accessories = [
    { id: "none", name: "Ninguno", price: 0, description: "Sin accesorios" },
    { id: "hat", name: "Sombrero pirata", price: 30, description: "¡Arrr, marinero!" },
    { id: "glasses", name: "Gafas de sol", price: 40, description: "Estilo bajo el mar" },
    { id: "bow", name: "Lazo", price: 25, description: "Toque elegante" },
    { id: "necklace", name: "Collar de perlas", price: 60, description: "Tesoro del océano" },
  ]

  const colors = [
    { id: "teal", name: "Turquesa", price: 0, description: "Color clásico del mar" },
    { id: "blue", name: "Azul", price: 20, description: "Como el océano profundo" },
    { id: "purple", name: "Púrpura", price: 35, description: "Misterioso y elegante" },
    { id: "pink", name: "Rosa", price: 35, description: "Alegre y divertido" },
    { id: "green", name: "Verde", price: 20, description: "Como las algas marinas" },
  ]

  const handleAnimalSelect = (animalId: string) => {
    const animal = animals.find((a) => a.id === animalId)
    if (animal && (animal.price <= userPoints || animalId === selectedAnimal)) {
      setSelectedAnimal(animalId)
      setMascotMessage(`¡Has elegido ser un ${animal.name}! ${animal.description}`)
    } else if (animal) {
      setMascotMessage(
        `Necesitas ${animal.price} puntos para desbloquear el ${animal.name}. ¡Sigue completando lecciones!`,
      )
    }
  }

  const handleAccessorySelect = (accessoryId: string) => {
    const accessory = accessories.find((a) => a.id === accessoryId)
    if (accessory && (accessory.price <= userPoints || accessoryId === selectedAccessory || accessoryId === "none")) {
      setSelectedAccessory(accessoryId === "none" ? null : accessoryId)
      if (accessoryId === "none") {
        setMascotMessage("Has quitado todos los accesorios. ¡Luzco más natural!")
      } else {
        setMascotMessage(`¡Me encanta este ${accessory.name}! ${accessory.description}`)
      }
    } else if (accessory) {
      setMascotMessage(
        `Necesitas ${accessory.price} puntos para desbloquear el ${accessory.name}. ¡Sigue completando lecciones!`,
      )
    }
  }

  const handleColorSelect = (colorId: string) => {
    const color = colors.find((c) => c.id === colorId)
    if (color && (color.price <= userPoints || colorId === selectedColor)) {
      setSelectedColor(colorId)
      setMascotMessage(`¡Me encanta este color ${color.name}! ${color.description}`)
    } else if (color) {
      setMascotMessage(
        `Necesitas ${color.price} puntos para desbloquear el color ${color.name}. ¡Sigue completando lecciones!`,
      )
    }
  }

  const saveCustomization = () => {
    // Guardar personalización en localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "lakshmi_mascot",
        JSON.stringify({
          animal: selectedAnimal,
          accessory: selectedAccessory,
          color: selectedColor,
        }),
      )
      setMascotMessage("¡Personalización guardada! Me encanta mi nuevo look.")
    }
  }

  // Cargar personalización guardada
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMascot = localStorage.getItem("lakshmi_mascot")
      if (savedMascot) {
        const parsedMascot = JSON.parse(savedMascot)
        setSelectedAnimal(parsedMascot.animal || "turtle")
        setSelectedAccessory(parsedMascot.accessory || null)
        setSelectedColor(parsedMascot.color || "teal")
      }
    }
  }, [])

  return (
    <Card className="w-full max-w-md shadow-lg border-teal-200">
      <CardHeader>
        <CardTitle className="text-xl text-teal-800">Personaliza tu mascota</CardTitle>
        <CardDescription>Usa tus puntos para personalizar tu compañero de aprendizaje</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex justify-center mb-6">
          <TurtleMascot className="w-32 h-32" message={mascotMessage} />
        </div>

        <div className="bg-teal-50 p-3 rounded-lg border border-teal-200 mb-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-teal-700">Tus puntos disponibles</p>
            <p className="text-xl font-bold text-teal-800">{userPoints}</p>
          </div>
          <img src="/images/pirate-coin.png" alt="Puntos" className="w-10 h-10" />
        </div>

        <Tabs defaultValue="animal" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="animal">Animal</TabsTrigger>
            <TabsTrigger value="accessory">Accesorios</TabsTrigger>
            <TabsTrigger value="color">Color</TabsTrigger>
          </TabsList>

          <TabsContent value="animal" className="space-y-2">
            {animals.map((animal) => (
              <motion.div
                key={animal.id}
                whileHover={{ scale: animal.price <= userPoints || animal.id === selectedAnimal ? 1.02 : 1 }}
                className={`p-3 rounded-lg border ${
                  selectedAnimal === animal.id ? "bg-teal-100 border-teal-300" : "bg-white border-teal-200"
                } ${
                  animal.price <= userPoints || animal.id === selectedAnimal
                    ? "cursor-pointer"
                    : "opacity-60 cursor-not-allowed"
                }`}
                onClick={() => handleAnimalSelect(animal.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-teal-800">{animal.name}</h3>
                    <p className="text-sm text-teal-600">{animal.description}</p>
                  </div>
                  <div className="flex items-center">
                    {animal.price > 0 && (
                      <Badge
                        className={`mr-2 ${animal.price <= userPoints ? "bg-teal-100 text-teal-800" : "bg-red-100 text-red-800"}`}
                      >
                        {animal.price} pts
                      </Badge>
                    )}
                    {animal.price > userPoints && animal.id !== selectedAnimal && (
                      <Lock className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="accessory" className="space-y-2">
            {accessories.map((accessory) => (
              <motion.div
                key={accessory.id}
                whileHover={{
                  scale:
                    accessory.price <= userPoints || accessory.id === selectedAccessory || accessory.id === "none"
                      ? 1.02
                      : 1,
                }}
                className={`p-3 rounded-lg border ${
                  (selectedAccessory === accessory.id) || (accessory.id === "none" && selectedAccessory === null)
                    ? "bg-teal-100 border-teal-300"
                    : "bg-white border-teal-200"
                } ${
                  accessory.price <= userPoints || accessory.id === selectedAccessory || accessory.id === "none"
                    ? "cursor-pointer"
                    : "opacity-60 cursor-not-allowed"
                }`}
                onClick={() => handleAccessorySelect(accessory.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-teal-800">{accessory.name}</h3>
                    <p className="text-sm text-teal-600">{accessory.description}</p>
                  </div>
                  <div className="flex items-center">
                    {accessory.price > 0 && (
                      <Badge
                        className={`mr-2 ${accessory.price <= userPoints ? "bg-teal-100 text-teal-800" : "bg-red-100 text-red-800"}`}
                      >
                        {accessory.price} pts
                      </Badge>
                    )}
                    {accessory.price > userPoints && accessory.id !== selectedAccessory && accessory.id !== "none" && (
                      <Lock className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="color" className="space-y-2">
            {colors.map((color) => (
              <motion.div
                key={color.id}
                whileHover={{ scale: color.price <= userPoints || color.id === selectedColor ? 1.02 : 1 }}
                className={`p-3 rounded-lg border ${
                  selectedColor === color.id ? "bg-teal-100 border-teal-300" : "bg-white border-teal-200"
                } ${
                  color.price <= userPoints || color.id === selectedColor
                    ? "cursor-pointer"
                    : "opacity-60 cursor-not-allowed"
                }`}
                onClick={() => handleColorSelect(color.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-teal-800">{color.name}</h3>
                    <p className="text-sm text-teal-600">{color.description}</p>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full bg-${color.id}-500 mr-2`}></div>
                    {color.price > 0 && (
                      <Badge
                        className={`mr-2 ${color.price <= userPoints ? "bg-teal-100 text-teal-800" : "bg-red-100 text-red-800"}`}
                      >
                        {color.price} pts
                      </Badge>
                    )}
                    {color.price > userPoints && color.id !== selectedColor && (
                      <Lock className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter>
        <Button onClick={saveCustomization} className="w-full bg-teal-600 hover:bg-teal-700">
          Guardar personalización
        </Button>
      </CardFooter>
    </Card>
  )
}
