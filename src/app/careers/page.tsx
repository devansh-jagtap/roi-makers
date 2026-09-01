"use client";

import { useState } from "react";
import Link from "next/link";
import GlassPage from "@/components/ui/glass/GlassPage";
import { HeroStage } from "@/components/ui/glass/HeroStage";
import { careersStage } from "@/data/stage";
import { SectionHeading } from "@/components/ui/glass/Sections";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/glass/Reveal";
import { useToast } from "@/components/ui/toast";
import { applicationProfiles, benefits, company, openRoles, perks } from "@/data/site";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  position: "",
  message: "",
};

export default function CareersPage() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [resume, setResume] = useState<File | null>(null);

  const update = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("email", form.email);
      if (form.phone) data.append("phone", form.phone);
      data.append("position", form.position);
      data.append("message", form.message);
      if (resume) data.append("resume", resume);

      const response = await fetch("/api/careers", { method: "POST", body: data });
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.error || "Submission failed");
      }

      toast("Application submitted successfully.", "success");
      setForm(emptyForm);
      setResume(null);
      const input = document.getElementById("resume") as HTMLInputElement | null;
      if (input) input.value = "";
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "There was an error submitting the form. Please try again.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GlassPage>
      <HeroStage
        eyebrow="Join our team"
        title={
          <>
            Build your career
            <br />
            with <span className="display-accent">ROI Makers.</span>
          </>
        }
        lede="We're assembling a world-class team of growth obsessives, creative engineers and data storytellers. If you thrive in ambiguity and measure success in outcomes, let's talk."
        actions={
          <>
            <a href="#apply" className="btn-brand">
              <span>Apply now</span>
              <span aria-hidden>→</span>
            </a>
            <a href={`mailto:${company.emails.careers}`} className="btn-glass">
              <span>{company.emails.careers}</span>
            </a>
          </>
        }
        cards={careersStage}
        crumbs={[{ label: "Careers" }]}
      />

      {/* ---------------------------------------------------------- */}
      <section className="section-tight">
        <div className="shell">
          <SectionHeading
            eyebrow="We're hiring"
            title="Open roles right now."
            description="Two seats open on the floor. If neither fits but you think you belong here, apply anyway and tell us why."
          />

          <RevealGroup className="mt-12 grid gap-6 md:grid-cols-2">
            {openRoles.map((role) => (
              <RevealItem key={role.title} className="h-full">
                <article className="glass glass-card flex h-full flex-col p-7 sm:p-9">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <h3 className="display-3">{role.title}</h3>
                    <span className="glass-pill !py-1.5 !text-[0.6rem]">{role.experience}</span>
                  </div>
                  <p className="clash-display-font mt-3 text-[0.65rem] uppercase tracking-[0.2em] text-[var(--brand)]">
                    {role.type}
                  </p>
                  <div className="hairline my-6" />
                  <p className="clash-display-font text-[0.62rem] uppercase tracking-[0.2em] text-soft">
                    Skills required
                  </p>
                  <ul className="mt-4 flex flex-1 flex-wrap content-start gap-2">
                    {role.skills.map((skill) => (
                      <li key={skill} className="glass-pill !py-1.5 !text-[0.6rem] !normal-case !tracking-[0.06em]">
                        {skill}
                      </li>
                    ))}
                  </ul>
                  <a href="#apply" className="btn-glass group mt-7 self-start">
                    <span className="link-arrow">
                      <span>Apply for this role</span>
                      <span aria-hidden>↗</span>
                    </span>
                  </a>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      <section className="section-tight">
        <div className="shell">
          <SectionHeading eyebrow="Why ROI Makers" title="Benefits and perks." align="center" />

          <RevealGroup className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <RevealItem key={benefit.title} className="h-full">
                <div className="glass glass-card h-full p-7">
                  <span className="clash-display-font text-[0.65rem] tabular-nums tracking-[0.2em] text-[var(--brand)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="display-4 mt-3">{benefit.title}</h3>
                  <p className="body-copy archivo-font mt-2 text-sm">{benefit.description}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.1}>
            <div className="glass-ink mt-6 p-7 sm:p-10">
              <h3 className="display-3">Plus more…</h3>
              <ul className="mt-6 grid gap-3 md:grid-cols-2">
                {perks.map((perk) => (
                  <li key={perk} className="archivo-font flex items-center gap-3 text-sm text-white/75">
                    <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-bright)]" />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      <section id="apply" className="section scroll-mt-24">
        <div className="shell max-w-4xl">
          <SectionHeading
            eyebrow="Get started"
            title="Apply now."
            description={
              <>
                Fill out the form below, or email your resume and portfolio to{" "}
                <a
                  href={`mailto:${company.emails.careers}`}
                  className="font-semibold text-[var(--brand)] underline-offset-4 hover:underline"
                >
                  {company.emails.careers}
                </a>
                .
              </>
            }
            align="center"
          />

          <Reveal delay={0.1}>
            <form onSubmit={handleSubmit} className="glass mt-12 p-7 sm:p-10">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name" htmlFor="name" required>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={update}
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    className="glass-field archivo-font"
                  />
                </Field>

                <Field label="Email" htmlFor="email" required>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={update}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="glass-field archivo-font"
                  />
                </Field>

                <Field label="Phone" htmlFor="phone">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={update}
                    autoComplete="tel"
                    placeholder="+91 90000 00000"
                    className="glass-field archivo-font"
                  />
                </Field>

                <Field label="Profile" htmlFor="position" required>
                  <select
                    id="position"
                    name="position"
                    value={form.position}
                    onChange={update}
                    required
                    className="glass-field archivo-font"
                  >
                    <option value="">Select your profile</option>
                    {applicationProfiles.map((profile) => (
                      <option key={profile} value={profile}>
                        {profile}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="mt-5 grid gap-5">
                <Field label="Resume / CV" htmlFor="resume">
                  <input
                    id="resume"
                    name="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(event) => setResume(event.target.files?.[0] ?? null)}
                    className="glass-field archivo-font cursor-pointer file:mr-4 file:rounded-full file:border-0 file:bg-[var(--brand)] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white"
                  />
                </Field>

                <Field label="Message" htmlFor="message" required>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={update}
                    required
                    rows={6}
                    placeholder="Tell us about yourself, your experience, and why you'd be a great fit…"
                    className="glass-field archivo-font resize-none"
                  />
                </Field>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button type="submit" disabled={submitting} className="btn-brand disabled:opacity-60">
                  <span>{submitting ? "Submitting…" : "Submit application"}</span>
                  <span aria-hidden>→</span>
                </button>
                <p className="clash-display-font text-[0.62rem] uppercase tracking-[0.18em] text-soft">
                  We reply to every application
                </p>
              </div>
            </form>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Call for help", value: company.phones[0], href: `tel:${company.phones[0].replace(/\s/g, "")}` },
                { label: "Email address", value: company.emails.careers, href: `mailto:${company.emails.careers}` },
                { label: "Office address", value: company.addressShort, href: undefined },
              ].map((item) => (
                <div key={item.label} className="glass glass-card p-5">
                  <p className="clash-display-font text-[0.6rem] uppercase tracking-[0.2em] text-[var(--brand)]">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a href={item.href} className="archivo-font mt-2 block text-sm hover:text-[var(--brand)]">
                      {item.value}
                    </a>
                  ) : (
                    <p className="archivo-font mt-2 text-sm">{item.value}</p>
                  )}
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <p className="body-copy archivo-font mt-10 text-center text-sm">
              Curious what we actually do all day?{" "}
              <Link href="/services" className="font-semibold text-[var(--brand)] underline-offset-4 hover:underline">
                Read about the work
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>
    </GlassPage>
  );
}

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="clash-display-font mb-2 block text-[0.62rem] uppercase tracking-[0.2em] text-soft"
      >
        {label}
        {required ? <span className="text-[var(--brand)]"> *</span> : null}
      </label>
      {children}
    </div>
  );
}
