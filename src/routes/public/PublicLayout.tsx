import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/layout/PageTransition";

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-navy-950">
      <Navbar />
      <main className="flex-1">
        <PageTransition />
      </main>
      <Footer />
    </div>
  );
}
