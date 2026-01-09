"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { LogOut, Plus, Search, Pencil, Trash2, Eye } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import InventarioFormDialog from "./inventario-form-dialog"
import DeleteConfirmDialog from "./delete-confirm-dialog"
import AdvancedFilters, { type FilterValues } from "./advanced-filters"
import ExportButton from "./export-button"
import InventoryStats from "./inventory-stats"
import Image from "next/image"
import ViewItemDialog from "./view-item-dialog"
import DocumentUploadAction from "./document-upload-action"
import DocumentViewAction from "./document-view-action"

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

interface DashboardContentProps {
  initialData: InventarioItem[]
  userEmail: string
}

export default function DashboardContent({ initialData, userEmail }: DashboardContentProps) {
  const [inventario, setInventario] = useState<InventarioItem[]>(initialData)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<FilterValues>({
    responsable: "",
    objeto: "",
    modelo: "",
    codigoBarras: "",
    area: "",
    estadoEquipo: "",
  })
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventarioItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<InventarioItem | null>(null)
  const [viewingItem, setViewingItem] = useState<InventarioItem | null>(null)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const areas = useMemo(() => {
    const uniqueAreas = new Set(inventario.map((item) => item.area))
    return Array.from(uniqueAreas).sort()
  }, [inventario])

  const responsables = useMemo(() => {
    const uniqueResp = new Set(inventario.map((item) => item.responsable))
    return Array.from(uniqueResp).sort()
  }, [inventario])

  const filteredInventario = useMemo(() => {
    let result = inventario

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      result = result.filter((item) =>
        [
          item.responsable,
          item.objeto,
          item.modelo,
          item.codigo_barras,
          item.area,
          item.estado_equipo ?? "",
          item.garantia ?? "",
          item.observaciones ?? "",
        ]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(term)),
      )
    }

    if (filters.responsable && filters.responsable !== "all") {
      result = result.filter((item) => item.responsable === filters.responsable)
    }
    if (filters.objeto) {
      result = result.filter((item) => item.objeto.toLowerCase().includes(filters.objeto.toLowerCase()))
    }
    if (filters.modelo) {
      result = result.filter((item) => item.modelo.toLowerCase().includes(filters.modelo.toLowerCase()))
    }
    if (filters.codigoBarras) {
      result = result.filter((item) => item.codigo_barras.toLowerCase().includes(filters.codigoBarras.toLowerCase()))
    }
    if (filters.area && filters.area !== "all") {
      result = result.filter((item) => item.area === filters.area)
    }
    if (filters.estadoEquipo && filters.estadoEquipo !== "all") {
      result = result.filter((item) => (item.estado_equipo ?? "").toLowerCase() === filters.estadoEquipo.toLowerCase())
    }

    return result
  }, [inventario, searchTerm, filters])

  useEffect(() => {
    setPage(1)
  }, [searchTerm, filters])

  const totalPages = Math.max(1, Math.ceil(filteredInventario.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedInventario = filteredInventario.slice(startIndex, startIndex + pageSize)

  const handlePageChange = (direction: "prev" | "next") => {
    setPage((prev) => {
      if (direction === "prev") return Math.max(1, prev - 1)
      return Math.min(totalPages, prev + 1)
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const handleAddNew = () => {
    setEditingItem(null)
    setIsFormOpen(true)
  }

  const handleEdit = (item: InventarioItem) => {
    setEditingItem(item)
    setIsFormOpen(true)
  }

  const handleDelete = (item: InventarioItem) => {
    setDeletingItem(item)
  }

  const handleView = (item: InventarioItem) => {
    setViewingItem(item)
  }

  const refreshData = async () => {
    const { data } = await supabase.from("inventario").select("*").order("created_at", { ascending: false })
    if (data) {
      setInventario(data as InventarioItem[])
    }
  }

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/logimarket-logo.png" alt="Logimarket" width={160} height={40} className="h-10 w-auto" />
              <div className="border-l pl-3 ml-1">
                <h1 className="text-xl font-bold">Panel de Inventario</h1>
                <p className="text-sm text-muted-foreground">{userEmail}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" className="gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-6">
        <InventoryStats data={inventario} />

        <AdvancedFilters filters={filters} onFilterChange={setFilters} areas={areas} responsables={responsables} />

        <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
          {/* Actions Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 w-full md:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Búsqueda rápida..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <ExportButton data={filteredInventario} />
              <Button onClick={handleAddNew} className="gap-2 flex-1 md:flex-none">
                <Plus className="h-4 w-4" />
                Agregar Equipo
              </Button>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-sm text-muted-foreground">
            <span>
              Mostrando {filteredInventario.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + pageSize, filteredInventario.length)} de {filteredInventario.length} registros
            </span>
            <div className="flex items-center gap-2">
              {filteredInventario.length !== inventario.length && <Badge variant="secondary">Filtros activos</Badge>}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent"
                  onClick={() => handlePageChange("prev")}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <span className="text-xs text-muted-foreground">
                  Página {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent"
                  onClick={() => handlePageChange("next")}
                  disabled={currentPage === totalPages || filteredInventario.length === 0}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Responsable</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead>Objeto</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Código de Barras</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Garantía</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventario.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                        {searchTerm || Object.values(filters).some((v) => v)
                          ? "No se encontraron registros con ese criterio de búsqueda"
                          : "No hay registros en el inventario"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedInventario.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.responsable}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.area}
                          </span>
                        </TableCell>
                        <TableCell>{item.objeto}</TableCell>
                        <TableCell>{item.modelo}</TableCell>
                        <TableCell className="font-mono text-xs">{item.codigo_barras}</TableCell>
                        <TableCell>{item.estado_equipo || "Sin estado"}</TableCell>
                        <TableCell>
                          {item.fecha_garantia
                            ? new Date(item.fecha_garantia).toLocaleDateString("es-ES")
                            : item.garantia || ""}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <DocumentUploadAction itemId={item.id} codigoBarras={item.codigo_barras} />
                            <DocumentViewAction itemId={item.id} codigoBarras={item.codigo_barras} />
                            <Button onClick={() => handleView(item)} variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Ver</span>
                            </Button>
                            <Button onClick={() => handleEdit(item)} variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Button
                              onClick={() => handleDelete(item)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Eliminar</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>

      {/* Dialogs */}
      <InventarioFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        editingItem={editingItem}
        onSuccess={refreshData}
      />
      <DeleteConfirmDialog
        open={!!deletingItem}
        onOpenChange={() => setDeletingItem(null)}
        item={deletingItem}
        onSuccess={refreshData}
      />
      <ViewItemDialog open={!!viewingItem} item={viewingItem} onClose={() => setViewingItem(null)} />
    </>
  )
}
