import * as React from "react";
import Link from "next/link";
import { ChevronRight, LogOut, Menu, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { navItems, type NavUser } from "./nav-items";

interface NavbarMobileProps {
  user: NavUser | null;
  activeIndex: string;
  isHomeTop: boolean;
}

export function NavbarMobile({ user, activeIndex, isHomeTop }: NavbarMobileProps) {
  return (
    <div className="mr-4 flex flex-none items-center gap-2 lg:hidden">
      <ThemeToggle isTransparent={isHomeTop} />

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "size-9",
              isHomeTop
                ? "text-white hover:bg-white/10"
                : "text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
            )}
          >
            <Menu className="size-6" />
            <span className="sr-only">Buka menu navigasi</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="top"
          showCloseButton={false}
          className="top-14 max-h-[calc(100vh-3.5rem)] gap-0 border-b border-border bg-background/95 p-0 text-foreground backdrop-blur-xl sm:max-w-none shadow-2xl"
        >
          <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
          <nav className="flex max-h-[calc(100vh-3.5rem)] flex-col overflow-y-auto px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = activeIndex === item.index;
              return (
                <SheetClose key={item.index} asChild>
                  <Link
                    href={item.target}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors duration-150 ease-out",
                      isActive
                        ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20"
                        : "text-foreground/80 hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "shrink-0 rounded-lg p-1.5 transition-colors",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-muted text-muted-foreground group-hover:text-foreground"
                      )}
                    >
                      {item.icon}
                    </span>
                    <span className="flex-1 text-sm font-semibold">
                      {item.nav}
                    </span>
                    <ChevronRight className="size-4 opacity-50" />
                  </Link>
                </SheetClose>
              );
            })}

            <div className="mt-4 border-t border-border pt-4">
              {user?.isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-muted/50">
                    <Avatar className="size-8 ring-2 ring-primary/20">
                      {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
                      <AvatarFallback>
                        <User className="size-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold">{user.name}</p>
                      <p className="truncate text-[10px] text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <SheetClose asChild>
                      <Link
                        href="/dashboard"
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-2 text-xs font-medium"
                      >
                        <Settings className="size-4" />
                        Dashboard
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/logout"
                        className="flex items-center justify-center gap-2 rounded-xl bg-destructive/10 text-destructive px-4 py-2 text-xs font-medium"
                      >
                        <LogOut className="size-4" />
                        Keluar
                      </Link>
                    </SheetClose>
                  </div>
                </div>
              ) : (
                <SheetClose asChild>
                  <Link
                    href="/login"
                    className="block w-full rounded-xl bg-blue-600 text-white py-2.5 text-center text-xs font-semibold shadow-md shadow-blue-600/20"
                  >
                    Masuk ke Akun
                  </Link>
                </SheetClose>
              )}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
