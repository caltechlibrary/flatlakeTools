import { assertEquals, assertNotEquals } from "@std/assert";

import { CommonMarkDoc } from "../src/commonMark.ts";

Deno.test("testing the CommonMarkDoc object", () => {
  // Example usage
  const docTextWithFrontMatter = `---
title: Example Document
author: John Doe
date: '2023-10-01'

---

# Hello World

This is an example of a CommonMark document.`;

  let fm = new CommonMarkDoc(docTextWithFrontMatter);
  fm.parse(docTextWithFrontMatter);
  const frontMatter = fm.frontMatter || {};
  assertNotEquals(fm.frontMatter, null);
  assertEquals(frontMatter.title, "Example Document");
  assertEquals(frontMatter.author, "John Doe");
  assertEquals(frontMatter.date, "2023-10-01");
  assertEquals(
    fm.content,
    `# Hello World

This is an example of a CommonMark document.`,
  );

  assertEquals(docTextWithFrontMatter, fm.stringify());

  const docTextWithoutFrontMatter = `# Hello World

This is an example of a CommonMark document without front matter.`;

  fm = new CommonMarkDoc(docTextWithoutFrontMatter);
  assertEquals(fm.frontMatter, null);
  assertEquals(
    fm.content,
    `# Hello World

This is an example of a CommonMark document without front matter.`,
  );

  assertEquals(docTextWithoutFrontMatter, fm.stringify());
});
