import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-white min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 px-4 sm:px-6 py-4 sm:py-6 overflow-x-hidden">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
