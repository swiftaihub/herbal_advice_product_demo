"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

export function ContactForm({
  copy,
}: {
  copy: {
    formName: string;
    formEmail: string;
    formMessage: string;
    formSubmit: string;
    successPlaceholder: string;
  };
}) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      action={() => setSubmitted(true)}
      className="space-y-5 rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-6 shadow-[0_14px_44px_rgba(24,21,17,0.06)] md:p-8"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]">
          {copy.formName}
        </label>
        <Input name="name" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]">
          {copy.formEmail}
        </label>
        <Input name="email" type="email" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]">
          {copy.formMessage}
        </label>
        <Textarea name="message" />
      </div>
      {submitted ? (
        <p className="rounded-2xl border border-[rgba(70,108,83,0.16)] bg-[rgba(70,108,83,0.06)] px-4 py-3 text-sm text-[var(--color-success)]">
          {copy.successPlaceholder}
        </p>
      ) : null}
      <Button className="w-full" type="submit">
        {copy.formSubmit}
      </Button>
    </form>
  );
}
