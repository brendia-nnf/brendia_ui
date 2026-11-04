import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Galerija prije/poslije na stranici Brendia Pro® metoda. Fotografije
// dodaje klijentica (admin na platformi); javno se vide samo is_public.
export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("method_gallery")
    .select("id, image_before_url, image_after_url, caption")
    .eq("is_public", true)
    .order("sort_order", { ascending: true });

  if (error) {
    // Tablica možda još ne postoji (migracija 010) — prazna galerija
    console.error("method-gallery fetch failed:", error);
    return NextResponse.json({ items: [] });
  }

  return NextResponse.json({ items: data ?? [] });
}
