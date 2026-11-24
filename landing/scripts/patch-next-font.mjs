// Keeps "next build" working when Google Fonts sends a font address without a file ending.
//
// This site loads the Roboto font through next/font/google. While the site is built, Next.js asks
// Google Fonts for the font files. Since October 2026 Google sometimes answers with an address like
// https://fonts.gstatic.com/l/font?kit=... in place of .../name.woff2. Next.js 14.0.0 reads the file
// ending from the address, finds none, and the build stops with:
//   TypeError: Cannot read properties of null (reading '1')
//
// This script changes that one line in the installed copy of Next.js: a missing ending now counts as
// "woff2", the format Next.js asks Google for. It runs after every install ("postinstall" in
// package.json), on your computer and on Vercel. It never stops an install.
//
// Next.js 16.4.3 and later have this fix built in. After such an upgrade, delete this file and the
// "postinstall" line in package.json.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const file = join(here, "..", "node_modules", "next", "dist", "compiled", "@next", "font", "dist", "google", "loader.js");

const OLD = "const ext = /\\.(woff|woff2|eot|ttf|otf)$/.exec(googleFontFileUrl)[1];";
const NEW = "const ext = (/\\.(woff|woff2|eot|ttf|otf)$/.exec(googleFontFileUrl) || [null, 'woff2'])[1]; // changed by scripts/patch-next-font.mjs";

function say(text) {
  console.log("next/font fix: " + text);
}

try {
  if (existsSync(file)) {
    const code = readFileSync(file, "utf8");
    if (code.includes(NEW)) {
      say("already in place.");
    } else if (code.includes(OLD)) {
      writeFileSync(file, code.split(OLD).join(NEW));
      say("applied.");
    } else {
      say("this version of Next.js does not have the old line. Nothing was changed.");
    }
  } else {
    say("Next.js is not installed here yet. Nothing to do.");
  }
} catch (error) {
  say("could not be applied (" + error.message + "). The install goes on.");
}
