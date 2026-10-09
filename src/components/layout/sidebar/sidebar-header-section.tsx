import Link from "next/link"
import Image from "next/image"
import Logo from "@/assets/icon/Logo(150x150).svg"

export default function SidebarHeaderSection() {
  return (
    <Link
      href="/dashboard"
      className="flex items-center group-data-[collapsible=icon]:gap-0 gap-2.5 rounded-xl group-data-[collapsible=icon]:px-0 px-2 py-1.5 transition-all hover:bg-sidebar-accent"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 p-1.5 border border-blue-500/20">
        <Image
          src={Logo}
          alt="PKL SMKN 6 Malang"
          width={28}
          height={28}
          className="h-full w-auto"
          priority
        />
      </div>

      <div className="flex flex-col text-left transition-opacity duration-200 group-data-[collapsible=icon]:hidden">
        <span className="text-xs font-black tracking-wider uppercase text-sidebar-foreground">
          PKL SMKN 6
        </span>
        <span className="text-[10px] font-medium text-sidebar-foreground/60">
          Admin Portal
        </span>
      </div>
    </Link>
  )
}
