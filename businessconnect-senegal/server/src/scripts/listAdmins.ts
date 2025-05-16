import mongoose from 'mongoose';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://businessconnect:tlIQzehUEZnFPwoa@cluster0.gtehtk.mongodb.net/businessconnect?retryWrites=true&w=majority';

async function resetAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    // Supprimer l'ancien admin (par rôle)
    await User.deleteMany({ role: 'admin' });
    console.log('Ancien(s) admin(s) supprimé(s).');

    // Créer le nouvel admin avec numéro de téléphone et email générique
    const hashedPassword = await bcrypt.hash('Admin@2025!', 10);
    const newAdmin = await User.create({
      name: 'Administrateur',
      phone: '786049485',
      email: 'admin@businessconnect.sn',
      password: hashedPassword,
      role: 'admin',
      isVerified: true
    });
    console.log('Nouveau compte admin créé :');
    console.log(`- Téléphone : ${newAdmin.phone} | Email : ${newAdmin.email} | Nom : ${newAdmin.name} | ID : ${newAdmin._id}`);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Erreur lors de la modification des admins :', err);
    process.exit(1);
  }
}

resetAdmin(); 