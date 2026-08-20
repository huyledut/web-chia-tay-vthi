"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { FormEvent, useEffect, useState } from "react";
import { WishCard } from "./WishCard";
import type { Wish } from "@/data/wishes";

const STORAGE_KEY = "viet-thi-extra-wishes";
const STICKERS = ["💗", "💌", "🌸", "✈️", "🌙", "☁️", "🎓", "✨", "🙏"];

export function WishForm() {
  const [extra, setExtra] = useState<Wish[]>([]);
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");
  const [sticker, setSticker] = useState("💗");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setExtra(JSON.parse(raw) as Wish[]);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!from.trim() || !message.trim()) return;

    const next: Wish = {
      id: crypto.randomUUID(),
      from: from.trim(),
      message: message.trim(),
      sticker,
      tone: "pink",
    };
    const all = [next, ...extra];
    setExtra(all);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    setFrom("");
    setMessage("");
  }

  return (
    <div className="mt-14">
      {extra.length > 0 ? (
        <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {extra.map((wish, index) => (
            <WishCard
              key={wish.id}
              wish={wish}
              layout="single"
              pageNumber={index + 1}
            />
          ))}
        </div>
      ) : null}

      <form
        onSubmit={onSubmit}
        className="mx-auto max-w-xl rounded-4xl bg-white/80 p-6 shadow-lg ring-1 ring-clay/20"
      >
        <h3 className="font-script text-3xl text-navy">
          Thành viên Chánh Tâm gửi thêm lời chúc
        </h3>
        <p className="mt-1 text-sm text-navy/60">
          Viết lời chúc của bạn. Hiện trên máy này — muốn cả nhà thấy thì gửi
          lại để đưa vào trang.
        </p>
        <input
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="Tên bạn"
          className="mt-5 w-full rounded-2xl border-0 bg-blush px-4 py-3 outline-none ring-1 ring-clay/15 focus:ring-2 focus:ring-clay"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Viết lời chúc cho Việt Thi..."
          rows={4}
          className="mt-3 w-full rounded-2xl border-0 bg-blush px-4 py-3 outline-none ring-1 ring-clay/15 focus:ring-2 focus:ring-clay"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {STICKERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSticker(item)}
              className={`rounded-full px-3 py-1 text-lg ${
                sticker === item ? "bg-peach ring-2 ring-clay" : "bg-blush"
              }`}
              aria-label={`Chọn sticker ${item}`}
            >
              {item}
            </button>
          ))}
        </div>
        <button
          type="submit"
          className="mt-4 rounded-full bg-clay px-6 py-3 text-sm font-semibold text-white"
        >
          Gửi lời chúc 💌
        </button>
      </form>
    </div>
  );
}
