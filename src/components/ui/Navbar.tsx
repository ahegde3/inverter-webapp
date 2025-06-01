"use client";

import * as React from "react";
import Link from "next/link";
import ProfileIcon from "./ProfileIcon";
import { ThemeToggle } from "../theme-toggle";

const Navbar = () => {
  return (
    <nav
      className="w-full md:border-0 px-4 md:px-8 py-3 md:py-5 flex items-center justify-between"
      style={{
        background: "var(--background)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <Link href="/">
        <h1
          className="text-xl md:text-3xl font-bold"
          style={{ color: "var(--primary)" }}
        >
          VKP Inverter
        </h1>
      </Link>
      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle />
        <ProfileIcon />
      </div>
    </nav>
  );
};

export default Navbar;
