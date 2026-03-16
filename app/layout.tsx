import "./globals.css"
import type { ReactNode } from "react"

export const metadata = {
  title: "Vanille Or",
  description: "Boutique Vanille Premium",
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {

  return (
    <html lang="fr">
      <body className="bg-white text-gray-900">
        {children}
      </body>
    </html>
  )
}
