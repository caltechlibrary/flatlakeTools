import { assertEquals } from "@std/assert";
import { Post, RSSFeed, RSSItem } from "../src/metadata.ts";

Deno.test("Post structure should match expected format", () => {
  const post: Post = {
    content: "Test content",
    data: {
      abstract: "Test abstract",
      author: "Test author",
      keywords: ["test", "example"],
      title: "Test title",
    },
    url: "test-url",
  };

  assertEquals(post.content, "Test content");
  assertEquals(post.data.abstract, "Test abstract");
  assertEquals(post.data.author, "Test author");
  assertEquals(post.data.keywords, ["test", "example"]);
  assertEquals(post.data.title, "Test title");
  assertEquals(post.url, "test-url");
});

Deno.test("RSSFeed structure should match expected format", () => {
  const feed: RSSFeed = {
    title: "Test Feed",
    description: "Test Description",
    link: "http://example.com",
    items: [],
  };

  assertEquals(feed.title, "Test Feed");
  assertEquals(feed.description, "Test Description");
  assertEquals(feed.link, "http://example.com");
  assertEquals(feed.items, []);
});

Deno.test("RSSItem structure should match expected format", () => {
  const item: RSSItem = {
    title: "Item Title",
    description: "Item Description",
    link: "http://example.com/item",
    pubDate: "Mon, 01 Jan 2023 00:00:00 GMT",
    author: "Item Author",
    categories: ["category1", "category2"],
  };

  assertEquals(item.title, "Item Title");
  assertEquals(item.description, "Item Description");
  assertEquals(item.link, "http://example.com/item");
  assertEquals(item.pubDate, "Mon, 01 Jan 2023 00:00:00 GMT");
  assertEquals(item.author, "Item Author");
  assertEquals(item.categories, ["category1", "category2"]);
});
