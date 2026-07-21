import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex items-center justify-between  px-6 py-4">
      <Link href="/">
        <Image
          loading="eager"
          src="/logo1.png"
          alt="Stay Hydrated Firmen Logo"
          width={150}
          height={150}
        />
      </Link>

      <nav>{/* Navigation hier */}</nav>
    </header>
  );
}
