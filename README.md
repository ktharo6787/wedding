# ថារ៉ូ & ធានី wedding invitation

A mobile-responsive Nuxt 3 / Vue 3 e-invitation inspired by the supplied emerald-and-gold references. It includes a split-door opening with a tappable ornate crest, optional guest-name personalization, scroll reveals, a wedding programme with tabs, a live seconds countdown, venue and dress details, a Google Calendar event link, gift envelope, RSVP form, music control, and mobile bottom navigation. The top bar has been removed; the hero uses the couple's Khmer names, and section headings share one Khmer-first style. The interior uses your supplied patterned background and a transparent gold corner ornament recreated from your reference.

The closing Khmer thank-you message appears as selectable text immediately above the footer, not as a screenshot. Its wording is an editable adaptation of the supplied image; review and replace the two paragraphs in `pages/index.vue` if you need a word-for-word transcription.

## Run

Node.js 20 or newer is recommended.

```bash
pnpm install
pnpm dev
```

Open the local URL printed by Nuxt. Alternatively, run `npm install` and `npm run dev`.

```bash
pnpm build
pnpm preview
```

For static hosting, use `pnpm generate` and upload `.output/public`.

## Personalize

- Edit `data/invitation.ts` for names, date, times, venue, dress code, RSVP deadline, and music. **The venue, schedule, and RSVP address are placeholders** until you replace them with confirmed details. `calendarEnd` currently sets a provisional 9:00 PM end for the calendar event; update it when the final schedule is known.
- Your supplied couple photo is displayed inside the arch at `public/images/tharo-theany-photo.jpg`. To change it, replace that file or update `heroImage` in `data/invitation.ts`.
- Set `venueAddress` to show the map button and include the address in the calendar event. The calendar link opens a prefilled Google Calendar event; guests must sign in and press Save. It does not download a file or directly write to Apple Calendar. Set `rsvpEmail` to an address you control to prepare an email RSVP; otherwise guests can copy the response and share it manually. This project does not store guest data on a server.
- Update the ceremony and reception programme text and times in `pages/index.vue`. The eight-step ceremony follows the supplied reference's timeline style, but the ritual wording is an editable adaptation; confirm exact wording and times before sharing. The date, countdown, and date card now start at the first ceremony time, 6:00 AM.
- Change colors, layout, and animations in `assets/css/modern-khmer.css`. Khmer titles use the bundled Khmer OS Muol Light font (`public/fonts/KhmerOS_muollight.ttf`, LGPL-3.0 license included); Khmer body copy uses Battambang, English headings and copy use Playfair Display, and small labels use Jost. The opening crest uses `public/images/gold-khmer-emblem-cutout.png`, a transparent-background cutout of your supplied `public/images/gold-khmer-emblem.jpeg`. The invitation interior repeats your supplied `public/images/interior-background.jpg`; its corners use `public/images/gold-corner-transparent.png`, and the side border uses `public/images/ivory-edge.svg`. Verify your rights to publish supplied imagery before putting the site online.
- Replace `public/audio/invitation-music.m4a` with music you have permission to publish.
- The horizontal section divider in `components/SectionDivider.vue` is a transparent gold SVG redraw inspired by your supplied `public/images/khmer-divider-source.png`. It replaces the previous white rule without displaying the photo's white background.

The date uses an ISO timestamp with a timezone offset. Update both `date` and `dateLabel` when changing it so the countdown, Google Calendar event, and visible date agree. Animations honor the visitor's reduced-motion setting.
