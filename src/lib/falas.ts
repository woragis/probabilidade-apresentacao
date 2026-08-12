import { readFileSync } from "node:fs";
import { join } from "node:path";

export const FALA_CHAPTERS = [
  { slug: "mapa", file: "00-mapa.md", nav: "Mapa" },
  { slug: "abertura", file: "01-abertura-fundamentos.md", nav: "Abertura" },
  { slug: "encontros", file: "02-encontros.md", nav: "Encontros" },
  { slug: "caes", file: "03-caes-bayes.md", nav: "Cães" },
  { slug: "xadrez", file: "04-xadrez-war-sintese.md", nav: "Xadrez–fim" },
] as const;

export type FalaChapter = {
  slug: string;
  nav: string;
  title: string;
  html: string;
};

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inline(s: string): string {
  return escapeHtml(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function mdToHtml(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;

  const flushList = (kind: "ul" | "ol", items: string[]) => {
    out.push(`<${kind}>${items.map((it) => `<li>${it}</li>`).join("")}</${kind}>`);
  };

  while (i < lines.length) {
    const line = lines[i]!;
    const trimmed = line.trim();

    if (trimmed === "") {
      i++;
      continue;
    }

    if (trimmed === "---") {
      out.push("<hr />");
      i++;
      continue;
    }

    const h = /^(#{1,3})\s+(.*)$/.exec(trimmed);
    if (h) {
      const level = h[1]!.length;
      const heading = h[2]!;
      const text = inline(heading);
      const Tag = `h${level}`;
      const isSlide = /^\d+[.)]/.test(heading);
      if (level >= 2 && isSlide) {
        out.push(`<article class="slide-card"><${Tag}>${text}</${Tag}>`);
        i++;
        const body: string[] = [];
        while (i < lines.length) {
          const n = lines[i]!.trim();
          if (n.startsWith("#") || n === "---") break;
          body.push(lines[i]!);
          i++;
        }
        out.push(mdToHtml(body.join("\n")));
        out.push("</article>");
        continue;
      }
      out.push(`<${Tag}>${text}</${Tag}>`);
      i++;
      continue;
    }

    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i]!.trim().startsWith("|")) {
        const cells = lines[i]!
          .trim()
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim());
        if (!cells.every((c) => /^:?-+:?$/.test(c))) rows.push(cells);
        i++;
      }
      if (rows.length) {
        const head = rows[0]!;
        const body = rows.slice(1);
        out.push(
          `<div class="table-wrap"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${body
            .map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`)
            .join("")}</tbody></table></div>`,
        );
      }
      continue;
    }

    if (trimmed.startsWith(">")) {
      const quote: string[] = [];
      while (i < lines.length && lines[i]!.trim().startsWith(">")) {
        quote.push(lines[i]!.trim().replace(/^>\s?/, ""));
        i++;
      }
      out.push(`<blockquote>${quote.map((q) => (q ? `<p>${inline(q)}</p>` : "")).join("")}</blockquote>`);
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i]!.trim())) {
        items.push(inline(lines[i]!.trim().replace(/^[-*]\s+/, "")));
        i++;
      }
      flushList("ul", items);
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i]!.trim())) {
        items.push(inline(lines[i]!.trim().replace(/^\d+\.\s+/, "")));
        i++;
      }
      flushList("ol", items);
      continue;
    }

    const para: string[] = [trimmed];
    i++;
    while (
      i < lines.length &&
      lines[i]!.trim() !== "" &&
      !lines[i]!.trim().startsWith("#") &&
      !lines[i]!.trim().startsWith("|") &&
      !lines[i]!.trim().startsWith(">") &&
      !lines[i]!.trim().startsWith("---") &&
      !/^[-*]\s+/.test(lines[i]!.trim()) &&
      !/^\d+\.\s+/.test(lines[i]!.trim())
    ) {
      para.push(lines[i]!.trim());
      i++;
    }
    const text = para.join(" ");
    const cls = /^\*\*Gancho/.test(trimmed) ? ' class="gancho"' : "";
    out.push(`<p${cls}>${inline(text)}</p>`);
  }

  return out.join("\n");
}

export function loadFalaChapters(): FalaChapter[] {
  const dir = join(process.cwd(), "content/falas");
  return FALA_CHAPTERS.map((ch) => {
    const raw = readFileSync(join(dir, ch.file), "utf8");
    const title = raw.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? ch.nav;
    return { slug: ch.slug, nav: ch.nav, title, html: mdToHtml(raw) };
  });
}
