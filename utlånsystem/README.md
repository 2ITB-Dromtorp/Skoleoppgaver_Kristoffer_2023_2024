# Database Dokumentasjon

## Samlinger

Denne databasen består av tre hovedsamlinger: `Users`, `Equipment`, og `BorrowRequest`. Under beskrives strukturen til hver av disse samlingene.

---

## Users

Denne samlingen lagrer informasjon om brukere. Hver bruker har følgende felter:

- **email** (string): Brukerens e-postadresse. Dette er en obligatorisk og unik verdi.
- **password** (string): Brukerens passord (bør alltid være hashet). Dette feltet er obligatorisk.
- **class_id** (string): ID for klassen som brukeren tilhører. Dette feltet er obligatorisk.
- **role** (string): Brukerens rolle (f.eks. student, lærer). Dette feltet er obligatorisk.
- **contact_info** (object): Brukerens kontaktinformasjon, som inneholder følgende:
  - **firstname** (string): Brukerens fornavn. Dette er obligatorisk.
  - **lastname** (string): Brukerens etternavn. Dette er obligatorisk.
  - **phone** (string): Brukerens telefonnummer. Dette er valgfritt.
  - **adress** (string): Brukerens adresse. Dette er valgfritt.
  - **city** (string): Byen brukeren bor i. Dette er valgfritt.

---

## Equipment

Denne samlingen inneholder informasjon om utstyr som er tilgjengelig for lån. Hver utstyrsenhet har følgende felter:

- **\_id** (string): Serienummeret til utstyret. Dette er en unik og obligatorisk verdi.
- **Type** (string): Type utstyr (f.eks. datamaskin, kamera). Dette er obligatorisk.
- **Model** (string): Modell av utstyret. Dette er obligatorisk.
- **Specs** (array): En liste over spesifikasjoner for utstyret. Dette er valgfritt.
- **BorrowStatus** (object): Statusen for lån, som inneholder følgende:
  - **currentStatus** (string): Gjeldende status for utstyret. Dette kan være enten "borrowed" eller "available".
  - **studentsborrowing** (array): En liste over studenter som låner eller ønsker å låne utstyret.

---

## BorrowRequest

Denne samlingen inneholder forespørsler om å låne utstyr. Hver forespørsel har følgende felter:

- **\_id** (string): ID for låneforespørselen, vanligvis samme som utstyrets serienummer. Dette er en unik og obligatorisk verdi.
- **studentsborrowing** (array): En liste over studenter som ønsker å låne dette utstyret.
