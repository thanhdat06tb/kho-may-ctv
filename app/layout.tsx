import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { ServiceWorkerRegister } from "./sw-register";
import "./globals.css";

export const preferredRegion = ["hnd1", "sin1"];

export const metadata: Metadata = {
  title: "Kho Máy CTV",
  description: "PWA quản lý kho iPhone cũ cho cộng tác viên",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Kho Máy CTV",
    statusBarStyle: "black-translucent"
  }
};

export const viewport: Viewport = {
  themeColor: "#07111f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="dark">
      <body>
        {children}
        <ServiceWorkerRegister />
        <Toaster theme="dark" richColors position="top-center" />
      </body>
    </html>
  );
}
