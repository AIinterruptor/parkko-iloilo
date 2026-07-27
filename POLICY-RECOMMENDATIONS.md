# ParkKo — Policy Recommendations

> Draft for the Commander's decision. Covers four questions raised during the
> SMDC Style Residences pivot: **conflicts**, **damages**, **insurance claims**,
> and **condo rules compliance**.
>
> These are business/legal policy calls, not code decisions. Nothing here is
> implemented yet — each section ends with what to build once you've decided.
>
> ⚠️ **I have not seen the actual SMDC Style Residences House Rules, Master Deed,
> or Deed of Restrictions.** Section 4 is the highest-risk item and is written as
> questions to answer, not answers. Get those documents before building anything
> in it.

---

## 0. The principle that should drive all four

ParkKo takes ₱500/month from owners and **never touches the rent**. That single
design choice has a consequence you should embrace rather than fight:

**ParkKo is a listing and coordination platform, not an escrow agent, not an
insurer, and not an arbitrator.**

Every policy below follows from that. The moment ParkKo starts holding money,
judging fault, or promising to cover damage, it takes on custodial and liability
exposure that a ₱500/month product cannot fund. The platform's job is to make
the facts undeniable — who booked, when, what condition, what was agreed — so
the two parties, the building admin, or an insurer can resolve it quickly.

**The product promise should be: "We make disputes easy to settle. We don't
settle them for you."**

---

## 1. Conflicts

### The conflicts that will actually happen

Ranked by how often I'd expect them, in a building of four towers:

| # | Conflict | Root cause |
|---|---|---|
| 1 | **Overstay** — car still there when the next booking starts | Already handled (see below) |
| 2 | **Wrong slot** — someone parks in a bay that isn't theirs | Slot numbers are easy to misread in a dim basement |
| 3 | **Double-booking** — owner sold the same period twice, or needs the slot back | No availability calendar yet |
| 4 | **No-show / cancellation** — booker doesn't come, wants a refund | No cancellation policy exists |
| 5 | **Access** — guard won't let the booker in, sticker/pass problems | Building access is separate from ParkKo |
| 6 | **Condition** — "it was blocked", "it was flooded", "it's smaller than pictured" | Listing accuracy |
| 7 | **Payment** — owner says unpaid, booker says paid | Direct payment means no platform ledger |

### What's already built

Overstay is handled: 30-minute grace, then all three parties are notified —
owner, occupying driver, and the next booker — with a one-tap extend for the
driver. That's the single highest-value conflict control, because it stops the
problem *before* the next person is blocked.

### Recommended: a three-tier ladder

Deliberately, most conflicts should never reach tier 3.

**Tier 1 — Self-serve (target: 80% of cases)**
The app gives both sides the facts and a one-tap resolution:
- Extend (already built), or release the slot early
- "I'm blocked" button → notifies owner + occupant immediately, with timestamp
- "Wrong car in my slot" → photo + plate → notifies owner and building security
- Cancellation inside the free window → automatic

**Tier 2 — Owner/co-host resolves (target: 15%)**
The owner (or a co-host with the `overstay`/`bookings` permission) has buttons to:
- Refund a portion directly (they hold the money, so they must action it)
- Offer an alternative slot they own
- Waive an overstay charge

**Tier 3 — Escalation (target: 5%)**
ParkKo does **not** adjudicate. It produces a **Dispute Pack** — a one-page PDF
with booking reference, timestamps, both parties' statements, photos, and the
notification log — and routes it to whoever actually has authority:
- Building admin / property management office, for anything involving building
  access, security, or House Rules
- The two parties directly, for money
- Barangay conciliation (*Katarungang Pambarangay*) is the normal PH next step
  for small civil disputes between residents before any court action

### Cancellation policy — recommend "Moderate"

Copy Airbnb's proven middle tier rather than inventing one:

| When cancelled | Booker gets back |
|---|---|
| ≥ 7 days before start | 100% |
| 2–7 days before | 50% |
| < 48 hours | 0% |
| Owner cancels, any time | 100% + ParkKo helps rebook |

Owner-side cancellation needs a penalty or the whole system is unreliable — but
since ParkKo holds no money, the only real lever is **reputation**: an
"Owner cancelled" note on the listing, and repeat offenders lose their listing.
Say this in the Owner Plan terms.

### Build list (once approved)
- [ ] Availability calendar on each slot — **prerequisite for fixing #3**, and
      the single biggest structural gap right now
- [ ] "Report a problem" flow with photo + timestamp
- [ ] Dispute Pack PDF generator
- [ ] Cancellation policy engine + display on the listing and receipt
- [ ] Owner-side refund/waive actions

---

## 2. Damages

### The honest position

Two very different exposures get lumped together as "damages":

**A. Damage to the vehicle** (dents, scratches, flooding, theft)
**B. Damage to the property** (owner's slot, building structure, another car)

The recommended stance for both: **ParkKo does not compensate.** It provides
evidence. Anything else requires a claims fund and an adjuster, which ₱500/month
per owner cannot support.

But "we don't cover it" is only acceptable if you make it **easy to prove what
happened**, and say so plainly before booking — not after.

### Recommended: condition evidence, both ends

The mechanism that resolves most vehicle-damage disputes is boring and cheap:

1. **Check-in photos** — booker photographs the slot and their car on arrival
   (4 quick shots, prompted by the app, timestamped and stored with the booking)
2. **Check-out photos** — same on departure
3. Both sets attach to the booking permanently and appear in the Dispute Pack

This resolves "it was already scratched" arguments in seconds, which is where
these disputes actually die. It's the same reason car rental companies do a walk
around with a diagram.

### Liability, stated plainly in the terms

Recommended language for the booking terms (have a PH lawyer review before use):

> The slot owner provides parking space only. The owner is not a depositary of
> the vehicle and does not assume custody, control, or responsibility for it.
> Vehicles are parked at the owner's risk. ParkKo is a listing platform, is not
> a party to the rental, holds no funds, and is not liable for loss or damage to
> any vehicle or property.

That "not a depositary" phrasing matters in PH law: a *deposit* (Civil Code
Art. 1962) creates a duty of safekeeping, while a lease of space does not. Parking
arrangements are ordinarily the latter — but **get this confirmed by counsel**,
because how it's worded and operated affects whether a court agrees.

### Damage to the building or another car

This one is not the owner's or ParkKo's to absorb — it's the **driver's**, and
it's normally covered by their motor insurance (see §3). The app's job:
- Capture the booker's plate number and insurance details at verification
- Make them visible to the owner on the booking
- Notify building admin when an incident is reported inside common areas

### Build list (once approved)
- [ ] Check-in / check-out photo capture (reuse existing `compressImage`)
- [ ] Incident report attached to a booking, with photos + timestamps
- [ ] Terms of Service and liability waiver, accepted at booking (not buried)
- [ ] Store booker plate + insurer on the profile, surface to the owner

---

## 3. Insurance claims

### The key insight

**ParkKo should not sell or provide insurance.** Selling it turns you into an
insurance intermediary, which in the Philippines requires Insurance Commission
licensing. Avoid that entirely at this stage.

Instead: **make existing policies work.** Almost everyone involved already has
cover — it just doesn't get claimed because nobody documents anything.

### Who actually covers what

| Scenario | Who normally pays | ParkKo's role |
|---|---|---|
| Booker's car damaged by a third party | Booker's **comprehensive** motor policy | Provide evidence pack |
| Booker's car damaged, no fault found | Booker's own comprehensive, or nobody | Provide evidence pack |
| Booker damages another car | Booker's **CTPL / third-party liability** | Provide plate + policy details |
| Booker damages the building | Booker's TPL, then building's property policy | Notify building admin fast |
| Theft from/of the vehicle | Booker's comprehensive (theft rider) | Police report + CCTV request |
| Flood in the basement | Booker's **Acts of Nature** rider (usually optional!) | Weather alert; disclose flood history |

Two items worth flagging to your users, because they're the common gaps:
- **CTPL alone is not enough.** It covers injury to third parties, not the
  parked car. Many Filipino drivers carry CTPL only.
- **Flooding needs an Acts of Nature rider.** Iloilo, basement parking, habagat
  season — this is a real and foreseeable exposure. A basement slot listing
  should carry a flood-history disclosure.

### Recommended: an "insurance readiness" layer

Cheap to build, no licensing exposure, and genuinely useful:

1. **Capture at verification** — insurer name, policy number, expiry, and
   coverage type (CTPL / comprehensive / +Acts of Nature). Store on the profile.
2. **Show it on the booking** — the owner sees "Comprehensive, valid to Mar 2027"
   before accepting. A booker with expired cover is a visible risk.
3. **Nudge, don't gate** — badge a booker as "Insured" the way "Verified" works
   now. Owners can decide; ParkKo doesn't refuse anyone.
4. **Claims assistant** — when an incident is filed, generate the pack an insurer
   will ask for: booking reference, both photo sets, timestamps, plate numbers,
   both parties' details, and a prompt to obtain a police report (required for
   theft and most significant claims) and to request building CCTV **within the
   retention window** — often only 15–30 days, which is why speed matters.

### Optional, later: group cover

Once there's real volume, the building corporation or ParkKo could negotiate a
**group parking liability policy** — cheaper per slot than individual cover, and
a genuine selling point for the ₱500 plan. This needs a licensed broker and real
numbers. Not now.

### Build list (once approved)
- [ ] Insurance fields on the profile + "Insured" badge
- [ ] Display booker's coverage to the owner at booking
- [ ] Claims assistant / evidence pack export
- [ ] Flood-history disclosure on basement and ground-level listings
- [ ] CCTV retention warning on any incident report

---

## 4. Condo rules compliance ⚠️ HIGHEST RISK

### Read this first

**This section could stop the product.** Everything above assumes owners may
rent out their slots. That assumption needs verifying against the actual
governing documents before you build anything else.

I have **not** seen SMDC Style Residences' House Rules, Master Deed, or Deed of
Restrictions. What follows is what to check and how to design defensively —
not a claim about what those documents say.

### The questions that must be answered

Get the **Master Deed with Deed of Restrictions**, the **House Rules**, and the
**parking slot title or assignment document**, then answer:

1. **Is the slot separately titled, or merely assigned?**
   This is the single most important question.
   - *Separately titled* (its own CCT) → the owner genuinely owns it and
     ordinarily may lease it, subject to restrictions
   - *Assigned / limited common area* → the owner has a **right to use**, not
     ownership, and subletting may be prohibited outright

2. **Does the Master Deed restrict transfer to non-residents?**
   Many PH condominiums restrict parking slot sale or lease to **unit owners
   within the same project**. If so, renting to outside visitors is barred, and
   ParkKo becomes a resident-to-resident exchange only. *This would be a major
   product change — inventory stays, but the visitor side largely disappears.*

3. **Do House Rules ban commercial use of common areas?**
   Renting for profit may be classed as commercial activity.

4. **What are the actual visitor parking rules?**
   Time limits, overnight bans, sticker/pass requirements, guest registration.

5. **Is condominium corporation consent required to lease a slot?**
   Some require written consent per lease.

6. **Are there penalties?** Fines, towing rights, suspension of privileges.

### How to design defensively regardless of the answers

Build these whatever the documents say — they're right in every scenario:

**a. House Rules acknowledgement.** Both owner and booker tick an explicit
acknowledgement at listing and at booking. Store the version they accepted.

**b. In-app House Rules panel.** Surface the relevant rules where they matter:
in the listing form for owners, on the receipt for bookers (gate hours, guest
registration, speed limits, no car washing/repairs, no overnight if applicable).

**c. Owner attestation.** At residency verification, the owner ticks:
> "I confirm my parking slot is mine to lease and that leasing it does not
> violate the Master Deed, Deed of Restrictions, or House Rules of SMDC Style
> Residences."

This does not create legal cover for ParkKo, but it puts the obligation where
the knowledge is and creates a record.

**d. Admin channel.** A route for the property management office to flag or
suspend a listing. **The building admin should outrank the platform** — if
management says a slot can't be listed, it comes down, immediately and without
argument. Design for that from the start.

**e. Guest registration integration.** Most PH condos require visitors to be
registered at the guardhouse. The booking reference on the receipt should carry
whatever the guard actually needs — plate, unit sponsoring the visit, validity
window.

### The strategic recommendation

**Approach the building administration before launch, not after.**

Right now this is a prototype with mock data, so there's nothing to answer for.
The moment it carries real listings inside a real building, unsanctioned, it
becomes a governance problem — and the property manager's first move will be to
shut it down.

The far better play: bring it to them as a **solution to a problem they already
have**. Every condo admin in the country deals with visitor parking complaints,
unauthorised parking, and towing arguments. ParkKo gives them:
- A record of who is parked where and by whose authority
- Fewer "car blocking my slot" escalations
- Visitor bay occupancy data they've never had

There's a plausible business in that: an **official building partnership**, with
management endorsing it to residents — which also solves your distribution
problem, since you need owners and bookers in the same building simultaneously.
A revenue share on the ₱500 is a reasonable thing to offer.

### Build list (once the documents are read)
- [ ] House Rules acknowledgement + versioning
- [ ] Owner attestation at residency verification
- [ ] In-app House Rules panel (needs the real rules)
- [ ] Admin suspension channel
- [ ] Guest registration details on the receipt
- [ ] Rule-driven constraints (e.g. disable overnight bookings if banned)

---

## Recommended sequence

1. **Get the governing documents.** Everything else is provisional until §4 is
   answered. This is a phone call to the admin office, not a development task.
2. **Availability calendar.** The biggest structural gap; prevents conflict #3.
3. **Check-in/check-out photos.** Cheapest, highest-value damage control.
4. **Terms of Service + liability waiver.** Should exist before any real booking.
5. **Insurance capture + badge.** Low effort, differentiates the product.
6. **Dispute Pack.** Ties conflicts, damages, and insurance together.
7. **Approach building administration.**

---

## What I need from you, Sir

- **The House Rules / Master Deed** — or authorisation to proceed on stated
  assumptions, flagged as unverified
- **A decision on cancellation policy** (Moderate recommended)
- **Confirmation of the no-liability stance** — this is the load-bearing
  business decision, and it should be reviewed by a PH lawyer before any real
  money moves through the platform
- **Whether to approach building administration** before or after further build
