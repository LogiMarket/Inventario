"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Filter } from "lucide-react"

export interface FilterValues {
  responsable: string
  objeto: string
  modelo: string
  codigoBarras: string
  area: string
  estadoEquipo: string
}

interface AdvancedFiltersProps {
  filters: FilterValues
  onFilterChange: (filters: FilterValues) => void
  areas: string[]
  responsables: string[]
}

export default function AdvancedFilters({ filters, onFilterChange, areas, responsables }: AdvancedFiltersProps) {
  const handleChange = (field: keyof FilterValues, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value,
    })
  }

  const handleClearAll = () => {
    onFilterChange({
      responsable: "",
      objeto: "",
      modelo: "",
      area: "",
      codigoBarras: "",
      estadoEquipo: "",
    })
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== "")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros Avanzados
            </CardTitle>
            <CardDescription>Busca equipos por criterios específicos</CardDescription>
          </div>
          {hasActiveFilters && (
            <Button onClick={handleClearAll} variant="outline" size="sm" className="gap-2 bg-transparent">
              <X className="h-4 w-4" />
              Limpiar Filtros
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="filter-responsable">Responsable</Label>
            <Select value={filters.responsable} onValueChange={(value) => handleChange("responsable", value)}>
              <SelectTrigger id="filter-responsable">
                <SelectValue placeholder="Selecciona responsable" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {responsables.map((resp) => (
                  <SelectItem key={resp} value={resp}>
                    {resp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter-objeto">Objeto</Label>
            <Input
              id="filter-objeto"
              type="text"
              placeholder="Ej: Laptop"
              value={filters.objeto}
              onChange={(e) => handleChange("objeto", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter-modelo">Modelo</Label>
            <Input
              id="filter-modelo"
              type="text"
              placeholder="Ej: Dell XPS"
              value={filters.modelo}
              onChange={(e) => handleChange("modelo", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter-barras">Código de barras</Label>
            <Input
              id="filter-barras"
              type="text"
              placeholder="Ej: CB-001234"
              value={filters.codigoBarras}
              onChange={(e) => handleChange("codigoBarras", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter-area">Área</Label>
            <Select value={filters.area} onValueChange={(value) => handleChange("area", value)}>
              <SelectTrigger id="filter-area">
                <SelectValue placeholder="Selecciona área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {areas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter-estado">Estado del equipo</Label>
            <Select value={filters.estadoEquipo} onValueChange={(value) => handleChange("estadoEquipo", value)}>
              <SelectTrigger id="filter-estado">
                <SelectValue placeholder="Selecciona estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="en_reparacion">En reparación</SelectItem>
                <SelectItem value="dado_de_baja">Dado de baja</SelectItem>
                <SelectItem value="regresa_al_almacen">Regresa al Almacén</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
