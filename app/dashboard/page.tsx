import { Suspense } from "react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardContent from "@/components/dashboard/dashboard-content"
import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton"

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Obtener datos iniciales del inventario
  const { data: inventario } = await supabase
    .from("inventario")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent initialData={inventario || []} userEmail={user.email || ""} />
      </Suspense>
    </div>
  )
}
