// Import the YAML module from jsr
import * as yaml from "jsr:@std/yaml";

export class CommonMarkDoc {
  frontMatter: Record<string, unknown> | null;
  content: string;

  constructor(text: string) {
    this.frontMatter = null;
    this.content = "";
    this.parse(text);
  }

  parse(text: string): void {
    // Regular expression to match front matter
    const frontMatterRegex = /^---([\s\S]*?)---/;
    const match = text.match(frontMatterRegex);

    if (match) {
      const frontMatter = match[1];
      this.frontMatter = yaml.parse(frontMatter) as Record<string, unknown>;
      this.content = text.replace(frontMatterRegex, "").trim();
    } else {
      this.frontMatter = null;
      this.content = text;
    }
  }

  stringify(): string {
    if (this.frontMatter !== null) {
      // Convert the frontMatter record to a YAML string
      const frontMatterString = yaml.stringify(this.frontMatter);
      // Prepend the front matter to the content
      return `---\n${frontMatterString}\n---\n\n${this.content}`;
    } else {
      // Return only the content if there is no front matter
      return this.content;
    }
  }

  validate(): boolean {
    if (this.frontMatter === null) {
      return false;
    }

    const requiredFields = ["title", "abstract", "datePublished"];
    for (const field of requiredFields) {
      if (!(field in this.frontMatter)) {
        return false;
      }
    }

    return true;
  }

  isDatePublishedValid(): boolean {
    if (this.frontMatter === null || !("datePublished" in this.frontMatter)) {
      return false;
    }

    const datePublished = this.frontMatter.datePublished;

    // Check if datePublished is a string or a Date object
    if (typeof datePublished === "string") {
      // Optionally, you can further validate the string format here
      return true;
    } else if (datePublished instanceof Date) {
      return true;
    }

    return false;
  }

  getDatePublishedAsDate(): Date | null {
    if (this.frontMatter === null || !("datePublished" in this.frontMatter)) {
      return null;
    }

    const datePublished = this.frontMatter.datePublished;

    if (datePublished instanceof Date) {
      return datePublished;
    } else if (typeof datePublished === "string") {
      // Attempt to parse the string as a Date
      const parsedDate = new Date(datePublished);
      // Check if the parsed date is valid
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }

    // Return null if datePublished is neither a Date object nor a valid date string
    return null;
  }
}
