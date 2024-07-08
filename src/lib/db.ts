import { PGlite } from '@electric-sql/pglite'

let db: PGlite
let dbInitialized = false

export async function initDb(): Promise<void> {
  if (!dbInitialized) {
    db = new PGlite('idb://food-inventory')
    await db.waitReady
    await createTables()
    dbInitialized = true
  }
}

async function createTables(): Promise<void> {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS food_items (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      quantity INTEGER,
      date_added DATE,
      storage TEXT
    );

    CREATE TABLE IF NOT EXISTS common_items (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tags (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS item_tags (
      item_id INTEGER,
      tag_id INTEGER,
      PRIMARY KEY (item_id, tag_id),
      FOREIGN KEY (item_id) REFERENCES common_items(id),
      FOREIGN KEY (tag_id) REFERENCES tags(id)
    );

    CREATE TABLE IF NOT EXISTS shelf_lives (
      id SERIAL PRIMARY KEY,
      item_id INTEGER,
      storage TEXT NOT NULL,
      duration INTEGER NOT NULL,
      duration_unit TEXT NOT NULL,
      FOREIGN KEY (item_id) REFERENCES common_items(id)
    );
  `)
}

interface FoodItem {
  id: number
  name: string
  quantity: number
  date_added: string
  storage: string
}

export async function addFoodItem(name: string, quantity: number, storage: string): Promise<void> {
  await initDb()
  const date_added = new Date().toISOString().split('T')[0]

  await db.query<FoodItem>(
    'INSERT INTO food_items (name, quantity, date_added, storage) VALUES ($1, $2, $3, $4)',
    [name, quantity, date_added, storage],
  )
}

export async function getFoodItems(storage: string): Promise<FoodItem[]> {
  await initDb()
  const result = await db.query<FoodItem>('SELECT * FROM food_items WHERE storage = $1', [storage])
  return result.rows
}

export async function updateFoodItem(id: number, name: string, quantity: number): Promise<void> {
  await initDb()
  await db.query(
    'UPDATE food_items SET name = $1, quantity = $2 WHERE id = $3',
    [name, quantity, id],
  )
}

export async function deleteFoodItem(id: number): Promise<void> {
  await initDb()
  await db.query('DELETE FROM food_items WHERE id = $1', [id])
}
