import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KAINOVA | Twin Sisters Swarm",
  description: "The most powerful, sophisticated Twin Sisters Swarm in existence.",
  icons: {
    icon: "/kainova-icon.png", // Using the file we created
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
