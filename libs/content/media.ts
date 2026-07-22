import type { AssetRef, MediaEntry, SeriesEpisode } from "@/types/content";

export const mediaEntries: MediaEntry[] = [
  {
    slug: "photoshoot",
    title: "Photoshoot",
    subtitle: "Ảo ảnh đa nhiệm",
    description:
      "Bộ ảnh thị giác hóa trạng thái bận rộn, nhiễu tín hiệu và cảm giác kiểm soát giả khi đổi tác vụ liên tục.",
    cta: "Xem bộ ảnh",
    href: "/media-archive/photoshoot",
    cover: {
      label: "archive-photoshoot.jpg",
      alt: "Bìa photoshoot Ảo ảnh đa nhiệm",
      ratio: "portrait",
    },
  },
  {
    slug: "series",
    title: "Series",
    subtitle: "Một Cú Task",
    description:
      "Ba tập nội dung ngắn bóc tách cảm giác siêu năng lực multitask và khoảng cách giữa bận rộn với hiệu quả.",
    cta: "Xem series",
    href: "/media-archive/series",
    cover: {
      label: "archive-series.jpg",
      alt: "Bìa series Một Cú Task",
      ratio: "portrait",
    },
  },
  {
    slug: "short-film",
    title: "Phim ngắn",
    subtitle: "Ảo ảnh đa nhiệm",
    description:
      "Một câu chuyện 16:9 về người trẻ đi giữa các luồng việc, thông báo và deadline trong cùng một hệ thống.",
    cta: "Xem phim",
    href: "/media-archive/short-film",
    cover: {
      label: "archive-phim.jpg",
      alt: "Bìa phim ngắn Ảo ảnh đa nhiệm",
      ratio: "portrait",
    },
  },
];

export const photos: (AssetRef & { id: string })[] = Array.from(
  { length: 6 },
  (_, index) => ({
    id: `photo-${index + 1}`,
    label: `photoshoot-${index + 1}.jpg`,
    alt: `Photoshoot Ảo ảnh đa nhiệm - ảnh ${index + 1}`,
    ratio: index < 4 ? "portrait" : "wide",
  }),
);

export const seriesEpisodes: SeriesEpisode[] = [1, 2, 3].map((episode) => ({
  episode: String(episode),
  title: `Tập ${episode}`,
  description:
    "Mô tả chính thức của tập này đang chờ đội nội dung cập nhật. Trang giữ cấu trúc sẵn để không phá flow Media Archive.",
  needsContent: true,
  poster: {
    label: `series-tap${episode}.jpg`,
    alt: `Poster Một Cú Task tập ${episode}`,
    ratio: "poster",
  },
}));

export function getEpisode(episode: string) {
  return seriesEpisodes.find((item) => item.episode === episode);
}
