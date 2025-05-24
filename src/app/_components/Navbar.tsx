"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Search } from "lucide-react";
import ProfileIcon from "./ProfileIcon";

const Navbar = () => {
  const [state, setState] = React.useState(false);

  const menus = [
    { title: "Home", path: "/your-path" },
    { title: "Blog", path: "/your-path" },
    { title: "About Us", path: "/your-path" },
    { title: "Contact Us", path: "/your-path" },
  ];

  return (
    <nav
      className="w-full md:border-0"
      style={{
        background: "var(--background)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center justify-around px-4 max-w-screen-xl mx-auto md:px-8">
        <div className="flex items-center justify-between py-3 md:py-5 md:block">
          <Link href="/">
            <h1
              className="text-3xl font-bold"
              style={{ color: "var(--primary)" }}
            >
              Logo
            </h1>
          </Link>
          <div className="md:hidden">
            <button
              className="outline-none p-2 rounded-md focus:border focus:border-opacity-40"
              style={{
                color: "var(--foreground)",
                borderColor: "var(--border)",
              }}
              onClick={() => setState(!state)}
            >
              <Menu />
            </button>
          </div>
        </div>
        <div
          className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
            state ? "block" : "hidden"
          }`}
        >
          <ul className="justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0">
            {menus.map((item, idx) => (
              <li
                key={idx}
                className="hover:text-opacity-80"
                style={{ color: "var(--foreground)" }}
              >
                <Link href={item.path}>{item.title}</Link>
              </li>
            ))}
            <form
              className="flex items-center space-x-2 rounded-md p-2"
              style={{ border: "1px solid var(--border)" }}
            >
              <Search
                className="h-5 w-5 flex-none"
                style={{ color: "var(--muted-foreground)" }}
              />
              <input
                className="w-full outline-none appearance-none sm:w-auto placeholder:text-muted-foreground"
                style={{
                  color: "var(--foreground)",
                  background: "transparent",
                }}
                type="text"
                placeholder="Search"
              />
            </form>
          </ul>
        </div>
        <ProfileIcon />
      </div>
    </nav>
  );
};

export default Navbar;
