"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface InventarioItem {
  id: number
  objeto: string
  modelo: string
  codigo_barras: string
}

interface DeleteConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: InventarioItem | null
  onSuccess: () => void
}

export default function DeleteConfirmDialog({ open, onOpenChange, item, onSuccess }: DeleteConfirmDialogProps) {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const supabase = getSupabaseBrowserClient()

  const handleDelete = async () => {
    if (!item) return

    setError("")
    setLoading(true)

    try {
      const { error } = await supabase.from("inventario").delete().eq("id", item.id)
      if (error) throw error

      onSuccess()
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || "Error al eliminar el registro")
    } finally {
      setLoading(false)
    }
  }

  if (!item) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>Esta acción no se puede deshacer. Esto eliminará permanentemente el siguiente equipo del inventario:</p>
            <div className="bg-muted p-3 rounded-md mt-2">
              <p className="font-medium">
                {item.objeto} - {item.modelo}
              </p>
              <p className="text-sm text-muted-foreground">Código de barras: {item.codigo_barras}</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
