# AgentApprove — Spark Grant Application (Final)

> Submit at: https://airtable.com/appftNMpv819abvTc/pagTUNYDigGHZqQ8o/form

---

## About You

**Name:** PANAGIOTIS POLLIS

**Email:** panagiotispollis@gmail.com

**Telegram / Signal:** @PANAGOT

**Project Name:** AgentApprove

**Live Mini App Link:** https://agent-approve-beryl.vercel.app/

**Website:** https://agent-approve-beryl.vercel.app/ (mini app live today; dedicated docs website is Milestone 1 deliverable)

**GitHub:** https://github.com/panagot/AgentApprove

**Location:** Greece

**Team:**

Solo founder: Panagiotis Pollis — full-stack builder (Next.js, TypeScript, World Mini Apps). Responsible for product, engineering, World ID integration, and go-to-market. Previously built web3 and AI tooling; focused on human-in-the-loop systems for autonomous agents.

**Full-time on project:** Yes — solo founder, full-time on AgentApprove since MVP ship. Pre-traction; focused on open-source infrastructure for World developers.

**Worked together before:**

Solo founder project. I have prior experience building and shipping web applications independently, including integrations with identity and payment systems. This is my first dedicated World Mini App, built on the official @worldcoin/create-mini-app template and aligned with World’s AgentKit / Human-in-the-Loop launch.

---

## Product & Strategic Fit

**What are you building, and who is it for?**

AgentApprove is an open-source Human-in-the-Loop mini app for the World ecosystem. When an AI agent tries to pay, sign, deploy, or call a paid API, the action pauses until a verified human approves it in World App with a World ID proof bound to that specific action.

It’s built for two audiences:

1. Developers — a forkable reference implementation of World’s AgentKit / HITL pattern with REST API, webhooks, risk scoring, and audit logging (github.com/panagot/AgentApprove)
2. End users on World — anyone delegating tasks to AI agents who needs a simple inbox to approve or reject agent actions

We’re pre-traction (no users yet). The app is deployed and functional; our goal is to keep it open source and make it the easiest starting point for builders integrating Human-in-the-Loop on World.

**Strategic use cases (check all that apply):**

- ☑ Digital identity / proof of humanity
- ☑ Developer tooling / infrastructure
- ☑ Other: Open-source Human-in-the-Loop reference for AI agents on World

**World stack integration:**

- World ID 4.0 (IDKit): Action-bound verification per approval (agent-approve:{requestId}); Orb tier for high-value actions
- MiniKit 2.0: Native World App UX, wallet auth, haptics on approve
- Human-in-the-Loop: Compatible with World’s HITL workflow — agents POST requests, humans approve in-app, webhooks resume execution
- REST API + webhooks for agent integration (POST /api/requests, callback on approve/reject)
- World Credit API: Trust badge on connected wallets
- Fully open source (MIT) on GitHub for ecosystem reuse

**Usage metrics:**

Pre-traction — no DAU/WAU/retention yet.

Current status:
- Live mini app: https://agent-approve-beryl.vercel.app/
- Open source (MIT): https://github.com/panagot/AgentApprove
- 18 automated tests passing
- Core flows verified: World ID action-bound approval, webhooks, risk engine, audit log, demo simulator

The product is production-ready for developers to fork and integrate. Grant funding targets developer experience, documentation, and ecosystem adoption — not paid user acquisition.

**What are you currently learning from users?**

No end-user metrics yet — we’re in pre-traction validation.

What we’ve learned from building and self-testing:
- Developers need a copy-paste reference, not just docs — hence the open-source repo with /integrate page and Demo tab
- The webhook → resume-agent loop is the critical integration path we’ve built and documented
- Risk labels and Orb-tier gating matter for high-value actions — already implemented

Next validation (post-grant): share in World dev Discord/Telegram, get 5–10 developers to fork or integrate the API, measure integration attempts rather than consumer DAU.

---

## Business Potential & Commitment

**Monetization:**

Not monetizing at this stage. AgentApprove is MIT open source — free for developers and users on the World network.

Long-term sustainability (not grant-dependent):
- Optional hosted Pro tier for teams (webhooks, audit export) — only after developer adoption
- B2B API pricing for agent platforms — only after reference impl is widely used

For Spark: this is infrastructure for the ecosystem, not a consumer revenue play.

**Current priorities / next milestones (6–12 weeks):**

Month 1 (grant-funded):
- Milestone 1: Dedicated website + Postgres + integration docs
- Milestone 2: Ecosystem launch + 12-month maintenance commitment

Months 2–12 (maintenance, included in grant):
- Security patches and World stack compatibility updates
- Doc and website updates as AgentKit / HITL evolves
- Bug fixes and developer support via GitHub issues

**Funding request: $4,000**

Requesting: $4,000 — delivered in 2 milestones over 30 days, with a 90-day adoption phase.

We are pre-traction (no users yet). This is not a user-acquisition grant — it funds open-source infrastructure, a dedicated project website, and 12 months of maintenance so developers and users on the World network can rely on AgentApprove long-term.

90-day roadmap (3 milestones):

Milestone 1 — $2,000 | Days 1–15
Ship production-ready open-source core + dedicated website

Deliverables:
- Dedicated project website (separate from the mini app) — product overview, docs, API reference, integration guides, GitHub links, and live demo CTA
- Production reliability: Postgres migration (replace ephemeral /tmp JSON on Vercel), webhook retry logic, error handling
- Open-source developer experience: README overhaul, 3 copy-paste integration examples (curl, Node.js agent, webhook handler)
- MiniKit push notification prototype for pending approvals

Success criteria:
- Website live and linked from GitHub + mini app
- Any World developer can fork the repo and integrate HITL in under 30 minutes
- App deployable reliably on Vercel (persistent storage)

Milestone 2 — $2,000 | Days 16–30
Launch to ecosystem + commit to 12-month maintenance

Deliverables:
- Public launch in World developer community (Discord, Telegram, X) with website + live demo
- In-app /integrate page synced with website docs
- Bug fixes and dependency updates from early developer feedback
- 12-month maintenance commitment: security patches, World stack updates (MiniKit / IDKit / AgentKit compatibility), broken-build fixes, and doc updates as the ecosystem evolves

Success criteria:
- 5+ developers actively evaluating or forking the repo
- Website + docs remain current through May 2027
- Repo stays MIT open source with responsive issue handling

Milestone 3 — Days 31–90 | Adoption & maintenance (included in grant)
- Support developer integrations via GitHub issues
- Iterate docs and examples from builder feedback
- Keep website and mini app current with World stack updates

Expected impact:

AgentApprove becomes a maintained, open-source Human-in-the-Loop reference for World — with a proper website, working code, and a year of upkeep — so builders don’t rebuild this from scratch. $4K covers one focused month of delivery plus ongoing maintenance for the ecosystem.

---

## Vision & Fit

**Why are you building this? Why now and why you?**

World launched AgentKit and Human-in-the-Loop in 2026, but there’s no open-source, forkable consumer UI that developers can point users to. Docs explain the pattern; nobody has shipped a working reference app developers can clone.

I’m a solo builder in Greece, shipping on the official World mini app template. AgentApprove is already live, tested, and open source — I’m asking for a small grant to maintain and improve it for the ecosystem, not to scale a consumer product we don’t have users for yet.

Why $4K: enough to harden docs, persistence, and examples so other builders don’t rebuild this from scratch. That’s the highest-leverage use of a Spark grant at our stage.

**Success in 3–6 months:**

- Dedicated AgentApprove website live with docs, API reference, and demo
- AgentApprove is the go-to open-source HITL reference in World dev community
- 5–10 developers have forked or integrated the API
- Integration time for HITL on World drops from “build from scratch” to “fork AgentApprove”
- Repo is production-deployable (Postgres, reliable webhooks, push notifications)
- 12-month maintenance active through May 2027

**If things go well, what's next:**

Keep AgentApprove open source and maintained as ecosystem infrastructure. If developer adoption grows and real end users appear through integrations, consider Scale grant or optional hosted tier. No plans for external fundraising at this stage — focused on being useful infrastructure for World builders.

**Anything else we should know:**

We’re being transparent: zero users, pre-traction. We’re not applying to scale a consumer app — we’re applying for a small grant to maintain open-source developer infrastructure that benefits everyone building agents on World.

Repo: https://github.com/panagot/AgentApprove (MIT)
Live demo: https://agent-approve-beryl.vercel.app/
