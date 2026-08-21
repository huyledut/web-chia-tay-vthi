export type WishTone = "pink" | "sky" | "cream" | "lilac" | "peach";

export type Wish = {
  id: string;
  from: string;
  relation?: string;
  message: string;
  sticker: string;
  tone: WishTone;
  imageUrl?: string;
};
