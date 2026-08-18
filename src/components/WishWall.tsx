"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { wishes as staticWishes, type Wish } from "@/data/wishes";
import { WishCard } from "./WishCard";

type FireWish = Wish & { createdAt?: { seconds: number } };

export function WishWall() {
  const [fireWishes, setFireWishes] = useState<FireWish[]>([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "wishes"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<FireWish, "id">),
        }));
        setFireWishes(docs);
        setLoading(false);
      },
      () => {
        /* ignore permission errors in dev before rules are set */
        setLoading(false);
      }
    );

    return unsub;
  }, []);

  const allWishes: Wish[] = [...fireWishes, ...staticWishes];

  return (
    <section className="mx-auto max-w-5xl pb-8">
      <div className="mb-10 text-center">
        <p className="text-3xl">💌</p>
        <h2 className="mt-2 font-script text-5xl text-navy">
          Lời chúc từ Chánh Tâm
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-navy/65">
          Học Chúng Chánh Tâm gửi Việt Thi, trước ngày bay sang Mỹ.
        </p>

        {/* CTA */}
        <Link
          href="/gui-loi-chuc"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-rose to-petal px-6 py-2.5 text-sm font-bold text-white shadow-[0_4px_20px_rgba(249,168,201,0.4)] transition hover:scale-105"
        >
          ✍️ Gửi lời chúc của bạn
        </Link>
      </div>

      {loading ? (
        <div className="py-10 text-center text-sm text-navy/40 animate-pulse">
          Đang tải lời chúc...
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allWishes.map((wish, index) => (
            <WishCard key={wish.id} wish={wish} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
