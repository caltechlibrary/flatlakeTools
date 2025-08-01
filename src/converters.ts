import { Post, RSSFeed, RSSItem } from './metadata.ts';

export function convertToRSS(posts: Post[], channelInfo: Partial<RSSFeed>): RSSFeed {
    const feed: RSSFeed = {
        title: channelInfo.title || "My Blog",
        description: channelInfo.description || "A collection of blog posts",
        link: channelInfo.link || "http://example.com",
        language: channelInfo.language,
        copyright: channelInfo.copyright,
        managingEditor: channelInfo.managingEditor,
        webMaster: channelInfo.webMaster,
        items: [],
    };

    const baseUrl = feed.link;

    posts.forEach((post) => {
        const item: RSSItem = {
            title: post.data.title,
            description: post.data.abstract,
            link: new URL(post.data.url, baseUrl).toString(), // Combine base URL with item URL
            pubDate: new Date(post.data.datePublished || post.data.pubDate || post.data.dateCreated || post.data.dateModified || Date.now()).toUTCString(),
            author: post.data.author,
            categories: post.data.keywords,
        };
        feed.items.push(item);
    });

    return feed;
}
