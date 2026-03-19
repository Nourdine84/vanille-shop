import "./globals.css";
import HeaderWrapper from "../components/header-wrapper";
import Providers from "../components/providers";
import Footer from "../components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="flex flex-col min-h-screen bg-white text-gray-900">

        <Providers>

          <HeaderWrapper />

          <main className="flex-1">
            {children}
          </main>

          <Footer />

        </Providers>

      </body>
    </html>
  );
}