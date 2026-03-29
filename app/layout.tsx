import "./global.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LLAMA.AI | Intelligence",
  description: "Next-gen Llama 3.1 Interface",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="bg-black text-white">
        {children}
      </body>
    </html>
  );
}

