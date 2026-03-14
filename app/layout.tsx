import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Navimow Szakértő | Robotfűnyíró Kalkulátor',
  description: 'Találja meg a kertjéhez tökéletes Segway Navimow robotfűnyírót másodpercek alatt! Hivatalos kalkulátor és legközelebbi partner kereső.',
  openGraph: {
    title: 'Navimow Szakértő | Robotfűnyíró Kalkulátor',
    description: 'Találja meg a kertjéhez tökéletes Segway Navimow robotfűnyírót másodpercek alatt!',
    images: ['/hatter.jpg'], // Ez a kép jelenik meg, ha megosztod Facebookon/Messengeren!
    locale: 'hu_HU',
    type: 'website',
  },
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
