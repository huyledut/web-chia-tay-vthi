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

export const wishes: Wish[] = [
  {
    id: "1",
    from: "Học Chúng Chánh Tâm",
    relation: "Tự Viện Phước Duyên · Huế",
    sticker: "🙏",
    tone: "sky",
    message:
      "Thi ơi, từ mái chùa Phước Duyên đến trời Mỹ là một hành trình rất dài. Chúng mình chắp tay chúc cậu đi an lành, tới nơi bình an, và giữ được tâm Chánh Tâm dù ở bất cứ nơi đâu.",
  },
  {
    id: "2",
    from: "Các huynh đệ Chánh Tâm",
    relation: "học chúng",
    sticker: "🌸",
    tone: "pink",
    message:
      "Những buổi cùng lạy, cùng học, cùng cười ở Huế sẽ theo cậu sang Mỹ. Nhớ nhà thì nhớ chúng mình cũng được — chúng mình vẫn ở Tự Viện, vẫn gọi tên cậu như ngày cậu chưa đi.",
  },
  {
    id: "3",
    from: "Một người em Chánh Tâm",
    sticker: "✈️",
    tone: "cream",
    message:
      "Chị Thi đi Mỹ, em chúc chị mạnh khỏe, học giỏi, ngủ ngon trên máy bay, và mỗi lần nhớ Huế thì nhìn trời — vì mây thì đi được cả hai phía.",
  },
  {
    id: "4",
    from: "Một người chị",
    relation: "Học Chúng Chánh Tâm",
    sticker: "💗",
    tone: "lilac",
    message:
      "Cậu tốt nghiệp rồi, giờ lại thêm một cái tốt nghiệp của lòng dũng cảm: dám đi xa. Chị tin cậu sẽ ổn. Mỹ lớn, nhưng trái tim cậu vốn đã rộng từ những ngày ở Phước Duyên.",
  },
  {
    id: "5",
    from: "Bạn cùng khóa tu",
    sticker: "🌙",
    tone: "peach",
    message:
      "Chúc Thi giữ được nụ cười dịu dàng trong tấm hình tốt nghiệp, giữ được đôi tay chắp trong đại lễ Phật Đản, và giữ được chúng mình trong một góc nhỏ của cuộc sống mới.",
  },
  {
    id: "6",
    from: "Cả nhà Chánh Tâm",
    sticker: "☁️",
    tone: "pink",
    message:
      "Đi vui nhé Việt Thi. Huế, Tự Viện Phước Duyên, Học Chúng Chánh Tâm — cửa vẫn mở. Khi nào nhớ, về. Khi nào mỏi, gọi. Chúng mình gửi cậu đi bằng lời chúc, không phải bằng sự quên.",
  },
];
