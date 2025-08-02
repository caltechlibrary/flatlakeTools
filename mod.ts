// Import the necessary modules
import { parse } from "jsr:@std/yaml";
import { Post, RSSFeed } from "./src/metadata.ts";
import { convertToRSS } from "./src/converters.ts";
import { generateCommonMark, generateRSS } from "./src/generators.ts";
import { fmtHelp, helpText } from "./helptext.ts";
import { licenseText, releaseDate, releaseHash, version } from "./version.ts";

async function main() {
  const appName = "flk";
  if (
    Deno.args.length < 3 || Deno.args.includes("--help") ||
    Deno.args.includes("-h")
  ) {
    console.log(fmtHelp(helpText, appName, version, releaseDate, releaseHash));
    return;
  }

  if (Deno.args.includes("--license") || Deno.args.includes("-l")) {
    console.log(licenseText);
    return;
  }

  if (Deno.args.includes("--version") || Deno.args.includes("-v")) {
    console.log(`${appName} ${version} ${releaseHash}`);
    return;
  }

  const [channelName, outputFormat, jsonFilename] = Deno.args;

  try {
    const fltYaml = await Deno.readTextFile("flt.yaml");
    const fltConfig = parse(fltYaml) as {
      channels: Array<{ name: string } & Partial<RSSFeed>>;
    };

    const channelInfo = fltConfig.channels.find((channel) =>
      channel.name === channelName
    );

    if (!channelInfo) {
      throw new Error(`Channel '${channelName}' not found in flt.yaml.`);
    }

    const jsonData = JSON.parse(await Deno.readTextFile(jsonFilename)) as {
      values: Post[];
    };

    const rssFeed = convertToRSS(jsonData.values, channelInfo);

    if (outputFormat === "rss") {
      const rssXML = generateRSS(rssFeed);
      console.log(rssXML);
    } else if (outputFormat === "markdown") {
      const commonMark = generateCommonMark(rssFeed);
      console.log(commonMark);
    } else {
      throw new Error("Invalid output format. Use 'rss' or 'markdown'.");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }
    Deno.exit(1);
  }
}

main();
