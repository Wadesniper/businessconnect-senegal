// Script pour insérer un compte admin dans MongoDB
// Usage : node scripts/seed-admin.js

const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://businessconnect:tlIQzehUEZnFPwoa@cluster0.gtehtk.mongodb.net/businessconnect?retryWrites=true&w=majority';
const DB_NAME = 'businessconnect';

async function seedAdmin() {
  const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const users = db.collection('users');

    const email = 'admin@businessconnect.sn';
    const password = 'SuperAdmin2024!';
    const hash = await bcrypt.hash(password, 10);

    const existing = await users.findOne({ email });
    if (existing) {
      console.log('Un compte admin existe déjà.');
      return;
    }

    await users.insertOne({
      fullName: 'Super Admin',
      email,
      password: hash,
      role: 'admin',
      avatar: '/images/avatars/admin.png',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('Compte admin créé avec succès !');
  } catch (err) {
    console.error('Erreur lors de la création du compte admin :', err);
  } finally {
    await client.close();
  }
}

seedAdmin(); 