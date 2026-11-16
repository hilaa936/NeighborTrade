import { Heebo } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth";
import { authOptions, getCurrentUser } from "@/server/auth";
import { directionOf } from "@/i18n/config";
import Providers from "@/components/layout/Providers";
import TopBar from "@/components/layout/TopBar";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import "../styles/globals.css";

const heebo = Heebo({ subsets: ["hebrew", "latin"], variable: "--font-heebo", display: "swap" });

export async function generateMetadata() {
  const t = await getTranslations("app");
  return {
    title: { default: t("name"), template: `%s · ${t("name")}` },
    description: t("description"),
  };
}

export const viewport = { themeColor: "#2e6f35" };

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const [session, user] = await Promise.all([getServerSession(authOptions), getCurrentUser()]);

  return (
    <html lang={locale} dir={directionOf(locale)} className={heebo.variable}>
      <body className="flex min-h-dvh flex-col font-sans">
        <NextIntlClientProvider>
          <Providers session={session}>
            <TopBar user={user && { id: user.id, name: user.name, image: user.image }} />
            <main className="has-bottom-nav flex flex-1 flex-col">{children}</main>
            <Footer />
            <BottomNav />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
