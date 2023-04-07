import React from "react";

interface ArticleSectionProps {
  data: string;
}

export function ArticleSection({ data }: ArticleSectionProps) {
  return (
    <div className="flex flex-col items-center">
      <p>{data}</p>
    </div>
  );
}
