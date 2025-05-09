import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "CIUNAC SOL",
	description: "App para ingreso y consulta de solicitudes de CIUNAC",
};

export default function RootLayout({children, }: Readonly<{children: React.ReactNode;}>) 
{
	return (
		<html lang="es">
		<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
			{children}
			<Toaster position="top-center" richColors/>
		</body>
		</html>
	);
}
