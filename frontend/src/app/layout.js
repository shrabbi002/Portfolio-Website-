import "./globals.css";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

export const metadata = {
  title: "MD Sakhawat Hossain Rabbi | Business Analyst | QA Engineer | AI/ML Researcher",
  description: "Professional portfolio showcasing projects, research, and expertise in software development, QA, business analysis, and AI/ML.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
