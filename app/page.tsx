import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Zap, Package } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logimarket-logo.png" alt="Logimarket" width={200} height={50} className="h-12 w-auto" />
          </div>
          <div className="flex gap-3">
            <Button asChild variant="ghost">
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/registro">Registrarse</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-balance">
            Sistema de Gestión de Inventario
            <span className="block text-primary mt-2">Automatizado y Eficiente</span>
          </h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Controla, actualiza y gestiona todos los equipos de tu organización en un solo lugar. Búsqueda avanzada,
            reportes en tiempo real y total seguridad.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/registro">Comenzar Ahora</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-transparent">
              <Link href="/login">Acceder</Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <Zap className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Búsqueda Rápida</h3>
            <p className="text-muted-foreground">
              Encuentra equipos por año, responsable, modelo, número de serie o área en segundos.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <Shield className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Seguro y Confiable</h3>
            <p className="text-muted-foreground">
              Autenticación robusta y políticas de seguridad que protegen tu información.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <Package className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Control Total</h3>
            <p className="text-muted-foreground">
              Agrega, actualiza y elimina registros con una interfaz intuitiva y eficiente.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
