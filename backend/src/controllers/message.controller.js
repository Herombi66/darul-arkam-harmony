const { v4: uuidv4 } = require('uuid');
const { prisma } = require('../prisma');
function getDev() {
  try { if (!global.__msgDev) global.__msgDev = { threads: new Map(), messages: new Map() }; } catch {}
  return global.__msgDev;
}

async function createThread(subject, participants) {
  const threadId = uuidv4();
  if (process.env.AUTH_DEV_MODE === 'true') {
    const dev = getDev();
    dev.threads.set(threadId, { id: threadId, subject: subject || 'Conversation', lastMessageAt: new Date().toISOString(), participants });
    dev.messages.set(threadId, []);
    return threadId;
  }
  await prisma.messageThread.create({ data: { id: threadId, subject: subject || 'Conversation' } });
  await prisma.messageParticipant.createMany({ data: participants.map(p => ({ threadId, userId: p.id, role: p.role })) });
  return threadId;
}

async function findOrCreateThread(from, to, subject) {
  const participants = [from, to];
  return createThread(subject, participants);
}

exports.getThreads = async (req, res) => {
  try {
    const userId = req.user.id;
    if (process.env.AUTH_DEV_MODE === 'true') {
      const dev = getDev();
      const list = Array.from(dev.threads.values()).filter(t => t.participants.some(p => p.id === userId));
      list.sort((a,b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
      return res.status(200).json({ success: true, data: list.map(r => ({ id: r.id, subject: r.subject || null, last_message_at: r.lastMessageAt })) });
    }
    const rows = await prisma.messageThread.findMany({
      where: { participants: { some: { userId } } },
      orderBy: { lastMessageAt: 'desc' },
      select: { id: true, subject: true, lastMessageAt: true }
    });
    res.status(200).json({ success: true, data: rows.map(r => ({ id: r.id, subject: r.subject || null, last_message_at: r.lastMessageAt })) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getThread = async (req, res) => {
  try {
    const { threadId } = req.params;
    if (process.env.AUTH_DEV_MODE === 'true') {
      const dev = getDev();
      const thread = dev.threads.get(threadId);
      if (!thread) return res.status(404).json({ success: false, message: 'Thread not found' });
      if (!thread.participants.some(p => p.id === req.user.id)) return res.status(403).json({ success: false, message: 'Forbidden' });
      const participants = thread.participants.map(p => ({ user_id: p.id, role: p.role }));
      const msgsRaw = dev.messages.get(threadId) || [];
      const msgs = msgsRaw.map(m => ({
        id: m.id,
        thread_id: threadId,
        from_user_id: m.from_user_id,
        from_role: m.from_role,
        to_user_id: m.to_user_id,
        to_role: m.to_role,
        subject: m.subject || null,
        content: m.content,
        created_at: m.created_at,
        delivered_at: m.delivered_at || null,
        read_at: m.read_at || null,
      }));
      return res.status(200).json({ success: true, data: { thread: { id: thread.id, subject: thread.subject || null, last_message_at: thread.lastMessageAt }, participants, messages: msgs } });
    }
    const access = await prisma.messageParticipant.findFirst({ where: { threadId, userId: req.user.id } });
    if (!access) return res.status(403).json({ success: false, message: 'Forbidden' });
    const thread = await prisma.messageThread.findUnique({ where: { id: threadId }, select: { id: true, subject: true, lastMessageAt: true } });
    if (!thread) return res.status(404).json({ success: false, message: 'Thread not found' });
    const participants = await prisma.messageParticipant.findMany({ where: { threadId }, select: { userId: true, role: true } });
    const msgsRaw = await prisma.message.findMany({ where: { threadId }, orderBy: { createdAt: 'asc' } });
    const msgs = msgsRaw.map(m => ({
      id: m.id,
      thread_id: m.threadId,
      from_user_id: m.fromUserId,
      from_role: m.fromRole,
      to_user_id: m.toUserId,
      to_role: m.toRole,
      subject: m.subject || null,
      content: decryptContentIfNeeded(m.content),
      created_at: m.createdAt,
      delivered_at: m.deliveredAt,
      read_at: m.readAt,
    }))
    res.status(200).json({ success: true, data: { thread: { id: thread.id, subject: thread.subject || null, last_message_at: thread.lastMessageAt }, participants: participants.map(p => ({ user_id: p.userId, role: p.role })), messages: msgs } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getInbox = async (req, res) => {
  try {
    const userId = req.user.id;
    if (process.env.AUTH_DEV_MODE === 'true') {
      const dev = getDev();
      const all = Array.from(dev.messages.values()).flat();
      const items = all.filter(m => m.to_user_id === userId).sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return res.status(200).json({ success: true, data: items.map(r => ({
        id: r.id,
        thread_id: r.thread_id,
        from_user_id: r.from_user_id,
        from_role: r.from_role,
        subject: r.subject || null,
        content: r.content,
        created_at: r.created_at,
        delivered_at: r.delivered_at || null,
        read_at: r.read_at || null,
      })) });
    }
    const rows = await prisma.message.findMany({
      where: { toUserId: userId },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, data: rows.map(r => ({
      id: r.id,
      thread_id: r.threadId,
      from_user_id: r.fromUserId,
      from_role: r.fromRole,
      subject: r.subject || null,
      content: decryptContentIfNeeded(r.content),
      created_at: r.createdAt,
      delivered_at: r.deliveredAt,
      read_at: r.readAt,
    })) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { toRole, toId, subject, content, threadId: providedThreadId, sensitive = false, attachments } = req.body || {};
    if (!toRole || !toId || !content) {
      if (!providedThreadId) {
        return res.status(400).json({ success: false, message: 'toRole, toId, and content or threadId are required' });
      }
    }
    const from = { id: req.user.id, role: req.user.role };
    let threadId = providedThreadId;
    if (!threadId) {
      const to = { id: toId, role: toRole };
      threadId = await findOrCreateThread(from, to, subject);
    }
    if (process.env.AUTH_DEV_MODE === 'true') {
      const dev = getDev();
      const t = dev.threads.get(threadId);
      if (!t) return res.status(404).json({ success: false, message: 'Thread not found' });
      const participants = t.participants;
      const others = participants.filter(p => p.id !== from.id);
      const created = [];
      for (const p of others) {
        const id = uuidv4();
        const row = {
          id,
          thread_id: threadId,
          from_user_id: from.id,
          from_role: from.role,
          to_user_id: p.id,
          to_role: p.role,
          subject: subject || null,
          content,
          created_at: new Date().toISOString(),
        };
        dev.messages.get(threadId).push(row);
        created.push(row);
        try { if (global.io) global.io.to(`user-${p.id}`).emit('message', { threadId, message: row }); } catch {}
      }
      t.lastMessageAt = new Date().toISOString();
      return res.status(200).json({ success: true, data: created.length === 1 ? created[0] : created });
    }
    const participants = await prisma.messageParticipant.findMany({ where: { threadId }, select: { userId: true, role: true } });
    const others = participants.filter(p => p.userId !== from.id);
    const encrypted = encryptContentIfNeeded(content, sensitive);
    const created = [];
    for (const p of others) {
      const id = uuidv4();
      const row = await prisma.message.create({ data: {
        id,
        threadId,
        fromUserId: from.id,
        fromRole: from.role,
        toUserId: p.userId,
        toRole: p.role,
        subject: subject || null,
        content: encrypted,
      } });
      created.push(row);
      try { if (global.io) global.io.to(`user-${p.userId}`).emit('message', { threadId, message: { id: row.id, thread_id: row.threadId, from_user_id: row.fromUserId, from_role: row.fromRole, to_user_id: row.toUserId, to_role: row.toRole, subject: row.subject, content, created_at: row.createdAt, delivered_at: row.deliveredAt, read_at: row.readAt } }); } catch {}
      try { await prisma.messageAudit.create({ data: { id: uuidv4(), actorUserId: from.id, action: 'send', messageId: row.id, threadId, metadata: { sensitive } } }); } catch {}
    }
    await prisma.messageThread.update({ where: { id: threadId }, data: { lastMessageAt: new Date() } });
    res.status(200).json({ success: true, data: created.length === 1 ? created[0] : created });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.markRead = async (req, res) => {
    try {
      const { messageId } = req.params;
      const msg = await prisma.message.findUnique({ where: { id: messageId }, select: { toUserId: true } });
      if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
      if (msg.toUserId !== req.user.id) return res.status(403).json({ success: false, message: 'Forbidden' });
      const updated = await prisma.message.update({ where: { id: messageId }, data: { readAt: new Date() }, select: { fromUserId: true } });
      try { if (global.io) global.io.to(`user-${updated.fromUserId}`).emit('message:status', { messageId, read: true }); } catch {}
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.createThread = async (req, res) => {
  try {
    const { subject, participants } = req.body || {};
    if (!participants || !Array.isArray(participants) || participants.length < 2) {
      return res.status(400).json({ success: false, message: 'At least two participants required' });
    }
    // RBAC: teachers can include teacher, student, parent, admin
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ success: false, message: 'Only teachers can create threads' });
    }
    const threadId = await createThread(subject, participants);
    try { await prisma.messageAudit.create({ data: { id: uuidv4(), actorUserId: req.user.id, action: 'thread:create', threadId, metadata: { count: participants.length } } }); } catch {}
    res.status(200).json({ success: true, data: { id: threadId } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.search = async (req, res) => {
  try {
    const q = (req.query.q || '').toString();
    const userId = req.user.id;
    const rows = await prisma.message.findMany({
      where: {
        thread: { participants: { some: { userId } } },
        OR: [
          { subject: { contains: q, mode: 'insensitive' } },
          { content: { contains: q, mode: 'insensitive' } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 200
    });
    res.status(200).json({ success: true, data: rows.map(r => ({
      id: r.id,
      thread_id: r.threadId,
      from_user_id: r.fromUserId,
      from_role: r.fromRole,
      to_user_id: r.toUserId,
      to_role: r.toRole,
      subject: r.subject || null,
      content: decryptContentIfNeeded(r.content),
      created_at: r.createdAt,
      delivered_at: r.deliveredAt,
      read_at: r.readAt,
    })) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.flag = async (req, res) => {
  try {
    const { messageId } = req.body || {};
    await prisma.messageFlag.upsert({ where: { userId_messageId: { userId: req.user.id, messageId } }, update: { flaggedAt: new Date() }, create: { userId: req.user.id, messageId } });
    res.status(200).json({ success: true });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.unflag = async (req, res) => {
  try {
    const { messageId } = req.body || {};
    await prisma.messageFlag.delete({ where: { userId_messageId: { userId: req.user.id, messageId } } });
    res.status(200).json({ success: true });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.archive = async (req, res) => {
  try {
    const { threadId } = req.body || {};
    await prisma.messageArchive.upsert({ where: { userId_threadId: { userId: req.user.id, threadId } }, update: { archivedAt: new Date() }, create: { userId: req.user.id, threadId } });
    res.status(200).json({ success: true });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.unarchive = async (req, res) => {
  try {
    const { threadId } = req.body || {};
    await prisma.messageArchive.delete({ where: { userId_threadId: { userId: req.user.id, threadId } } });
    res.status(200).json({ success: true });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.attach = async (req, res) => {
  try {
    const { messageId, files } = req.body || {};
    if (!messageId || !Array.isArray(files)) return res.status(400).json({ success: false, message: 'messageId and files[] required' });
    const fs = require('fs');
    const path = require('path');
    const dir = path.join(__dirname, '../../uploads/messages');
    try { fs.mkdirSync(dir, { recursive: true }); } catch {}
    const saved = [];
    for (const f of files) {
      const { name, mime, base64 } = f;
      const buf = Buffer.from(base64, 'base64');
      if (buf.length > 10 * 1024 * 1024) return res.status(400).json({ success: false, message: 'File too large' });
      const filename = `${messageId}_${Date.now()}_${name}`.replace(/[^a-zA-Z0-9_.-]/g, '_');
      const filePath = path.join(dir, filename);
      fs.writeFileSync(filePath, buf);
      await prisma.messageAttachment.create({ data: { id: uuidv4(), messageId, filename, mime, sizeBytes: buf.length, path: filePath } });
      saved.push({ filename, mime, size: buf.length });
    }
    res.status(200).json({ success: true, data: saved });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};
const crypto = require('crypto');

function encryptContentIfNeeded(content, sensitive) {
  try {
    if (!sensitive) return content;
    const key = process.env.MSG_ENCRYPTION_KEY;
    if (!key || key.length < 16) return content;
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', crypto.createHash('sha256').update(key).digest(), iv);
    const enc = Buffer.concat([cipher.update(content, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `enc:${iv.toString('base64')}:${tag.toString('base64')}:${enc.toString('base64')}`;
  } catch {
    return content;
  }
}

function decryptContentIfNeeded(content) {
  try {
    if (!content.startsWith('enc:')) return content;
    const key = process.env.MSG_ENCRYPTION_KEY;
    if (!key || key.length < 16) return '[Encrypted]';
    const [, ivB64, tagB64, dataB64] = content.split(':');
    const iv = Buffer.from(ivB64, 'base64');
    const tag = Buffer.from(tagB64, 'base64');
    const data = Buffer.from(dataB64, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-gcm', crypto.createHash('sha256').update(key).digest(), iv);
    decipher.setAuthTag(tag);
    const dec = Buffer.concat([decipher.update(data), decipher.final()]);
    return dec.toString('utf8');
  } catch {
    return '[Encrypted]';
  }
}
