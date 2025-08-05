/**
 * blogit.ts handle front matter validation and copying of the CommonMark document into the blog directory structure.
 */
import { basename, join } from "@std/path";
import * as yaml from "@std/yaml";
import { exists } from "@std/fs/exists";
import { CommonMarkDoc } from "./commonMark.ts";

async function publish(
  blogBaseDir: string,
  cmarkDoc: CommonMarkDoc,
  filename: string,
): Promise<boolean> {
  if (cmarkDoc.frontMatter === null) {
    console.error(`${filename} is missing front matter`);
    return false;
  }
  if (cmarkDoc.frontMatter.datePublished === undefined) {
    console.error(`${filename} front matter is missing datePublished:
---
${yaml.stringify(cmarkDoc.frontMatter)}
---
`);
    return false;
  }
  const date: Date | null = cmarkDoc.getDatePublishedAsDate();
  if (date === null) {
    console.log(
      `datePublished is corrupted, ${cmarkDoc.frontMatter.datePublished}`,
    );
    return false;
  }
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const day = (date.getDate() + 1).toString().padStart(2, "0");// Day is zero-based

  // Create the directory structure
  const datePath = join(year, month, day);
  const fullDirPath = join(blogBaseDir, datePath);

  // Create directories recursively
  await Deno.mkdir(fullDirPath, { recursive: true });

  // Extract the basename from the filename
  const fileBasename = basename(filename);

  // Define the destination path
  const destPath = join(fullDirPath, fileBasename);

  // Copy the file to the new directory
  await Deno.copyFile(filename, destPath);

  console.log(`File published to ${destPath}`);
  return true;
}

// Implements the blogit command, validates the CommonMark document's front matter
// and them copies it into the blogDir based on the front matter.
export async function blogit(
  blogDir: string,
  filename: string,
): Promise<boolean> {
  if (!exists(filename)) {
    console.error(`could not find ${filename}`);
    return false;
  }
  const text = await Deno.readTextFile(filename);
  const cmarkDoc = new CommonMarkDoc(text);
  if (!cmarkDoc.validate()) {
    console.error(`front matter is incomplete or not ready for publication:
---
${yaml.stringify(cmarkDoc.frontMatter)}
---
`);
    return false;
  }
  return await publish(blogDir, cmarkDoc, filename);
}
