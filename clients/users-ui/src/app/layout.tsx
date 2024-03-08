import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers/NextUiProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});

export const metadata: Metadata = {
  title: "FastDeli App",
  description: "Fast Delivery Food Service Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${inter.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html >
  );
}
