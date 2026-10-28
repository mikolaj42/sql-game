// Learning path: units and lessons. Tasks are referenced by their id (see tasks.js).
// Set premium:true on a unit to make it part of the paid version later.
const PATH = [
 {
  "id": "basics",
  "title": "Basics",
  "blurb": "Read your first tables",
  "premium": false,
  "lessons": [
   {
    "id": "basics-1",
    "title": "Your first SELECT",
    "intro": "A table is a grid: each row is one record and each column holds one kind of value. SELECT chooses the columns you want to see and FROM names the table. A star (*) means every column.",
    "example": "SELECT name, city\nFROM customers;",
    "tasks": [
     "shop-e19",
     "shop-e20",
     "gap-01",
     "shop-e21",
     "shop-e22",
     "shop-e23",
     "bug-01",
     "shop-e24"
    ]
   },
   {
    "id": "basics-2",
    "title": "Other tables",
    "intro": "Every database has its own tables, but the pattern never changes: SELECT columns FROM table. You can calculate inside SELECT, and AS gives a result column a friendlier label.",
    "example": "SELECT name, salary / 12 AS monthly\nFROM employees;",
    "tasks": [
     "hr-e13",
     "hr-e14",
     "gap-02",
     "hr-e15",
     "lib-e09",
     "lib-e10",
     "lib-e11"
    ]
   }
  ]
 },
 {
  "id": "filtering",
  "title": "Filtering",
  "blurb": "Pick the right rows",
  "premium": false,
  "lessons": [
   {
    "id": "filtering-1",
    "title": "WHERE",
    "intro": "WHERE keeps only the rows that match a condition. Compare numbers with =, < and >, and write text in single quotes.",
    "example": "SELECT name, price\nFROM products\nWHERE price > 100;",
    "tasks": [
     "shop-e01",
     "shop-e04",
     "gap-03",
     "shop-e06",
     "shop-e07",
     "shop-e08",
     "bug-02",
     "shop-e09"
    ]
   },
   {
    "id": "filtering-2",
    "title": "More conditions",
    "intro": "Join conditions with AND (both must be true) or OR (one is enough). <> means not equal, and BETWEEN picks a range that includes both ends.",
    "example": "SELECT name, price\nFROM products\nWHERE category = 'Furniture' AND price > 1000;",
    "tasks": [
     "shop-e10",
     "shop-e11",
     "gap-04",
     "shop-e13",
     "shop-e14",
     "shop-e17",
     "bug-03",
     "shop-e18"
    ]
   },
   {
    "id": "filtering-3",
    "title": "Text and missing values",
    "intro": "LIKE finds text by pattern, where % stands for any characters. IN checks a list of values. A missing value is NULL, and you test for it with IS NULL because = NULL never matches.",
    "example": "SELECT name\nFROM employees\nWHERE manager_id IS NULL;",
    "tasks": [
     "hr-e01",
     "hr-e02",
     "gap-05",
     "hr-e04",
     "hr-e05",
     "bug-04",
     "hr-e06"
    ]
   },
   {
    "id": "filtering-4",
    "title": "Ranges and unique values",
    "intro": "Dates are stored as text like '2022-01-01', so you can compare them with > and <. DISTINCT removes duplicate rows from the result.",
    "example": "SELECT DISTINCT job_title\nFROM employees;",
    "tasks": [
     "hr-e07",
     "hr-e10",
     "gap-06",
     "hr-e11",
     "hr-e12"
    ]
   },
   {
    "id": "filtering-5",
    "title": "Library filters",
    "intro": "Same tools, new tables. Read the schema first, then decide which column to filter on.",
    "example": "SELECT title, year\nFROM books\nWHERE genre = 'Fiction';",
    "tasks": [
     "lib-e01",
     "lib-e02",
     "lib-e04",
     "lib-e05",
     "lib-e07"
    ]
   }
  ]
 },
 {
  "id": "sorting",
  "title": "Sorting & limits",
  "blurb": "Order and limit results",
  "premium": false,
  "lessons": [
   {
    "id": "sorting-1",
    "title": "Sorting",
    "intro": "ORDER BY sorts the result, from small to large by default, and DESC reverses that. LIMIT keeps only the first rows, so ORDER BY plus LIMIT gives you a top list.",
    "example": "SELECT name, price\nFROM products\nORDER BY price DESC\nLIMIT 3;",
    "tasks": [
     "shop-e02",
     "shop-e03",
     "gap-07",
     "shop-e05",
     "bug-05",
     "shop-e12"
    ]
   },
   {
    "id": "sorting-2",
    "title": "Top lists",
    "intro": "Sorting and limiting also work on dates and text. OFFSET skips rows before LIMIT starts counting, which is handy for second highest questions.",
    "example": "SELECT salary\nFROM employees\nORDER BY salary DESC\nLIMIT 1 OFFSET 1;",
    "tasks": [
     "hr-e03",
     "hr-e08",
     "lib-e03",
     "hr-h11"
    ]
   }
  ]
 },
 {
  "id": "aggregates",
  "title": "Aggregates",
  "blurb": "Numbers from many rows",
  "premium": false,
  "lessons": [
   {
    "id": "aggregates-1",
    "title": "Counting and adding up",
    "intro": "Aggregate functions turn many rows into one value: COUNT, SUM, AVG, MIN and MAX. COUNT(*) counts rows. With WHERE you can aggregate just part of a table.",
    "example": "SELECT AVG(price)\nFROM products\nWHERE category = 'Electronics';",
    "tasks": [
     "shop-e15",
     "shop-e16",
     "gap-08",
     "hr-e09",
     "lib-e06",
     "shop-m16",
     "bug-06",
     "shop-m18"
    ]
   }
  ]
 },
 {
  "id": "grouping",
  "title": "Grouping",
  "blurb": "One result per group",
  "premium": false,
  "lessons": [
   {
    "id": "grouping-1",
    "title": "GROUP BY",
    "intro": "GROUP BY splits the rows into groups and runs the aggregate once per group. Every column you select must be in GROUP BY or inside an aggregate.",
    "example": "SELECT city, COUNT(*)\nFROM customers\nGROUP BY city;",
    "tasks": [
     "shop-m01",
     "shop-m02",
     "gap-09",
     "shop-m05",
     "shop-m07",
     "shop-m09",
     "bug-07",
     "shop-m11"
    ]
   },
   {
    "id": "grouping-2",
    "title": "HAVING and dates",
    "intro": "WHERE filters rows before grouping, HAVING filters the groups afterwards. strftime('%Y-%m', date) turns a date into a year-month label you can group by.",
    "example": "SELECT category, COUNT(*)\nFROM products\nGROUP BY category\nHAVING COUNT(*) > 2;",
    "tasks": [
     "shop-m14",
     "hr-m06",
     "gap-10",
     "hr-m10",
     "lib-m01",
     "lib-m02",
     "bug-08",
     "lib-m08"
    ]
   }
  ]
 },
 {
  "id": "joins",
  "title": "Joins",
  "blurb": "Combine tables",
  "premium": false,
  "lessons": [
   {
    "id": "joins-1",
    "title": "Joining two tables",
    "intro": "A JOIN connects rows from two tables through matching columns, usually an id in one table and a foreign key in the other. ON says which columns match, and aliases like b and a keep the query short.",
    "example": "SELECT b.title, a.name\nFROM books b\nJOIN authors a ON a.id = b.author_id;",
    "tasks": [
     "lib-e08",
     "shop-m04",
     "gap-11",
     "shop-m08",
     "shop-m12",
     "shop-m17",
     "bug-09",
     "hr-m04"
    ]
   },
   {
    "id": "joins-2",
    "title": "Joins with conditions",
    "intro": "After joining you can filter with WHERE using columns from either table. You can chain more JOINs to reach a third table.",
    "example": "SELECT o.id, c.name\nFROM orders o\nJOIN customers c ON c.id = o.customer_id\nWHERE o.status = 'delivered';",
    "tasks": [
     "hr-m08",
     "hr-m12",
     "lib-m03",
     "lib-m07",
     "shop-h02",
     "bug-10",
     "shop-h07"
    ]
   },
   {
    "id": "joins-3",
    "title": "LEFT JOIN and self joins",
    "intro": "A plain JOIN drops rows without a match. LEFT JOIN keeps every row from the left table and fills the missing side with NULL, which lets you find rows with no match. A self join joins a table to itself, for example employees to their managers.",
    "example": "SELECT a.name\nFROM authors a\nLEFT JOIN books b ON b.author_id = a.id\nWHERE b.id IS NULL;",
    "tasks": [
     "shop-h18",
     "hr-h01",
     "gap-12",
     "hr-h02",
     "hr-h07",
     "bug-11",
     "lib-h01"
    ]
   }
  ]
 },
 {
  "id": "reports",
  "title": "Joins + grouping",
  "blurb": "Reports from several tables",
  "premium": false,
  "lessons": [
   {
    "id": "reports-1",
    "title": "Join, then group",
    "intro": "Reports usually combine both ideas: join the tables you need, then GROUP BY to get one row per customer, category or month.",
    "example": "SELECT c.city, COUNT(o.id)\nFROM customers c\nJOIN orders o ON o.customer_id = c.id\nGROUP BY c.city;",
    "tasks": [
     "shop-m03",
     "shop-m06",
     "gap-13",
     "shop-m10",
     "shop-m13",
     "shop-m15",
     "hr-m01",
     "hr-m02",
     "bug-12",
     "hr-m03"
    ]
   },
   {
    "id": "reports-2",
    "title": "Totals and filters",
    "intro": "You can multiply columns inside an aggregate, for example SUM(quantity * price) for revenue. Put conditions on rows in WHERE and conditions on totals in HAVING.",
    "example": "SELECT p.category, SUM(oi.quantity * p.price)\nFROM order_items oi\nJOIN products p ON p.id = oi.product_id\nGROUP BY p.category;",
    "tasks": [
     "hr-m05",
     "hr-m07",
     "gap-14",
     "hr-m09",
     "hr-m11",
     "lib-m04",
     "lib-m05",
     "lib-m06"
    ]
   },
   {
    "id": "reports-3",
    "title": "Harder reports",
    "intro": "Combine several joins, grouping and sorting in one query. Build it in steps: first the joins, then the grouping, then the ordering.",
    "example": "SELECT c.name, SUM(oi.quantity * p.price)\nFROM customers c\nJOIN orders o ON o.customer_id = c.id\nJOIN order_items oi ON oi.order_id = o.id\nJOIN products p ON p.id = oi.product_id\nGROUP BY c.id, c.name\nORDER BY 2 DESC;",
    "tasks": [
     "shop-h01",
     "shop-h05",
     "shop-h06",
     "shop-h08",
     "shop-h10",
     "bug-13",
     "shop-h12"
    ]
   },
   {
    "id": "reports-4",
    "title": "Dates and distinct counts",
    "intro": "COUNT(DISTINCT x) counts different values only once. julianday(date) turns a date into a number, so subtracting two of them gives the days between.",
    "example": "SELECT COUNT(DISTINCT customer_id)\nFROM orders;",
    "tasks": [
     "shop-h13",
     "hr-h05",
     "hr-h10",
     "lib-h02",
     "lib-h03",
     "bug-14",
     "lib-h04"
    ]
   }
  ]
 },
 {
  "id": "subqueries",
  "title": "Subqueries",
  "blurb": "A query inside a query",
  "premium": false,
  "lessons": [
   {
    "id": "subqueries-1",
    "title": "A query inside a query",
    "intro": "A subquery in parentheses runs first and hands a value or a list to the outer query. A single value works with > or =, a list works with IN or NOT IN.",
    "example": "SELECT name, price\nFROM products\nWHERE price > (SELECT AVG(price) FROM products);",
    "tasks": [
     "shop-h03",
     "shop-h11",
     "gap-15",
     "shop-h15",
     "bug-15",
     "shop-h17"
    ]
   },
   {
    "id": "subqueries-2",
    "title": "Correlated subqueries",
    "intro": "A correlated subquery refers to the outer row, so it runs once per row. EXISTS and NOT EXISTS only ask whether a matching row is there.",
    "example": "SELECT name\nFROM members m\nWHERE NOT EXISTS (SELECT 1 FROM loans l WHERE l.member_id = m.id);",
    "tasks": [
     "hr-h03",
     "hr-h08",
     "gap-16",
     "lib-h05",
     "bug-16",
     "lib-h07"
    ]
   }
  ]
 },
 {
  "id": "advanced",
  "title": "CASE, CTE & windows",
  "blurb": "The tools of senior analysts",
  "premium": false,
  "lessons": [
   {
    "id": "advanced-1",
    "title": "CASE and WITH",
    "intro": "CASE WHEN ... THEN ... ELSE ... END creates labels based on conditions. WITH gives a subquery a name so you can reuse it, which keeps long queries readable.",
    "example": "SELECT name,\n  CASE WHEN price >= 1000 THEN 'expensive' ELSE 'cheap' END\nFROM products;",
    "tasks": [
     "shop-h04",
     "hr-h06",
     "gap-17",
     "shop-h16",
     "hr-h12",
     "bug-17",
     "lib-h08"
    ]
   },
   {
    "id": "advanced-2",
    "title": "Window functions",
    "intro": "A window function calculates across related rows without collapsing them. PARTITION BY restarts the calculation for each group and ORDER BY sets the order inside it. RANK() and running totals are the classics.",
    "example": "SELECT title, genre,\n  RANK() OVER (PARTITION BY genre ORDER BY pages DESC)\nFROM books;",
    "tasks": [
     "shop-h09",
     "shop-h14",
     "gap-18",
     "hr-h04",
     "hr-h09",
     "bug-18",
     "lib-h06"
    ]
   }
  ]
 }
];
