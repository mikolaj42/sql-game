// Baza danych używana w grze (sklep internetowy "BiuroPlus")
const DB_SCRIPT = `
CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, city TEXT, signup_date TEXT);
CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, price REAL);
CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, order_date TEXT, status TEXT);
CREATE TABLE order_items (id INTEGER PRIMARY KEY, order_id INTEGER, product_id INTEGER, quantity INTEGER);

INSERT INTO customers VALUES
(1,'Anna Kowalska','Warszawa','2023-01-15'),
(2,'Piotr Nowak','Kraków','2023-02-20'),
(3,'Marta Wiśniewska','Gdańsk','2023-03-05'),
(4,'Jan Zieliński','Warszawa','2023-04-11'),
(5,'Ewa Lewandowska','Wrocław','2023-05-30'),
(6,'Tomasz Kamiński','Kraków','2023-06-18'),
(7,'Karolina Dąbrowska','Warszawa','2023-07-22'),
(8,'Michał Wójcik','Poznań','2023-08-09');

INSERT INTO products VALUES
(1,'Laptop Pro 15','Elektronika',4500),
(2,'Mysz bezprzewodowa','Elektronika',120),
(3,'Klawiatura mechaniczna','Elektronika',350),
(4,'Biurko regulowane','Meble',1800),
(5,'Krzesło ergonomiczne','Meble',1200),
(6,'Lampka LED','Meble',90),
(7,'Notatnik A5','Papiernicze',15),
(8,'Zestaw długopisów','Papiernicze',25);

INSERT INTO orders VALUES
(1,1,'2024-01-10','dostarczone'),
(2,2,'2024-01-15','dostarczone'),
(3,1,'2024-02-03','dostarczone'),
(4,3,'2024-02-14','anulowane'),
(5,4,'2024-03-01','dostarczone'),
(6,5,'2024-03-12','w drodze'),
(7,2,'2024-03-20','dostarczone'),
(8,6,'2024-04-02','dostarczone'),
(9,1,'2024-04-18','w drodze'),
(10,7,'2024-05-05','dostarczone'),
(11,4,'2024-05-21','anulowane'),
(12,3,'2024-06-01','dostarczone');

INSERT INTO order_items VALUES
(1,1,1,1),(2,1,2,1),(3,2,4,1),(4,3,7,5),(5,3,8,2),(6,4,5,1),
(7,5,3,1),(8,5,2,2),(9,6,6,2),(10,7,5,1),(11,7,6,1),(12,8,1,1),
(13,9,3,1),(14,10,7,10),(15,10,8,4),(16,11,4,1),(17,12,2,1),(18,12,7,3);
`;

// level: easy | medium | hard
// ordered: true = kolejność wierszy ma znaczenie
const TASKS = [
  // ŁATWE
  { level: "easy", points: 10, ordered: false,
    text: "Dzwoni dział sprzedaży. Potrzebuję listy klientów z Warszawy: imię i nazwisko oraz miasto (w tej kolejności).",
    solution: "SELECT name, city FROM customers WHERE city = 'Warszawa'",
    hint: "Użyj WHERE city = 'Warszawa' na tabeli customers." },
  { level: "easy", points: 10, ordered: true,
    text: "Wszystkie produkty z kategorii Meble, od najdroższego do najtańszego. Kolumny: nazwa i cena.",
    solution: "SELECT name, price FROM products WHERE category = 'Meble' ORDER BY price DESC",
    hint: "WHERE filtruje kategorię, ORDER BY price DESC sortuje malejąco." },
  { level: "easy", points: 10, ordered: true,
    text: "Zarząd pyta o trzy najtańsze produkty w sklepie. Podaj nazwę i cenę, od najtańszego.",
    solution: "SELECT name, price FROM products ORDER BY price ASC LIMIT 3",
    hint: "Posortuj rosnąco po cenie i ogranicz wynik słowem LIMIT." },
  { level: "easy", points: 10, ordered: false,
    text: "Muszę zobaczyć anulowane zamówienia: numer zamówienia i data.",
    solution: "SELECT id, order_date FROM orders WHERE status = 'anulowane'",
    hint: "Tabela orders, kolumna status. Wartość to 'anulowane'." },

  // ŚREDNIE
  { level: "medium", points: 20, ordered: false,
    text: "Ilu mamy klientów w każdym mieście? Raport: miasto i liczba klientów.",
    solution: "SELECT city, COUNT(*) FROM customers GROUP BY city",
    hint: "GROUP BY city i funkcja COUNT(*)." },
  { level: "medium", points: 20, ordered: false,
    text: "Najdroższy produkt w każdej kategorii. Kolumny: kategoria i maksymalna cena.",
    solution: "SELECT category, MAX(price) FROM products GROUP BY category",
    hint: "Pogrupuj po category i użyj MAX(price)." },
  { level: "medium", points: 20, ordered: false,
    text: "Którzy klienci składają zamówienia często? Pokaż imię i nazwisko oraz liczbę zamówień, ale tylko dla klientów z co najmniej 2 zamówieniami.",
    solution: "SELECT c.name, COUNT(o.id) FROM customers c JOIN orders o ON o.customer_id = c.id GROUP BY c.id, c.name HAVING COUNT(o.id) >= 2",
    hint: "Połącz customers z orders przez customer_id, pogrupuj i filtruj grupy przez HAVING." },
  { level: "medium", points: 20, ordered: false,
    text: "Lista dostarczonych zamówień: imię i nazwisko klienta oraz data zamówienia (w tej kolejności).",
    solution: "SELECT c.name, o.order_date FROM orders o JOIN customers c ON c.id = o.customer_id WHERE o.status = 'dostarczone'",
    hint: "JOIN orders z customers, a potem WHERE na statusie." },

  // TRUDNE
  { level: "hard", points: 30, ordered: true,
    text: "Wartość każdego dostarczonego zamówienia (suma ilość × cena). Kolumny: numer zamówienia i wartość, od największej.",
    solution: "SELECT o.id, SUM(oi.quantity * p.price) FROM orders o JOIN order_items oi ON oi.order_id = o.id JOIN products p ON p.id = oi.product_id WHERE o.status = 'dostarczone' GROUP BY o.id ORDER BY 2 DESC",
    hint: "Trzy tabele: orders, order_items, products. SUM(oi.quantity * p.price), GROUP BY o.id." },
  { level: "hard", points: 30, ordered: false,
    text: "Którzy klienci nigdy niczego nie zamówili? Zwróć tylko imię i nazwisko.",
    solution: "SELECT c.name FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL",
    hint: "LEFT JOIN customers z orders i szukaj wierszy, gdzie o.id IS NULL." },
  { level: "hard", points: 30, ordered: false,
    text: "Produkty droższe niż średnia cena wszystkich produktów. Podaj nazwę i cenę.",
    solution: "SELECT name, price FROM products WHERE price > (SELECT AVG(price) FROM products)",
    hint: "Podzapytanie w WHERE: (SELECT AVG(price) FROM products)." },
  { level: "hard", points: 30, ordered: false,
    text: "Oznacz każdy produkt: 'drogi' (cena od 1000), 'średni' (100 do 999) albo 'tani' (poniżej 100). Kolumny: nazwa i etykieta.",
    solution: "SELECT name, CASE WHEN price >= 1000 THEN 'drogi' WHEN price >= 100 THEN 'średni' ELSE 'tani' END FROM products",
    hint: "CASE WHEN ... THEN ... WHEN ... THEN ... ELSE ... END." }
];
