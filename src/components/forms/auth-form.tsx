"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AuthMode = "sign-in" | "create-account" | "forgot-password";

interface AuthFormProps {
  mode: AuthMode;
  copy: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    submitSignIn: string;
    submitCreate: string;
    submitForgot: string;
    successPlaceholder: string;
    validation: {
      required: string;
      email: string;
      passwordLength: string;
      passwordMatch: string;
    };
  };
}

export function AuthForm({ mode, copy }: AuthFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(formData: FormData) {
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");
    const firstName = String(formData.get("firstName") || "").trim();
    const lastName = String(formData.get("lastName") || "").trim();
    const emailPattern = /\S+@\S+\.\S+/;

    if (mode === "create-account" && (!firstName || !lastName)) {
      setError(copy.validation.required);
      return;
    }

    if (!email || (mode !== "forgot-password" && !password)) {
      setError(copy.validation.required);
      return;
    }

    if (!emailPattern.test(email)) {
      setError(copy.validation.email);
      return;
    }

    if (mode !== "forgot-password" && password.length < 8) {
      setError(copy.validation.passwordLength);
      return;
    }

    if (mode === "create-account" && password !== confirmPassword) {
      setError(copy.validation.passwordMatch);
      return;
    }

    setError(null);
    setSubmitted(true);
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-5 rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-6 shadow-[0_14px_44px_rgba(24,21,17,0.06)] md:p-8"
    >
      {mode === "create-account" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-ink)]">
              {copy.firstName}
            </label>
            <Input name="firstName" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-ink)]">
              {copy.lastName}
            </label>
            <Input name="lastName" />
          </div>
        </div>
      ) : null}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]">
          {copy.email}
        </label>
        <Input name="email" type="email" />
      </div>
      {mode !== "forgot-password" ? (
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-ink)]">
            {copy.password}
          </label>
          <Input name="password" type="password" />
        </div>
      ) : null}
      {mode === "create-account" ? (
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-ink)]">
            {copy.confirmPassword}
          </label>
          <Input name="confirmPassword" type="password" />
        </div>
      ) : null}
      {error ? (
        <p className="rounded-2xl border border-[rgba(155,58,45,0.16)] bg-[rgba(155,58,45,0.06)] px-4 py-3 text-sm text-[var(--color-danger)]">
          {error}
        </p>
      ) : null}
      {submitted ? (
        <p className="rounded-2xl border border-[rgba(70,108,83,0.16)] bg-[rgba(70,108,83,0.06)] px-4 py-3 text-sm text-[var(--color-success)]">
          {copy.successPlaceholder}
        </p>
      ) : null}
      <Button className="w-full" type="submit">
        {mode === "sign-in"
          ? copy.submitSignIn
          : mode === "create-account"
            ? copy.submitCreate
            : copy.submitForgot}
      </Button>
    </form>
  );
}
