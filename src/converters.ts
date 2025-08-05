import * as path from "@std/path";
import { Post, RSSFeed, RSSItem } from "./metadata.ts";

function channelLinkToBaseUrl(link: string): string {
  const u = new URL(link);
  const p = path.dirname(u.pathname);
  u.pathname = p;
  return u.toString();
}

function jsonLinkToHtmlLink(link: string | URL): string | URL {
  let dname: string = "";
  let bname: string = "";
  if (link instanceof URL) {
    dname = path.dirname(link.pathname);
    bname = path.basename(link.pathname).replace(/\.json$/g, ".html");
    link.pathname = path.join(dname, bname);
    return link;
  } else {
    dname = path.dirname(link);
    bname = path.basename(link).replace(/\.json$/g, ".html");
    return path.join(dname, bname);
  }
}

export function convertToRSS(
  posts: Post[],
  channelInfo: Partial<RSSFeed>,
): RSSFeed {
  const feed: RSSFeed = {
    title: channelInfo.title || "A Blog",
    description: channelInfo.description || "A collection of blog posts",
    link: channelInfo.link || "http://example.edu",
    language: channelInfo.language,
    copyright: channelInfo.copyright,
    managingEditor: channelInfo.managingEditor,
    webMaster: channelInfo.webMaster,
    items: [],
  };

  const baseUrl = channelLinkToBaseUrl(feed.link);

  posts.forEach((post) => {
    // Combine the base URL with the post URL to form an absolute URL
    const absoluteUrl: string = new URL(jsonLinkToHtmlLink(post.url), baseUrl)
      .toString();

    const item: RSSItem = {
      title: post.data.title,
      description: post.data.abstract,
      guid: absoluteUrl, // Use the absolute URL for a GUID
      link: absoluteUrl, // Use the absolute URL for the link
      pubDate: new Date(
        post.data.datePublished || post.data.pubDate || post.data.dateCreated ||
          post.data.dateModified || Date.now(),
      ).toUTCString(),
      author: post.data.author,
      categories: post.data.keywords,
    };
    feed.items.push(item);
  });

  return feed;
}
