"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { RichTextEditor } from "@/components/shared/forms/RichTextEditor";
import { MainH } from "@/components/shared/text/Headings";

export default function RichTextEditorPage() {
  const t = useTranslations("Forms.pages.richText");
  const [content, setContent] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <MainH title={ t("title") } description={ t("description") } />
      <RichTextEditor value={ content } onChange={ setContent } />
    </div>
  );
}
