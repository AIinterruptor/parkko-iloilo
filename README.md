# ParkKo — SMDC Style Residences, Iloilo

Peer-to-peer parking **inside one condominium complex**: SMDC Style Residences,
Mandurriao, Iloilo City — Buildings A, B, C and D only.

**Live demo:** https://aiinterruptor.github.io/parkko-iloilo/

## Who it's for

Two sides, deliberately asymmetric:

- **Unit owners** — your slot sits empty while you're at work or abroad, and you
  still pay dues on it. List it and earn by the day, week, or month.
- **Visitors & neighbours** — guests stop circling the podium, and residents with
  a second car find the slot the building has no more of.

## Exclusivity model

The core design decision, stated plainly:

- **Booking is open.** Visitors are the point. Requiring a guest to prove they
  live here would defeat the product.
- **Listing is closed.** A slot can only be published by a verified resident of
  Buildings A–D, with an active subscription and a registered payout wallet.

Enforcement lives in `firestore.rules`, not just the UI: a user cannot flip their
own `resident` or `subscribed` flag — only the building administrator and the
payment webhook can — and a listing must name a building in A–D. Client-side
gating is the UX; the rules are the teeth.

## Business model

- **Owners pay ₱500/month** to keep listings live. Unlimited slots.
- **ParkKo takes no commission.** Bookers pay exactly the slot rate.
- **Payments go directly to the owner's wallet** (GCash / Maya / bank), sent
  from the booker's own banking app. There is no payment gateway: ParkKo holds
  no funds and is not a party to the transaction. Listings carry only the
  provider, account name, and last four digits — never the full number.
- Every booking issues a printable receipt naming that wallet.

## What it does

- Browse slots by **building, parking level, and slot number**
- Filter by amenities — covered, guarded, CCTV, EV charging, SUV-friendly
- Rent **daily, weekly, or monthly** (longer terms auto-discounted; no hourly —
  residential parking rents by the day at minimum, usually by the month)
- Site map locked to the complex, with shared **visitor bays** and crowd-sourced
  "how full is it right now?" reporting
- **Overstay handling** — 30-minute grace, then owner, occupying driver, and the
  next booker are all notified; the driver can extend in one tap
- **Co-hosts** — owners delegate day-to-day management (messages, bookings,
  overstays, listing, pricing) without ever delegating the money: a co-host
  cannot change the payout wallet, receive payments, or remove the listing
- Owner ↔ booker chat, reviews, verified booker profiles

## Open policy questions

Conflicts, damages, insurance claims, and condominium rules compliance are
addressed in **[POLICY-RECOMMENDATIONS.md](POLICY-RECOMMENDATIONS.md)** — these
are business and legal decisions, not yet implemented. **Condo rules compliance
is the highest-risk open item**: whether owners may lease their slots at all
depends on the Master Deed and House Rules, which have not been reviewed.

## Status

Prototype. **All slot data, owners, unit numbers, wallets, and reviews are mock
data.** Tower coordinates and parking-level layouts are approximations for the
demo, not survey data. Not affiliated with or endorsed by SMDC.

## Tech

Single self-contained `index.html`. React 18 + Leaflet. Edit `src/app.jsx`, then:

```
node build.js
```

`build.js` compiles the JSX ahead of time and inlines it. **Never hand-edit the
compiled block in `index.html`** — the next build overwrites it.

**No payment gateway.** Rent moves directly between booker and owner in their
own banking apps; the app records the reference and issues the receipt. The
former PayMongo Cloudflare Worker has been removed — routing rent through the
platform would make ParkKo a custodian of other people's funds, with BSP
obligations and a float it has no reason to hold.

> Note: `worker/` may still exist locally with build artifacts. It is no longer
> tracked in git and can be deleted.

## Photo credits

Hero images are free-licensed from Wikimedia Commons and show Iloilo City, the
wider setting for the complex — not the property itself:

- **Molo Church and Molo Plaza with Fountain** — Renz0903, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- **Iloilo River Esplanade Phase 6** — Johngaje92, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)

Both are cropped and compressed for web delivery. Listing thumbnails are original
SVG illustrations, not photographs of the actual slots.

## Roadmap

- [ ] **Slot availability calendar** — biggest structural gap; prevents double-booking
- [ ] Check-in / check-out condition photos (damage evidence)
- [ ] Terms of Service + liability waiver at booking
- [ ] Insurance capture and "Insured" badge
- [ ] Administrator console for reviewing residency documents against the master unit list
- [ ] Real backend for multi-user sync (Firestore rules are already written for it)
- [ ] Guard-post check-in: show the booking reference at the gate
