import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, Building, Calendar } from "lucide-react"

interface InventarioItem {
  id: number
  created_at: string
  responsable: string
  area: string
  estado_equipo: string | null
  fecha_garantia: string | null
}

interface InventoryStatsProps {
  data: InventarioItem[]
}

export default function InventoryStats({ data }: InventoryStatsProps) {
  const totalEquipos = data.length
  const totalResponsables = new Set(data.map((item) => item.responsable)).size
  const totalAreas = new Set(data.map((item) => item.area)).size

  const activos = data.filter((item) => (item.estado_equipo ?? "").toLowerCase() === "activo").length
  const hoy = new Date()
  const conGarantiaVigente = data.filter((item) => {
    if (!item.fecha_garantia) return false
    const fecha = new Date(item.fecha_garantia)
    return fecha >= hoy
  }).length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Equipos</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEquipos}</div>
          <p className="text-xs text-muted-foreground">Registrados en el sistema</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Responsables</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalResponsables}</div>
          <p className="text-xs text-muted-foreground">Personas a cargo</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Áreas</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAreas}</div>
          <p className="text-xs text-muted-foreground">Departamentos activos</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Activos</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activos}</div>
          <p className="text-xs text-muted-foreground">Marcados como activos</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Garantía vigente</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{conGarantiaVigente}</div>
          <p className="text-xs text-muted-foreground">Equipos con garantía al día</p>
        </CardContent>
      </Card>
    </div>
  )
}
