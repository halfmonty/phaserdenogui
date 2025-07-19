import { WebUI } from "jsr:@webui/deno-webui@2.5.8";

let watcher: Deno.FsWatcher | undefined;

const myWindow = new WebUI();
myWindow.setSize(816, 639); // Window size needs to account of excess title bar and window border size
myWindow.setRootFolder("./static");

await myWindow.showBrowser("index.html", WebUI.Browser.AnyBrowser);

async function startWatchMode(): Promise<void> {
  console.log('👀 Starting watch mode...');
  let buildTimeout: number | null = null;
  // Watch for file changes
  watcher = Deno.watchFs(['./static'], { recursive: true });
  for await (const event of watcher) {
    // const isTypeScriptFile = event.paths.some((path) => path.endsWith('.js')); // Filter on specific file types if desired

    if (event.kind == 'modify') {
    // Debounce
      if (buildTimeout) {
        clearTimeout(buildTimeout);
      }

      buildTimeout = setTimeout(() => {
        myWindow.showBrowser("index.html", WebUI.Browser.AnyBrowser);
      }, 300);
    }
  }
}

startWatchMode();

await WebUI.wait();

console.log("Exiting...");
Deno.exit(0);