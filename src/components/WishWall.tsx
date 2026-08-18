"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { wishes as staticWishes, type Wish } from "@/data/wishes";
import { WishCard } from "./WishCard";

export function WishWall({
  initialFireWishes = [],
}: {
  initialFireWishes?: Wish[];
}) {
  const [fireWishes, setFireWishes] = useState<Wish[]>(initialFireWishes);

  useEffect(() => {
    let unsub: (() => void) | undefined;

    import("@/lib/firebase")
      .then(({ db }) => import("firebase/firestore").then((fs) => ({ db, fs })))
      .then(({ db, fs }) => {
        const q = fs.query(
          fs.collection(db, "wishes"),
          fs.orderBy("createdAt", "desc")
        );
        unsub = fs.onSnapshot(
          q,
          (snap) => {
            setFireWishes(
              snap.docs.map((d) => ({
                id: d.id,
                ...(d.data() as Omit<Wish, "id">),
              }))
            );
          },
          () => {
            /* keep server-rendered wishes if live listener fails */
          }
        );
      })
      .catch(() => {
        /* iOS / Messenger: HTML already has Firestore wishes from the server */
      });

    return () => unsub?.();
  }, []);

  const allWishes: Wish[] = [...fireWishes, ...staticWishes];

  return (
    <section className="mx-auto max-w-5xl pb-8">
      <div className="mb-10 text-center">
        <p className="text-3xl">💌</p>
        <h2 className="mt-2 font-script text-5xl text-navy">
          Lời chúc gửi Việt Thi 💌
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-navy/65">
          Mọi người đã nhắn gửi những điều thương yêu nhất cho cậu trước ngày lên đường ✈️
        </p>

        <Link
          href="/gui-loi-chuc"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-rose to-petal px-6 py-2.5 text-sm font-bold text-white shadow-[0_4px_20px_rgba(249,168,201,0.4)] transition hover:scale-105"
        >
          ✍️ Nhắn gửi Thi nào!
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {allWishes.map((wish, index) => (
          <WishCard key={wish.id} wish={wish} index={index} />
        ))}
      </div>
    </section>
  );
}
