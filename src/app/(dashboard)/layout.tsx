import { AppSidebar } from "@/components/layout/sidebar/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { DashboardBreadcrumb } from "@/components/layout/dashboard-breadcrumb"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="min-w-0 py-1.25 flex flex-col flex-1 overflow-hidden bg-slate-50/60 dark:bg-[#0B111A]">
        {/* Sticky Dashboard Topbar Header */}
        <header className="sticky top-0 z-30 flex h-14 sm:h-16 shrink-0 items-center justify-between gap-2 border-b border-border/70 bg-background/80 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 cursor-pointer" />
            <Separator orientation="vertical" className="mx-1.5 h-4" />
            <DashboardBreadcrumb />
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        {/* Dashboard Main View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
