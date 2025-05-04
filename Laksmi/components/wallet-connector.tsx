"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TurtleMascot } from "@/components/turtle-mascot"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function WalletConnector() {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)
  const [mascotMessage, setMascotMessage] = useState(
    "¡Conecta tu wallet para guardar tus logros en la blockchain! Puedes elegir entre Scroll y Mantle para tus contratos inteligentes.",
  )
  const [activeTab, setActiveTab] = useState("wallet")

  useEffect(() => {
    // Comprobar si MetaMask está instalado
    if (typeof window !== "undefined") {
      setIsMetaMaskInstalled(!!window.ethereum)

      // Comprobar si ya hay una conexión activa
      if (window.ethereum) {
        window.ethereum
          .request({ method: "eth_accounts" })
          .then((accounts: string[]) => {
            if (accounts.length > 0) {
              setAccount(accounts[0])
              setIsConnected(true)
            }
          })
          .catch((err: Error) => {
            console.error(err)
          })
      }
    }
  }, [])

  const connectWallet = async () => {
    setError(null)

    if (!window.ethereum) {
      setError("Por favor instala MetaMask para continuar.")
      return
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      setAccount(accounts[0])
      setIsConnected(true)
      setMascotMessage(
        "¡Excelente! Tu wallet está conectada. Ahora puedes crear contratos inteligentes para guardar tus logros.",
      )
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Error al conectar con MetaMask")
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)

    if (value === "scroll") {
      setMascotMessage(
        "Scroll es una solución de escalabilidad Layer 2 para Ethereum que utiliza tecnología ZK-Rollup. Ofrece transacciones rápidas y de bajo costo, ideal para aplicaciones educativas como Lakshmi.",
      )
    } else if (value === "mantle") {
      setMascotMessage(
        "Mantle es una red Layer 2 que combina la seguridad de Ethereum con bajas tarifas de gas. Su enfoque en la descentralización lo hace perfecto para guardar tus logros educativos de forma segura.",
      )
    } else {
      setMascotMessage(
        "¡Conecta tu wallet para guardar tus logros en la blockchain! Puedes elegir entre Scroll y Mantle para tus contratos inteligentes.",
      )
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg border-teal-200">
      <CardHeader>
        <CardTitle className="text-xl text-teal-800">Conecta tu Wallet</CardTitle>
        <CardDescription>Guarda tu progreso en la blockchain y crea contratos inteligentes</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex justify-center mb-6">
          <TurtleMascot className="w-20 h-20" message={mascotMessage} />
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isMetaMaskInstalled && (
          <Alert className="mb-4 bg-teal-50 border-teal-200">
            <AlertCircle className="h-4 w-4 text-teal-600" />
            <AlertTitle className="text-teal-800">MetaMask no detectado</AlertTitle>
            <AlertDescription className="text-teal-700">
              Para utilizar todas las funciones de Lakshmi, necesitas instalar la extensión MetaMask.
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 text-teal-600 hover:underline"
              >
                Descargar MetaMask
              </a>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="wallet" value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="scroll" disabled={!isConnected}>
              Scroll
            </TabsTrigger>
            <TabsTrigger value="mantle" disabled={!isConnected}>
              Mantle
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallet">
            {isConnected ? (
              <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                <div className="flex items-center gap-3">
                  <div className="bg-teal-100 p-2 rounded-full">
                    <Wallet className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-teal-800">Wallet conectada</h3>
                    <p className="text-sm text-teal-600 truncate">{account}</p>
                  </div>
                </div>
              </div>
            ) : (
              <Button
                onClick={connectWallet}
                className="w-full bg-teal-600 hover:bg-teal-700"
                disabled={!isMetaMaskInstalled}
              >
                <Wallet className="mr-2 h-4 w-4" />
                Conectar con MetaMask
              </Button>
            )}
          </TabsContent>

          <TabsContent value="scroll">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-800 mb-1">Sobre Scroll</h3>
                    <p className="text-blue-700 text-sm">
                      Scroll es una solución de escalabilidad Layer 2 para Ethereum que utiliza tecnología ZK-Rollup.
                      Ofrece transacciones rápidas y de bajo costo, manteniendo la seguridad de Ethereum.
                    </p>
                    <Separator className="my-2" />
                    <h4 className="font-medium text-blue-800 mb-1">Beneficios:</h4>
                    <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
                      <li>Transacciones rápidas y económicas</li>
                      <li>Compatible con aplicaciones de Ethereum</li>
                      <li>Alta seguridad heredada de Ethereum</li>
                      <li>Ideal para aplicaciones educativas como Lakshmi</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700">Crear contrato en Scroll</Button>
            </div>
          </TabsContent>

          <TabsContent value="mantle">
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-purple-800 mb-1">Sobre Mantle</h3>
                    <p className="text-purple-700 text-sm">
                      Mantle es una red Layer 2 que combina la seguridad de Ethereum con bajas tarifas de gas. Está
                      diseñada para ser altamente descentralizada y eficiente.
                    </p>
                    <Separator className="my-2" />
                    <h4 className="font-medium text-purple-800 mb-1">Beneficios:</h4>
                    <ul className="text-sm text-purple-700 list-disc pl-5 space-y-1">
                      <li>Enfoque en la descentralización</li>
                      <li>Bajas tarifas de transacción</li>
                      <li>Ecosistema en crecimiento</li>
                      <li>Perfecto para guardar logros educativos de forma segura</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-700">Crear contrato en Mantle</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="text-sm text-teal-700">
        Tus logros y progreso se guardarán de forma segura en la blockchain.
      </CardFooter>
    </Card>
  )
}
