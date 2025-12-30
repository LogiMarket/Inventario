"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface InventarioItem {
  id: number
  created_at: string
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

interface ViewItemDialogProps {
  open: boolean
  item: InventarioItem | null
  onClose: () => void
}

export default function ViewItemDialog({ open, item, onClose }: ViewItemDialogProps) {
  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="w-[95vw] max-w-[720px] sm:max-w-[680px]">
        <DialogHeader>
          <DialogTitle>Detalle del equipo</DialogTitle>
          <DialogDescription>Consulta la información completa del registro.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          <Field label="Responsable" value={item.responsable} />
          <Field label="Área" value={item.area} />
          <Field label="Objeto" value={item.objeto} />
          <Field label="Modelo" value={item.modelo} />
          <Field label="Código de barras" value={item.codigo_barras} mono />
          <Field label="Estado" value={item.estado_equipo || "Sin estado"} />
          <Field label="Garantía" value={item.garantia || "-"} />
          <Field
            label="Fecha garantía"
            value={item.fecha_garantia ? new Date(item.fecha_garantia).toLocaleDateString("es-ES") : "-"}
          />
          <Field label="Observaciones" value={item.observaciones || "-"} multiline className="md:col-span-2" />
          <Field
            label="Fecha de registro"
            value={new Date(item.created_at).toLocaleString("es-ES")}
            mono
            className="md:col-span-2"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Field({
  label,
  value,
  mono,
  multiline,
  className,
}: {
  label: string
  value: string
  mono?: boolean
  multiline?: boolean
  className?: string
}) {
  return (
    <div className={`space-y-1 ${className || ""}`}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div
        className={`rounded-md border bg-muted/40 px-3 py-2 text-sm leading-snug ${
          mono ? "font-mono" : ""
        } ${multiline ? "whitespace-pre-wrap" : ""}`}
      >
        {value}
      </div>
    </div>
  )
}
