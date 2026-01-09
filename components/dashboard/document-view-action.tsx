"use client"

import { useState, useEffect } from "react"
import { FileText, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface Props {
  itemId: number
  codigoBarras: string
}

interface FileInfo {
  name: string
  path: string
  url: string
}

export default function DocumentViewAction({ itemId, codigoBarras }: Props) {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = getSupabaseBrowserClient()

  const loadFiles = async () => {
    setLoading(true)
    try {
      // Listar todos los archivos en la carpeta inventario
      const { data, error } = await supabase.storage
        .from("documentos")
        .list("inventario", { limit: 1000, sortBy: { column: "created_at", order: "desc" } })

      if (error) {
        console.error("Error listing files:", error)
        throw error
      }

      if (!data) {
        setFiles([])
        setLoading(false)
        return
      }

      // Filtrar solo archivos que correspondan a este item
      const prefix = `${itemId}-${codigoBarras}`
      const itemFiles = data.filter((file: any) => file.name.startsWith(prefix) && file.id)

      console.log(`Buscando archivos con prefijo: ${prefix}`)
      console.log(`Archivos encontrados: ${itemFiles.length}`)
      console.log("Files:", itemFiles)

      const fileList = itemFiles.map((file: any) => {
        const { data: urlData } = supabase.storage.from("documentos").getPublicUrl(`inventario/${file.name}`)
        return {
          name: file.name,
          path: `inventario/${file.name}`,
          url: urlData.publicUrl,
        }
      })
      setFiles(fileList)
    } catch (err: any) {
      console.error("Error loading files:", err)
      setFiles([])
    } finally {
      setLoading(false)
    }
  }

  const handleView = (url: string) => {
    window.open(url, "_blank")
  }

  const handleDownload = async (path: string, name: string) => {
    const { data } = await supabase.storage.from("documentos").download(path)
    if (data) {
      const url = URL.createObjectURL(data)
      const a = document.createElement("a")
      a.href = url
      a.download = name
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <DropdownMenu onOpenChange={(open) => open && loadFiles()}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Ver documentos">
          <FileText className="h-4 w-4" />
          <span className="sr-only">Ver documentos</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {loading ? (
          <div className="px-2 py-6 text-center text-sm text-muted-foreground">Cargando...</div>
        ) : files.length === 0 ? (
          <div className="px-2 py-6 text-center text-sm text-muted-foreground">
            Sin documentos
          </div>
        ) : (
          files.map((file) => (
            <div key={file.path} className="flex items-center gap-2 px-2 py-1.5">
              <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs flex-1 truncate" title={file.name}>
                {file.name.split("-").slice(3).join("-")}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => handleView(file.url)}
                  title="Ver"
                >
                  <Eye className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => handleDownload(file.path, file.name)}
                  title="Descargar"
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
