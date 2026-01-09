"use client"

import { useRef, useState } from "react"
import { UploadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface Props {
  itemId: number
  codigoBarras: string
}

export default function DocumentUploadAction({ itemId, codigoBarras }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = getSupabaseBrowserClient()
  const { toast } = useToast()

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setLoading(true)

    try {
      const path = `inventario/${itemId}-${codigoBarras}-${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from("documentos").upload(path, file, { upsert: false, cacheControl: "3600" })

      if (error) {
        throw error
      }

      toast({
        title: "✅ Documento subido",
        description: `${file.name} se ha subido correctamente`,
      })
    } catch (err: any) {
      console.error("Upload error:", err)
      toast({
        title: "❌ Error al subir documento",
        description: err.message || "Intenta de nuevo",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      event.target.value = ""
    }
  }

  return (
    <>
      <input ref={inputRef} type="file" className="hidden" onChange={handleChange} />
      <Button
        onClick={handleClick}
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        title="Subir documentación"
        disabled={loading}
      >
        <UploadCloud className="h-4 w-4" />
        <span className="sr-only">Subir documentación</span>
      </Button>
    </>
  )
}
