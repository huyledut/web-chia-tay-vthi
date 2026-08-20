import type { Metadata } from "next";
import { Mali, Nunito } from "next/font/google";
import { FloatingDecor } from "@/components/FloatingDecor";
import { SceneBackground } from "@/components/SceneBackground";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "vietnamese"],
});

const mali = Mali({
  variable: "--font-mali",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Tạm biệt Việt Thi — Học Chúng Chánh Tâm",
    template: "%s · Chánh Tâm",
  },
  description:
    "Học Chúng Chánh Tâm, Tự Viện Phước Duyên (Huế), gửi Việt Thi trước ngày sang Mỹ.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${nunito.variable} ${mali.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <SceneBackground />
        <FloatingDecor />
        <div className="relative z-10 flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
