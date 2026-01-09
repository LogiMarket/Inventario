"use client"

import { useRef, useState } from "react"
import { UploadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export default function DocumentUploadButton() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const supabase = getSupabaseBrowserClient()

  const handleClick = () => {
    setMessage(null)
    inputRef.current?.click()
  }

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    setMessage(null)

    const filePath = `${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from("documentos").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      setMessage(`Error al subir: ${error.message}`)
    } else {
      setMessage("Documento subido correctamente")
    }

    setLoading(false)
    event.target.value = ""
  }

  return (
    <div className="flex flex-col gap-1">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        accept="*/*"
      />
      <Button variant="outline" onClick={handleClick} disabled={loading} className="gap-2">
        <UploadCloud className="h-4 w-4" />
        {loading ? "Subiendo..." : "Subir documento"}
      </Button>
      {message && <p className="text-xs text-muted-foreground max-w-xs">{message}</p>}
    </div>
  )
}
