import mongoose from 'mongoose';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://businessconnect:tlIQzehUEZnFPwoa@cluster0.gtehtk.mongodb.net/businessconnect?retryWrites=true&w=majority';

async function resetAdminPassword() {
  try {
    await mongoose.connect(MONGODB_URI);
    const admin = await User.findOne({ role: 'admin', phone: '786049485' });
    if (!admin) {
      console.log('Aucun utilisateur admin avec ce téléphone trouvé.');
    } else {
      const hashedPassword = await bcrypt.hash('Admin@2025!', 10);
      admin.password = hashedPassword;
      await admin.save();
      console.log('Mot de passe admin réinitialisé avec succès.');
      console.log(`- Téléphone : ${admin.phoneNumber} | Email : ${admin.email} | Nom : ${admin.firstName} ${admin.lastName} | ID : ${admin._id}`);
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error('Erreur lors de la réinitialisation du mot de passe admin :', err);
    process.exit(1);
  }
}

resetAdminPassword(); 