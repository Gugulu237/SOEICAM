export function wantsMarkdown(accept: string | null) {
  const entries = (accept || "").split(",").map((entry) => {
    const [media, ...parameters] = entry.trim().toLowerCase().split(";");
    const quality = parameters.find((parameter) => parameter.trim().startsWith("q="));
    const q = quality ? Number(quality.trim().slice(2)) : 1;
    return { media: media.trim(), q: Number.isFinite(q) && q >= 0 && q <= 1 ? q : 0 };
  });
  const markdown = entries.find((entry) => entry.media === "text/markdown");
  const html = entries.find((entry) => entry.media === "text/html") || entries.find((entry) => entry.media === "text/*") || entries.find((entry) => entry.media === "*/*");
  return Boolean(markdown && markdown.q > 0 && markdown.q >= (html?.q ?? 0));
}
