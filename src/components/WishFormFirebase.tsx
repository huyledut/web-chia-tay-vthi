"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import type { WishTone } from "@/data/wishes";

const STICKERS = ["💗", "💌", "🌸", "✈️", "🌙", "☁️", "🎓", "✨", "🙏", "🌺"];
const TONES: { value: WishTone; label: string; bg: string }[] = [
  { value: "pink",  label: "Hồng",   bg: "bg-[#fff0f8]" },
  { value: "sky",   label: "Xanh",   bg: "bg-[#edf6ff]" },
  { value: "lilac", label: "Tím",    bg: "bg-[#f5f0ff]" },
  { value: "peach", label: "Đào",    bg: "bg-[#fff5ee]" },
  { value: "cream", label: "Kem",    bg: "bg-[#fffaf0]" },
];

const CLOUD_NAME   = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: form }
  );
  if (!res.ok) throw new Error("Upload ảnh thất bại, thử lại nhé.");
  const data = (await res.json()) as { secure_url: string };
  return data.secure_url;
}

export function WishFormFirebase() {
  const router = useRouter();

  const [from,      setFrom]      = useState("");
  const [relation,  setRelation]  = useState("");
  const [message,   setMessage]   = useState("");
  const [sticker,   setSticker]   = useState("💗");
  const [tone,      setTone]      = useState<WishTone>("pink");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview,   setPreview]   = useState<string | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setError("Ảnh tối đa 8 MB.");
      return;
    }
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setError(null);
  }

  function removeImage() {
    setImageFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!from.trim() || !message.trim()) return;
    setLoading(true);
    setError(null);

    try {
      let imageUrl: string | null = null;
      if (imageFile) imageUrl = await uploadImage(imageFile);

      await addDoc(collection(db, "wishes"), {
        from:      from.trim(),
        relation:  relation.trim() || null,
        message:   message.trim(),
        sticker,
        tone,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      router.push("/?gui=ok");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra, thử lại nhé.");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-xl space-y-5 rounded-4xl bg-white p-7 shadow-[0_8px_40px_rgba(249,168,201,0.2)] ring-1 ring-rose/20"
    >
      <div>
        <h1 className="font-script text-4xl text-navy">Gửi lời chúc 💌</h1>
        <p className="mt-1 text-sm text-navy/55">
          Lời chúc của bạn sẽ hiện trên trang lời chúc cho cả nhà cùng đọc.
        </p>
      </div>

      {/* name */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-navy/70">Tên bạn *</label>
        <input
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="Nguyễn Văn A"
          required
          className="w-full rounded-2xl bg-blush px-4 py-3 text-sm outline-none ring-1 ring-rose/20 focus:ring-2 focus:ring-rose"
        />
      </div>

      {/* relation */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-navy/70">
          Vai trò / Quan hệ <span className="font-normal opacity-50">(tuỳ chọn)</span>
        </label>
        <input
          value={relation}
          onChange={(e) => setRelation(e.target.value)}
          placeholder="Thành viên Học Chúng Chánh Tâm"
          className="w-full rounded-2xl bg-blush px-4 py-3 text-sm outline-none ring-1 ring-rose/20 focus:ring-2 focus:ring-rose"
        />
      </div>

      {/* message */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-navy/70">Lời chúc *</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Viết lời chúc cho Việt Thi..."
          rows={5}
          required
          className="w-full resize-none rounded-2xl bg-blush px-4 py-3 text-sm leading-7 outline-none ring-1 ring-rose/20 focus:ring-2 focus:ring-rose"
        />
      </div>

      {/* sticker */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-navy/70">Sticker</label>
        <div className="flex flex-wrap gap-2">
          {STICKERS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSticker(s)}
              className={`rounded-full px-3 py-1.5 text-lg transition ${
                sticker === s
                  ? "bg-rose/20 ring-2 ring-rose"
                  : "bg-blush hover:bg-rose/10"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* tone */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-navy/70">Màu card</label>
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTone(t.value)}
              className={`${t.bg} rounded-full px-4 py-1.5 text-sm font-semibold text-navy/70 transition ${
                tone === t.value ? "ring-2 ring-rose" : "ring-1 ring-navy/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* image upload */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-navy/70">
          Ảnh kèm theo <span className="font-normal opacity-50">(tuỳ chọn · tối đa 8 MB)</span>
        </label>
        {preview ? (
          <div className="relative overflow-hidden rounded-2xl">
            <div className="relative aspect-video w-full">
              <Image
                src={preview}
                alt="preview"
                fill
                className="object-cover"
                sizes="480px"
                unoptimized
              />
            </div>
            <button
              type="button"
              onClick={removeImage}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-sm text-white backdrop-blur-sm hover:bg-black/70"
              aria-label="Xoá ảnh"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-rose/30 bg-blush py-5 text-sm text-navy/50 transition hover:border-rose hover:text-rose"
          >
            📷 Chọn ảnh
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
        />
      </div>

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-500">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={loading || !from.trim() || !message.trim()}
        className="w-full rounded-full bg-linear-to-r from-rose to-petal py-3.5 text-sm font-bold text-white shadow-[0_4px_20px_rgba(249,168,201,0.45)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Đang gửi..." : "Gửi lời chúc 💌"}
      </button>
    </form>
  );
}
