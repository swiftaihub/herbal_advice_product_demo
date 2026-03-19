import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();

function runScript(scriptName) {
  execFileSync(process.execPath, [path.join(repoRoot, "scripts", scriptName)], {
    cwd: repoRoot,
    stdio: "inherit",
  });
}

function removeIfPresent(relativePath) {
  const targetPath = path.join(repoRoot, relativePath);

  if (!fs.existsSync(targetPath)) {
    return;
  }

  fs.rmSync(targetPath, { recursive: true, force: true });
}

runScript("generate-article-bundle.mjs");
runScript("generate-static-locale-routes.mjs");

// Turbopack can keep a stale view of the removed legacy locale route tree.
removeIfPresent(path.join("src", "app", "[locale]"));
removeIfPresent(path.join(".next", "dev"));
