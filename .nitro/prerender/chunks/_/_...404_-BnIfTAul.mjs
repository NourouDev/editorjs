import { ssr, ssrHydrationKey, escape, createComponent } from 'file:///home/ismael/Documents/GitHub/editorjs/node_modules/.pnpm/solid-js@1.9.11/node_modules/solid-js/web/dist/server.js';
import { A } from './components-CnxhC21C.mjs';
import 'file:///home/ismael/Documents/GitHub/editorjs/node_modules/.pnpm/solid-js@1.9.11/node_modules/solid-js/dist/server.js';
import '../virtual/entry.mjs';
import 'file:///home/ismael/Documents/GitHub/editorjs/node_modules/.pnpm/h3@1.15.5/node_modules/h3/dist/index.mjs';
import 'file:///home/ismael/Documents/GitHub/editorjs/node_modules/.pnpm/solid-js@1.9.11/node_modules/solid-js/web/storage/dist/storage.js';

var _tmpl$ = ["<main", ' class="text-center mx-auto text-gray-700 p-4"><h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">Not Found</h1><p class="mt-8">Visit <a href="https://solidjs.com" target="_blank" class="text-sky-600 hover:underline">solidjs.com</a> to learn how to build Solid apps.</p><p class="my-4"><!--$-->', "<!--/--> - <!--$-->", "<!--/--></p></main>"];
const id$$ = "src/routes/[...404].tsx?pick=default&pick=$css";
function NotFound() {
  return ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(A, {
    href: "/",
    "class": "text-sky-600 hover:underline",
    children: "Home"
  })), escape(createComponent(A, {
    href: "/about",
    "class": "text-sky-600 hover:underline",
    children: "About Page"
  })));
}

export { NotFound as default, id$$ };
//# sourceMappingURL=_...404_-BnIfTAul.mjs.map
