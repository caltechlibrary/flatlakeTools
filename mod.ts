// Import the necessary modules
import { exists } from "@std/fs/exists";
import { parse } from "@std/yaml";
import { FltConfig, Post } from "./src/metadata.ts";
import { convertToRSS } from "./src/converters.ts";
import { generateCommonMark, generateRSS } from "./src/generators.ts";
import { fmtHelp, helpText } from "./helptext.ts";
import { licenseText, releaseDate, releaseHash, version } from "./version.ts";
import { blogit } from "./src/blogit.ts";

async function main() {
  const appName = "flt";
  const cfgName = `${appName}.yaml`;

  // handle help
  if (
    Deno.args.includes("help") ||
    Deno.args.includes("--help") ||
    Deno.args.includes("-help") ||
    Deno.args.includes("-h")
  ) {
    console.log(fmtHelp(helpText, appName, version, releaseDate, releaseHash));
    return 0;
  }

  // handle license
  if (
    Deno.args.includes("license") ||
    Deno.args.includes("--license") ||
    Deno.args.includes("-license") ||
    Deno.args.includes("-l")
  ) {
    console.log(licenseText);
    return 0;
  }

  // handle version
  if (
    Deno.args.includes("version") ||
    Deno.args.includes("--version") ||
    Deno.args.includes("-version") ||
    Deno.args.includes("-v")
  ) {
    console.log(`${appName} ${version} ${releaseHash}`);
    return 0;
  }

  const args = Deno.args;
  let action: string = "";
  let channelName: string = "";
  let filename: string = "";
  const cmdError: string[] = [];

  // Process command line arguments
  args.length > 0
    ? action = args.shift() || ""
    : cmdError.push("missing blogit, rss or markown action");
  if (action === "blogit") {
    args.length > 0
      ? filename = args.shift() || ""
      : cmdError.push(`(${action}) missing filename`);
  } else {
    args.length > 0
      ? channelName = args.shift() || ""
      : cmdError.push(`(${action}) missing channel name`);
    args.length > 0
      ? filename = args.shift() || ""
      : cmdError.push(`(${action}) missing filename`);
  }
  if (cmdError.length > 0) {
    console.error(`USAGE: ${appName} blogit|rss|mardkown PARAMETERS
For help try: ${appName} help 
`);
    console.error(cmdError.join("\n"));
    return 1;
  }

  let fltYaml: string = "";
  if (await exists(cfgName)) {
    fltYaml = await Deno.readTextFile(cfgName);
  } else {
    fltYaml = `# posts hold the path used for your blog.
blog: posts
# Base URL for your site.
base_url: http://localhost:8000
# channel is used to generate an RSS Feed and you blogs
# CommonMark index page.
channels:
  - name: blog
    title: "Posts"
    description: "Demo of flatLakeToos blogging"
    ## IMPORTANT Change this link to point to the path of your RSS file.
    link: "http://localhost:8000/index.xml"
    language: "en-us"
    ## copyright: ""
    ## managingEditor: "editor@example.edu"
    ## webMaster: "webmaster@example.edu"
`;
    if (confirm("no flt.yaml file found, create it?")) {
      console.log(`Generating a default flt.yaml file. Please read and edit.`);
      await Deno.writeTextFile(cfgName, fltYaml);
      return 0;
    } else {
      console.error("aborting");
      return 1;
    }
  }

  let fltConfig: FltConfig;
  try {
    fltConfig = parse(fltYaml) as FltConfig;
  } catch (error) {
    if (error instanceof Error) {
      console.error("error:", error.message);
    } else {
      console.error("a configuration error occurred:", error);
    }
    return 1;
  }
  const blogDir = fltConfig.blog || "";

  // Handle channel related requests
  if (channelName) {
    const channelInfo = fltConfig.channels.find((channel) =>
      channel.name === channelName
    );

    if (!channelInfo) {
      console.error(`channel '${channelName}' not found in flt.yaml.`);
      return 1;
    }

    const jsonData = JSON.parse(await Deno.readTextFile(filename)) as {
      values: Post[];
    };
    const rssFeed = convertToRSS(jsonData.values, channelInfo);

    if (action === "rss") {
      const rssXML = generateRSS(rssFeed);
      console.log(rssXML);
    } else if (action === "markdown") {
      const commonMark = generateCommonMark(rssFeed);
      console.log(commonMark);
    } else {
      console.error("Invalid output format. Use 'rss' or 'markdown'.");
      return 1;
    }
  } else {
    // Handle blogit
    if (!await blogit(blogDir, filename)) {
      console.error(`error: ${appName} blogit ${filename} failed.`);
      return 1;
    }
  }
  return 0;
}

if (import.meta.main) {
  Deno.exit(await main());
}
