export type Photo = {
  src: string;
  alt: string;
  span?: "tall" | "wide";
};

export const photos: Photo[] = [
  {
    src: "/photos/01-tot-nghiep.png",
    alt: "Việt Thi trong lễ tốt nghiệp",
    span: "tall",
  },
  {
    src: "/photos/05-chia-tay.png",
    alt: "Học Chúng Chánh Tâm buổi chia tay",
    span: "wide",
  },
  {
    src: "/photos/04-tet-binh-ngo.png",
    alt: "Tết tại Tự Viện Phước Duyên",
  },
  {
    src: "/photos/03-phat-dan-2023.png",
    alt: "Đại lễ Phật Đản tại Tự Viện Phước Duyên",
  },
  {
    src: "/photos/07-phat-dan-2024.png",
    alt: "Học Chúng Chánh Tâm trong đại lễ Phật Đản",
  },
  {
    src: "/photos/02-ban-be.png",
    alt: "Bạn bè Học Chúng Chánh Tâm",
  },
  {
    src: "/photos/06-trai-tim.png",
    alt: "Hai người bạn tạo hình trái tim",
    span: "tall",
  },
  {
    src: "/photos/08-hoa-va-qua.png",
    alt: "Việt Thi bên hoa và quà tốt nghiệp",
    span: "tall",
  },
  {
    src: "/photos/09-ao-dai.png",
    alt: "Việt Thi áo dài và lễ phục tốt nghiệp",
  },
];
