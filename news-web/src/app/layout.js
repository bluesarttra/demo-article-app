
import { Inter } from "next/font/google";
import { routing } from "../../i18n/routing";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
