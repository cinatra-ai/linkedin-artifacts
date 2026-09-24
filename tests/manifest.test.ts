// @vitest-environment node
// ACCEPTANCE 1, the packaging half: this extension registers NO display of its
// own. The post draft is drawn by the display of its CONTENT TYPE, which the
// host resolves for each slot (markdown for text/markdown, plain text for
// text/plain), so the package declares no `ui` block, exports no display
// module, and keeps its claim on its own type and its accepted forms.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { linkedinArtifactsManifest } from "../src/index";

const pkg = JSON.parse(
  readFileSync(fileURLToPath(new URL("../package.json", import.meta.url)), "utf8"),
) as {
  name: string;
  main: string;
  files: string[];
  exports: Record<string, string>;
  peerDependencies: Record<string, string>;
  peerDependenciesMeta?: Record<string, { optional?: boolean }>;
  cinatra: {
    kind: string;
    artifact: {
      accepts: { file: { mimeTypes: string[] } };
      ui?: unknown;
      objectTypes: Array<{ type: string }>;
    };
  };
};

const MIMES = ["text/markdown", "text/plain"];
const OWN_TYPE = "@cinatra-ai/linkedin:post-draft";

describe("the display is declared for this extension's own type", () => {
  it("registers NO renderer of its own for either text slot", () => {
    // THE POST DRAFT DRAWS THROUGH THE DISPLAY OF ITS CONTENT TYPE. A renderer
    // registered here for the `detail` or the `preview` slot would win that slot
    // for this extension's own type and shadow the markdown and plain-text
    // displays every other text work is drawn by. With both slots unclaimed the
    // host resolves, for each slot, the display of the MIME at that slot.
    //
    // This arm carries the intent of the arms that pinned the registered
    // displays: a strict v1 `ui` block bound to the host SDK ABI range, the
    // detail and preview entries, the props version each display accepted, the
    // no-host-ports rule and the generator's exports key. With nothing
    // registered, the whole `ui` block is absent (the kind gate refuses an empty
    // renderer map, so the block goes whole), in package.json and in the typed
    // manifest alike, and no display module is exported.
    expect(pkg.cinatra.artifact.ui).toBeUndefined();
    expect(linkedinArtifactsManifest.ui).toBeUndefined();
    expect(Object.keys(pkg.exports)).not.toContain("./src/renderers/detail");
    expect(Object.keys(pkg.exports)).not.toContain("./src/renderers/preview");
  });

  it("draws only the representation forms this extension itself accepts — no wildcard, no foreign form", () => {
    // The extension accepts its OWN forms and claims its OWN type; with no
    // display registered, those forms are what the host resolves a display
    // for, and nothing here claims a form beyond them.
    expect(pkg.cinatra.artifact.accepts.file.mimeTypes).toEqual(MIMES);
    expect(pkg.cinatra.artifact.objectTypes.map((c) => c.type)).toContain(OWN_TYPE);
  });

  it("takes the sanitizer from the SDK as the OPTIONAL host-provided peer it is", () => {
    expect(pkg.peerDependencies["@cinatra-ai/sdk-extensions"]).toBeDefined();
    expect(pkg.peerDependenciesMeta?.["@cinatra-ai/sdk-extensions"]?.optional).toBe(true);
  });

  it("keeps the typed src manifest in agreement with package.json", () => {
    expect(linkedinArtifactsManifest.ui).toEqual(pkg.cinatra.artifact.ui);
    expect(linkedinArtifactsManifest.accepts).toEqual(pkg.cinatra.artifact.accepts);
  });
});

describe("the display is published by the package itself", () => {
  it("declares an exports subpath map, never a bare sugar target", () => {
    expect(typeof pkg.exports).toBe("object");
    expect(Array.isArray(pkg.exports)).toBe(false);
    for (const key of Object.keys(pkg.exports)) {
      expect(key.startsWith(".")).toBe(true);
      expect(key.includes("*")).toBe(false);
    }
  });

  it("publishes the package root and nothing else", () => {
    // This arm carries the intent of the arm that published every declared
    // display at the generator's key: with no display declared, no display
    // subpath is published, and an exports map closes every path it does not
    // name — so the root is the package's only public entry.
    expect(Object.keys(pkg.exports)).toEqual(["."]);
  });

  it("keeps the package ROOT importable — an exports map closes every path it does not name", () => {
    expect(pkg.exports["."]).toBe("./src/index.ts");
    expect(pkg.exports["."]).toBe(pkg.main);
  });

  it("keeps every exports target inside the published files allowlist, and existing", () => {
    expect(pkg.files).toContain("src");
    for (const target of Object.values(pkg.exports)) {
      expect(target.startsWith("./src/")).toBe(true);
      const resolved = fileURLToPath(new URL(`../${target.slice(2)}`, import.meta.url));
      expect(() => readFileSync(resolved, "utf8")).not.toThrow();
    }
  });
});
