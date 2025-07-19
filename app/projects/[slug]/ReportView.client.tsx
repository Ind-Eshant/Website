"use client";

import { useEffect, useState } from "react";

export function ReportView({ slug }: { slug: string }) {
  const [views, setViews] = useState<number>(0);

  useEffect(() => {
    fetch(`/api/views/${slug}`)
      .then((res) => res.json())
      .then((data) => setViews(data.views))
      .catch(() => setViews(0));
  }, [slug]);

  return (
    <div className="text-zinc-500 text-sm px-4 pt-2">
      {views.toLocaleString()} views
    </div>
  );
}
