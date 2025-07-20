import { WebUI } from "jsr:@webui/deno-webui@^2.5.8";
import { exists } from "jsr:@std/fs/exists";

// MIME types for file serving
const MIME_TYPES: Record<string, string> = {
  'html': 'text/html',
  'js': 'application/javascript',
  'css': 'text/css',
  'json': 'application/json',
  'png': 'image/png',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'gif': 'image/gif',
  'svg': 'image/svg+xml',
  'ico': 'image/x-icon',
  'txt': 'text/plain',
  'pdf': 'application/pdf',
  'zip': 'application/zip',
  'woff': 'font/woff',
  'woff2': 'font/woff2',
  'ttf': 'font/ttf',
  'otf': 'font/otf',
} as const;

const myWindow = new WebUI();
myWindow.setSize(816, 639); // Window size needs to account of excess title bar and window border size

async function startWatchMode(): Promise<void> {
  console.log('👀 Starting watch mode...');
  let buildTimeout: number | null = null;
  // Watch for file changes
  const watcher = Deno.watchFs(['./static'], { recursive: true });
  for await (const event of watcher) {
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

const getFile = async (
  contentType: string,
  filename: string,
): Promise<Uint8Array> => {
  const content = await Deno.readFile(import.meta.dirname + filename);
  const header = `HTTP/1.1 200 OK\r\nContent-Type: ${contentType}\r\n\r\n`;
  const headerBytes = new TextEncoder().encode(header);
  const response = new Uint8Array(headerBytes.length + content.length);
  response.set(headerBytes);
  response.set(content, headerBytes.length);
  return response;
};

async function myFileHandler(myUrl: URL) {
  const extension = myUrl.pathname.split('.').pop();
  if (extension == undefined) return "HTTP/1.1 404 Not Found";
  if(MIME_TYPES[extension]) {
    return await getFile(MIME_TYPES[extension], "/static" + myUrl.pathname)
  }
  return "HTTP/1.1 404 Not Found";
}

// Bind Exit
myWindow.bind("exit", () => {
  // Close all windows and exit
  WebUI.exit();
});

// Bind Exit
myWindow.bind("exit", () => {
  // Close all windows and exit
  WebUI.exit();
});

myWindow.setFileHandler(myFileHandler);

await myWindow.showBrowser("index.html", WebUI.Browser.AnyBrowser);

if( await exists("./static", { isDirectory: true })) {
  startWatchMode();
}

await WebUI.wait();

console.log("Exiting...");
Deno.exit(0);