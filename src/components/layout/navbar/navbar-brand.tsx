import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/icon/Logo(150x150).svg";
import { cn } from "@/lib/utils";

interface NavbarBrandProps {
  isHomeTop: boolean;
}

export function NavbarBrand({ isHomeTop }: NavbarBrandProps) {
  return (
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
              isHomeTop ? "text-white" : "text-slate-900 dark:text-white"
            )}
          >
            PKL SMKN 6
          </span>
          <span
            className={cn(
              "text-[9px] font-medium tracking-tight",
              isHomeTop ? "text-slate-300" : "text-slate-500 dark:text-slate-400"
            )}
          >
            Portal Digital
          </span>
        </div>
      </Link>
    </div>
  );
}
