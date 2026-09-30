import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { fadeUp, stagger } from "./motionVariants";

const testimonials = [
  {
    quote:
      "I can see every payment logged against my properties without ever calling my agent. It's the first platform that's made me trust remote management.",
    name: "Folake Adeyemi",
    role: "Landlord, 6 properties",
    avatarUrl: "https://i.pravatar.cc/150?img=44",
  },
  {
    quote:
      "Verification took a day, and since then every assignment has come straight to my dashboard. Tenants trust the badge, and it shows in how fast inspections convert.",
    name: "Tunde Williams",
    role: "Agent, Prime Lagos Realty",
    avatarUrl: "https://i.pravatar.cc/150?img=51",
  },
  {
    quote:
      "Requesting maintenance used to mean chasing WhatsApp messages. Now I log it once and watch the status change — no chasing required.",
    name: "Chioma Uzor",
    role: "Tenant, Old Ikoyi",
    avatarUrl: "https://i.pravatar.cc/150?img=25",
  },
];

export function TestimonialsSection() {
  return (
    <section className="border-t border-navy-700/60 bg-navy-900/40 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Trusted across the ecosystem"
          description="What landlords, agents, and tenants say about managing with PLEET."
        />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={fadeUp}>
              <Card className="h-full p-6">
                <Quote className="h-6 w-6 text-brand-500/50" />
                <p className="mt-4 text-sm text-navy-200">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={t.avatarUrl} alt={t.name} />
                    <AvatarFallback>{t.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-navy-400">{t.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
