import { RSSFeed } from './metadata.ts';

export function generateRSS(feed: RSSFeed): string {
    const itemsXML = feed.items
        .map(
            (item) => `
        <item>
            <title><![CDATA[${item.title}]]></title>
            <description><![CDATA[${item.description}]]></description>
            <link>${item.link}</link>
            <pubDate>${item.pubDate}</pubDate>
            <author>${item.author}</author>
            ${item.categories.map((category) => `<category>${category}</category>`).join("")}
        </item>
    `
        )
        .join("");

    return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
    <channel>
        <title><![CDATA[${feed.title}]]></title>
        <description><![CDATA[${feed.description}]]></description>
        <link>${feed.link}</link>
        ${feed.language ? `<language>${feed.language}</language>` : ''}
        ${feed.copyright ? `<copyright>${feed.copyright}</copyright>` : ''}
        ${feed.managingEditor ? `<managingEditor>${feed.managingEditor}</managingEditor>` : ''}
        ${feed.webMaster ? `<webMaster>${feed.webMaster}</webMaster>` : ''}
        ${itemsXML}
    </channel>
</rss>`;
}

export function generateCommonMark(feed: RSSFeed): string {
    // Generate YAML front matter
    const yamlFrontMatter = `---
title: "${feed.title}"
description: "${feed.description}"
link: ${feed.link}
${feed.language ? `language: ${feed.language}\n` : ''}
${feed.copyright ? `copyright: "${feed.copyright}"\n` : ''}
${feed.managingEditor ? `managingEditor: ${feed.managingEditor}\n` : ''}
${feed.webMaster ? `webMaster: ${feed.webMaster}\n` : ''}
---

`;

    // Generate Markdown content for items
    const markdownItems = feed.items.map(item => {
        return `
### [${item.title}](${item.link})

**Description:** ${item.description}

**Author:** ${item.author}

**Published on:** ${item.pubDate}

**Categories:** ${item.categories.join(', ')}

---
`;
    }).join("\n");

    return yamlFrontMatter + markdownItems;
}
