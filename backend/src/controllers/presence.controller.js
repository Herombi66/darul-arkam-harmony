const { prisma } = require('../prisma');

exports.getActiveUsers = async (req, res) => {
  try {
    const role = (req.query.role || '').toString() || null;
    const classId = (req.query.classId || '').toString() || null;
    if (process.env.AUTH_DEV_MODE === 'true') {
      const dev = global.__presenceDev || new Map();
      const list = Array.from(dev.values()).filter(u => u.is_online && (!role || u.role === role) && (!classId || u.class_id === classId));
      return res.status(200).json({ success: true, data: list });
    }
    const rows = await prisma.userPresence.findMany({ where: { isOnline: true, ...(role ? { role } : {}), ...(classId ? { classId } : {}) }, orderBy: [{ role: 'asc' }, { userId: 'asc' }] });
    res.status(200).json({ success: true, data: rows.map(r => ({ user_id: r.userId, role: r.role, class_id: r.classId, is_online: r.isOnline, last_seen: r.lastSeen })) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.setOnline = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const { classId } = req.body || {};
    if (process.env.AUTH_DEV_MODE === 'true') return res.status(200).json({ success: true });
    await prisma.userPresence.upsert({ where: { userId }, update: { role, classId: classId || null, isOnline: true, lastSeen: new Date() }, create: { userId, role, classId: classId || null, isOnline: true } });
    res.status(200).json({ success: true });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.setOffline = async (req, res) => {
  try {
    const userId = req.user.id;
    if (process.env.AUTH_DEV_MODE === 'true') return res.status(200).json({ success: true });
    await prisma.userPresence.update({ where: { userId }, data: { isOnline: false, lastSeen: new Date() } });
    res.status(200).json({ success: true });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
