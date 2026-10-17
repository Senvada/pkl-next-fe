"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/modules/auth";
import { getActiveIndex, type NavUser } from "./navbar/nav-items";
import { NavbarBrand } from "./navbar/navbar-brand";
import { NavbarDesktop } from "./navbar/navbar-desktop";
import { NavbarMobile } from "./navbar/navbar-mobile";

export type NavbarProps = {
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
      <NavbarBrand isHomeTop={isHomeTop} />
      <NavbarDesktop user={user} activeIndex={activeIndex} isHomeTop={isHomeTop} />
      <NavbarMobile user={user} activeIndex={activeIndex} isHomeTop={isHomeTop} />
    </header>
  );
};

export default Navbar;
