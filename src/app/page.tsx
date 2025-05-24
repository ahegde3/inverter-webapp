// import Image from "next/image";
import { redirect } from "next/navigation";
import Navbar from "../components/ui/Navbar";

export default function Home() {
  redirect("/home");

  // This won't be reached due to the redirect
  return <Navbar />;
}
