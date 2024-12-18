import SessionProviderWrapper from "../components/providers/SessionProviderWrapper";
import localFont from "next/font/local";
import "../styles/globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { UserProvider } from "@/context/UserContext";

const geistSans = localFont({
  src: "../styles/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../styles/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Produce Exchange Platform",
  description: "A community-driven platform for trading homegrown produce",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="flex flex-col min-h-screen">
        <SessionProviderWrapper>
          <UserProvider>
            <Header />
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </UserProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
