import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Wish, WishTone } from "@/data/wishes";

const TONES = new Set<WishTone>(["pink", "sky", "cream", "lilac", "peach"]);

function toWish(id: string, data: Record<string, unknown>): Wish | null {
  const from = String(data.from ?? "").trim();
  const message = String(data.message ?? "").trim();
  if (!from || !message) return null;

  const toneRaw = String(data.tone ?? "pink");
  const tone: WishTone = TONES.has(toneRaw as WishTone)
    ? (toneRaw as WishTone)
    : "pink";

  return {
    id,
    from,
    message,
    relation: data.relation ? String(data.relation) : undefined,
    sticker: String(data.sticker || "💗"),
    tone,
    imageUrl: data.imageUrl ? String(data.imageUrl) : undefined,
  };
}

export async function fetchFireWishes(): Promise<Wish[]> {
  try {
    const q = query(
      collection(db, "wishes"),
      orderBy("createdAt", "desc"),
      limit(100)
    );
    const snap = await Promise.race([
      getDocs(q),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("firestore-timeout")), 4000);
      }),
    ]);
    return snap.docs
      .map((doc) => toWish(doc.id, doc.data() as Record<string, unknown>))
      .filter((wish): wish is Wish => wish !== null);
  } catch {
    return [];
  }
}
