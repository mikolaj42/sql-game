// Extra exercise types used inside learning-path lessons (they are not part of Career or Endless).
// type "gap": fill the blanks (___) of the template from the word bank. type "bug": the editor starts with a broken query.
// Both are checked by comparing the RESULT with the solution, like normal tasks.
const EXERCISES = [
 {
  "id": "gap-01",
  "type": "gap",
  "db": "shop",
  "topic": "basics",
  "level": "easy",
  "points": 5,
  "ordered": false,
  "text": "Fill the gaps: list the name and city of every customer.",
  "template": "SELECT name, ___\nFROM ___",
  "answers": [
   "city",
   "customers"
  ],
  "options": [
   "city",
   "customers",
   "products",
   "price",
   "orders"
  ],
  "hint": "The first gap is a column, the second one is the table."
 },
 {
  "id": "gap-02",
  "type": "gap",
  "db": "hr",
  "topic": "basics",
  "level": "easy",
  "points": 5,
  "ordered": false,
  "text": "Fill the gaps: each employee's monthly salary (the salary column is per year).",
  "template": "SELECT name, salary ___ 12\nFROM ___",
  "answers": [
   "/",
   "employees"
  ],
  "options": [
   "/",
   "*",
   "employees",
   "departments",
   "+"
  ],
  "hint": "Monthly means yearly divided by 12."
 },
 {
  "id": "gap-03",
  "type": "gap",
  "db": "shop",
  "topic": "filtering",
  "level": "easy",
  "points": 5,
  "ordered": false,
  "text": "Fill the gaps: products that cost more than 100.",
  "template": "SELECT name, price\nFROM products\n___ price ___ 100",
  "answers": [
   "WHERE",
   ">"
  ],
  "options": [
   "WHERE",
   "FROM",
   "SELECT",
   ">",
   "<",
   "="
  ],
  "hint": "WHERE starts a condition, and more than is the > sign."
 },
 {
  "id": "gap-04",
  "type": "gap",
  "db": "shop",
  "topic": "filtering",
  "level": "easy",
  "points": 5,
  "ordered": false,
  "text": "Fill the gaps: furniture that costs more than 1000.",
  "template": "SELECT name, price\nFROM products\nWHERE category = ___ ___ price > 1000",
  "answers": [
   "'Furniture'",
   "AND"
  ],
  "options": [
   "'Furniture'",
   "Furniture",
   "AND",
   "OR",
   "'Electronics'"
  ],
  "hint": "Text values need single quotes, and both conditions must be true."
 },
 {
  "id": "gap-05",
  "type": "gap",
  "db": "hr",
  "topic": "filtering",
  "level": "easy",
  "points": 5,
  "ordered": false,
  "text": "Fill the gaps: employees without a manager.",
  "template": "SELECT name\nFROM employees\nWHERE manager_id ___ ___",
  "answers": [
   "IS",
   "NULL"
  ],
  "options": [
   "IS",
   "=",
   "NULL",
   "0",
   "NOT"
  ],
  "hint": "A missing value is NULL and you test it with IS."
 },
 {
  "id": "gap-06",
  "type": "gap",
  "db": "lib",
  "topic": "filtering",
  "level": "easy",
  "points": 5,
  "ordered": false,
  "text": "Fill the gaps: each genre in the library once.",
  "template": "SELECT ___ ___\nFROM books",
  "answers": [
   "DISTINCT",
   "genre"
  ],
  "options": [
   "DISTINCT",
   "genre",
   "title",
   "COUNT",
   "year"
  ],
  "hint": "DISTINCT removes duplicates."
 },
 {
  "id": "gap-07",
  "type": "gap",
  "db": "shop",
  "topic": "sorting",
  "level": "easy",
  "points": 5,
  "ordered": true,
  "text": "Fill the gaps: the three most expensive products, most expensive first.",
  "template": "SELECT name, price\nFROM products\nORDER BY price ___\n___ 3",
  "answers": [
   "DESC",
   "LIMIT"
  ],
  "options": [
   "DESC",
   "ASC",
   "LIMIT",
   "WHERE",
   "OFFSET"
  ],
  "hint": "DESC sorts from big to small, LIMIT keeps the first rows."
 },
 {
  "id": "gap-08",
  "type": "gap",
  "db": "shop",
  "topic": "aggregates",
  "level": "easy",
  "points": 5,
  "ordered": false,
  "text": "Fill the gap: the average price of all products.",
  "template": "SELECT ___(price)\nFROM products",
  "answers": [
   "AVG"
  ],
  "options": [
   "AVG",
   "SUM",
   "COUNT",
   "MAX",
   "MIN"
  ],
  "hint": "Which function averages?"
 },
 {
  "id": "gap-09",
  "type": "gap",
  "db": "shop",
  "topic": "grouping",
  "level": "medium",
  "points": 10,
  "ordered": false,
  "text": "Fill the gaps: how many customers live in each city.",
  "template": "SELECT city, ___(*)\nFROM customers\n___ city",
  "answers": [
   "COUNT",
   "GROUP BY"
  ],
  "options": [
   "COUNT",
   "SUM",
   "GROUP BY",
   "ORDER BY",
   "WHERE"
  ],
  "hint": "Count the rows, then group them by city."
 },
 {
  "id": "gap-10",
  "type": "gap",
  "db": "shop",
  "topic": "grouping",
  "level": "medium",
  "points": 10,
  "ordered": false,
  "text": "Fill the gap: categories that have more than 2 products.",
  "template": "SELECT category, COUNT(*)\nFROM products\nGROUP BY category\n___ COUNT(*) > 2",
  "answers": [
   "HAVING"
  ],
  "options": [
   "HAVING",
   "WHERE",
   "ORDER BY",
   "LIMIT"
  ],
  "hint": "Conditions on groups use HAVING, not WHERE."
 },
 {
  "id": "gap-11",
  "type": "gap",
  "db": "lib",
  "topic": "joins",
  "level": "medium",
  "points": 10,
  "ordered": false,
  "text": "Fill the gaps: every book with its author's name.",
  "template": "SELECT b.title, a.name\nFROM books b\n___ authors a ___ a.id = b.author_id",
  "answers": [
   "JOIN",
   "ON"
  ],
  "options": [
   "JOIN",
   "ON",
   "LEFT",
   "AND",
   "USING"
  ],
  "hint": "JOIN connects the tables, ON says how they match."
 },
 {
  "id": "gap-12",
  "type": "gap",
  "db": "lib",
  "topic": "joins",
  "level": "hard",
  "points": 15,
  "ordered": false,
  "text": "Fill the gaps: authors who have no books in the library.",
  "template": "SELECT a.name\nFROM authors a\n___ JOIN books b ON b.author_id = a.id\nWHERE b.id ___ NULL",
  "answers": [
   "LEFT",
   "IS"
  ],
  "options": [
   "LEFT",
   "INNER",
   "IS",
   "=",
   "NOT"
  ],
  "hint": "LEFT JOIN keeps authors without a match, and NULL needs IS."
 },
 {
  "id": "gap-13",
  "type": "gap",
  "db": "shop",
  "topic": "reports",
  "level": "medium",
  "points": 10,
  "ordered": false,
  "text": "Fill the gap: the number of orders per customer city.",
  "template": "SELECT c.city, COUNT(o.id)\nFROM customers c\nJOIN orders o ON o.customer_id = c.id\nGROUP BY ___",
  "answers": [
   "c.city"
  ],
  "options": [
   "c.city",
   "o.id",
   "c.name",
   "o.status"
  ],
  "hint": "One row per city, so group by the city column."
 },
 {
  "id": "gap-14",
  "type": "gap",
  "db": "shop",
  "topic": "reports",
  "level": "medium",
  "points": 10,
  "ordered": false,
  "text": "Fill the gaps: revenue per product category (quantity times price, added up).",
  "template": "SELECT p.category, ___(oi.quantity ___ p.price)\nFROM order_items oi\nJOIN products p ON p.id = oi.product_id\nGROUP BY p.category",
  "answers": [
   "SUM",
   "*"
  ],
  "options": [
   "SUM",
   "COUNT",
   "*",
   "+",
   "AVG"
  ],
  "hint": "Multiply inside, add up outside."
 },
 {
  "id": "gap-15",
  "type": "gap",
  "db": "shop",
  "topic": "subqueries",
  "level": "hard",
  "points": 15,
  "ordered": false,
  "text": "Fill the gap: products that cost more than the average product.",
  "template": "SELECT name, price\nFROM products\nWHERE price > (SELECT ___(price) FROM products)",
  "answers": [
   "AVG"
  ],
  "options": [
   "AVG",
   "MAX",
   "SUM",
   "MIN"
  ],
  "hint": "The inner query must return the average price."
 },
 {
  "id": "gap-16",
  "type": "gap",
  "db": "lib",
  "topic": "subqueries",
  "level": "hard",
  "points": 15,
  "ordered": false,
  "text": "Fill the gap: members who have never borrowed a book.",
  "template": "SELECT name\nFROM members m\nWHERE ___ EXISTS (SELECT 1 FROM loans l WHERE l.member_id = m.id)",
  "answers": [
   "NOT"
  ],
  "options": [
   "NOT",
   "ALL",
   "ANY",
   "DISTINCT"
  ],
  "hint": "You want members for whom no loan exists."
 },
 {
  "id": "gap-17",
  "type": "gap",
  "db": "shop",
  "topic": "advanced",
  "level": "hard",
  "points": 15,
  "ordered": false,
  "text": "Fill the gaps: label each product expensive (1000 or more) or cheap.",
  "template": "SELECT name,\n  ___ WHEN price >= 1000 THEN 'expensive'\n  ELSE 'cheap'\n___\nFROM products",
  "answers": [
   "CASE",
   "END"
  ],
  "options": [
   "CASE",
   "END",
   "IF",
   "SWITCH",
   "WHEN"
  ],
  "hint": "A CASE expression starts with CASE and finishes with END."
 },
 {
  "id": "gap-18",
  "type": "gap",
  "db": "lib",
  "topic": "advanced",
  "level": "hard",
  "points": 15,
  "ordered": false,
  "text": "Fill the gaps: rank books by page count inside each genre.",
  "template": "SELECT title, genre,\n  RANK() ___ (___ BY genre ORDER BY pages DESC)\nFROM books",
  "answers": [
   "OVER",
   "PARTITION"
  ],
  "options": [
   "OVER",
   "PARTITION",
   "GROUP",
   "WITHIN",
   "ORDER"
  ],
  "hint": "Window functions use OVER, and PARTITION BY restarts the ranking per group."
 },
 {
  "id": "bug-01",
  "type": "bug",
  "db": "shop",
  "topic": "basics",
  "level": "easy",
  "points": 7,
  "ordered": false,
  "text": "Fix the bug: this query should list the names of all customers, but it does not run.",
  "starter": "SELEC name FROM customers",
  "solution": "SELECT name FROM customers",
  "hint": "Look at the very first word."
 },
 {
  "id": "bug-02",
  "type": "bug",
  "db": "shop",
  "topic": "filtering",
  "level": "easy",
  "points": 7,
  "ordered": false,
  "text": "Fix the bug: products that cost more than 100. The query does not run.",
  "starter": "SELECT name, price FROM products WHERE price => 100",
  "solution": "SELECT name, price FROM products WHERE price > 100",
  "hint": "There is no => operator in SQL."
 },
 {
  "id": "bug-03",
  "type": "bug",
  "db": "shop",
  "topic": "filtering",
  "level": "easy",
  "points": 7,
  "ordered": false,
  "text": "Fix the bug: customers from New York or Chicago. The query returns nothing.",
  "starter": "SELECT name, city FROM customers WHERE city = 'New York' AND city = 'Chicago'",
  "solution": "SELECT name, city FROM customers WHERE city = 'New York' OR city = 'Chicago'",
  "hint": "A row cannot be in two cities at once."
 },
 {
  "id": "bug-04",
  "type": "bug",
  "db": "hr",
  "topic": "filtering",
  "level": "easy",
  "points": 7,
  "ordered": false,
  "text": "Fix the bug: employees without a manager. The query returns nothing.",
  "starter": "SELECT name FROM employees WHERE manager_id = NULL",
  "solution": "SELECT name FROM employees WHERE manager_id IS NULL",
  "hint": "Comparing with = NULL never matches."
 },
 {
  "id": "bug-05",
  "type": "bug",
  "db": "shop",
  "topic": "sorting",
  "level": "easy",
  "points": 7,
  "ordered": true,
  "text": "Fix the bug: we want the three cheapest products, but this shows the most expensive.",
  "starter": "SELECT name, price FROM products ORDER BY price DESC LIMIT 3",
  "solution": "SELECT name, price FROM products ORDER BY price ASC LIMIT 3",
  "hint": "Flip the sort direction."
 },
 {
  "id": "bug-06",
  "type": "bug",
  "db": "shop",
  "topic": "aggregates",
  "level": "easy",
  "points": 7,
  "ordered": false,
  "text": "Fix the bug: count the delivered orders. The query does not run.",
  "starter": "SELECT COUNT(*) FROM orders WHERE status = delivered",
  "solution": "SELECT COUNT(*) FROM orders WHERE status = 'delivered'",
  "hint": "Text values need quotes."
 },
 {
  "id": "bug-07",
  "type": "bug",
  "db": "shop",
  "topic": "grouping",
  "level": "medium",
  "points": 14,
  "ordered": false,
  "text": "Fix the bug: orders per status, but only one row comes back.",
  "starter": "SELECT status, COUNT(*) FROM orders",
  "solution": "SELECT status, COUNT(*) FROM orders GROUP BY status",
  "hint": "Something is missing that splits the rows into groups."
 },
 {
  "id": "bug-08",
  "type": "bug",
  "db": "lib",
  "topic": "grouping",
  "level": "medium",
  "points": 14,
  "ordered": false,
  "text": "Fix the bug: genres with more than 2 books. The query does not run.",
  "starter": "SELECT genre, COUNT(*) FROM books WHERE COUNT(*) > 2 GROUP BY genre",
  "solution": "SELECT genre, COUNT(*) FROM books GROUP BY genre HAVING COUNT(*) > 2",
  "hint": "Aggregates cannot be used in WHERE. Use HAVING after GROUP BY."
 },
 {
  "id": "bug-09",
  "type": "bug",
  "db": "lib",
  "topic": "joins",
  "level": "medium",
  "points": 14,
  "ordered": false,
  "text": "Fix the bug: each book with its own author. Right now every book is paired with every author.",
  "starter": "SELECT b.title, a.name FROM books b JOIN authors a",
  "solution": "SELECT b.title, a.name FROM books b JOIN authors a ON a.id = b.author_id",
  "hint": "The join does not say which rows belong together."
 },
 {
  "id": "bug-10",
  "type": "bug",
  "db": "shop",
  "topic": "joins",
  "level": "medium",
  "points": 14,
  "ordered": false,
  "text": "Fix the bug: delivered orders with the right customer name. The names look wrong.",
  "starter": "SELECT o.id, c.name FROM orders o JOIN customers c ON c.id = o.id WHERE o.status = 'delivered'",
  "solution": "SELECT o.id, c.name FROM orders o JOIN customers c ON c.id = o.customer_id WHERE o.status = 'delivered'",
  "hint": "An order points to its customer through customer_id."
 },
 {
  "id": "bug-11",
  "type": "bug",
  "db": "lib",
  "topic": "joins",
  "level": "hard",
  "points": 21,
  "ordered": false,
  "text": "Fix the bug: members who never borrowed anything. The query returns nothing.",
  "starter": "SELECT m.name FROM members m JOIN loans l ON l.member_id = m.id WHERE l.id IS NULL",
  "solution": "SELECT m.name FROM members m LEFT JOIN loans l ON l.member_id = m.id WHERE l.id IS NULL",
  "hint": "A plain JOIN drops members without loans."
 },
 {
  "id": "bug-12",
  "type": "bug",
  "db": "shop",
  "topic": "reports",
  "level": "medium",
  "points": 14,
  "ordered": false,
  "text": "Fix the bug: orders per city. Right now there is one row per customer.",
  "starter": "SELECT c.city, COUNT(o.id) FROM customers c JOIN orders o ON o.customer_id = c.id GROUP BY c.name",
  "solution": "SELECT c.city, COUNT(o.id) FROM customers c JOIN orders o ON o.customer_id = c.id GROUP BY c.city",
  "hint": "Which column should the groups be built from?"
 },
 {
  "id": "bug-13",
  "type": "bug",
  "db": "shop",
  "topic": "reports",
  "level": "hard",
  "points": 21,
  "ordered": true,
  "text": "Fix the bug: total spent per customer, biggest spender first. The order is upside down.",
  "starter": "SELECT c.name, SUM(oi.quantity * p.price) FROM customers c JOIN orders o ON o.customer_id = c.id JOIN order_items oi ON oi.order_id = o.id JOIN products p ON p.id = oi.product_id GROUP BY c.id, c.name ORDER BY 2",
  "solution": "SELECT c.name, SUM(oi.quantity * p.price) FROM customers c JOIN orders o ON o.customer_id = c.id JOIN order_items oi ON oi.order_id = o.id JOIN products p ON p.id = oi.product_id GROUP BY c.id, c.name ORDER BY 2 DESC",
  "hint": "ORDER BY sorts from small to large unless told otherwise."
 },
 {
  "id": "bug-14",
  "type": "bug",
  "db": "shop",
  "topic": "reports",
  "level": "hard",
  "points": 21,
  "ordered": false,
  "text": "Fix the bug: how many different customers placed an order? The number is too high.",
  "starter": "SELECT COUNT(customer_id) FROM orders",
  "solution": "SELECT COUNT(DISTINCT customer_id) FROM orders",
  "hint": "Each customer is being counted once per order."
 },
 {
  "id": "bug-15",
  "type": "bug",
  "db": "shop",
  "topic": "subqueries",
  "level": "hard",
  "points": 21,
  "ordered": false,
  "text": "Fix the bug: products above the average price. The query does not run.",
  "starter": "SELECT name, price FROM products WHERE price > AVG(price)",
  "solution": "SELECT name, price FROM products WHERE price > (SELECT AVG(price) FROM products)",
  "hint": "Compute the average in a subquery."
 },
 {
  "id": "bug-16",
  "type": "bug",
  "db": "shop",
  "topic": "subqueries",
  "level": "hard",
  "points": 21,
  "ordered": false,
  "text": "Fix the bug: customers who have never had a cancelled order. This lists the opposite.",
  "starter": "SELECT name FROM customers WHERE id IN (SELECT customer_id FROM orders WHERE status = 'cancelled')",
  "solution": "SELECT name FROM customers WHERE id NOT IN (SELECT customer_id FROM orders WHERE status = 'cancelled')",
  "hint": "You want everyone who is not in that list."
 },
 {
  "id": "bug-17",
  "type": "bug",
  "db": "shop",
  "topic": "advanced",
  "level": "hard",
  "points": 21,
  "ordered": false,
  "text": "Fix the bug: label each product expensive or cheap. The query does not run.",
  "starter": "SELECT name, CASE WHEN price >= 1000 THEN 'expensive' ELSE 'cheap' FROM products",
  "solution": "SELECT name, CASE WHEN price >= 1000 THEN 'expensive' ELSE 'cheap' END FROM products",
  "hint": "Every CASE needs a closing word."
 },
 {
  "id": "bug-18",
  "type": "bug",
  "db": "hr",
  "topic": "advanced",
  "level": "hard",
  "points": 21,
  "ordered": false,
  "text": "Fix the bug: a running total of salaries in order of hiring. The query does not run.",
  "starter": "SELECT name, hire_date, SUM(salary) OVER (hire_date) FROM employees",
  "solution": "SELECT name, hire_date, SUM(salary) OVER (ORDER BY hire_date) FROM employees",
  "hint": "Inside OVER, the order is set with ORDER BY."
 }
];
