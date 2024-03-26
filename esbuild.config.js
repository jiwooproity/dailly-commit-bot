const { build } = require("esbuild");

build({
  entryPoints: ["./src/index.ts"],
  bundle: true,
  outfile: "./build/daily-bot.js",
  platform: "node",
});
