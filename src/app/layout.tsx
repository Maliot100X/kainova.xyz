import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KAINOVA | Twin Sisters Swarm",
  description: "The most powerful, sophisticated Twin Sisters Swarm in existence.",
  other: {
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: "https://www.kainova.xyz/api/og",
      button: {
        title: "Open App",
        action: {
          type: "launch_frame",
          name: "Kainova",
          url: "https://www.kainova.xyz/",
          splashImageUrl: "https://www.kainova.xyz/kainova-icon.png",
          splashBackgroundColor: "#050505"
        }
      }
    }),
    "base:app_id": "6993fc73e0d5d2cf831b5eb7"
  },
  icons: {
    icon: "/kainova-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#050505] text-[#e5e5e5] font-mono antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
