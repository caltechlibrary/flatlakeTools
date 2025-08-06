#!/bin/bash

flt blogit $HOME/Documents/hello.md
flatlake
flt markdown posts api/posts/all/page-1.json >index.md
flt rss posts api/posts/all/page-1.json >rss.xml
pandoc -f markdown -t html5 -s -o posts/2025/08/04/hello.html posts/2025/08/04/hello.md
pandoc -f markdown -t html5 -s -o index.html index.md
pandoc -f markdown -t html5 -s -o search.html search.md
pagefind -s .
