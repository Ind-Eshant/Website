import Link from "next/link";
import React from "react";
import { allProjects } from "contentlayer/generated";
import { Navigation } from "../components/nav"; // if nav.tsx exists there
import { Card } from "../components/card";       // if card.tsx exists there
import { Article } from "../components/article";
import { Eye } from "lucide-react";
import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = Redis.fromEnv();
}

export const revalidate = 60;

export default async function ProjectsPage() {
  const featured = allProjects.find((project) => project.slug === "joker")!;

  const sorted = allProjects
    .filter((p) => p.published)
    .filter((project) => project.slug !== featured.slug)
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime(),
    );

  return (
    <div className="relative pb-16">
      <Navigation />
      <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Projects
          </h2>
          <p className="mt-4 text-zinc-400">
            These Are Projects I Built Over Time.
          </p>
        </div>
        <div className="w-full h-px bg-zinc-800" />

       <div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2">
  {[featured, ...sorted].map((project) => (
    <Card key={project.slug}>
      <Link href={`/projects/${project.slug}`}>
        <article className="relative w-full h-full p-4 md:p-8">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs text-zinc-100">
              {project.date ? (
                <time dateTime={new Date(project.date).toISOString()}>
                  {Intl.DateTimeFormat(undefined, {
                    dateStyle: "medium",
                  }).format(new Date(project.date))}
                </time>
              ) : (
                <span>SOON</span>
              )}
            </div>
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <Eye className="w-4 h-4" />{" "}
              <span className="font-medium">126</span>
            </span>
          </div>

          <h2 className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display">
            {project.title}
          </h2>
          <p className="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300">
            {project.description}
          </p>
          <div className="mt-6">
            <p className="text-zinc-200 hover:text-zinc-50 text-sm">
              Read more <span aria-hidden="true">&rarr;</span>
            </p>
          </div>
        </article>
      </Link>
    </Card>
  ))}
</div>


        <div className="hidden w-full h-px md:block bg-zinc-800" />

        
      </div>
    </div>
  );
}
