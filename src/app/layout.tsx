import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import Aurora from "@/components/Aurora";
import BackgroundPhoto from "@/components/BackgroundPhoto";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Portfolio site",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..700,0..100,0..1;1,9..144,300..700,0..100,0..1&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap"
        />
      </head>
      <body className="grain min-h-full flex flex-col bg-background text-foreground">
        <BackgroundPhoto />
        <Aurora colorStops={["#f0cf8f", "#dba9bb", "#8d76a8"]} blend={0.14} amplitude={1.3} speed={2.2} />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
