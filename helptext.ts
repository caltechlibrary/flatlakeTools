/**
 * helptext.ts - this modules provides the help text for flatlakeTools.ts.
 */
export function fmtHelp(
  txt: string,
  appName: string,
  version: string,
  releaseDate: string,
  releaseHash: string,
): string {
  return txt.replaceAll("{app_name}", appName).replaceAll("{version}", version)
    .replaceAll("{release_date}", releaseDate).replaceAll(
      "{release_hash}",
      releaseHash,
    );
}

// CommonMark help text
export const helpText =
  `%{app_name}(1) user manual | version {version} {release_hash}
% R. S. Doiel
% {release_date}

# NAME

{app_name}

# SYNOPSIS

{app_name} [OPTIONS] CHANNEL_NAME FORMAT JSON_INPUT_FILE

# DESCRIPTION

{app_name} uses a \`{app_name}.yaml\` file to configura feeds and documents derrived
from the [FlatLake](https://flatlake.app) generated JSON API. It currently supports
generating RSS 2.0 feeds and CommonMark index pages based on the JSON API.

# OPTIONS

Options come as the last parameter(s) on the command line.

-h, --help
: display help

-v, --version
: display version

-l, --license
: display license

# CONFIG

The \`{app_name}.yaml\` file is a configuration file used to define metadata. \`{app_name}\`
works with a the concepts of channels. Each channel is analogous to a feed when talking about
RSS feeds. It also can for a listing or index page's content such as those written in CommonMark
for a website. The configuration file is written in YAML format (a human-readable
standard format often used for configuration files).

The top level attribute in \`{app_name}.yaml\` is \`channels\`. It contains a list of channel objects.
The channel object contains a list of attributes like "name", "title", "description", "link", "language",
"copyright", "managingEditor", "webMaster". Each of these are "string" type data. Here is an example
of a simple \`{app_name}.yaml\` file definined one channel named "channel_name".

~~~yaml
channels:
  - name: channel_name
    title: "Channel Title"
    description: "Channel Description"
    link: "https://example.com/channel"
    language: "en-us"
    copyright: "Copyright Information"
    managingEditor: "editor@example.com"
    webMaster: "webmaster@example.com"
~~~

## Fields

**channels**
: A list of channel configurations. Each channel is represented as an item in this list.

**name**
: A unique identifier for the channel. This is used to reference the channel when generating output.

**title**
: The title of the channel. This is typically the name of the blog or website associated with the channel.

**description**
: A brief description of the channel's content. This provides users with an overview of what the channel is about.

**link**
: The URL to the website or main page associated with the channel. This serves as the base URL for generating absolute links to individual items.

**language**
: (optional) The language in which the channel's content is written. This helps RSS readers and other tools to configure themselves to display content correctly.

**copyright**
: (optional) Information about the copyright for the content in the channel. This can include the copyright holder and the year of copyright.

**managingEditor**
: (optional) The email address of the editor responsible for the content in the channel. This can be used to contact the editor with questions or comments about the content.

**webMaster**
: (optional) The email address of the person responsible for the technical aspects of the channel. This can be used to contact the webmaster with technical issues or questions.

# Example

Here is an example of a complete \`{app_name}.yaml\` file with multiple channels:

~~~yaml
channels:
  - name: tech_insights
    title: "Tech Insights Blog"
    description: "The latest insights and news from the world of technology."
    link: "https://example.com/tech-insights"
    language: "en-us"
    copyright: "Copyright 2023 Tech Insights Blog. All rights reserved."
    managingEditor: "editor@techinsights.com"
    webMaster: "webmaster@techinsights.com"

  - name: health_tips
    title: "Health Tips Daily"
    description: "Daily tips and advice for maintaining a healthy lifestyle."
    link: "https://example.com/health-tips"
    language: "en-us"
    copyright: "Copyright 2023 Health Tips Daily. All rights reserved."
    managingEditor: "editor@healthtips.com"
    webMaster: "webmaster@healthtips.com"
~~~

# Usage

# EXAMPLES

In this example I am using a flatlake configuration like this.

~~~yaml
global:
  sort_key: datePublished
  sort_direction: desc
  outputs:
    - "single"
    - "list"
collections:
  - output_key: "posts"
    page_size: 24
    sort_key: "datePublished"
    sort_direction: "desc"
    single_elements:
      - "data"
      - "content"
    list_elements:
      - "data"
      - "content"
    inputs:
      - path: "./posts"
        glob: "**/*{md}"
~~~

I will use the generated \`api/all/page-1.json\` file to generate the RSS file \`index.xml\`.

~~~shell
flatlake
flt tech_insights rss api/all/page-1.json >tech_insights.xml
flt tech_insights markdown api/all/page-1.json >tech_insights.md
~~~

`;
