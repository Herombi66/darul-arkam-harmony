const { prisma } = require('../prisma')

function parseDate(input) {
  const d = new Date(input)
  if (isNaN(d.getTime())) return null
  return d
}

exports.getUpcoming = async (req, res) => {
  try {
    const now = new Date()
    const items = await prisma.event.findMany({ where: { is_active: true, event_date: { gte: now } }, orderBy: { event_date: 'asc' } })
    res.status(200).json({ success: true, data: items })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.getAll = async (req, res) => {
  try {
    const items = await prisma.event.findMany({ where: { is_active: true }, orderBy: { event_date: 'desc' } })
    res.status(200).json({ success: true, data: items })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.getStats = async (req, res) => {
  try {
    const now = new Date()
    const [total, upcoming, past] = await Promise.all([
      prisma.event.count({ where: { is_active: true } }),
      prisma.event.count({ where: { is_active: true, event_date: { gte: now } } }),
      prisma.event.count({ where: { is_active: true, event_date: { lt: now } } })
    ])
    res.status(200).json({ success: true, data: { total, upcoming, past } })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.create = async (req, res) => {
  try {
    const { title, description, event_date, location } = req.body || {}
    if (!title || !event_date) return res.status(400).json({ success: false, message: 'title and event_date are required' })
    const d = parseDate(event_date)
    if (!d) return res.status(400).json({ success: false, message: 'invalid event_date' })
    const created = await prisma.event.create({ data: { title, description: description || null, event_date: d, location: location || null } })
    try { global.io?.emit('events:update', { action: 'created', event: created }) } catch {}
    res.status(201).json({ success: true, data: created })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.update = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, event_date, location, is_active } = req.body || {}
    const data = {}
    if (typeof title === 'string') data.title = title
    if (typeof description !== 'undefined') data.description = description ?? null
    if (typeof location !== 'undefined') data.location = location ?? null
    if (typeof is_active !== 'undefined') data.is_active = !!is_active
    if (typeof event_date !== 'undefined') {
      const d = parseDate(event_date)
      if (!d) return res.status(400).json({ success: false, message: 'invalid event_date' })
      data.event_date = d
    }
    const updated = await prisma.event.update({ where: { id }, data })
    try { global.io?.emit('events:update', { action: 'updated', event: updated }) } catch {}
    res.status(200).json({ success: true, data: updated })
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Event not found' })
    res.status(500).json({ success: false, message: error.message })
  }
}

exports.remove = async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await prisma.event.delete({ where: { id } })
    try { global.io?.emit('events:update', { action: 'deleted', eventId: id }) } catch {}
    res.status(200).json({ success: true, data: deleted })
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Event not found' })
    res.status(500).json({ success: false, message: error.message })
  }
}
