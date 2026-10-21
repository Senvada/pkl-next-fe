import * as React from "react";
import { Building2, Home, Info, Map, Newspaper } from "lucide-react";

export type NavUser = {
  name: string;
  email: string;
  image?: string;
  isAuthenticated: boolean;
};

export type NavItem = {
  index: string;
  nav: string;
  target: string;
  icon: React.ReactNode;
};

export const navItems: NavItem[] = [
  { index: "home", nav: "Beranda", target: "/", icon: <Home className="size-4" /> },
  { index: "about", nav: "Tentang Kami", target: "/about", icon: <Info className="size-4" /> },
  { index: "companies", nav: "Perusahaan", target: "/companies", icon: <Building2 className="size-4" /> },
  { index: "articles", nav: "Artikel", target: "/articles", icon: <Newspaper className="size-4" /> },
  { index: "maps", nav: "Peta", target: "/maps", icon: <Map className="size-4" /> },
  // { index: "contact", nav: "Kontak", target: "/contact", icon: <PhoneCall className="size-4" /> },
];

export function getActiveIndex(pathname: string) {
  if (pathname === "/") return "home";
  const match = navItems.find(
    (item) => item.target !== "/" && pathname.startsWith(item.target),
  );
  return match?.index ?? "";
}
