# Phaser Deno GUI

This template uses the WebUI library to create Gui apps built on the modern OS built-in WebView capability.

![demo](./demo.gif)

| Note: I don't necessarily recommend using this for your next Steam game. It might be 100% fine, but the WebUI library and the Deno implementation of it and very much still in progress.

To Run this template you need deno installed. Then...

```bash
deno run dev
```

Running dev will watch for file changes in your ./static directory. You can think of the static directory as your public directory on a web server that is being served by the code in the main.ts file. Dev also will bundle all code imported by ./game/mode.ts and place it in ./static/js which will trigger the watch and update the running window.

The result is a very convenient, low code, local development environment for creating phaser games.

Since inside the .exe is a WebView, aka a browser, you can still get to browser devtools with Ctrl+Shift+I to see browser logs and such.

To compile to a single portable executable, run

```bash
deno run compile
```