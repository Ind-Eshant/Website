import { notFound } from "next/navigation";
import { allProjects } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import { Header } from "./header";
import "./mdx.css";
import { ReportView } from "./view";
import { Redis } from "@upstash/redis";

export const revalidate = 60;

type Props = {
  params: {
    slug: string;
  };
};

// Delay Redis client creation until runtime and check env var
let redis: Redis | null = null;
if (process.env.REDIS_URL) {
  redis = Redis.fromEnv();
}

export async function generateStaticParams(): Promise<Props["params"][]> {
  return allProjects
    .filter((p) => p.published)
    .map((p) => ({
      slug: p.slug,
    }));
}

export default async function PostPage({ params }: Props) {
  const slug = params?.slug;
  const project = allProjects.find((project) => project.slug === slug);

  if (!project) {
    notFound();
  }

  // If you want to use redis, check redis is not null
  // const views = redis ? await redis.get(`views:${slug}`) : 0;
  // For now, you have views hardcoded, so you can keep it

  return (
    <div className="bg-zinc-50 min-h-screen">
      <Header project={project} views={126} />
      <ReportView slug={project.slug} />

      <article className="px-4 py-12 mx-auto prose prose-zinc prose-quoteless">
        <Mdx code={project.body.code} />
      </article>
    </div>
  );
}
