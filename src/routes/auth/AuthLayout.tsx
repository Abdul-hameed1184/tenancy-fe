import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { PageTransition } from "@/components/layout/PageTransition";

const features = [
  "Verified Agent Network",
  "Architectural Management Tools",
  "Secure Tenant Communication",
  "Automated Maintenance Tracking",
];

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden flex-col justify-center overflow-hidden bg-gradient-to-br from-brand-950 via-navy-950 to-navy-900 p-12 lg:flex">
        <Link to="/" className="text-xl font-extrabold tracking-tight text-white">
          PLEET
        </Link>

        <h1 className="mt-16 text-display-lg text-white">
          The future of Nigerian <span className="text-brand-400">Real Estate</span> management.
        </h1>
        <p className="mt-6 max-w-md text-navy-300">
          Join a verified ecosystem of premium property owners, managers, and residents.
        </p>

        <ul className="mt-10 space-y-3">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-3 text-sm text-navy-200">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500/20 text-brand-400">
                <Check className="h-3 w-3" />
              </span>
              {f}
            </li>
          ))}
        </ul>

        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="mt-12 max-w-xs overflow-hidden rounded-xl border border-navy-700/60 shadow-lg shadow-black/40"
        >
          <img
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop"
            alt="PLEET managed residence"
            className="h-48 w-full object-cover"
          />
        </motion.div>
      </div>

      <div className="flex items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-12">
        <div className="w-full max-w-sm text-slate-900">
          <PageTransition />
        </div>
      </div>
    </div>
  );
}
