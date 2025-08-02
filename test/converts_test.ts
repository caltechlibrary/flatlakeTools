import { assertEquals } from "jsr:@std/assert";
import { convertToRSS } from "../src/converters.ts";
import { Post } from "../src/metadata.ts";

Deno.test("convertToRSS should convert posts to RSS feed correctly", () => {
  const posts: Post[] = [
    {
      content: "Test content",
      data: {
        abstract: "Test abstract",
        author: "Test author",
        keywords: ["test", "example"],
        title: "Test title",
        datePublished: "2023-01-01",
      },
      url: "test-url"
    },
  ];

  const channelInfo = {
    title: "Test Feed",
    description: "Test Description",
    link: "http://example.com",
  };

  const feed = convertToRSS(posts, channelInfo);

  assertEquals(feed.title, "Test Feed");
  assertEquals(feed.description, "Test Description");
  assertEquals(feed.link, "http://example.com");
  assertEquals(feed.items.length, 1);
  assertEquals(feed.items[0].title, "Test title");
  assertEquals(feed.items[0].description, "Test abstract");
  assertEquals(feed.items[0].link, "http://example.com/test-url");
});
