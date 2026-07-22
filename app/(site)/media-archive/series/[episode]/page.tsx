import { EpisodePage } from "@/components/features/media/MediaPages";
import { seriesEpisodes } from "@/libs/content/media";

export function generateStaticParams() {
  return seriesEpisodes.map((item) => ({ episode: item.episode }));
}

export default async function Page({ params }: { params: Promise<{ episode: string }> }) {
  const { episode } = await params;
  return <EpisodePage episode={episode} />;
}
