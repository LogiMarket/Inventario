"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface InventarioItem {
  id: number
  responsable: string
  area: string
  objeto: string
  modelo: string
  codigo_barras: string
  observaciones: string | null
  garantia: string | null
  fecha_garantia: string | null
  estado_equipo: string | null
}

interface InventarioFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingItem: InventarioItem | null
  onSuccess: () => void
}

export default function InventarioFormDialog({
  open,
  onOpenChange,
  editingItem,
  onSuccess,
}: InventarioFormDialogProps) {
  const [responsable, setResponsable] = useState("")
  const [objeto, setObjeto] = useState("")
  const [modelo, setModelo] = useState("")
  const [area, setArea] = useState("")
  const [codigoBarras, setCodigoBarras] = useState("")
  const [estadoEquipo, setEstadoEquipo] = useState("")
  const [garantia, setGarantia] = useState("")
  const [fechaGarantia, setFechaGarantia] = useState("")
  const [observaciones, setObservaciones] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    if (editingItem) {
      setResponsable(editingItem.responsable)
      setObjeto(editingItem.objeto)
      setModelo(editingItem.modelo)
      setArea(editingItem.area)
      setCodigoBarras(editingItem.codigo_barras)
      setEstadoEquipo(editingItem.estado_equipo || "")
      setGarantia(editingItem.garantia || "")
      setFechaGarantia(editingItem.fecha_garantia ? editingItem.fecha_garantia.split("T")[0] : "")
      setObservaciones(editingItem.observaciones || "")
    } else {
      resetForm()
    }
  }, [editingItem, open])

  const resetForm = () => {
    setResponsable("")
    setObjeto("")
    setModelo("")
    setArea("")
    setCodigoBarras("")
    setEstadoEquipo("")
    setGarantia("")
    setFechaGarantia("")
    setObservaciones("")
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const itemData = {
        responsable,
        area,
        objeto,
        modelo,
        codigo_barras: codigoBarras,
        estado_equipo: estadoEquipo || null,
        garantia: garantia || null,
        fecha_garantia: fechaGarantia ? new Date(fechaGarantia).toISOString() : null,
        observaciones: observaciones || null,
      }

      if (editingItem) {
        const { error } = await supabase.from("inventario").update(itemData).eq("id", editingItem.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("inventario").insert([itemData])
        if (error) throw error
      }

      onSuccess()
      onOpenChange(false)
      resetForm()
    } catch (err: any) {
      setError(err.message || "Error al guardar el registro")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingItem ? "Editar Equipo" : "Agregar Nuevo Equipo"}</DialogTitle>
          <DialogDescription>
            {editingItem
              ? "Actualiza la información del equipo"
              : "Ingresa los datos del nuevo equipo en el inventario"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="responsable" className="text-right">
                Responsable
              </Label>
              <Input
                id="responsable"
                value={responsable}
                onChange={(e) => setResponsable(e.target.value)}
                className="col-span-3"
                required
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="objeto" className="text-right">
                Objeto
              </Label>
              <Input
                id="objeto"
                value={objeto}
                onChange={(e) => setObjeto(e.target.value)}
                className="col-span-3"
                required
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="modelo" className="text-right">
                Modelo
              </Label>
              <Input
                id="modelo"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                className="col-span-3"
                required
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="codigoBarras" className="text-right">
                Código barras
              </Label>
              <Input
                id="codigoBarras"
                value={codigoBarras}
                onChange={(e) => setCodigoBarras(e.target.value)}
                className="col-span-3"
                required
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="area" className="text-right">
                Área
              </Label>
              <Input
                id="area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="col-span-3"
                required
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="estado" className="text-right">
                Estado
              </Label>
              <Select value={estadoEquipo} onValueChange={setEstadoEquipo}>
                <SelectTrigger id="estado" className="col-span-3">
                  <SelectValue placeholder="Selecciona estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="en_reparacion">En reparación</SelectItem>
                  <SelectItem value="dado_de_baja">Dado de baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="garantia" className="text-right">
                Garantía
              </Label>
              <Input
                id="garantia"
                value={garantia}
                onChange={(e) => setGarantia(e.target.value)}
                className="col-span-3"
                placeholder="Ej: 12 meses"
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fechaGarantia" className="text-right">
                Fecha garantía
              </Label>
              <Input
                id="fechaGarantia"
                type="date"
                value={fechaGarantia}
                onChange={(e) => setFechaGarantia(e.target.value)}
                className="col-span-3"
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="observaciones" className="text-right pt-2">
                Observaciones
              </Label>
              <Textarea
                id="observaciones"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                className="col-span-3"
                rows={3}
                disabled={loading}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : editingItem ? "Actualizar" : "Agregar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
