import type { Metadata } from "next";
import Footer from "./components/Footer";
import Header from "./components/Header";
import SideNavigationBar from "./components/SideNavigationBar";
import { AuthProvider } from "./context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blog",
  description: "This page is blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className="flex flex-col min-h-screen bg-gray-100">
          <Header />
          <div className="flex flex-grow">
            <SideNavigationBar />
            <main className="flex-grow p-6">
              <div className="max-w-3xl mx-auto">{children}</div>
            </main>
          </div>
          <Footer />
        </body>
      </AuthProvider>
    </html>
  );
}
