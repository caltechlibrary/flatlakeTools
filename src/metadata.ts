export interface Post {
    content: string;
    data: {
        abstract: string;
        author: string;
        dateCreated?: string;
        dateModified?: string;
        datePublished?: string;
        keywords: string[];
        pubDate?: string;
        title: string;
        url: string;
    };
}

export interface RSSFeed {
    title: string;
    description: string;
    link: string;
    language?: string;
    copyright?: string;
    managingEditor?: string;
    webMaster?: string;
    items: RSSItem[];
}

export interface RSSItem {
    title: string;
    description: string;
    link: string;
    pubDate: string;
    author: string;
    categories: string[];
}

