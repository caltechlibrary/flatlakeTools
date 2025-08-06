
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
