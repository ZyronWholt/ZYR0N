"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TurtleMascot } from "@/components/turtle-mascot"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PlusCircle, LogOut, User, UserPlus, Users, Sparkles } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export interface UserData {
  id: string
  name: string
  avatar?: string
  age?: string
  experience?: string
  points: number
  completedLevels: string[]
  completedLessons: Record<string, string[]>
  streakDays: number
  lastLogin: string
  challenges: {
    active: Array<{
      id: string
      title: string
      description: string
      reward: number
      deadline: string
      completed: boolean
    }>
    completed: string[]
  }
  customization: {
    animal: string
    accessory: string | null
    color: string
    background: string
  }
}

// Perfiles predefinidos
const predefinedProfiles: Omit<UserData, "id">[] = [
  {
    name: "Explorador Novato",
    avatar: "/images/avatars/explorer.png",
    age: "25",
    experience: "principiante",
    points: 10,
    completedLevels: [],
    completedLessons: { principiante: ["1"] },
    streakDays: 1,
    lastLogin: new Date().toISOString().split("T")[0],
    challenges: {
      active: [
        {
          id: "daily-1",
          title: "Ahorro diario",
          description: "Guarda una pequeña cantidad hoy",
          reward: 5,
          deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          completed: false,
        },
        {
          id: "weekly-1",
          title: "Presupuesto semanal",
          description: "Crea un presupuesto para esta semana",
          reward: 15,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          completed: false,
        },
      ],
      completed: [],
    },
    customization: {
      animal: "turtle",
      accessory: null,
      color: "teal",
      background: "coral",
    },
  },
  {
    name: "Capitán Ahorrador",
    avatar: "/images/avatars/captain.png",
    age: "30",
    experience: "medio",
    points: 50,
    completedLevels: ["principiante"],
    completedLessons: { principiante: ["1", "2", "3"], medio: ["1"] },
    streakDays: 5,
    lastLogin: new Date().toISOString().split("T")[0],
    challenges: {
      active: [
        {
          id: "daily-2",
          title: "Revisión de gastos",
          description: "Revisa tus gastos del día anterior",
          reward: 5,
          deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          completed: false,
        },
        {
          id: "weekly-2",
          title: "Análisis de inversiones",
          description: "Investiga una opción de inversión",
          reward: 20,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          completed: false,
        },
      ],
      completed: ["daily-1", "weekly-1"],
    },
    customization: {
      animal: "fish",
      accessory: "hat",
      color: "blue",
      background: "deep-sea",
    },
  },
  {
    name: "Inversionista Experto",
    avatar: "/images/avatars/investor.png",
    age: "35",
    experience: "experto",
    points: 150,
    completedLevels: ["principiante", "medio", "avanzado"],
    completedLessons: {
      principiante: ["1", "2", "3", "4", "5"],
      medio: ["1", "2", "3"],
      avanzado: ["1", "2"],
    },
    streakDays: 12,
    lastLogin: new Date().toISOString().split("T")[0],
    challenges: {
      active: [
        {
          id: "daily-3",
          title: "Análisis de mercado",
          description: "Revisa el comportamiento de un activo",
          reward: 10,
          deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          completed: false,
        },
        {
          id: "weekly-3",
          title: "Estrategia de diversificación",
          description: "Planifica una estrategia de diversificación",
          reward: 25,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          completed: false,
        },
      ],
      completed: ["daily-1", "weekly-1", "daily-2", "weekly-2"],
    },
    customization: {
      animal: "octopus",
      accessory: "glasses",
      color: "purple",
      background: "underwater-city",
    },
  },
]

export default function UserManager() {
  const router = useRouter()
  const [users, setUsers] = useState<UserData[]>([])
  const [currentUser, setCurrentUser] = useState<UserData | null>(null)
  const [newUserName, setNewUserName] = useState("")
  const [newUserAge, setNewUserAge] = useState("")
  const [newUserExperience, setNewUserExperience] = useState("")
  const [mascotMessage, setMascotMessage] = useState("¡Bienvenido a Lakshmi! Selecciona tu perfil o crea uno nuevo.")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"existing" | "predefined">("existing")

  // Cargar usuarios al iniciar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUsers = localStorage.getItem("lakshmi_users")
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers)
        setUsers(parsedUsers)
      }

      const currentUserId = localStorage.getItem("lakshmi_current_user_id")
      if (currentUserId) {
        const storedUsers = localStorage.getItem("lakshmi_users")
        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers)
          const user = parsedUsers.find((u: UserData) => u.id === currentUserId)
          if (user) {
            setCurrentUser(user)

            // Actualizar fecha de último login
            updateUserLastLogin(user.id)
          }
        }
      }
    }
  }, [])

  // Actualizar la fecha del último login
  const updateUserLastLogin = (userId: string) => {
    const today = new Date().toISOString().split("T")[0]

    if (typeof window !== "undefined") {
      const storedUsers = localStorage.getItem("lakshmi_users")
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers)
        const updatedUsers = parsedUsers.map((user: UserData) => {
          if (user.id === userId) {
            // Verificar si es un nuevo día para actualizar la racha
            const lastLoginDate = user.lastLogin ? new Date(user.lastLogin) : null
            const currentDate = new Date()

            // Si es el primer login o si el último login fue ayer, incrementar la racha
            if (
              !lastLoginDate ||
              Math.floor((currentDate.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24)) === 1
            ) {
              return {
                ...user,
                lastLogin: today,
                streakDays: (user.streakDays || 0) + 1,
              }
            }
            // Si han pasado más días, reiniciar la racha
            else if (
              lastLoginDate &&
              Math.floor((currentDate.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24)) > 1
            ) {
              return {
                ...user,
                lastLogin: today,
                streakDays: 1,
              }
            }
            // Si es el mismo día, mantener la racha
            return {
              ...user,
              lastLogin: today,
            }
          }
          return user
        })

        localStorage.setItem("lakshmi_users", JSON.stringify(updatedUsers))
        setUsers(updatedUsers)

        // Actualizar el usuario actual si es necesario
        if (currentUser && currentUser.id === userId) {
          const updatedUser = updatedUsers.find((u: UserData) => u.id === userId)
          if (updatedUser) {
            setCurrentUser(updatedUser)
          }
        }
      }
    }
  }

  // Modificar la función createNewUser para establecer la edad mínima
  const createNewUser = () => {
    if (!newUserName.trim()) return

    // Verificar que la edad sea al menos 17 años
    const age = Number.parseInt(newUserAge)
    if (isNaN(age) || age < 17) {
      setMascotMessage("La edad mínima para crear un perfil es de 17 años.")
      return
    }

    const newUser: UserData = {
      id: Date.now().toString(),
      name: newUserName,
      age: newUserAge,
      experience: newUserExperience,
      points: 0,
      completedLevels: [],
      completedLessons: {},
      streakDays: 1,
      lastLogin: new Date().toISOString().split("T")[0],
      challenges: {
        active: [
          {
            id: "daily-1",
            title: "Ahorro diario",
            description: "Guarda una pequeña cantidad hoy",
            reward: 5,
            deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            completed: false,
          },
          {
            id: "weekly-1",
            title: "Presupuesto semanal",
            description: "Crea un presupuesto para esta semana",
            reward: 15,
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            completed: false,
          },
        ],
        completed: [],
      },
      customization: {
        animal: "turtle",
        accessory: null,
        color: "teal",
        background: "coral",
      },
    }

    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    setCurrentUser(newUser)
    localStorage.setItem("lakshmi_users", JSON.stringify(updatedUsers))
    localStorage.setItem("lakshmi_current_user_id", newUser.id)

    // Limpiar formulario
    setNewUserName("")
    setNewUserAge("")
    setNewUserExperience("")
    setIsDialogOpen(false)

    setMascotMessage(`¡Bienvenido, ${newUser.name}! Estoy emocionada de acompañarte en tu viaje financiero.`)
  }

  const selectUser = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    if (user) {
      setCurrentUser(user)
      localStorage.setItem("lakshmi_current_user_id", userId)

      // Actualizar datos del usuario en localStorage para compatibilidad con el resto de la app
      localStorage.setItem(
        "lakshmi_user",
        JSON.stringify({
          name: user.name,
          age: user.age,
          experience: user.experience,
        }),
      )

      localStorage.setItem(
        "lakshmi_user_data",
        JSON.stringify({
          points: user.points,
        }),
      )

      if (user.completedLevels.length > 0) {
        localStorage.setItem("lakshmi_completed_levels", JSON.stringify(user.completedLevels))
      }

      // Guardar lecciones completadas por nivel
      Object.keys(user.completedLessons).forEach((level) => {
        localStorage.setItem(`lakshmi_completed_lessons_${level}`, JSON.stringify(user.completedLessons[level]))
      })

      // Guardar personalización
      localStorage.setItem("lakshmi_mascot", JSON.stringify(user.customization))

      setMascotMessage(`¡Hola de nuevo, ${user.name}! Continuemos donde lo dejamos.`)

      // Actualizar fecha de último login
      updateUserLastLogin(userId)
    }
  }

  const selectPredefinedProfile = (profileIndex: number) => {
    const profile = predefinedProfiles[profileIndex]

    // Crear un nuevo usuario basado en el perfil predefinido
    const newUser: UserData = {
      ...profile,
      id: Date.now().toString(),
    }

    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    setCurrentUser(newUser)
    localStorage.setItem("lakshmi_users", JSON.stringify(updatedUsers))
    localStorage.setItem("lakshmi_current_user_id", newUser.id)

    // Actualizar datos del usuario en localStorage para compatibilidad con el resto de la app
    localStorage.setItem(
      "lakshmi_user",
      JSON.stringify({
        name: newUser.name,
        age: newUser.age,
        experience: newUser.experience,
      }),
    )

    localStorage.setItem(
      "lakshmi_user_data",
      JSON.stringify({
        points: newUser.points,
      }),
    )

    if (newUser.completedLevels.length > 0) {
      localStorage.setItem("lakshmi_completed_levels", JSON.stringify(newUser.completedLevels))
    }

    // Guardar lecciones completadas por nivel
    Object.keys(newUser.completedLessons).forEach((level) => {
      localStorage.setItem(`lakshmi_completed_lessons_${level}`, JSON.stringify(newUser.completedLessons[level]))
    })

    // Guardar personalización
    localStorage.setItem("lakshmi_mascot", JSON.stringify(newUser.customization))

    setMascotMessage(`¡Bienvenido, ${newUser.name}! Tu perfil está listo para comenzar.`)
  }

  const logoutUser = () => {
    setCurrentUser(null)
    localStorage.removeItem("lakshmi_current_user_id")
    setMascotMessage("¡Hasta pronto! Selecciona un perfil para continuar.")
  }

  const continueToApp = () => {
    if (currentUser) {
      router.push("/dashboard")
    }
  }

  const getExperienceBadge = (experience: string) => {
    switch (experience) {
      case "principiante":
        return <Badge className="bg-teal-100 text-teal-800">Principiante</Badge>
      case "medio":
        return <Badge className="bg-blue-100 text-blue-800">Intermedio</Badge>
      case "avanzado":
        return <Badge className="bg-indigo-100 text-indigo-800">Avanzado</Badge>
      case "experto":
        return <Badge className="bg-purple-100 text-purple-800">Experto</Badge>
      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg border-teal-200">
      <CardHeader>
        <CardTitle className="text-xl text-teal-800">Perfiles de Usuario</CardTitle>
        <CardDescription>Selecciona tu perfil o crea uno nuevo</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex justify-center mb-6">
          <TurtleMascot className="w-24 h-24" message={mascotMessage} />
        </div>

        {currentUser ? (
          <div className="space-y-4">
            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200 flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-3 bg-teal-200">
                  {currentUser.avatar ? (
                    <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                  ) : (
                    <AvatarFallback>{currentUser.name.charAt(0).toUpperCase()}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h3 className="font-medium text-teal-800">{currentUser.name}</h3>
                  <div className="flex items-center text-xs text-teal-600">
                    <div className="flex items-center mr-3">
                      <img src="/images/pirate-coin.png" alt="Puntos" className="w-4 h-4 mr-1" />
                      {currentUser.points} puntos
                    </div>
                    {currentUser.streakDays > 0 && (
                      <div className="flex items-center">
                        <span className="text-amber-500 mr-1">🔥</span>
                        Racha: {currentUser.streakDays} {currentUser.streakDays === 1 ? "día" : "días"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={logoutUser}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button onClick={continueToApp} className="flex-1 bg-teal-600 hover:bg-teal-700">
                Continuar
              </Button>
              <Button
                variant="outline"
                onClick={logoutUser}
                className="flex-1 border-teal-300 text-teal-700 hover:bg-teal-50"
              >
                Volver al Menú
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Tabs defaultValue="existing" onValueChange={(value) => setActiveTab(value as "existing" | "predefined")}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="existing">Perfiles Guardados</TabsTrigger>
                <TabsTrigger value="predefined">Perfiles Predefinidos</TabsTrigger>
              </TabsList>

              <TabsContent value="existing">
                {users.length > 0 ? (
                  <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                    <h3 className="font-medium text-teal-800 mb-3 flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Tus perfiles
                    </h3>
                    <ScrollArea className="h-[220px]">
                      <div className="space-y-2">
                        {users.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-3 rounded-md hover:bg-teal-100 cursor-pointer border border-transparent hover:border-teal-300 transition-all"
                            onClick={() => selectUser(user.id)}
                          >
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-3 bg-teal-200">
                                {user.avatar ? (
                                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                ) : (
                                  <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <p className="font-medium text-teal-800">{user.name}</p>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center text-xs text-teal-600">
                                    <img src="/images/pirate-coin.png" alt="Puntos" className="w-3 h-3 mr-1" />
                                    {user.points}
                                  </div>
                                  {user.streakDays > 0 && (
                                    <span className="text-xs">
                                      <span className="text-amber-500 mr-1">🔥</span>
                                      {user.streakDays}d
                                    </span>
                                  )}
                                  {user.experience && (
                                    <span className="text-xs">{getExperienceBadge(user.experience)}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <User className="h-4 w-4 text-teal-600" />
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                ) : (
                  <div className="bg-teal-50 p-4 rounded-lg border border-teal-200 text-center text-teal-700">
                    <p>No tienes perfiles guardados.</p>
                    <p className="text-sm mt-1">Crea uno nuevo o usa un perfil predefinido.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="predefined">
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                  <h3 className="font-medium text-teal-800 mb-3 flex items-center">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Perfiles predefinidos
                  </h3>
                  <ScrollArea className="h-[220px]">
                    <div className="space-y-3">
                      {predefinedProfiles.map((profile, index) => (
                        <div
                          key={index}
                          className="flex items-start p-3 rounded-md hover:bg-teal-100 cursor-pointer border border-transparent hover:border-teal-300 transition-all"
                          onClick={() => selectPredefinedProfile(index)}
                        >
                          <Avatar className="h-12 w-12 mr-3">
                            {profile.avatar ? (
                              <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                            ) : (
                              <AvatarFallback>{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-teal-800">{profile.name}</p>
                              {getExperienceBadge(profile.experience || "")}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-teal-600 mb-1">
                              <div className="flex items-center">
                                <img src="/images/pirate-coin.png" alt="Puntos" className="w-3 h-3 mr-1" />
                                {profile.points} puntos
                              </div>
                              {profile.streakDays > 0 && (
                                <div className="flex items-center">
                                  <span className="text-amber-500 mr-1">🔥</span>
                                  Racha: {profile.streakDays}d
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-teal-700">
                              {profile.completedLevels.length > 0
                                ? `${profile.completedLevels.length} niveles completados`
                                : "Principiante"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
            </Tabs>

            <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={() => setIsDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Crear nuevo perfil
            </Button>

            {/* Diálogo independiente para crear perfil */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle className="text-teal-800">Crear nuevo perfil</DialogTitle>
                  <DialogDescription>Ingresa tus datos básicos para comenzar.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-teal-700">
                      ¿Cómo te llamas?
                    </Label>
                    <Input
                      id="name"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="Tu nombre"
                      className="border-teal-200 focus:border-teal-400 focus:ring-teal-400"
                      required
                      autoFocus
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-teal-700">
                      ¿Cuántos años tienes? (mínimo 17)
                    </Label>
                    <Input
                      id="age"
                      value={newUserAge}
                      onChange={(e) => setNewUserAge(e.target.value)}
                      placeholder="Tu edad"
                      type="number"
                      min="17"
                      className="border-teal-200 focus:border-teal-400 focus:ring-teal-400"
                      required
                    />
                    <p className="text-xs text-teal-600">Debes tener al menos 17 años para usar esta aplicación.</p>
                  </div>
                </div>

                <DialogFooter className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false)
                      setNewUserName("")
                      setNewUserAge("")
                    }}
                    className="border-teal-300 text-teal-700"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    onClick={createNewUser}
                    className="bg-teal-600 hover:bg-teal-700"
                    disabled={!newUserName.trim() || !newUserAge.trim()}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Crear perfil
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
