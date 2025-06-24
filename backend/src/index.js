require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const authRoutes = require('./routes/auth');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/api/liens', async (req, res) => {
  const liens = await prisma.lien.findMany();
  res.json(liens);
});

app.get('/api/liens/:id', async (req, res) => {
  const lien = await prisma.lien.findUnique({ where: { id: parseInt(req.params.id) } });
  res.json(lien);
});

app.patch('/api/liens/:id/satisfy', async (req, res) => {
  const lien = await prisma.lien.update({
    where: { id: parseInt(req.params.id) },
    data: { status: 'Satisfied' },
  });
  res.json(lien);
});

app.delete('/api/liens/:id', async (req, res) => {
  await prisma.lien.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ deleted: true });
});

app.post('/api/liens/:id/report-error', async (req, res) => {
  console.log(`Error reported on lien ${req.params.id}:`, req.body);
  res.json({ reported: true });
});

app.listen(4000, () => {
  console.log('API running on http://localhost:4000');
});
