import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";

const require = createRequire(import.meta.url);
// pnpm exposes the installed transitive packages here without adding production dependencies.
const transitiveRequire = createRequire(
  new URL("../../node_modules/.pnpm/node_modules/consumer.cjs", import.meta.url),
);
const fixture = await mkdtemp(path.join(tmpdir(), "eslint-config-consumers-"));

try {
  await mkdir(path.join(fixture, "nested"));
  await writeFile(path.join(fixture, "one.txt"), "one");
  await writeFile(path.join(fixture, "nested/two.txt"), "two");
  await writeFile(path.join(fixture, "nested/other.js"), "export const count = 1;\n");

  // glob consumes minimatch's parsed tokens, so upgrading minimatch alone can silently lose files.
  for (const parent of [
    "commitizen",
    "@npmcli/map-workspaces",
    "@npmcli/package-json",
    "unified-engine",
  ]) {
    const parentRequire = createRequire(transitiveRequire.resolve(parent));
    const glob = parentRequire("glob");
    const expected = ["nested/two.txt", "one.txt"];
    assert.deepEqual(glob.sync("**/*.txt", { cwd: fixture }).sort(), expected, parent);
    assert.deepEqual(glob.sync("**/*.missing", { cwd: fixture }), [], parent);
    if (parent !== "commitizen") {
      assert.deepEqual((await glob.glob("**/*.txt", { cwd: fixture })).sort(), expected, parent);
    }
    console.log(`${parent}: glob matches and missing-file result preserved`);
  }

  const commitizen = require("commitizen");
  await writeFile(path.join(fixture, ".czrc"), JSON.stringify({ path: "fixture-adapter" }));
  assert.equal(commitizen.configLoader.load(undefined, fixture).path, "fixture-adapter");

  const matchTasks = require("npm-run-all/lib/match-tasks.js");
  assert.deepEqual(matchTasks(["lint:es", "lint:format", "build"], ["lint:*"]), [
    "lint:es",
    "lint:format",
  ]);
  assert.throws(() => matchTasks(["build"], ["missing:*"]), /Task not found/);

  const mapWorkspaces = transitiveRequire("@npmcli/map-workspaces");
  await mkdir(path.join(fixture, "packages/one"), { recursive: true });
  await mkdir(path.join(fixture, "packages/excluded"), { recursive: true });
  await writeFile(path.join(fixture, "packages/one/package.json"), '{"name":"fixture-one"}');
  await writeFile(path.join(fixture, "packages/excluded/package.json"), '{"name":"excluded"}');
  const workspaces = await mapWorkspaces({
    cwd: fixture,
    pkg: { workspaces: ["packages/*", "!packages/excluded"] },
  });
  assert.deepEqual([...workspaces.keys()], ["fixture-one"]);

  const PackageJson = transitiveRequire("@npmcli/package-json");
  await mkdir(path.join(fixture, "bin"));
  await writeFile(path.join(fixture, "bin/tool.js"), "#!/usr/bin/env node\n");
  await writeFile(
    path.join(fixture, "package.json"),
    JSON.stringify({ name: "fixture", version: "1.0.0", directories: { bin: "bin" } }),
  );
  const manifest = await PackageJson.normalize(fixture, { steps: ["binDir"] });
  assert.deepEqual(manifest.content.bin, { "tool.js": "bin/tool.js" });
  await assert.rejects(() => PackageJson.load(path.join(fixture, "missing")), /package.json/);
  console.log(
    "Commitizen discovery, task matching/rejection, workspace exclusion and bin expansion pass",
  );
} finally {
  await rm(fixture, { recursive: true, force: true });
}
