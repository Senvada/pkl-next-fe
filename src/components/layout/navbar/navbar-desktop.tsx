import Link from "next/link";
import { LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { navItems, type NavUser } from "./nav-items";

interface NavbarDesktopProps {
  user: NavUser | null;
  activeIndex: string;
  isHomeTop: boolean;
}

export function NavbarDesktop({ user, activeIndex, isHomeTop }: NavbarDesktopProps) {
  return (
    <nav className="hidden flex-auto items-center justify-between lg:flex">
      <div className="flex flex-auto flex-row items-center justify-center gap-6 xl:gap-8">
        {navItems.map((item) => {
          const isActive = activeIndex === item.index;
          return (
            <Link
              key={item.index}
              href={item.target}
              className={cn(
                "flex items-center gap-1.5 border-b-2 py-1 text-sm font-semibold transition-colors duration-150 ease-out",
                isHomeTop
                  ? isActive
                    ? "border-blue-400 text-blue-300"
                    : "border-transparent text-white/80 hover:text-white hover:border-white/50"
                  : isActive
                  ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-300"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 dark:text-slate-300 dark:hover:text-white dark:hover:border-white/30"
              )}
            >
              <i className="not-italic">{item.icon}</i>
              <span>{item.nav}</span>
            </Link>
          );
        })}
      </div>

      <div className="mr-6 sm:mr-10 flex-none flex items-center gap-3">
        <ThemeToggle isTransparent={isHomeTop} />

        {user?.isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "h-auto gap-2.5 rounded-full border py-1 pr-3 pl-1 cursor-pointer",
                  isHomeTop
                    ? "border-white/30 text-white hover:bg-white/10"
                    : "border-slate-300 text-slate-900 hover:bg-slate-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                )}
              >
                <Avatar className="size-7 ring-2 ring-white/30">
                  {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
                  <AvatarFallback className="bg-transparent">
                    <User className="size-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="max-w-28 truncate text-xs font-semibold">{user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 border-slate-200 bg-white dark:border-white/10 dark:bg-[#1E2A38]/95 backdrop-blur-xl shadow-xl"
            >
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span className="truncate text-sm font-semibold">{user.name}</span>
                <span className="truncate text-xs font-normal text-muted-foreground">{user.email}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="flex items-center gap-2.5">
                  <Settings className="size-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="text-red-500 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
              >
                <Link href="/logout" className="flex items-center gap-2.5">
                  <LogOut className="size-4" />
                  Keluar
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            asChild
            variant={isHomeTop ? "outline" : "default"}
            size="sm"
            className={cn(
              "font-semibold rounded-xl text-xs h-9 px-4 cursor-pointer",
              isHomeTop
                ? "border-white bg-transparent text-white hover:bg-white hover:text-slate-900"
                : "bg-blue-600 hover:bg-blue-500 text-white shadow-sm"
            )}
          >
            <Link href="/login">Masuk</Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
