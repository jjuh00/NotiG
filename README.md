# NotiG

Muistiinpanojen tekemiseen tarkoitettu verkkosovellus, jossa käyttäjät voivat luoda, muokata, poistaa ja viedä (PDF-tiedostoksi) omia muistiinpanojaan mukaututetuilla tyyleillä.

## Hakemistorakenne

```
README.md
notig/
│
├── backend/
│   ├── controllers/
│   ├── database/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── types/
│   ├── app.ts
│   └── server.ts
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/t
│       ├── pages/
│       ├── hooks/
│       ├── styles/
│       ├── types/
│       ├── App.tsx
│       └── main.tsx
│
├── package.json
├── vite.config.ts
├── tsconfig.app.json
└── tsconfig.node.json
```

## Asennus

Anna kaikki komennot hakemistossa Notig/notig (siirry hakemistoon komennolla cd notig)

1. Asenna tarvittaessa Node.js (https://nodejs.org/en)
2. Asenna tarvittavat paketit kommennolla npm install

## Ohjelman käynnistäminen

Käynnistä frontend ja backend samanaikaisesti komennolla npm run dev
- Frontend pyörii osoitteessa [http://localhost:5173](http://localhost:5173)
- Backend pyörii osoitteessa [http://localhost:3003](http://localhost:3003)

## Kuinka ohjelma toimii?

1. Käynnistä backend ja frontend (katso kohdasta Ohjelman käynnistäminen)
2. Avaa verkkoselain osoitteessa [http://localhost:5173](http://localhost:5173)
3. Rekisteröi uusi käyttäjä tai kirjaudu olemassa olevan käyttäjän tiedoilla
4. Päänäkymässä voi tarkastella, luoda, muokata ja kiinnittää omia muistiinpanojasi
5. Voit kustomoida muistiinpanojesi tyylejä
6. Voit viedä muistiinpanon PDF-tiedostoksi
## Teknologiapino

- Frontend: React + TypeScript + Vite + React Router
- Frontend: Express.js + SQLite3 (molemmat TypeScript:llä)
- PDF-vienti: PDFKit
- Muotoilu: CSS + Flaticon kuvakkeet + Google Fonts
