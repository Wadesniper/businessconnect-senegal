const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const uri = 'mongodb+srv://businessconnect:tlIQzehUEZnFPwoa@cluster0.gtehtk.mongodb.net/businessconnect?retryWrites=true&w=majority';

const NEW_ADMIN = {
  email: 'contact@businessconnectsenegal.com',
  password: 'Admin@2025!', // Mot de passe en clair, sera hashé
  name: 'Administrateur',
  role: 'admin',
  phone: '+221786049485',
  isVerified: true
};

async function main() {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  try {
    await client.connect();
    const db = client.db('businessconnect');
    const users = db.collection('users');

    // Supprimer tous les anciens admins (par email ou téléphone, avec ou sans indicatif)
    const deleteResult = await users.deleteMany({
      $or: [
        { email: 'admin@businessconnect.sn' },
        { phone: '786049485' },
        { phone: '+221786049485' },
        { email: NEW_ADMIN.email }
      ]
    });
    console.log(`Ancien(s) admin supprimé(s) : ${deleteResult.deletedCount}`);

    // Vérifier si un admin avec le même email/phone existe déjà
    const exists = await users.findOne({ $or: [
      { email: NEW_ADMIN.email },
      { phone: NEW_ADMIN.phone }
    ]});
    if (exists) {
      console.log('Un admin avec ce mail ou ce téléphone existe déjà.');
      return;
    }

    // Hasher le mot de passe
    const hash = await bcrypt.hash(NEW_ADMIN.password, 10);

    // Créer le nouvel admin
    const now = new Date();
    const adminDoc = {
      ...NEW_ADMIN,
      password: hash,
      createdAt: now,
      updatedAt: now
    };
    await users.insertOne(adminDoc);
    console.log('Nouveau compte admin créé avec succès :');
    console.log({
      email: adminDoc.email,
      phone: adminDoc.phone,
      password: NEW_ADMIN.password,
      hash: hash
    });
  } catch (err) {
    console.error('Erreur :', err);
  } finally {
    await client.close();
  }
}

main(); 