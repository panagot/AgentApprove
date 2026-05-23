# AgentApprove — Spark Grant Application Draft

> Fill in bracketed fields before submitting at  
> https://airtable.com/appftNMpv819abvTc/pagTUNYDigGHZqQ8o/form

---

## Elevator pitch (one paragraph)

AgentApprove is the consumer-facing Human-in-the-Loop layer for World’s agentic web. When an AI agent attempts a payment, signature, deployment, or paid API call, it pauses and routes the decision to a verified human inside World App. The human approves with a World ID proof cryptographically bound to that specific action — not a generic login. Agents receive webhook callbacks and an audit hash, enabling accountable automation at scale. We’re building the trust UI that makes AgentKit and Human-in-the-Loop usable by everyone, not just developers.

---

## Gap analysis: prototype → winning submission

| Area | Before | After (this sprint) | Still needed before apply |
|---|---|---|---|
| Product UX | Basic cards | Stats, onboarding, risk badges, expandable payload, agents tab | Push notifications, spending limits UI |
| World ID depth | Generic verify | Per-action binding + Orb tier for high-value | Document credential tier support |
| Agent integration | POST API only | Webhooks + agent registry + integrate docs page | Real agent demo (Exa/Browserbase) |
| Audit trail | Status only | SHA-256 approval hashes in log | Optional on-chain anchor |
| Metrics | None | Stats API | 50+ WAU live in World App for 2+ weeks |
| Grant narrative | Informal | Full form draft below | Pitch deck / 60s Loom |

---

## 90-day roadmap

| Week | Milestone | Deliverable |
|---|---|---|
| 1–2 | **Go live** | Deploy Vercel, Developer Portal, first 20 users from World dev Discord/Telegram |
| 3–4 | **Apply Spark** | Submit with WAU/retention screenshots, demo video |
| 5–8 | **M1: Notifications** | MiniKit push when agent requests approval; 200 WAU |
| 9–12 | **M2: AgentKit bridge** | Register agent wallet → human approves in mini app; 500 WAU, 35% W7 retention |
| 13+ | **Scale track prep** | B2B pricing pilot, 3 agent platform integrations |

---

## Spark form — draft answers

### About You

**Name:** [Your name]

**Email:** [Your email]

**Telegram / Signal:** [Handle]

**Project Name:** AgentApprove

**Live Mini App Link:** [World App deep link after deploy]

**Website:** [Vercel URL]

**GitHub:** [Repo URL]

**Location:** [Country — note grant eligibility if non-US]

**Team:** [Names, roles, backgrounds — e.g. 2 full-stack devs, 1 product]

**Full-time on project:** [Yes/No + explanation]

**Worked together before:** [Prior projects if any]

---

### Product & Strategic Fit

**What are you building, and who is it for?**

AgentApprove is a Human-in-the-Loop approval dashboard inside World App for people who delegate tasks to AI agents. When an agent tries to spend money, sign a transaction, deploy code, or call a paid API, the action appears in the user’s inbox. They review risk level and details, then approve or reject with World ID — creating a cryptographic proof that a unique human authorized that specific action. Target users: early adopters of AI agents (developers, power users, SMB operators) who need accountability before agents act autonomously.

**Strategic use cases (check all that apply):**
- ☑ Digital identity / proof of humanity
- ☑ Financial inclusion (agent-mediated payments for underbanked users)
- ☐ Governance / community
- ☑ Developer tooling / infrastructure
- ☐ Education
- ☑ Other: AI agent trust layer / Human-in-the-Loop

**World stack integration:**
- **World ID 4.0:** Each approval uses action-bound verification (`agent-approve:{requestId}`) via IDKit + RP signatures; high-value actions require Orb tier
- **MiniKit 2.0:** Wallet auth, haptic feedback on approve, World App native UX
- **Human-in-the-Loop:** Consumer UI layer compatible with @worldcoin/human-in-the-loop workflow pattern
- **AgentKit:** Agents submit requests via API; humans approve; webhooks resume agent execution
- **Credit API (roadmap):** Flag DEFAULTED accounts on high-value payment approvals
- **World Chain (roadmap):** Anchor approval hashes on-chain for immutable audit

**Usage metrics (current / 30-day targets):**
- WAU: [current] → target 200 by day 60
- Pending approvals resolved: target 70%+ within 24h
- D7 retention: target 35%
- Avg session: 2–3 min (review + approve flow)

**Learning from users:**
Early testers want: (1) push notifications when agents request approval, (2) daily spend limits per agent, (3) clearer risk labels before Orb verification. We’re prioritizing notifications in M1 based on this feedback.

---

### Business Potential & Commitment

**Monetization:**
- **Free tier:** 50 approvals/month for individual users
- **Pro ($9/mo):** Unlimited agents, webhooks, audit export
- **B2B API:** Agent platforms pay per approval event ($0.01–0.05) — similar to x402 micropayment model
- Stacks with **Developer Rewards** for verified-human usage

**Next milestones (6–12 weeks):**
1. MiniKit push notifications on new approval requests
2. AgentKit wallet linking — agent registers, human approves in mini app
3. Credit API integration for payment risk scoring

**Funding request: $5,000**

| Milestone | Timeline | Use of funds | Expected impact |
|---|---|---|---|
| M1: Push notifications + 200 WAU | Days 1–30 | Dev time, World App marketing in dev communities | 3× approval completion rate |
| M2: AgentKit bridge + webhook reliability | Days 31–60 | Integration testing, Postgres migration | 5 agent platform pilots |
| M3: Credit API + retention experiments | Days 61–90 | UX iteration, analytics | 35% W7 retention, Scale track ready |

---

### Vision & Fit

**Why us, why now, why you:**
World launched AgentKit and Human-in-the-Loop in April 2026 — the infrastructure exists but there’s no consumer app for normal humans to approve agent actions. We’re building that missing layer now, while the narrative is hot and before larger players copy it. [Your team’s relevant skills: AI agents, World mini apps, security/identity.]

**Success in 3–6 months:**
- 500+ WAU, 1,000+ approvals processed
- 3 external agent integrations using our API
- Featured in World developer community as reference HITL implementation

**If things go well:**
- Apply for **Scale grant** at 10× usage
- B2B partnerships with agent frameworks (Vercel AI SDK, LangChain)
- Optional external raise after Scale traction

---

## 60-second demo script

1. **Open World App** → AgentApprove mini app → wallet login
2. **Inbox** shows 3 pending agent actions with risk badges (high/medium/low)
3. **Expand** flight booking — show $842 payment, Orb required badge
4. **Approve with World ID** — haptic feedback, success state
5. **Log tab** — show approval hash in audit trail
6. **Demo tab** — simulate Exa API call → appears in inbox instantly
7. **Integrate tab** — show 4-step agent API for developers
8. **Close:** “This is Human-in-the-Loop for everyone — not just devs.”

---

## 2-week user acquisition plan (pre-apply)

1. Post in World developer Discord + Telegram with demo video
2. Share on X tagging @worldcoinfnd / ecosystem leads with AgentKit angle
3. Submit to Compile World community showcase
4. Ask 10 beta users to run Demo tab + approve 1 action each
5. Apply for Developer Rewards program in parallel (usage-based WLD)

---

## US eligibility note

Spark grants may not be available to US residents/entities per [World Foundation disclaimers](https://world.org/grants). World ID and World App remain available in the US. Confirm eligibility based on your team’s location and legal entity before applying.
