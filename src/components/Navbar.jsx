import Link from "next/link";
import Image from "next/image";
export default function Navbar() {
  return (
    <header className="sticky top-0 z-30   bg-white/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" >
          <Image
             src="/branding/logo.png"
             alt="Café Express"
             width={100}
             height={100}
             className="object-contain"
          />
        </Link>

        <div className="flex items-center gap-4 text-sm ">

          <Link href="/admin/pedidos"   className="font-bold text-cafe-oscuro transition hover:text-cafe-caramelo">
            Admin
          </Link>

        </div>
      </nav>
    </header>
  );
}