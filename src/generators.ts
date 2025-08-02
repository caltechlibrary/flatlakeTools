import { RSSFeed } from "./metadata.ts";


function escapeXML(input: string): string {
    return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function santizeMarkup(text: string | null | undefined): string {
  if (text === undefined || text === null) {
    return '';
  }
  return escapeXML(text as string);
}

export function generateRSS(feed: RSSFeed): string {
  const itemsXML = feed.items
    .map(
      (item) => `
        <item>
            <title><![CDATA[${item.title}]]></title>
            <description><![CDATA[${santizeMarkup(item.description)}]]></description>
            <link>${item.link}</link>
            <guid>${item.guid}</guid>
            <pubDate>${item.pubDate}</pubDate>
            <author>${item.author}</author>
            ${
        item.categories.map((category) => `<category>${category}</category>`)
          .join("")
      }
        </item>
    `,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title><![CDATA[${feed.title}]]></title>
        <description><![CDATA[${santizeMarkup(feed.description)}]]></description>
        <link>${feed.link}</link>
        ${feed.language ? `<language>${feed.language}</language>` : ""}
        ${feed.copyright ? `<copyright>${feed.copyright}</copyright>` : ""}
        ${
    feed.managingEditor
      ? `<managingEditor>${feed.managingEditor}</managingEditor>`
      : ""
  }
        ${feed.webMaster ? `<webMaster>${feed.webMaster}</webMaster>` : ""}
        <atom:link href="${feed.link}" rel="self" type="application/rss+xml" />
        ${itemsXML}
    </channel>
</rss>`;
}

export function generateCommonMark(feed: RSSFeed): string {
  // Generate YAML front matter
  const yamlFrontMatter = `---
title: "${feed.title}"
${feed.description ? `description: "${feed.description}"\n` : ''}
${feed.link ? `link: ${feed.link}\n` : ''}
${feed.language ? `language: ${feed.language}\n` : ''}
${feed.copyright ? `copyright: "${feed.copyright}"\n` : ''}
${feed.managingEditor ? `managingEditor: ${feed.managingEditor}\n` : ''}
${feed.webMaster ? `webMaster: ${feed.webMaster}\n` : ''}
---
`;
  
  let header:string = '';
  if (feed.title !== undefined && feed.title !== null) {
	  header = `\n# ${feed.title}\n`;
  }
  if (feed.description !== undefined && feed.description !== null) {
	  header += `\n${feed.description}\n\n`;
  }

  // Generate Markdown content for items
  const markdownItems = feed.items.map((item) => {
    //FIXME: the link to be relative to this blog index page, not an absolute URL.
    const title = item.title ? `\n## [${item.title}](${item.link})\n` : '';
    const description = item.description ? `**Description:** ${item.description}\n\n` : '';
    const author = item.author ? `**Author:** ${item.author}` : '';
    let pubDate = item.pubDate ? `**Published on:** ${item.pubDate}` : '';
    const categories = item.categories && item.categories.length > 0 ? `**Categories:** ${item.categories.join(", ")}` : '';
    if (pubDate !== '') {
      try {
        pubDate = (new Date(pubDate)).toISOString().split('T')[0];
      } catch(_error) {
        // just leave it alone for now.
      }
    }
    // Combine the fields, filtering out any empty strings
    const fields = [title, description, author, pubDate, categories].filter(field => field !== '');

    // Join the fields with newlines and add separators if there are any fields
    return fields.length > 0 ? `\n${fields.join('\n')}\n---\n` : '';
  }).join("\n");

  return yamlFrontMatter + header + markdownItems;
}
