import Link from "next/link";
import Image from "next/image";
export default function Navbar() {
  return (
    <header className="sticky top-0 z-30   bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        <Link href="/" >
          <Image
             src="/branding/logo.webp"
             alt="Café Express"
             width={150}
             height={150}
             className="object-contain"
          />
        </Link>

       
      </nav>
    </header>
  );
}