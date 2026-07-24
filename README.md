# ParkKo Iloilo

Find and rent parking spots in Iloilo City. Peer-to-peer parking marketplace.

**Live demo:** https://aiinterruptor.github.io/parkko-iloilo/

## What it does

- Interactive map of available parking spots (OpenStreetMap / Leaflet)
- Filter by amenities — guarded, covered, CCTV, EV charging, SUV-friendly
- Book a spot, leave reviews, get driving directions
- Runs entirely in the browser, no install

## Status

Prototype. Spot data is mock data — no backend yet.

## Tech

Single self-contained HTML file. React 18 + Leaflet, compiled in-browser via Babel standalone. Open `index.html` in any browser, or visit the live URL.

## Photo credits

Hero images are free-licensed from Wikimedia Commons:

- **Molo Church and Molo Plaza with Fountain** — Renz0903, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- **Iloilo River Esplanade Phase 6** — Johngaje92, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)

Both are cropped and compressed for web delivery. Listing thumbnails are original SVG illustrations.

## Roadmap

- [ ] Booker ↔ owner chat
- [ ] Document submission (driver's license, OR/CR, government ID, vehicle photo + plate)
- [ ] Verified booker profiles — verified users skip the document step
- [ ] Real backend for multi-user sync
