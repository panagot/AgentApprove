# AgentApprove

**Human-in-the-Loop approval dashboard for AI agents** — a World Mini App prototype built for the [World Foundation Spark Grant](https://world.org/grants).

When an AI agent wants to pay, sign, deploy, or call a paid API, AgentApprove pauses the action and requires a **World ID cryptographic proof** that a real human approved it. Every decision is logged in an audit trail.

Built on [World Human-in-the-Loop](https://docs.world.org/agents/human-in-the-loop/integrate) + MiniKit 2.0.

## Features (prototype)

- **Inbox** — pending agent actions (payment, sign, deploy, API call)
- **Approve with World ID** — each action gets a unique `agent-approve:{id}` verification binding
- **Reject** — deny without verification
- **Audit log** — history of approved/rejected/expired actions
- **Demo tab** — simulate agent requests for testing
- **Agent API** — `POST /api/requests` for external agents to submit approval requests

## Test before submitting

```bash
# Automated tests (18 scenarios — store, API, risk, full flow)
npm test

# Live simulation against running dev server
npm run dev          # terminal 1
npm run test:live    # terminal 2
```

Tests cover: risk scoring, approval hashes, agent registry, request CRUD, webhook dispatch, API validation, and a simulated reject→approve flow.

World ID verification requires World App — not covered by automated tests.


```bash
cd agent-approve
cp .env.sample .env.local
npm install
npm run dev
```

### Environment variables

Configure in [developer.world.org](https://developer.world.org/):

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_APP_ID` | Mini App ID (`app_...`) |
| `RP_ID` | Relying party ID (`rp_...`) |
| `RP_SIGNING_KEY` | RP signing key for IDKit |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `HMAC_SECRET_KEY` | `openssl rand -base64 32` |
| `AUTH_URL` | Your public URL (ngrok for local testing) |
| `AGENT_API_KEY` | Optional — secures agent POST endpoint |

### Test in World App

1. Run `npm run dev`
2. Expose with ngrok: `ngrok http 3000`
3. Set `AUTH_URL` to your ngrok URL in `.env.local`
4. Update app URL in Developer Portal → scan QR to install

## Agent API

```bash
curl -X POST https://your-app.vercel.app/api/requests \
  -H "Content-Type: application/json" \
  -H "x-agent-api-key: YOUR_KEY" \
  -d '{
    "agentName": "Travel Agent",
    "actionType": "payment",
    "summary": "Book flight SFO → Tokyo",
    "amount": "$842.00",
    "target": "united.com/checkout"
  }'
```

Action types: `payment` | `sign` | `deploy` | `api_call`

## Grant alignment

- Extends World’s **AgentKit / Human-in-the-Loop** launch (Apr 2026)
- Consumer-facing layer on top of dev infrastructure
- Deep **World ID** integration — action-bound proofs per approval
- **Non-airdrop utility** — real trust layer for the agentic web

## Deploy

Deploy to [Vercel](https://vercel.com) and update Developer Portal with production URL.

## License

MIT
