import Link from "next/link";
import { Mail } from "lucide-react";

export function ContactCTA() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 -z-10" />
            <div className="flex flex-col items-center justify-center gap-8 text-center px-4">
                <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
                    Interested in working together?
                </h2>
                <p className="max-w-[600px] text-lg text-muted-foreground">
                    I'm always open to discussing product design work or partnership opportunities.
                </p>
                <Link
                    href="/contact"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 gap-2"
                >
                    <Mail className="h-5 w-5" />
                    Send me an email
                </Link>
            </div>
        </section>
    );
}
