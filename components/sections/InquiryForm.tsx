"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button, Input } from "@/components/ui";

// Obrazac "Pošaljite upit za termin" (1.7) za 1:1 programe i Online + uživo.
// Šalje se kroz postojeći /api/contact (pohrana + mail administratorici);
// nakon dogovora termina klijentica kupcu šalje link za uplatu predujma.
export function InquiryForm({ programName }: { programName: string }) {
  const t = useTranslations("courseDetail.inquiryForm");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDates: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name || form.name.trim().length < 3) {
      next.name = t("validation.name");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = t("validation.email");
    }
    if (!form.phone.trim()) {
      next.phone = t("validation.phone");
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("sending");
    try {
      const messageLines = [
        `Program: ${programName}`,
        form.preferredDates && `Željeni termin: ${form.preferredDates}`,
        `Telefon: ${form.phone}`,
        form.message && `\n${form.message}`,
      ]
        .filter(Boolean)
        .join("\n");

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: `Upit za termin: ${programName}`,
          message: messageLines,
        }),
      });

      if (!response.ok) throw new Error("send failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-secondary/10 border border-secondary/30 p-8 text-center">
        <svg
          className="w-10 h-10 text-secondary mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-primary font-medium">{t("success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" id="inquiry">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label={t("name")}
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder={t("namePlaceholder")}
          error={errors.name}
          required
        />
        <Input
          label={t("email")}
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder={t("emailPlaceholder")}
          error={errors.email}
          required
        />
        <Input
          label={t("phone")}
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder={t("phonePlaceholder")}
          error={errors.phone}
          required
        />
        <Input
          label={t("preferredDates")}
          name="preferredDates"
          value={form.preferredDates}
          onChange={handleChange}
          placeholder={t("preferredDatesPlaceholder")}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-primary mb-2">
          {t("message")}
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder={t("messagePlaceholder")}
          rows={4}
          className="w-full px-4 py-3 border border-primary/15 focus:border-secondary focus:outline-none text-primary placeholder:text-primary/30 bg-white"
        />
      </div>

      {status === "error" && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm">
          {t("error")}
        </div>
      )}

      <Button type="submit" size="lg" isLoading={status === "sending"}>
        {status === "sending" ? t("sending") : t("submit")}
      </Button>
    </form>
  );
}
