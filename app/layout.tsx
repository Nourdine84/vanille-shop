import "./globals.css";
import HeaderWrapper from "../components/header-wrapper";
import { ToastProvider } from "../components/ui/toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <ToastProvider>
          <HeaderWrapper />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}