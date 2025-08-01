import { assertStringIncludes } from "jsr:@std/assert";
import { generateRSS, generateCommonMark } from "../src/generators.ts";
import { RSSFeed } from "../src/metadata.ts";

Deno.test("generateRSS should produce valid RSS XML", () => {
    const feed: RSSFeed = {
        title: "Test Feed",
        description: "Test Description",
        link: "http://example.com",
        items: [
            {
                title: "Item Title",
                description: "Item Description",
                link: "http://example.com/item",
                pubDate: "Mon, 01 Jan 2023 00:00:00 GMT",
                author: "Item Author",
                categories: ["category1", "category2"],
            },
        ],
    };

    const rssXML = generateRSS(feed);

    assertStringIncludes(rssXML, "<title><![CDATA[Test Feed]]></title>");
    assertStringIncludes(rssXML, "<description><![CDATA[Test Description]]></description>");
    assertStringIncludes(rssXML, "<link>http://example.com</link>");
    assertStringIncludes(rssXML, "<item>");
});

Deno.test("generateCommonMark should produce valid CommonMark with YAML front matter", () => {
    const feed: RSSFeed = {
        title: "Test Feed",
        description: "Test Description",
        link: "http://example.com",
        items: [
            {
                title: "Item Title",
                description: "Item Description",
                link: "http://example.com/item",
                pubDate: "Mon, 01 Jan 2023 00:00:00 GMT",
                author: "Item Author",
                categories: ["category1", "category2"],
            },
        ],
    };

    const commonMark = generateCommonMark(feed);

    assertStringIncludes(commonMark, "---");
    assertStringIncludes(commonMark, 'title: "Test Feed"');
    assertStringIncludes(commonMark, 'description: "Test Description"');
    assertStringIncludes(commonMark, "### [Item Title](http://example.com/item)");
});
