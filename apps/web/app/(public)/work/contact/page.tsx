import Link from "next/link";
import { Github, Linkedin, Mail, MapPin, MessageSquare, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/sections/contact/contact-form";
import { getPublicSiteProfile, getPublicSocialLinks } from "@/features/portfolio/portfolio.service";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const [profile, socials] = await Promise.all([getPublicSiteProfile(), getPublicSocialLinks()]);

  return (
    <section className="pt-10 sm:pt-14 pb-16 min-h-screen relative">
      <Container>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-cyan-100 dark:bg-cyan-900/40 rounded-3xl text-cyan-600 dark:text-cyan-400 mb-6 shadow-sm">
              <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 mb-6">
              Let's Talk
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              All information here is for professional purposes only. If you have any questions, feel free to send a direct message.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-500/30 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl group">
                <h3 className="text-xl font-bold mb-6 text-neutral-900 dark:text-neutral-100 group-hover:text-cyan-600 transition-colors">
                  Contact Information
                </h3>
                <div className="space-y-6">
                  {profile.location ? (
                    <InfoItem icon={<MapPin className="w-5 h-5" />} label="Address" value={profile.location} />
                  ) : null}
                  {profile.email ? (
                    <div className="flex items-start gap-4">
                      <IconBox><Mail className="w-5 h-5" /></IconBox>
                      <div>
                        <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1">Email</p>
                        <Link href={`mailto:${profile.email}`} className="text-sm text-cyan-600 hover:text-cyan-700 hover:underline font-semibold transition-colors">
                          {profile.email}
                        </Link>
                      </div>
                    </div>
                  ) : null}
                </div>
              </Card>

              <Card className="p-6 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/30 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl group">
                <h3 className="text-xl font-bold mb-6 text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 transition-colors">
                  Social Media
                </h3>
                <div className="space-y-4">
                  {socials.length ? (
                    socials.map((social) => (
                      <Link key={social.id} href={social.url} target="_blank" className="flex items-center gap-4 p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group/link">
                        <div className="p-2.5 bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xl group-hover/link:scale-110 transition-transform">
                          {social.name.toLowerCase().includes("linkedin") ? <Linkedin className="w-5 h-5" /> : <Github className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{social.name}</p>
                          <p className="text-xs text-neutral-500 font-medium">{social.url}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-neutral-500">Social links are being prepared.</p>
                  )}
                </div>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card className="p-8 sm:p-10 h-full transition-all duration-500 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none scale-[2.5] -translate-y-12 translate-x-12">
                  <Send className="w-40 h-40 text-cyan-500" strokeWidth={1} />
                </div>
                <h3 className="text-3xl font-extrabold mb-1.5 text-neutral-900 dark:text-neutral-100 tracking-tight">
                  Send a Message
                </h3>
                <p className="mb-10 text-neutral-500 dark:text-neutral-400 text-[15px] font-medium">
                  Opens your default email client to send a direct email.
                </p>
                <ContactForm />
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-neutral-600 dark:text-neutral-400 group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-colors">
      {children}
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <IconBox>{icon}</IconBox>
      <div>
        <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1">{label}</p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">{value}</p>
      </div>
    </div>
  );
}
