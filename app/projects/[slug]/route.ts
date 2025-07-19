import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const views = await redis.get<number>(["pageviews", "projects", slug].join(":")) ?? 0;
  return NextResponse.json({ views });
}
