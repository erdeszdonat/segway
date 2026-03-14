import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Navimow Szakértő | Robotfűnyíró Kalkulátor',
  description: 'Találja meg a kertjéhez tökéletes Segway Navimow robotfűnyírót másodpercek alatt!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hu">
      <body>{children}</body>
    </html>
  )
}
