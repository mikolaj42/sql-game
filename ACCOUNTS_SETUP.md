# Konta i zapis postępu: konfiguracja

Gra działa bez żadnej konfiguracji (postęp w przeglądarce). Konta włączą się dopiero, gdy wpiszesz klucze w `config.js`. Ekrany w panelach Supabase, Google i Meta czasem się zmieniają, więc nazwy przycisków mogą się nieco różnić.

## 1. Projekt w Supabase
1. Załóż konto na supabase.com i utwórz nowy projekt.
2. Region wybierz w UE (np. Frankfurt), bo zbierasz adresy e-mail użytkowników z Europy.
3. Zapisz hasło do bazy w bezpiecznym miejscu (do samej gry nie jest potrzebne).

## 2. Tabela z postępem
1. W projekcie wejdź w **SQL Editor** → **New query**.
2. Wklej całą zawartość pliku `supabase_setup.sql` i kliknij **Run**.
3. To tworzy tabelę `progress`, reguły dostępu (każdy widzi tylko swój wiersz) i funkcję do usuwania konta.
4. Skrypt nie był uruchamiany przez autora na prawdziwym Postgresie. Jeśli Supabase zgłosi błąd, wklej mi jego treść.

## 2b. Unikalne nazwy użytkowników
1. W **SQL Editor** utwórz nowe zapytanie, wklej całą zawartość pliku `supabase_usernames.sql` i kliknij **Run** (po `supabase_setup.sql`).
2. Skrypt tworzy tabelę `profiles`, indeks wymuszający unikalność nazw **bez rozróżniania wielkości liter** ("Anna" i "anna" to ta sama nazwa), funkcje `username_available` i `set_username` oraz wyzwalacz, który tworzy profil przy rejestracji.
3. Zasady nazw: 3-20 znaków, tylko litery bez polskich znaków, cyfry i `_`. Kilka nazw jest zarezerwowanych (np. `admin`, `support`, `boss`).
4. Rejestracja e-mailem wymaga nazwy, a gra sprawdza jej dostępność na żywo. Gdy dwie osoby wybiorą tę samą nazwę w tej samej chwili, baza odrzuci drugą.
5. Konta z Google oraz konta założone wcześniej nie mają nazwy: przy pierwszym logowaniu gra wyświetli okno **Choose your username**, którego nie da się pominąć.
6. Skrypt nie był uruchamiany na prawdziwym Postgresie. Jeśli Supabase zgłosi błąd, wklej mi jego treść. Bez tego kroku logowanie pokaże komunikat o braku tabeli `profiles`.

## 2d. Zmiana nazwy użytkownika
1. W **SQL Editor** utwórz nowe zapytanie, wklej cały plik `supabase_settings.sql` i kliknij **Run** (po `supabase_usernames.sql`).
2. Skrypt dodaje do tabeli `profiles` kolumnę z datą ostatniej zmiany i funkcję `change_username`. Użytkownik zmienia nazwę w grze: ikona profilu, **Account & settings**, **Username**, **Change**.
3. Zasady: ten sam format co przy rejestracji, nazwa nie może należeć do kogoś innego (zmiana samej wielkości liter własnej nazwy jest dozwolona), a zmienić ją można **raz na 14 dni**. Okres zmienisz w pliku (`interval '14 days'`) i uruchomisz skrypt jeszcze raz.
4. Bez tego kroku gra działa, ale przy próbie zmiany nazwy pokaże komunikat, że zmiana nie jest jeszcze dostępna. Zmiana hasła nie wymaga żadnego skryptu.

## 2c. Konta administratorów (admin mode)
1. W **SQL Editor** utwórz nowe zapytanie, wklej cały plik `supabase_admins.sql` i kliknij **Run**.
2. Skrypt tworzy tabelę `admins` z jednym wpisem (`mikolaj.jedraszka@gmail.com`) oraz funkcję `is_admin`, o którą gra pyta po zalogowaniu. Tylko takie konta widzą przełącznik **Admin mode**. Dla pozostałych jest ukryty, a zapisany wcześniej stan włączenia jest kasowany.
3. Listy nie da się odczytać z przeglądarki (żaden użytkownik nie zobaczy adresów administratorów), a adres musi być potwierdzony, żeby nikt nie przejął uprawnień przez rejestrację z cudzym adresem.
4. Kolejnego administratora dodasz zapytaniem `insert into public.admins (email) values ('ktos@example.com');` (małymi literami), a usuniesz `delete from public.admins where email = 'ktos@example.com';`.
5. Bez wykonania tego skryptu przełącznik jest ukryty dla wszystkich, także dla Ciebie. Skrypt nie był uruchamiany na prawdziwym Postgresie, więc jeśli Supabase zgłosi błąd, wklej mi jego treść.
6. W lokalnym środowisku bez kluczy w `config.js` (bez kont) przełącznik jest zawsze dostępny, żeby można było testować.

## 3. Klucze w grze
1. **Project Settings → API**. Skopiuj **Project URL** oraz klucz **anon / public** (nie `service_role`!).
2. Wklej je do `config.js`:
```js
const SUPABASE_URL = "https://TWOJ-PROJEKT.supabase.co";
const SUPABASE_ANON_KEY = "wklej-klucz-anon";
```
Klucz anon jest publiczny z założenia. Dane chronią reguły z kroku 2. Klucza `service_role` nigdy nie wklejaj do plików strony.

## 4. Adresy powrotu
**Authentication → URL Configuration**:
- **Site URL**: `https://mikolaj42.github.io/sql-game/`
- **Redirect URLs** (dodaj wszystkie):
  - `https://mikolaj42.github.io/sql-game/**`
  - `http://127.0.0.1:5500/**`
  - `http://localhost:5500/**`

Dwa ostatnie pozwalają testować logowanie lokalnie przez Live Server (port 5500).

## 5. E-mail i hasło
- **Authentication → Providers → Email** jest domyślnie włączone.
- Jeśli włączone jest potwierdzanie adresu (Confirm email), nowy użytkownik musi kliknąć link w mailu przed pierwszym logowaniem.
- Wbudowana wysyłka maili z Supabase ma niskie limity i nadaje się do testów. Przy większym ruchu podepnij własnego dostawcę (Authentication → SMTP).

## 6. Google
1. Wejdź w Google Cloud Console i utwórz projekt.
2. **APIs & Services → OAuth consent screen**: typ External, nazwa aplikacji, e-mail wsparcia, e-mail dewelopera.
3. **Credentials → Create credentials → OAuth client ID**, typ **Web application**.
4. W **Authorized redirect URIs** wpisz adres z Supabase: `https://TWOJ-PROJEKT.supabase.co/auth/v1/callback` (dokładny adres pokazuje Supabase przy ustawieniach Google).
5. Skopiuj **Client ID** i **Client Secret**.
6. W Supabase: **Authentication → Providers → Google**, włącz, wklej Client ID i Secret, zapisz.
7. Podstawowe logowanie (e-mail i profil) zwykle nie wymaga weryfikacji aplikacji przez Google, ale ekran zgody musi mieć uzupełnione dane i link do polityki prywatności.

## 7. Facebook
Logowanie przez Facebooka zostało usunięte z gry, więc nie trzeba nic konfigurować. Jeśli w Supabase włączyłeś wcześniej dostawcę Facebook, możesz go wyłączyć w **Authentication → Providers → Facebook**.

## 8. Test
1. Lokalnie: otwórz folder przez Live Server, kliknij **Sign in** w nagłówku gry i załóż konto.
2. Rozwiąż zadanie, odśwież stronę, wyloguj się i zaloguj ponownie. Postęp powinien wrócić.
3. Wdrożenie: `git add .`, `git commit`, `git push` (pamiętaj, że `config.js` z kluczami trafi do publicznego repozytorium, co przy kluczu anon jest zamierzone).

## 9. Prywatność i dane
- Strona zbiera adresy e-mail, więc potrzebuje krótkiej polityki prywatności (kto jest administratorem, jakie dane, po co, jak usunąć konto). Google i Meta też o nią proszą przy publicznym logowaniu.
- Użytkownik może usunąć konto przyciskiem **Delete account** w oknie konta (usuwa konto i postęp).
- Wylogowanie usuwa postęp z urządzenia (zostaje w koncie), żeby kolejna osoba na tym samym komputerze nie odziedziczyła danych.

## 10. Darmowy plan: pauza projektu
Darmowe projekty Supabase zatrzymują się po tygodniu bez aktywności. Wtedy logowanie i synchronizacja nie działają, dopóki nie wznowisz projektu w panelu (gra nadal działa lokalnie). Płatny plan nie ma tego ograniczenia. Aktualne limity sprawdź na stronie cennika Supabase.
