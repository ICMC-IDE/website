import { defineConfig } from "vite";
import externalize from "vite-plugin-externalize-dependencies";

export default defineConfig({
  optimizeDeps: {
    noDiscovery: true,
    include: null,
  },
  base: "./",
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
        editor: "editor.html",
      },
      external: [/core\/.*/i],
    },
    sourcemap: "inline",
    minify: true,
    cssMinify: true,
    target: "es2023",
  },
  worker: {
    format: "es",
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
  plugins: [
    // Externalize dependencies on dev mode
    externalize({
      externals: ["core"],
    }),
    {
      name: "rollup-plugin-html-template",
      enforce: "pre",
      async transform(code, id) {
        if (id.endsWith(".html?template")) {
          const html = code.replaceAll(/>\s+</g, "><");
          return `
            const template = document.createElement("template");
            template.innerHTML = ${JSON.stringify(html)};
            export default template;
          `;
        }
      },
    },
  ],
});
