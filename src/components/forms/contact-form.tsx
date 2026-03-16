"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { getClientSessionId } from "@/lib/client/session";

const emailPattern = /\S+@\S+\.\S+/;
const maxMessageLength = 1_500;

function isLikelyChinese(value: string) {
  return /[^\u0000-\u00ff]/.test(value);
}

export function ContactForm({
  copy,
}: {
  copy: {
    botField?: string;
    cooldownLabel?: string;
    errorGeneric?: string;
    formName: string;
    formEmail: string;
    formMessage: string;
    formPending?: string;
    formSubmit: string;
    rateLimited?: string;
    successMessage?: string;
    successPlaceholder?: string;
    validationEmail?: string;
    validationMessageLength?: string;
    validationRequired?: string;
  };
}) {
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [status, setStatus] = useState<{
    message: string;
    tone: "error" | "success";
  } | null>(null);

  const prefersChinese = isLikelyChinese(copy.formSubmit);
  const feedback = {
    botField:
      copy.botField ??
      (prefersChinese
        ? "å¦‚æžœä½ æ˜¯çœŸäººï¼Œè¯·å°†æ­¤å­—æ®µä¿æŒä¸ºç©ºã€‚"
        : "If you are human, leave this field empty."),
    cooldownLabel: copy.cooldownLabel ?? (prefersChinese ? "è¯·ç­‰å¾…" : "Retry in"),
    errorGeneric:
      copy.errorGeneric ??
      (prefersChinese
        ? "æäº¤å¤±è´¥ï¼Œè¯·ç¨åŽå†è¯•ã€‚"
        : "We couldn't submit your note. Please try again in a moment."),
    formPending:
      copy.formPending ?? (prefersChinese ? "æ­£åœ¨å®‰å…¨å‘é€..." : "Sending securely..."),
    rateLimited:
      copy.rateLimited ??
      (prefersChinese
        ? "æäº¤è¿‡äºŽé¢‘ç¹ï¼Œè¯·ç¨ç­‰åŽå†è¯•ã€‚"
        : "You're sending too quickly. Please wait before trying again."),
    successMessage:
      copy.successMessage ??
      copy.successPlaceholder ??
      (prefersChinese
        ? "å—ä¿æŠ¤çš„æäº¤å…¥å£å·²æŽ¥æ”¶ä½ çš„ç•™è¨€ã€‚"
        : "Protected intake accepted your note."),
    validationEmail:
      copy.validationEmail ??
      (prefersChinese
        ? "è¯·è¾“å…¥æœ‰æ•ˆçš„é‚®ç®±åœ°å€ã€‚"
        : "Enter a valid email address."),
    validationMessageLength:
      copy.validationMessageLength ??
      (prefersChinese
        ? "ç•™è¨€è¯·æŽ§åˆ¶åœ¨ 1500 å­—ç¬¦ä»¥å†…ã€‚"
        : "Keep your note under 1,500 characters."),
    validationRequired:
      copy.validationRequired ??
      (prefersChinese
        ? "è¯·å¡«å†™å§“åã€é‚®ç®±å’Œå†…å®¹ã€‚"
        : "Please complete your name, email, and message."),
  };

  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, []);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [remainingSeconds]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting || remainingSeconds > 0) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const website = String(formData.get("website") || "").trim();

    if (!name || !email || !message) {
      setStatus({ message: feedback.validationRequired, tone: "error" });
      return;
    }

    if (!emailPattern.test(email)) {
      setStatus({ message: feedback.validationEmail, tone: "error" });
      return;
    }

    if (message.length > maxMessageLength) {
      setStatus({ message: feedback.validationMessageLength, tone: "error" });
      return;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-session": getClientSessionId(),
        },
        body: JSON.stringify({
          email,
          message,
          name,
          website,
        }),
        cache: "no-store",
        signal: controller.signal,
      });
      const body = (await response.json().catch(() => null)) as
        | {
            error?: string;
            retryAfterSeconds?: number;
          }
        | null;

      if (!response.ok) {
        if (response.status === 429) {
          const retryAfterSeconds = Math.max(
            Number(body?.retryAfterSeconds ?? response.headers.get("Retry-After") ?? 60),
            1,
          );

          setRemainingSeconds(retryAfterSeconds);
          setStatus({ message: feedback.rateLimited, tone: "error" });
          return;
        }

        setStatus({ message: feedback.errorGeneric, tone: "error" });
        return;
      }

      form.reset();
      setRemainingSeconds(0);
      setStatus({ message: feedback.successMessage, tone: "success" });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      setStatus({ message: feedback.errorGeneric, tone: "error" });
    } finally {
      abortControllerRef.current = null;
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-6 shadow-[0_14px_44px_rgba(24,21,17,0.06)] md:p-8"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]">
          {copy.formName}
        </label>
        <Input name="name" maxLength={80} required />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]">
          {copy.formEmail}
        </label>
        <Input name="email" type="email" maxLength={254} required />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]">
          {copy.formMessage}
        </label>
        <Textarea name="message" maxLength={maxMessageLength} required />
      </div>

      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">{feedback.botField}</label>
        <Input
          id="website"
          name="website"
          autoComplete="off"
          maxLength={120}
          tabIndex={-1}
        />
      </div>

      {status ? (
        <p
          className={
            status.tone === "success"
              ? "rounded-2xl border border-[rgba(70,108,83,0.16)] bg-[rgba(70,108,83,0.06)] px-4 py-3 text-sm text-[var(--color-success)]"
              : "rounded-2xl border border-[rgba(155,58,45,0.16)] bg-[rgba(155,58,45,0.06)] px-4 py-3 text-sm text-[var(--color-danger)]"
          }
          aria-live="polite"
        >
          {status.message}
        </p>
      ) : null}

      {remainingSeconds > 0 ? (
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-muted)]">
          {feedback.cooldownLabel} {remainingSeconds}s
        </p>
      ) : null}

      <Button className="w-full" type="submit" disabled={isSubmitting || remainingSeconds > 0}>
        {isSubmitting
          ? feedback.formPending
          : remainingSeconds > 0
            ? `${feedback.cooldownLabel} ${remainingSeconds}s`
            : copy.formSubmit}
      </Button>
    </form>
  );
}
