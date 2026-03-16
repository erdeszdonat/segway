import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Navimow Szakértő | Robotfűnyíró Kalkulátor',
  description: 'Találja meg a kertjéhez tökéletes Segway Navimow robotfűnyírót másodpercek alatt!',
  icons: {
    icon: '/segwaylogo1.svg', // Ez hivatkozik a public/segwaylogo1.svg fájlra
    apple: '/segwaylogo1.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hu">
      <head>
        {/* Biztosítjuk, hogy a böngésző azonnal megtalálja az ikont */}
        <link rel="icon" href="/segwaylogo1.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  )
}
