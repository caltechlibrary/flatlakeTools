---
title: Introduction to flatlakeTools
author: rsdoiel@caltech.edu (R. S. Doiel)
abstract: >
  An quick introduction blogging to using CommonMark, front matter, [FlatLake](https://flatlake.app) and [flatlakeTools](https://github.com/caltechlibrary/flatlakeTools). Coverts initial setup and content organization.

  Also touched on is using Pandoc to convert CommonMark to HTML and PageFind for generating a search page for the blog.
  
dateCreated: '2025-08-04'
dateModified: '2025-08-04'
datePublished: '2025-08-04'
keywords:
 - FlatLake
 - flatlakeTools
 - Pandoc
 - CommonMark
 - Markdown
 - PageFind
---

# Introduction to flatlakeTools

[flatlakeTools](https://github.com/caltechlibrary/flatlakeTools) is an experimental set of tools for exploring and using CloudCannon's [FlatLake](https://flatlake.app) application for deploying a simple blog. FlatLake will redirect a directory structure full of CommonMark (Markdown) documents processing their [front matter]() and aggregating the results into a static JSON API. This JSON API is has sufficient data to render RSS and a simple blog index page. The flatlakeTools fills in the gaps for managing the CommonMark documents and leveraging the index page and RSS file. You can then use Pandoc to convert the CommonMark documents into HTML. You can then use PageFind to generate search indexes to make your blog searchable.  The result is static website ready to deploy.

## Requirements

You'll need the following to follow along.

- [FlatLake](https://flatlake.app)
- [PageFind](https://pagefind.app)
- [Pandoc](https://pandoc.org)
- [flatLakeTools](https://github.com/caltechlibrary/flatlakeTools/releases)
- A text editor
- A web browser

## Deno steps

1. After installing the required software create a directory for staging the blog, change in the directory
2. create a YAML configuration file for FlatLake (see example in this document)
3. create a YAML configuration for the `flt` command in flatlakeTools
4. Write a blog posts in CommonMark (markdown) include front matter for title, abstrasct, datePublished, and author
5. Use the `flt` command to "blogit" into the blog directory tree.
6. Create/update the JSON API using the FlateLake command
7. Generate the blog index page using the `flt` command
8. Create a CommonMark search page
9. Using Pandoc turn all the CommonMark documents into HTML
10. Using PageFind to generate search indexes
11. Use PageFind to server the test site 

### Setting up the directory and configuration

~~~shell
mkdir site
cd site
edit flatlake.yaml
edit flt.yaml
~~~

The `flatlake.yaml` file should look something like this.

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

The `flt.yaml` file should look something like this.

~~~yaml
 posts hold the path used for your blog.
blog: posts
# The base URL for your website, we're using the PageFind server address
base_url: http://localhost:1414
# channel is used to generate an RSS Feed and you blogs
# CommonMark index page.
channels:
  - name: posts
    title: "Posts"
    description: "Blog posts"
    link: "http://localhost:1414/index.rss"
    language: "en-us"
    ## copyright: ""
    ## managingEditor: "editor@example.edu"
    ## webMaster: "webmaster@example.edu"
~~~

NOTE: the link is pointing to the RSS on our test system. Normally this would be the name of your website.

### Write a blog post

For this demo the blog post can be a short hello world document. Here's my example, "hello.md"

~~~markdown
---
title: Hello World
abstract: This is a simple Hello World demo
datePublished: '2025-08-04'
author: 'j.doe@example.edu (J. Doe)'
---

# Hello World

Hi there!
~~~

Note where you save this someplace like `$HOME/Documents/hello.md`. You need to remember  the path we we'll use it when we public the CommonMark document into the blog directory tree.


### Adding our first blog post and staging our site

In the directory you've created previous for staging your site you'll use the `flt` command to add the CommonMark document you created in `$HOME/Documents/hello.md` into the blog. The `flt` action you'll be using is called "blogit". It will first check to make sure the CommonMark document has the expected front matter then if it is OK it'll copy it into the blog tree (i.e. "posts" directory.)

~~~shell
flt blogit $HOME/Documents/hello.md
~~~

If all went well you should see a message like this.

~~~
File published to posts/2025/08/04/hello.md
~~~

This will create the posts directory structure and copy the "hello.md" CommonMark document into place.

~~~
/ (site root)
  - posts
    - 2025
      - 08
        - 04
          hello.md
~~~

Now let's run FlatLake to update the JSON API.

~~~shell
flatlake
~~~

You should see output that looks like this.

~~~
flatlake running as 0.4.3

[Walking collections]
finished running flatlake

Finished in 0.009 seconds
~~~

Looking at the directory now, you should see a directory called `api` along side the `posts` you previously create in your site root. That `api` directory holds a the JSON API that will be used by `flt` to create your blog's index page and the blog's RSS feed. Let's create those files next.

~~~shell
flt markdown posts api/posts/all/page-1.json >index.md
flt rss posts api/posts/all/page-1.json >index.rss
~~~

Now we're ready to create the search page. I've included a simple version below, called it "search.md" in the site root.

~~~markdown

# Search

<link href="/pagefind/pagefind-ui.css" rel="stylesheet">

<script src="/pagefind/pagefind-ui.js"></script>

<p>

<div id="search"></div>

<p>

<script>
new PagefindUI({
    element: "#search",
    highlightParam: "highlight",
    mergeIndex: [
        {
            bundlePath: "./pagefind",
            baseUrl: "/"
        }
    ]
})
</script>
~~~

### Rendering HTML and testing it

Right now our blog has three CommonMark documents, "posts/2025/08/04/hello.md", "search.md" and "index.md". We can use Pandoc to convert those to HTML files.

~~~shell
pandoc -f markdown -t html5 -s -o posts/2025/08/04/hello.html posts/2025/08/04/hello.md
pandoc -f markdown -t html5 -s -o search.html search.md
pandoc -f markdown -t html5 -s -o index.html index.md
~~~

Now we can generate the search indexes and test our website.

~~~shell
pagefind  -v -s . --serve
open http://localhost:1414
~~~

You can now fire up your localhost web server and view your handy work.
