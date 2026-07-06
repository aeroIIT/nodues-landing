import { Button } from "@/components/ui/button";
import {
  CallVolumeChart,
  TrustNote,
  NegotiationChat,
} from "@/components/Snippets";
import { useState } from "react";
import {
  Phone,
  MessageSquare,
  CreditCard,
  Settings,
  Shield,
  BarChart3,
  Users,
  TrendingUp,
  Plus,
  Check,
} from "lucide-react";

export default function Home() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    referral: "",
  });

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    // Inserts into vocallabs_website_leads via Hasura's anonymous role
    // (public insert permission — no secret needed client-side).
    const HASURA_URL =
      import.meta.env.VITE_HASURA_URL ?? "https://db.vocallabs.ai/v1/graphql";
    try {
      const res = await fetch(HASURA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `mutation InsertWaitlistLead($object: vocallabs_website_leads_insert_input!) {
            insert_vocallabs_website_leads_one(object: $object) { id }
          }`,
          variables: {
            object: {
              name: form.name,
              phone_number: form.phone,
              company_email_id: form.email,
              referral: form.referral || null,
              type: "nodues",
            },
          },
        }),
      });
      const json = await res.json();
      if (json.errors?.length) throw new Error(json.errors[0].message);
      setSubmitted(true);
    } catch (err) {
      setError(
        "Something went wrong. Please try again or email hello@nodues.com."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToWaitlist = () =>
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="page-bg relative min-h-screen text-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="text-xl font-serif font-bold">NoDues</div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm hover:text-gray-600">
              Platform
            </a>
            <a href="#why" className="text-sm hover:text-gray-600">
              Why NoDues
            </a>
            <a href="#faq" className="text-sm hover:text-gray-600">
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              className="bg-black text-white hover:bg-gray-800"
              onClick={scrollToWaitlist}
            >
              Join Waitlist
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden pt-32 pb-16 md:pb-24">
        {/* Soft "light" glow + faint rupee-note watermark */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute left-1/2 top-[-20%] h-[460px] w-[880px] -translate-x-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(7,0,148,0.13), transparent 65%)",
            }}
          />
          <span className="absolute top-1/2 -right-10 -translate-y-1/2 select-none font-serif leading-none text-black/[0.05] text-[16rem] md:text-[22rem]">
            ₹
          </span>
        </div>

        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <h1 className="headline-serif mb-6 text-black">
                The <span className="text-accent">OS</span> for
                <br />
                Intelligent Collection
                <br />
                at Scale
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Voice AI powered Automated Infrastructure that decides whom to
                target, when, and how…
              </p>
              <div className="flex gap-4">
                <Button className="btn-primary" onClick={scrollToWaitlist}>
                  Join the Waitlist
                </Button>
                <Button
                  className="btn-secondary"
                  onClick={() => {
                    window.location.href = "mailto:hello@nodues.com";
                  }}
                >
                  Contact Sales
                </Button>
              </div>
              <div className="flex gap-8 mt-8 text-sm text-gray-600">
                <div>
                  <div className="font-medium text-black">Any scale</div>
                  <div>Portfolio decisioning</div>
                </div>
                <div>
                  <div className="font-medium text-black">Enterprise</div>
                  <div>Security &amp; compliance</div>
                </div>
              </div>
            </div>

            {/* Enterprise Waitlist Form */}
            <div id="waitlist" className="scroll-mt-24">
              <div className="card-minimal bg-white">
                {submitted ? (
                  <div className="text-center py-6">
                    <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-black">
                      <Check className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-serif text-2xl mb-2">You're on the list.</h3>
                    <p className="text-gray-600">
                      Thanks{form.name ? `, ${form.name.split(" ")[0]}` : ""}. We'll
                      reach out to{" "}
                      <span className="text-black font-medium">{form.email}</span>{" "}
                      to scope a pilot.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="font-serif text-2xl mb-2">Join the waitlist</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      For enterprise lenders and collection teams. We'll reach out
                      to scope a pilot for your portfolio.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <input
                        type="text"
                        required
                        placeholder="Full name"
                        value={form.name}
                        onChange={update("name")}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="Phone number"
                        value={form.phone}
                        onChange={update("phone")}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Work email"
                        value={form.email}
                        onChange={update("email")}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                      />
                      <select
                        value={form.referral}
                        onChange={update("referral")}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black ${
                          form.referral ? "text-black" : "text-gray-400"
                        }`}
                      >
                        <option value="">How did you hear about us? (optional)</option>
                        <option value="google">Google / search</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="friends">Friend or colleague</option>
                        <option value="other">Other</option>
                      </select>
                      {error && (
                        <p className="text-sm text-red-600">{error}</p>
                      )}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary w-full disabled:opacity-60"
                      >
                        {submitting ? "Joining…" : "Join the Waitlist"}
                      </button>
                      <p className="text-xs text-gray-500 text-center">
                        Enterprise only. No spam—we'll only reach out about access.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="section-spacing">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-sm text-gray-600 uppercase tracking-wide mb-4">
              The Problem
            </p>
            <h2 className="heading-section mb-6">
              Collection at scale is a decision problem—not a dialing problem.
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Enterprise recovery teams have too many accounts and too little
              intelligence about who to pursue, when, and how.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Phone,
                title: "No contact strategy",
                desc: "Manual outreach with no logic for who to reach, when, or how",
              },
              {
                icon: Users,
                title: "Wasted effort",
                desc: "Your best people spent on accounts that won't pay—or would have anyway",
              },
              {
                icon: TrendingUp,
                title: "Inconsistent outcomes",
                desc: "Every account gets the same treatment, regardless of risk",
              },
              {
                icon: BarChart3,
                title: "Siloed systems",
                desc: "CRM, dialers, payments and data that don't talk to each other",
              },
              {
                icon: Shield,
                title: "Compliance exposure",
                desc: "Manual processes turn every interaction into a regulatory risk",
              },
              {
                icon: CreditCard,
                title: "No real scale",
                desc: "Headcount, not intelligence, is the only lever to grow recovery",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <item.icon className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                <h3 className="font-medium text-black mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Section */}
      <section id="features" className="section-spacing">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-sm text-gray-600 uppercase tracking-wide mb-4">
              The Platform
            </p>
            <h2 className="heading-section mb-6">
              One OS for the entire collection lifecycle.
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              NoDues unifies decisioning, orchestration and execution into a single
              agentic infrastructure layer—so intelligence drives every account.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Phone,
                title: "Intelligent targeting",
                desc: "Scores and prioritizes every account—who to pursue, when, and how hard—using behavioral, risk and payment signals.",
              },
              {
                icon: TrendingUp,
                title: "Decision engine",
                desc: "Codify your collection strategy as policies the system executes consistently across millions of accounts.",
              },
              {
                icon: BarChart3,
                title: "Portfolio intelligence",
                desc: "Real-time visibility into recovery, risk and automation performance across your entire book.",
              },
              {
                icon: Users,
                title: "Human-in-the-loop",
                desc: "Autonomous execution that carries out the decided strategy and escalates to your team only when it matters.",
              },
              {
                icon: MessageSquare,
                title: "Omnichannel orchestration",
                desc: "Coordinates voice, WhatsApp, SMS and email as one strategy per account—not disconnected blasts.",
              },
              {
                icon: Shield,
                title: "Built for scale & compliance",
                desc: "Deploy on your own infrastructure, with audit trails and guardrails baked into every action.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <item.icon className="h-8 w-8 mx-auto mb-4 text-accent" />
                <h3 className="font-medium text-black mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="section-spacing">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-sm text-gray-600 uppercase tracking-wide mb-4">
              In action
            </p>
            <h2 className="heading-section mb-6">Intelligence you can see.</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From portfolio metrics to real-time negotiation, NoDues turns every
              interaction into a better decision.
            </p>
          </div>

          <div className="space-y-10 md:space-y-14">
            {/* Row 1 — Daily call volume */}
            <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <h3 className="font-serif text-xl md:text-2xl tracking-tight mb-3">
                  Portfolio intelligence, live
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Track daily call volume, recovery and risk across your entire
                  book—so every decision is grounded in real data, not guesswork.
                </p>
              </div>
              <CallVolumeChart />
            </div>

            {/* Row 2 — Build debtor trust */}
            <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="md:order-2">
                <h3 className="font-serif text-xl md:text-2xl tracking-tight mb-3">
                  Build debtor trust
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  NoDues collects like your best agent—firm, respectful and
                  empathetic—turning difficult conversations into commitments.
                </p>
              </div>
              <div className="md:order-1">
                <TrustNote />
              </div>
            </div>

            {/* Row 3 — Negotiate in real time */}
            <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <h3 className="font-serif text-xl md:text-2xl tracking-tight mb-3">
                  Negotiate in real time
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Agents remind, offer payment plans and handle objections across
                  voice and WhatsApp—based on the strategy you define.
                </p>
              </div>
              <NegotiationChat />
            </div>
          </div>
        </div>
      </section>

      {/* Why NoDues Section */}
      <section id="why" className="section-spacing">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="heading-section mb-6">Why enterprises build on NoDues.</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The infrastructure layer for recovery—decisioning, orchestration and
              compliance that point tools can't deliver.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Shield,
                title: "Runs on your infrastructure",
                desc: "Deploy in your cloud or on-prem. Data never leaves your perimeter—full residency and compliance control.",
              },
              {
                icon: Settings,
                title: "Integrates with your stack",
                desc: "Connects to existing CRMs, dialers, core banking and data pipelines. No rip-and-replace.",
              },
              {
                icon: Phone,
                title: "Decisions, not just dials",
                desc: "An intelligence layer that decides the right strategy per account—the part single-point tools never solve.",
              },
              {
                icon: TrendingUp,
                title: "Scales without headcount",
                desc: "Grow recovery by adding intelligence, not agents—consistent from one account to ten million.",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-6">
                <item.icon className="h-8 w-8 flex-shrink-0 text-accent" />
                <div>
                  <h3 className="font-medium text-black mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="section-spacing">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="heading-section mb-6">
              Enterprise-grade security and compliance.
            </h2>
            <p className="text-lg text-gray-600">
              Certified and compliant with the strictest standards.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {["ISO 27001", "SOC 2 Type 2", "GDPR Compliant", "HIPAA Compliant"].map(
              (cert, i) => (
                <div key={i} className="card-minimal">
                  <Shield className="h-8 w-8 mx-auto mb-4 text-accent" />
                  <p className="font-medium text-black">{cert}</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section-spacing">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-6">
              <h2 className="heading-section">
                Frequently
                <br />
                asked questions
              </h2>
            </div>

            <div className="md:col-span-6 border-t border-gray-200">
              {[
                {
                  q: "Is NoDues just an AI calling agent?",
                  a: "No. NoDues is a complete agentic OS for collections—it decides who to target and how, then orchestrates execution. Voice, WhatsApp, SMS and email are execution channels, not the product.",
                },
                {
                  q: "How does NoDues decide who to target?",
                  a: "It scores every account on payment propensity, risk and behavior, then prioritizes and assigns the optimal strategy—continuously, across your entire portfolio.",
                },
                {
                  q: "Can it run on our own infrastructure?",
                  a: "Yes. Deploy in your cloud or on-prem so data stays within your compliance perimeter, with full audit trails.",
                },
                {
                  q: "Does it integrate with our existing systems?",
                  a: "Yes—NoDues connects to your CRMs, dialers, core banking and data pipelines without replacing what already works.",
                },
                {
                  q: "We're an enterprise—how do we get access?",
                  a: "NoDues is currently onboarding select enterprise partners. Join the waitlist and our team will reach out to scope a pilot for your portfolio.",
                },
              ].map((item, i) => (
                <div key={i} className="border-b border-gray-200">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-6 py-3.5 text-left"
                  >
                    <span className="font-medium text-black">{item.q}</span>
                    <Plus
                      className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform duration-300 ${
                        expandedFaq === i ? "rotate-45" : ""
                      }`}
                    />
                  </button>
                  {expandedFaq === i && (
                    <p className="text-gray-600 pb-4 -mt-1 leading-relaxed">
                      {item.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing">
        <div className="container text-center">
          <h2 className="heading-section mb-8">
            Bring intelligence to your entire collection operation.
          </h2>
          <div className="flex gap-4 justify-center">
            <Button className="btn-primary" onClick={scrollToWaitlist}>
              Join the Waitlist
            </Button>
            <Button
              className="btn-secondary"
              onClick={() => {
                window.location.href = "mailto:hello@nodues.com";
              }}
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-medium mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#features" className="hover:text-white">
                    Decision engine
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-white">
                    Orchestration
                  </a>
                </li>
                <li>
                  <a href="#why" className="hover:text-white">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Get access</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#waitlist" className="hover:text-white">
                    Join the waitlist
                  </a>
                </li>
                <li>
                  <a href="mailto:hello@nodues.com" className="hover:text-white">
                    hello@nodues.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-gray-400 text-center">
            <p>&copy; 2026 NoDues. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
