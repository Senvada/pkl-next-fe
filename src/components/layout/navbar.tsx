"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Building2,
  ChevronRight,
  Home,
  Info,
  LogOut,
  Map,
  Menu,
  Newspaper,
  PhoneCall,
  Settings,
  User,
} from "lucide-react";

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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import Logo from "@/assets/icon/Logo(150x150).svg";
import { useCurrentUser } from "@/hooks/modules/auth";

type NavUser = {
  name: string;
  email: string;
  image?: string;
  isAuthenticated: boolean;
};

type NavItem = {
  index: string;
  nav: string;
  target: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { index: "home", nav: "Beranda", target: "/", icon: <Home className="size-4" /> },
  { index: "about", nav: "Tentang Kami", target: "/about", icon: <Info className="size-4" /> },
  { index: "companies", nav: "Perusahaan", target: "/companies", icon: <Building2 className="size-4" /> },
  { index: "articles", nav: "Artikel", target: "/articles", icon: <Newspaper className="size-4" /> },
  { index: "maps", nav: "Peta", target: "/maps", icon: <Map className="size-4" /> },
  { index: "contact", nav: "Kontak", target: "/contact", icon: <PhoneCall className="size-4" /> },
];

function getActiveIndex(pathname: string) {
  if (pathname === "/") return "home";
  const match = navItems.find(
    (item) => item.target !== "/" && pathname.startsWith(item.target),
  );
  return match?.index ?? "";
}

type NavbarProps = {
  user?: NavUser | null;
};

const Navbar = ({ user: propUser = null }: NavbarProps) => {
  const currentUser = useCurrentUser();
  const user: NavUser | null =
    propUser ||
    (currentUser
      ? {
          name: currentUser.name,
          email: currentUser.email,
          image: currentUser.avatar_url ?? undefined,
          isAuthenticated: true,
        }
      : null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const activeIndex = getActiveIndex(pathname ?? "/");
  const isHomeTop = pathname === "/" && !scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-9999 flex h-14 w-full justify-between transition-all duration-300 sm:h-18 items-center",
        isHomeTop
          ? "bg-transparent text-white"
          : "bg-white/85 text-slate-900 shadow-xs backdrop-blur-md dark:bg-[#1A2634]/90 dark:text-white"
      )}
    >
      <div className="ml-4 sm:ml-8 lg:ml-10 flex h-full w-auto flex-none items-center justify-center">
        <Link href="/" className="h-full w-fit py-2.5 sm:py-3.5 flex items-center gap-2.5">
          <Image
            src={Logo}
            alt="PKL Logo"
            width={40}
            height={40}
            className="h-8 sm:h-10 w-auto"
            priority
          />
          <div className="hidden sm:flex flex-col">
            <span
              className={cn(
                "text-xs font-black tracking-wider uppercase",
                isHomeTop
                  ? "text-white"
                  : "text-slate-900 dark:text-white"
              )}
            >
              PKL SMKN 6
            </span>
            <span
              className={cn(
                "text-[9px] font-medium tracking-tight",
                isHomeTop
                  ? "text-slate-300"
                  : "text-slate-500 dark:text-slate-400"
              )}
            >
              Portal Digital
            </span>
          </div>
        </Link>
      </div>

      <NavWide user={user} activeIndex={activeIndex} isHomeTop={isHomeTop} />
      <NavMobile user={user} activeIndex={activeIndex} isHomeTop={isHomeTop} />
    </header>
  );
};

function NavWide({
  user,
  activeIndex,
  isHomeTop,
}: {
  user: NavUser | null;
  activeIndex: string;
  isHomeTop: boolean;
}) {
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
                "flex items-center gap-1.5 border-b-2 py-1 text-sm font-semibold transition-all duration-200",
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
        {/* Theme Toggle Button */}
        <ThemeToggle isTransparent={isHomeTop} />

        {user?.isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "h-auto gap-2.5 rounded-full border py-1 pr-3 pl-1",
                  isHomeTop
                    ? "border-white/30 text-white hover:bg-white/10"
                    : "border-slate-300 text-slate-900 hover:bg-slate-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                )}
              >
                <Avatar className="size-7 ring-2 ring-white/30">
                  {user.image ? (
                    <AvatarImage src={user.image} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="bg-transparent">
                    <User className="size-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="max-w-28 truncate text-xs font-semibold">
                  {user.name}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 border-slate-200 bg-white dark:border-white/10 dark:bg-[#1E2A38]/95 backdrop-blur-xl shadow-xl"
            >
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span className="truncate text-sm font-semibold">
                  {user.name}
                </span>
                <span className="truncate text-xs font-normal text-muted-foreground">
                  {user.email}
                </span>
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

function NavMobile({
  user,
  activeIndex,
  isHomeTop,
}: {
  user: NavUser | null;
  activeIndex: string;
  isHomeTop: boolean;
}) {
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
                      "group flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200",
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
                      {user.image ? (
                        <AvatarImage src={user.image} alt={user.name} />
                      ) : null}
                      <AvatarFallback>
                        <User className="size-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold">
                        {user.name}
                      </p>
                      <p className="truncate text-[10px] text-muted-foreground">
                        {user.email}
                      </p>
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

export default Navbar;
