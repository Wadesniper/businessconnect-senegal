import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://businessconnect:tlIQzehUEZnFPwoa@cluster0.gtehtk.mongodb.net/businessconnect?retryWrites=true&w=majority";

const JobSchema = new mongoose.Schema({}, { strict: false });
const Job = mongoose.model('Job', JobSchema);

async function purgeJobs() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: 'businessconnect' });
    console.log('Connecté à MongoDB');
    const result = await Job.deleteMany({});
    console.log(`Offres supprimées : ${result.deletedCount}`);
    await mongoose.disconnect();
    console.log('Déconnexion MongoDB');
  } catch (err) {
    console.error('Erreur lors de la purge :', err);
    process.exit(1);
  }
}

purgeJobs(); 