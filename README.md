# Career Coach - Frontend

Frontend aplikacji Career Coach zbudowany w React + Vite + Tailwind CSS.

## Technologie

- **React 19** - biblioteka UI
- **Vite** - narzędzie do budowania
- **Tailwind CSS** - framework CSS

## Uruchomienie lokalne

### 1. Instalacja zależności

```bash
npm install
```

### 2. Skonfiguruj adres backendu

Ustaw zmienną `VITE_API_URL` wskazującą adres backendu:

```bash
echo "VITE_API_URL=http://localhost:8000" > .env.local
```

### 3. Uruchom serwer deweloperski

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: `http://localhost:5173`

### 4. Upewnij się, że backend działa

Backend powinien działać na `http://localhost:8000`

Aby uruchomić backend:
```bash
cd ../career-coach-backend
source venv/bin/activate  # lub venv/Scripts/activate na Windows
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Klucz OpenAI

Użytkownik wprowadza swój klucz API OpenAI w polu formularza w aplikacji. Klucz nie jest przechowywany w backendzie.

## Skrypty

- `npm run dev` - uruchamia serwer deweloperski
- `npm run build` - buduje aplikację produkcyjną
- `npm run preview` - podgląd buildu produkcyjnego
- `npm run lint` - sprawdza kod pod kątem błędów

## Struktura projektu

```
src/
├── App.jsx              # Główny komponent aplikacji
├── App.css              # Style aplikacji
├── index.css            # Globalne style + Tailwind
└── main.jsx             # Punkt wejścia
tailwind.config.cjs      # Konfiguracja Tailwind CSS
postcss.config.cjs       # Konfiguracja PostCSS
```

## Deployment

Aplikacja jest gotowa do deploymentu na **Vercel**.

1. Push kodu do GitHub
2. Połącz repozytorium z Vercel
3. Vercel automatycznie wykryje Vite i zbuduje projekt
4. Ustaw zmienną `VITE_API_URL` w Vercel na adres backendu w produkcji

---

*Utworzono: 14 października 2025*
