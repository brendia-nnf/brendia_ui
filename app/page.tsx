"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "Hvala na prijavi!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Nesto nije uspjelo. Pokusaj ponovo.");
      }
    } catch {
      setStatus("error");
      setMessage("Greska u povezivanju. Pokusaj ponovo.");
    }
  };

  return (
    <main className="min-h-screen bg-cream lg:flex lg:flex-row">
      {/* Image Section */}
      <div className="relative w-full h-[50vh] lg:h-screen lg:w-auto lg:flex-shrink-0">
        <Image
          src="/images/nina-coming-soon.jpeg"
          alt="Brendia Pro"
          width={800}
          height={1200}
          className="w-full h-full object-cover object-top lg:w-auto lg:h-screen"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-primary/10" />
      </div>

      {/* Content Section */}
      <div className="relative flex-1 min-h-[50vh] lg:min-h-screen flex flex-col items-center justify-center px-6 py-12 lg:py-0 lg:px-12">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-primary) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-lg w-full text-center lg:text-left">
          {/* Logo */}
          <div className="mb-10">
            <Image
              src="/images/logo.png"
              alt="Brendia Pro"
              width={160}
              height={53}
              className="mx-auto lg:mx-0"
            />
          </div>

          {/* Heading */}
          <h1 className="font-heading text-4xl md:text-5xl text-primary mb-6 tracking-tight">
            Tvoja Transformacija
            <br />
            <span className="text-secondary">Dolazi Uskoro</span>
          </h1>

          {/* Subheading */}
          <p className="text-primary/70 text-lg mb-6 leading-relaxed">
            Ekskluzivna edukacija za Brendia Pro® ekstenzije koja ce tvoju karijeru podignuti na novu razinu.
          </p>

          {/* Highlight */}
          <p className="text-secondary font-medium text-lg mb-10">
            Budi prva koja sazna kada idemo live.
          </p>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Unesi svoj email"
                className={cn(
                  "flex-1 min-h-[64px] py-5 px-6 rounded-none border-2 border-primary/20",
                  "bg-white text-primary placeholder:text-primary/40",
                  "focus:outline-none focus:border-secondary",
                  "transition-colors duration-300",
                  "font-body text-base"
                )}
                disabled={status === "loading"}
                required
              />
              <button
                type="submit"
                disabled={status === "loading" || !email}
                className={cn(
                  "h-16 px-8 bg-primary text-white font-medium",
                  "hover:bg-primary/90 active:scale-[0.98]",
                  "transition-all duration-300",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2",
                  "tracking-wide text-sm uppercase"
                )}
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Slanje...
                  </span>
                ) : (
                  "Prijavi Se"
                )}
              </button>
            </div>

            {/* Status Message */}
            {message && (
              <p
                className={cn(
                  "mt-4 text-sm",
                  status === "success" && "text-green-600",
                  status === "error" && "text-red-600"
                )}
              >
                {message}
              </p>
            )}
          </form>

          {/* Trust Text */}
          <p className="text-primary/40 text-sm">
            Za profesionalce koji uvijek teze vise.
            <br />
            Bez spama. Samo ekskluzivne informacije.
          </p>
        </div>

      </div>
    </main>
  );
}
