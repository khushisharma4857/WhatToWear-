import express from 'express'
import cors from 'cors'
import pg from 'pg'

const { Pool } = pg
const app = express()
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

app.use(cors())
app.use(express.json())

// ── Clothing Items ──────────────────────────────────────────────────────────

app.get('/api/items', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM clothing_items ORDER BY created_at ASC'
    )
    res.json(rows.map(dbToItem))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch items' })
  }
})

app.post('/api/items', async (req, res) => {
  const { id, name, category, color, season, occasion, imageColor, imageUrl, emoji, wearCount, lastWorn } = req.body
  try {
    const { rows } = await pool.query(
      `INSERT INTO clothing_items (id, name, category, color, season, occasion, image_color, image_url, emoji, wear_count, last_worn)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [id, name, category, color ?? 'custom', season ?? [], occasion ?? [], imageColor ?? '#e5e7eb', imageUrl ?? null, emoji ?? '👕', wearCount ?? 0, lastWorn ?? null]
    )
    res.status(201).json(dbToItem(rows[0]))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to add item' })
  }
})

app.delete('/api/items/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM clothing_items WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete item' })
  }
})

app.patch('/api/items/:id/wear', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]
    const { rows } = await pool.query(
      `UPDATE clothing_items SET wear_count = wear_count + 1, last_worn = $1 WHERE id = $2 RETURNING *`,
      [today, req.params.id]
    )
    if (!rows.length) return res.status(404).json({ error: 'Item not found' })
    res.json(dbToItem(rows[0]))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update wear count' })
  }
})

// ── Outfits ─────────────────────────────────────────────────────────────────

app.get('/api/outfits', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM outfits ORDER BY created_at ASC')
    res.json(rows.map(dbToOutfit))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch outfits' })
  }
})

app.post('/api/outfits', async (req, res) => {
  const { id, name, items, occasion, createdAt } = req.body
  try {
    const { rows } = await pool.query(
      `INSERT INTO outfits (id, name, items, occasion, created_at_date)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [id, name, items ?? [], occasion ?? 'casual', createdAt ?? new Date().toISOString().split('T')[0]]
    )
    res.status(201).json(dbToOutfit(rows[0]))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to add outfit' })
  }
})

app.delete('/api/outfits/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM outfits WHERE id = $1', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete outfit' })
  }
})

// ── Helpers ──────────────────────────────────────────────────────────────────

function dbToItem(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    color: row.color,
    season: row.season,
    occasion: row.occasion,
    imageColor: row.image_color,
    imageUrl: row.image_url ?? undefined,
    emoji: row.emoji,
    wearCount: row.wear_count,
    lastWorn: row.last_worn ?? undefined,
  }
}

function dbToOutfit(row) {
  return {
    id: row.id,
    name: row.name,
    items: row.items,
    occasion: row.occasion,
    createdAt: row.created_at_date,
  }
}

const PORT = 3001
app.listen(PORT, '0.0.0.0', () => console.log(`API server running on port ${PORT}`))
