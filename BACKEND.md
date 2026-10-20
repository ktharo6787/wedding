# Wedding Control Centre

Open `/admin` to sign in or create an account. Every account receives a private wedding workspace and can create up to 20 isolated wedding projects.

## Included

- Guest and family invitation records
- Personal invitation links with opened, pending, attending and declined states
- RSVP responses saved directly to the backend
- Party size, attending count, table assignment and notes
- Budgeted, actual and paid expense tracking
- Vendors, categories, due dates and payment states
- Dashboard attendance and budget summaries
- Live invitation colors, imagery, typography, animation and butterfly controls
- Couple, parent, date, venue and invitation-copy editing
- Multiple user accounts with isolated wedding data
- Multiple wedding projects per account with unique public URLs
- Emerald, ivory and royal starting templates
- Custom background, crest, emblem, butterfly and frame image uploads
- Draft/public invitation control per wedding

## Storage

The app works immediately with a local JSON database at `.data/wedding-admin.json`. Uploaded artwork is stored in `.data/uploads`.

The directory is ignored by Git. Back it up regularly if local storage is used.

For production, copy `.env.example` to `.env` and configure `DATABASE_URL`. The app automatically creates and uses a PostgreSQL table named `wedding_admin_state`.

## Start

```bash
npm install
npm run dev
```

Then visit:

- Invitation: `http://localhost:3000/`
- Admin: `http://localhost:3000/admin`

Each published wedding has a URL using its unique slug:

```text
http://localhost:3000/?wedding=your-wedding-slug
```

Guest invitation links add a private `invite` code to that URL.

## Production

```bash
npm run build
node .output/server/index.mjs
```

Set `DATABASE_SSL=false` only for a trusted PostgreSQL server that does not support TLS.

For multi-instance production hosting, place `WEDDING_DATA_DIR` on a persistent shared volume or replace local uploads with object storage.
