import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Javni popis certificiranih Brendia Pro® Artistica (2.7). Na popisu su
// samo polaznice koje su dale suglasnost (is_public). Pretraga po
// gradu/salonu radi se na klijentu — popis je malen.
export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("certified_artists")
    .select(
      "id, full_name, salon_name, city, country, instagram_url, website_url, certified_at"
    )
    .eq("is_public", true)
    .order("city", { ascending: true })
    .order("full_name", { ascending: true });

  if (error) {
    // Tablica možda još ne postoji (migracija 009) — vrati prazan popis
    console.error("certified-artists fetch failed:", error);
    return NextResponse.json({ artists: [] });
  }

  return NextResponse.json({ artists: data ?? [] });
}
