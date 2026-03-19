import "./globals.css";
import HeaderWrapper from "../components/header-wrapper";
import Footer from "../components/Footer";
import Providers from "../components/providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <HeaderWrapper />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}