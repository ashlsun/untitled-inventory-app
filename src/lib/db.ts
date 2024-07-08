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
  // await db.exec(`DROP TABLE IF EXISTS  food_item`)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS food_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      quantity INTEGER,
      date_added DATE,
      storage TEXT
    );
  `)
}

interface FoodItem {
  id: string
  name: string
  quantity: number
  date_added: string
  storage: string
}

export async function addFoodItem(id: string, name: string, quantity: number, storage: string): Promise<void> {
  await initDb()
  const date_added = new Date().toISOString().split('T')[0]

  await db.query<FoodItem>(
    'INSERT INTO food_items (id, name, quantity, date_added, storage) VALUES ($1, $2, $3, $4, $5)',
    [id, name, quantity, date_added, storage],
  )
}

export async function getFoodItems(storage: string): Promise<FoodItem[]> {
  await initDb()
  const result = await db.query<FoodItem>('SELECT * FROM food_items WHERE storage = $1', [storage])
  return result.rows
}

export async function updateFoodItem(id: string, name: string, quantity: number, dateAdded: string): Promise<void> {
  await initDb()
  await db.query(
    'UPDATE food_items SET name = $1, quantity = $2, dateAdded = $3 WHERE id = $4',
    [name, quantity, dateAdded, id],
  )
}

export async function deleteFoodItem(id: string): Promise<void> {
  await initDb()
  await db.query('DELETE FROM food_items WHERE id = $1', [id])
}
