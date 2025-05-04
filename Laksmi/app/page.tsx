import { Card, CardContent } from "@/components/ui/card"
import UserManager from "@/components/user-manager"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Lakshmi - Educación Financiera",
  description: "Aprende finanzas personales de manera sencilla y empática",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center justify-center p-4 bg-[url('/images/coral-bg.png')] bg-cover bg-center">
      <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm z-0"></div>
      <Card className="w-full max-w-md shadow-lg border-teal-200 relative z-10 bg-blue-50/90">
        <CardContent className="p-6">
          <UserManager />
        </CardContent>
      </Card>
    </main>
  )
}
