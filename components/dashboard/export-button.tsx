"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface InventarioItem {
  id: number
  created_at: string
  responsable: string
  area: string
  objeto: string
  modelo: string
  codigo_barras: string
  estado_equipo: string | null
  garantia: string | null
  fecha_garantia: string | null
  observaciones: string | null
}

interface ExportButtonProps {
  data: InventarioItem[]
}

export default function ExportButton({ data }: ExportButtonProps) {
  const handleExport = () => {
    const headers = [
      "Responsable",
      "Área",
      "Objeto",
      "Modelo",
      "Código de Barras",
      "Estado",
      "Garantía",
      "Fecha Garantía",
      "Observaciones",
      "Fecha Registro",
    ]

    const csvData = [
      headers.join(","),
      ...data.map((item) =>
        [
          `"${item.responsable}"`,
          `"${item.area}"`,
          `"${item.objeto}"`,
          `"${item.modelo}"`,
          `"${item.codigo_barras}"`,
          `"${item.estado_equipo ?? ""}"`,
          `"${item.garantia ?? ""}"`,
          item.fecha_garantia ? new Date(item.fecha_garantia).toLocaleDateString("es-ES") : "",
          `"${item.observaciones ?? ""}"`,
          new Date(item.created_at).toLocaleDateString("es-ES"),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `inventario_logimarket_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button onClick={handleExport} variant="outline" className="gap-2 bg-transparent">
      <Download className="h-4 w-4" />
      Exportar CSV
    </Button>
  )
}
