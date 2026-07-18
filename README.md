# LinkedIn Artifacts

The LinkedIn artifacts pack for Cinatra. It holds the member post drafts an agent prepares for a person's LinkedIn feed — the draft body, its destination account, and any attached media references — so every drafted post is an addressable, editable artifact in the library until it is scheduled or published, and then locked alongside its published post URN and URL.

Install this pack via the Cinatra marketplace. Once installed, a member post an agent drafts during a run is saved as a `linkedin:post-draft` artifact you can review and revise while it stays a draft; publishing rides the social-media publish path and locks the draft with its receipt. Media references are the post's own resources or provider asset references — never other artifacts. The organization-page counterpart ships as a separate pack. For local development, run `node extension-kind-gate.mjs --package-root .` at the repo root and confirm zero errors before submitting to the marketplace.

## Works with

- LinkedIn connector (member post publishing)
- Social media drafting agents

## Capabilities

- Save an agent-drafted LinkedIn member post as an editable artifact in the library
- Revise a post draft's body, destination, and media references while it stays a draft
- Keep a locked, addressable record of a published post with its LinkedIn URN and URL
- Attach a post draft as reference context when briefing a drafting agent
