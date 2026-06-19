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
import { cn } from "@/lib/utils";
import Logo from "@/assets/icon/Logo(150x150).svg";

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
  { index: "home", nav: "Beranda", target: "/", icon: <Home className="size-5" /> },
  { index: "about", nav: "Tentang Kami", target: "/about", icon: <Info className="size-5" /> },
  { index: "companies", nav: "Perusahaan", target: "/companies", icon: <Building2 className="size-5" /> },
  { index: "articles", nav: "Artikel", target: "/articles", icon: <Newspaper className="size-5" /> },
  { index: "maps", nav: "Peta", target: "/maps", icon: <Map className="size-5" /> },
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

const Navbar = ({ user = null }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const activeIndex = getActiveIndex(pathname ?? "/");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      style={{
        backgroundColor: `rgba(30,42,56,${scrolled ? 0.7 : 0})`,
        backdropFilter: `blur(${scrolled ? 10 : 0}px)`,
        WebkitBackdropFilter: `blur(${scrolled ? 10 : 0}px)`,
      }}
      className="fixed z-999999 flex h-12 w-full justify-between bg-transparent transition-all duration-300 sm:h-18"
    >
      <div className="ml-10 flex h-full w-auto flex-none items-center justify-center">
        <Link href="/" className="h-full w-fit py-2 sm:py-4">
          <Image
            src={Logo}
            alt="PKL Logo"
            width={48}
            height={48}
            className="h-full w-auto"
            priority
          />
        </Link>
      </div>

      <NavWide user={user} activeIndex={activeIndex} />
      <NavMobile user={user} activeIndex={activeIndex} />
    </header>
  );
};

function NavWide({
  user,
  activeIndex,
}: {
  user: NavUser | null;
  activeIndex: string;
}) {
  return (
    <nav className="hidden flex-auto items-center justify-between lg:flex">
      <div className="flex flex-auto flex-row items-center justify-center gap-8">
        {navItems.map((item) => {
          const isActive = activeIndex === item.index;
          return (
            <Link
              key={item.index}
              href={item.target}
              className={cn(
                "flex items-center gap-1 border-b-2 pb-1 text-lg font-semibold text-white transition-all duration-300 ease-in-out",
                isActive
                  ? "border-white"
                  : "border-transparent hover:border-white",
              )}
            >
              <i className="not-italic">{item.icon}</i>
              <span>{item.nav}</span>
            </Link>
          );
        })}
      </div>

      <div className="mr-10 flex-none items-center justify-start">
        {user?.isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto gap-2.5 rounded-full border border-white/30 py-1 pr-3 pl-1 text-white hover:bg-white/10 hover:text-white"
              >
                <Avatar className="size-7 ring-2 ring-white/30">
                  {user.image ? (
                    <AvatarImage src={user.image} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="bg-transparent text-white/80">
                    <User className="size-5" />
                  </AvatarFallback>
                </Avatar>
                <span className="max-w-30 truncate text-sm font-medium">
                  {user.name}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 border-white/10 bg-[#1E2A38]/95 text-white backdrop-blur-xl"
            >
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span className="truncate text-sm font-semibold text-white">
                  {user.name}
                </span>
                <span className="truncate text-xs font-normal text-white/50">
                  {user.email}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                asChild
                className="text-white/70 focus:bg-white/10 focus:text-white"
              >
                <Link href="/dashboard" className="flex items-center gap-2.5">
                  <Settings className="size-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="text-red-400/80 focus:bg-red-500/10 focus:text-red-400"
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
            variant="outline"
            className="border-white bg-transparent font-semibold text-white hover:bg-white hover:text-[#1E2A38]"
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
}: {
  user: NavUser | null;
  activeIndex: string;
}) {
  return (
    <div className="mr-6 flex flex-none items-center justify-start lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 text-white hover:bg-white/10 hover:text-white"
          >
            <Menu className="size-7" />
            <span className="sr-only">Buka menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="top"
          showCloseButton={false}
          className="top-12 max-h-[calc(100vh-3rem)] gap-0 border-none bg-[#1E2A38]/95 p-0 text-white backdrop-blur-xl sm:max-w-none"
        >
          <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
          <nav className="flex max-h-[calc(100vh-3rem)] mt-14 flex-col overflow-y-auto px-4 py-3">
            {navItems.map((item) => {
              const isActive = activeIndex === item.index;
              return (
                <SheetClose key={item.index} asChild>
                  <Link
                    href={item.target}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200",
                      isActive
                        ? "bg-white/15 text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <span
                      className={cn(
                        "shrink-0 rounded-lg p-1.5 transition-colors",
                        isActive
                          ? "bg-white/20"
                          : "bg-white/5 group-hover:bg-white/10",
                      )}
                    >
                      {item.icon}
                    </span>
                    <span className="flex-1 text-[15px] font-medium">
                      {item.nav}
                    </span>
                    <ChevronRight
                      className={cn(
                        "size-4 transition-all duration-200",
                        isActive
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-50",
                      )}
                    />
                  </Link>
                </SheetClose>
              );
            })}

            <div className="mt-3 border-t border-white/10 px-4 pt-3">
              {user?.isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 px-2 py-2">
                    <Avatar className="size-9 ring-2 ring-white/30">
                      {user.image ? (
                        <AvatarImage src={user.image} alt={user.name} />
                      ) : null}
                      <AvatarFallback className="bg-transparent text-white/80">
                        <User className="size-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-white/50">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <SheetClose asChild>
                      <Link
                        href="/dashboard"
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/10 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
                      >
                        <Settings className="size-4" />
                        Dashboard
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/logout"
                        className="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
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
                    className="block w-full rounded-xl border border-white/30 py-2.5 text-center text-[15px] font-semibold text-white transition-all duration-200 hover:bg-white hover:text-[#1E2A38]"
                  >
                    Masuk
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
