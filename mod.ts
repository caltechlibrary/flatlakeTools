import { parse } from "@std/yaml";
import { Post } from './src/metadata.ts';
import { convertToRSS } from './src/converters.ts';
import { generateRSS } from './src/generators.ts';

interface Channel {
    name: string;
    title: string;
    description: string;
    link: string;
    language?: string;
    copyright?: string;
    managingEditor?: string;
    webMaster?: string;
}

interface FLTConfig {
    channels: Channel[];
}

async function main() {
    if (Deno.args.length < 3 || Deno.args.includes("--help") || Deno.args.includes("-h")) {
        console.log("Usage: deno run --allow-read mod.ts CHANNEL_NAME OUTPUT_FORMAT JSON_INPUT_FILE");
        console.log("Arguments:");
        console.log("  CHANNEL_NAME       Name of the channel defined in flt.yaml");
        console.log("  OUTPUT_FORMAT      Desired output format: 'rss' or 'markdown'");
        console.log("  JSON_INPUT_FILE    Path to the JSON file containing input data");
        return;
    }

    if (Deno.args.includes("--license") || Deno.args.includes("-l")) {
        console.log("This software is licensed under the MIT License.");
        return;
    }

    if (Deno.args.includes("--version") || Deno.args.includes("-v")) {
        console.log("Version 1.0.0");
        return;
    }

    const [channelName, outputFormat, jsonFilename] = Deno.args;

    try {
        const fltYaml = await Deno.readTextFile('flt.yaml');
        const fltConfig = parse(fltYaml) as FLTConfig;

        const channelInfo = fltConfig.channels.find(channel => channel.name === channelName);

        if (!channelInfo) {
            throw new Error(`Channel '${channelName}' not found in flt.yaml.`);
        }

        const jsonData = JSON.parse(await Deno.readTextFile(jsonFilename)) as { values: Post[] };

        const rssFeed = convertToRSS(jsonData.values, channelInfo);

        if (outputFormat === 'rss') {
            const rssXML = generateRSS(rssFeed);
            console.log(rssXML);
        } else if (outputFormat === 'markdown') {
            // Implement markdown generation logic here
            console.log("Markdown output format is not yet implemented.");
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
