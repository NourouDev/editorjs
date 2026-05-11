import { ssr, ssrHydrationKey, escape, createComponent } from 'file:///home/ismael/Documents/GitHub/editorjs/node_modules/.pnpm/solid-js@1.9.11/node_modules/solid-js/web/dist/server.js';
import { createSignal } from 'file:///home/ismael/Documents/GitHub/editorjs/node_modules/.pnpm/solid-js@1.9.11/node_modules/solid-js/dist/server.js';
import { A } from './components-CnxhC21C.mjs';
import '../virtual/entry.mjs';
import 'file:///home/ismael/Documents/GitHub/editorjs/node_modules/.pnpm/h3@1.15.5/node_modules/h3/dist/index.mjs';
import 'file:///home/ismael/Documents/GitHub/editorjs/node_modules/.pnpm/solid-js@1.9.11/node_modules/solid-js/web/storage/dist/storage.js';

var _tmpl$$1 = ["<button", ' class="w-[200px] rounded-full bg-gray-100 border-2 border-gray-300 focus:border-gray-400 active:border-gray-400 px-[2rem] py-[1rem]">Clicks: <!--$-->', "<!--/--></button>"];
function Counter() {
  const [count, setCount] = createSignal(0);
  return ssr(_tmpl$$1, ssrHydrationKey(), escape(count()));
}
var _tmpl$ = ["<main", ' class="text-center mx-auto text-gray-700 p-4"><h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">About Page</h1><!--$-->', '<!--/--><p class="mt-8">Visit <a href="https://solidjs.com" target="_blank" class="text-sky-600 hover:underline">solidjs.com</a> to learn how to build Solid apps.</p><p class="my-4"><!--$-->', "<!--/--> - <span>About Page</span></p></main>"];
const id$$ = "src/routes/about.tsx?pick=default&pick=$css";
function About() {
  return ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(Counter, {})), escape(createComponent(A, {
    href: "/",
    "class": "text-sky-600 hover:underline",
    children: "Home"
  })));
}

export { About as default, id$$ };
//# sourceMappingURL=about-CMbkLRXH.mjs.map
