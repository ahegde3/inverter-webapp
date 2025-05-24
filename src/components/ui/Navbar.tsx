"use client";

import * as React from "react";
import Link from "next/link";
import ProfileIcon from "./ProfileIcon";

const Navbar = () => {
  return (
    <nav
      className="w-full md:border-0 px-8 py-3 md:py-5 flex items-center justify-between"
      style={{
        background: "var(--background)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <Link href="/">
        <h1 className="text-3xl font-bold" style={{ color: "var(--primary)" }}>
          AceInverter
        </h1>
      </Link>
      <ProfileIcon />
    </nav>
  );
};

export default Navbar;
