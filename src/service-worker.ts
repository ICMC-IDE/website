/// <reference lib="webworker" />

declare let self: ServiceWorkerGlobalScope;

self.addEventListener("activate", (_event: ExtendableEvent) => {
  console.log("Service worker activated.");
});

self.addEventListener("fetch", (event: FetchEvent) => {
  console.log("Service worker fetched.", event.request.url);

  event.respondWith(new Response("Hello, world!"));
});

self.addEventListener("install", (_event: ExtendableEvent) => {
  console.log("Service worker installed.");
});
