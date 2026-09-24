import type { SemanticArtifactManifest } from "@cinatra-ai/sdk-extensions";

// `@cinatra-ai/linkedin-artifacts` — the LinkedIn work-product PACK (epic
// cinatra#1448, rescopes #1457). It CLAIMS the LinkedIn MEMBER post-draft object
// type under the `@cinatra-ai/linkedin` namespace:
//
//   - linkedin:post-draft [draftable] — a member LinkedIn post drafted by an
//                          agent (or authored/edited by a user) before it is
//                          published to the member's feed via the
//                          `social_media_publish` path. draftable: content edits
//                          are allowed only while a row is a draft, then it
//                          locks (the draft→scheduled→published state machine +
//                          publish receipts — the post URN/URL — ride the
//                          publication-operation ledger, cinatra#1450 — declared
//                          here, enforced by that write-path owner). Media
//                          references are same-artifact resources or provider
//                          asset references (LinkedIn asset URNs) — NEVER
//                          artifact ids (epic #1448 atomicity, principle 2).
//
// The ORGANIZATION-page counterpart (`linkedin-community:org-post-draft`) is a
// SEPARATE pack, cinatra#1767 (a later milestone, blocked on the
// linkedin-community connector #932) — it is intentionally NOT claimed here.
//
// The claim (kind, per-claim dispositions incl. the `draftable` mutability
// class, and the inline row JSON Schema it carries as its schema-source) is the
// manifest of record in `package.json` `cinatra.artifact.objectTypes`; the
// object-registry bridge reads it there. This typed export mirrors only the
// DESCRIPTOR half (representation forms) — the SDK `SemanticArtifactManifest`
// contract the bridge type-checks the descriptor against; the `objectTypes`
// claim block is validated host-side by the objects manifest schema. The single
// runtime registrar for `@cinatra-ai/linkedin:post-draft` stays host-side (epic
// #1448 principle 5: exactly one runtime registrar per type; the claim adds only
// disposition / mutability / arbitration, never a second registrar).
//
// No matcher skill: a member post draft is agent-authored (or user-authored) run
// output, not an uploaded document to auto-classify — there is no reliable byte
// signature that separates a bare short-form social post from other short-form
// text, so the pack ships the representation form (`accepts`) without a matcher.
// The `accepts` form (text/markdown + text/plain) is the post body's shape.
export const linkedinArtifactsManifest: SemanticArtifactManifest = {
  accepts: {
    file: {
      mimeTypes: ["text/markdown", "text/plain"],
    },
  },

  // NO DISPLAY OF ITS OWN. The post draft is not this package's to draw: a
  // renderer registered here would win a slot for this extension's own type and
  // shadow the displays every other text work is drawn by. Both slots are left
  // unclaimed, so the post draft is drawn by the display of its content type,
  // which the host resolves for each slot — markdown for text/markdown, plain
  // text for text/plain. The `cinatra` block in package.json, the manifest of
  // record, declares no `ui` block either; the manifest test keeps the two in
  // agreement.
};

export {
  type ArtifactRendererProps,
  ARTIFACT_RENDERER_PROPS_API_VERSION,
} from "./artifact-renderer-props";

export {
  type ArtifactContentProjection,
  type ArtifactContentAbsence,
  type ArtifactContentClass,
  ARTIFACT_CONTENT_CHANNEL_VERSION,
} from "./artifact-content-channel";

// TYPES ONLY, AND FROM THE SANITIZER-FREE CONTRACT MODULE. The view leaf reaches
// the host-provided sanitizer, and a type re-export from THAT module would make
// a compiler follow it there. This root module must stay resolvable with nothing
// installed. The display modules are not exported by this package.
export type { TextView, TextFloorReason } from "./renderers/text-view-contract";
