import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Navimow Szakértő | Robotfűnyíró Kalkulátor",
  description: "Találja meg a kertjéhez tökéletes Segway Navimow robotfűnyírót másodpercek alatt!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
