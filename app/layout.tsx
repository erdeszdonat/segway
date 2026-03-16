import type { Metadata } from "next";

// Megjegyzés: A Geist betűtípusokat eltávolítottam a környezeti kompatibilitás miatt, 
// de a Vercel-en a korábbi globals.css-ed továbbra is működni fog.

export const metadata: Metadata = {
  title: 'Navimow Szakértő | Robotfűnyíró Kalkulátor',
  description: 'Találja meg a kertjéhez tökéletes Segway Navimow robotfűnyírót másodpercek alatt!',
  icons: {
    icon: '/segwaylogo1.svg', // Az új ikonod a public mappából
    apple: '/segwaylogo1.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu">
      <head>
        {/* Explicit ikon hivatkozás a böngészők számára */}
        <link rel="icon" href="/segwaylogo1.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
