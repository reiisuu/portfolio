import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, Space_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const nothingDisplay = localFont({
  src: "../fonts/nothing-font.otf.woff2",
  variable: "--font-nothing-display",
  display: "swap",
});
const spaceMono = Space_Mono({ variable: "--font-space-mono", weight: ["400", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Developer Portfolio",
  description: "A Nothing OS inspired developer portfolio.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${nothingDisplay.variable} ${spaceMono.variable} h-full antialiased`}>
      <body className="min-h-full">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
