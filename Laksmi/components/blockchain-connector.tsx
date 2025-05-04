"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function BlockchainConnector() {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)

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
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Error al conectar con MetaMask")
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg border-amber-200">
      <CardHeader>
        <CardTitle className="text-xl text-amber-800">Conecta tu Wallet</CardTitle>
        <CardDescription>Conecta tu wallet de MetaMask para guardar tu progreso en la blockchain</CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isMetaMaskInstalled && (
          <Alert className="mb-4 bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">MetaMask no detectado</AlertTitle>
            <AlertDescription className="text-amber-700">
              Para utilizar todas las funciones de Lakshmi, necesitas instalar la extensión MetaMask.
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 text-amber-600 hover:underline"
              >
                Descargar MetaMask
              </a>
            </AlertDescription>
          </Alert>
        )}

        {isConnected ? (
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <Wallet className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-amber-800">Wallet conectada</h3>
                <p className="text-sm text-amber-600 truncate">{account}</p>
              </div>
            </div>
          </div>
        ) : (
          <Button
            onClick={connectWallet}
            className="w-full bg-amber-600 hover:bg-amber-700"
            disabled={!isMetaMaskInstalled}
          >
            <Wallet className="mr-2 h-4 w-4" />
            Conectar con MetaMask
          </Button>
        )}
      </CardContent>

      <CardFooter className="text-sm text-amber-700">
        Tus logros y progreso se guardarán de forma segura en la blockchain.
      </CardFooter>
    </Card>
  )
}
