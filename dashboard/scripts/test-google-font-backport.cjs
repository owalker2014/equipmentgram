const assert = require("node:assert/strict");
const { mkdtempSync, writeFileSync, rmSync } = require("node:fs");
const { tmpdir } = require("node:os");
const path = require("node:path");
const { test } = require("node:test");

const googleFontPath = "next/dist/compiled/@next/font/dist/google/";
const { findFontFilesInCss } = require(googleFontPath + "find-font-files-in-css");

// Adapted from vercel/next.js#100158. Exercise the installed, patched Next.js
// package, not a separate copy of the implementation.
const cases = [
  ["https://fonts.gstatic.com/l/font?kit=a=b&skey=c&v=v20", "format('woff2')", "woff2"],
  ["https://fonts.gstatic.com/l/font?kit=a%2Bb&skey=c", 'format("woff")', "woff"],
  ["https://fonts.gstatic.com/l/font", "format('truetype')", "ttf"],
  ["https://fonts.gstatic.com/l/font", "format('opentype')", "otf"],
  ["https://fonts.gstatic.com/l/font", "format('embedded-opentype')", "eot"],
  ["https://fonts.gstatic.com/l/font", "", "woff2"],
  ["https://fonts.gstatic.com/l/font", "format('unknown')", "woff2"],
  ["https://fonts.gstatic.com/s/font.ttf?kit=a&v=1#font", "format('woff2')", "ttf"],
  ["https://fonts.gstatic.com/l/font?kit=a.woff", "format('woff2')", "woff2"],
  ["https://fonts.gstatic.com/s/roboto/font.woff2", "format('woff2')", "woff2"],
];

for (const [url, format, ext] of cases) {
  test(`extracts ${ext} from ${url} ${format}`, () => {
    const face = `@font-face {\n  src: url(${url}) ${format};\n}`;
    assert.deepEqual(findFontFilesInCss(`/* latin */\n${face}\n${face}`, ["latin"]), [
      { googleFontFileUrl: url, preloadFontFile: true, ext },
    ]);
  });
}

test("preserves subset preloading and deduplication", () => {
  const css = `/* latin */
@font-face {
  src: url(latin.woff2) format('woff2');
}
/* greek */
@font-face {
  src: url(greek.woff2) format('woff2');
}
@font-face {
  src: url(greek.woff2) format('woff2');
}`;
  assert.deepEqual(findFontFilesInCss(css, ["latin"]), [
    { googleFontFileUrl: "latin.woff2", preloadFontFile: true, ext: "woff2" },
    { googleFontFileUrl: "greek.woff2", preloadFontFile: false, ext: "woff2" },
  ]);
  assert.ok(findFontFilesInCss(css).every((file) => !file.preloadFontFile));
});

for (const [description, fontUrl] of [
  ["extensionless", "https://fonts.gstatic.com/l/font?kit=a=b&skey=c&v=v20"],
  ["ordinary", "https://fonts.gstatic.com/s/roboto/font.woff2"],
]) {
  test(`production Roboto loader emits and rewrites ${description} font URLs`, async () => {
    const directory = mkdtempSync(path.join(tmpdir(), "next-font-backport-"));
    const mockPath = path.join(directory, "responses.cjs");
    const previousMock = process.env.NEXT_FONT_GOOGLE_MOCKED_RESPONSES;
    const cssUrl = "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap";
    const css = `/* latin */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400 700;
  src: url(${fontUrl}) format('woff2');
}`;
    writeFileSync(mockPath, `module.exports = ${JSON.stringify({ [cssUrl]: css })};\n`);
    process.env.NEXT_FONT_GOOGLE_MOCKED_RESPONSES = mockPath;
    const loaderPath = require.resolve(googleFontPath + "loader");
    delete require.cache[loaderPath];

    try {
      const loader = require(loaderPath).default;
      // Next invokes the loader for both server and client. Test both paths,
      // including the loader's shared stylesheet/font-buffer caches.
      for (const isServer of [true, false]) {
        const emitted = [];
        const result = await loader({
          functionName: "Roboto",
          data: [{
            weight: ["400", "700"],
            subsets: ["latin"],
            variable: "--font-roboto",
            adjustFontFallback: false,
          }],
          emitFontFile(buffer, ext, preload, adjustFontFallback) {
            emitted.push({ buffer, ext, preload, adjustFontFallback });
            return "/_next/static/media/roboto-test.woff2";
          },
          isDev: false,
          isServer,
        });
        assert.equal(emitted.length, 1);
        assert.deepEqual(emitted[0], {
          buffer: Buffer.from(fontUrl), // Next's offline mock returns URL bytes.
          ext: "woff2",
          preload: true,
          adjustFontFallback: false,
        });
        assert.ok(result.css.includes("url(/_next/static/media/roboto-test.woff2)"));
        assert.ok(!result.css.includes(fontUrl));
        assert.equal(result.variable, "--font-roboto");
        assert.equal(result.fallbackFonts, undefined);
      }
    } finally {
      if (previousMock === undefined) {
        delete process.env.NEXT_FONT_GOOGLE_MOCKED_RESPONSES;
      } else {
        process.env.NEXT_FONT_GOOGLE_MOCKED_RESPONSES = previousMock;
      }
      delete require.cache[loaderPath];
      delete require.cache[mockPath];
      rmSync(directory, { recursive: true, force: true });
    }
  });
}
