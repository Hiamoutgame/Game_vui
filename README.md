# Vũ Trụ Task Vụ

Website truyền thông tương tác về “ảo tưởng đa nhiệm” dành cho người trẻ 18–24 tuổi tại TP.HCM. Dự án dùng giao diện neon/cyberpunk, bài ghi chép, Media Archive và nhiệm vụ mô phỏng đổi tác vụ.

## Công nghệ

- Next.js 16.2 (App Router) và React 19
- TypeScript
- Tailwind CSS 4
- `next/font`: Be Vietnam Pro, Chakra Petch, Geist Mono
- pnpm

## Chạy dự án

Cần Node.js tương thích Next.js 16 và pnpm.

```bash
pnpm install
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000). Những lệnh thường dùng:

```bash
pnpm lint
pnpm build
pnpm start
```

## Các khu vực

| Khu vực | URL | Mô tả |
| --- | --- | --- |
| Trang chủ | `/` | Giới thiệu chiến dịch và các module. |
| Về dự án | `/about` | Vấn đề, thông điệp, cách tiếp cận. |
| Thông tin | `/information` | Danh sách ghi chép và insight. |
| Bài viết | `/information/[slug]` | Bài viết tạo từ dữ liệu. |
| Media Archive | `/media-archive` | Photoshoot, series và phim ngắn. |
| Nhiệm vụ | `/mission` | Tự đánh giá thói quen đổi tác vụ. |
| Game mô phỏng | `/mission/play` | Bốn mini-game mô phỏng đa nhiệm. |
| Liên hệ | `/contact` | Liên hệ và social của chiến dịch. |

## Cấu trúc

```text
app/                    Routes, layout, styles, sitemap, robots
app/(site)/mission/play/ Game engine, mini-games, Web Audio
components/layout/      Header, footer, skip link
components/ui/          Các primitive giao diện neon
components/features/    Giao diện theo tính năng (Media Archive)
libs/content/           Nội dung chiến dịch có kiểu dữ liệu
libs/navigation.ts      Menu điều hướng
types/                  Kiểu dữ liệu dùng chung
public/                 Tài nguyên tĩnh khi chạy app
assets/                 Tài nguyên và tham chiếu thiết kế
```

## Cập nhật nội dung và media

- Nhận diện, liên hệ, social: `libs/content/site.ts`
- Bài viết: `libs/content/articles.ts`
- Media Archive, photoshoot, series: `libs/content/media.ts`
- Câu hỏi và kết quả nhiệm vụ: `libs/content/mission.ts`
- Menu: `libs/navigation.ts`

Một số ảnh/video hiện là `EmptyAssetFrame` hoặc mock player. Khi có asset chính thức, đặt asset runtime trong `public/`, bổ sung `src` cho `AssetRef`, rồi thay placeholder ở component liên quan. Các file ở `assets/` không được Next.js tự động phục vụ.

## Phát triển

Xem [AGENTS.md](AGENTS.md) để biết quy ước kiến trúc, Server/Client Components, accessibility, game state và kiểm tra. Dự án dùng Next.js 16, vì vậy hãy đọc hướng dẫn phù hợp trong `node_modules/next/dist/docs/` trước khi thay đổi API hay convention của framework.
