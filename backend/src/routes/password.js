const express = require('express');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();
const router = express.Router();

// Create password setup/reset token
router.post('/request-token', async (req, res) => {
  const { email, type } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 min

  await prisma.passwordToken.create({
    data: {
      token,
      type,
      userId: user.id,
      expiresAt: expires,
    }
  });

  // TODO: Send email with link (simulate here)
  res.json({ token, message: 'Token created. Send link to user manually or via email.' });
});

// Set or reset password with token
router.post('/set-password', async (req, res) => {
  const { token, password } = req.body;

  const record = await prisma.passwordToken.findUnique({ where: { token } });
  if (!record || record.expiresAt < new Date()) {
    return res.status(400).json({ error: 'Token invalid or expired' });
  }

  const hash = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: record.userId },
    data: { password: hash }
  });

  await prisma.passwordToken.delete({ where: { token } });

  res.json({ success: true });
});

module.exports = router;
