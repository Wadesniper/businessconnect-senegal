const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://businessconnect:tlIQzehUEZnFPwoa@cluster0.gtehtk.mongodb.net/businessconnect?retryWrites=true&w=majority";

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String },
  location: { type: String },
  jobType: { type: String },
  sector: { type: String },
  description: { type: String },
  missions: [{ type: String }],
  requirements: [{ type: String }],
  contactEmail: { type: String },
  keywords: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Job = mongoose.model('Job', JobSchema);

const offerPath = path.resolve(__dirname, 'offer.json');
let offer;
try {
  const data = fs.readFileSync(offerPath, 'utf-8');
  offer = JSON.parse(data);
} catch (err) {
  console.error('Erreur lors de la lecture ou du parsing de offer.json :', err);
  process.exit(1);
}

async function checkOfferExists() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: 'businessconnect' });
    const exists = await Job.findOne({ title: offer.title, contactEmail: offer.contactEmail });
    if (exists) {
      console.log('✅ Offre déjà présente dans la base :', offer.title, '|', offer.contactEmail);
    } else {
      console.log('❌ Offre NON trouvée dans la base :', offer.title, '|', offer.contactEmail);
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error('Erreur lors de la vérification :', err);
    if (err instanceof Error) {
      console.error('Stack:', err.stack);
    }
  }
}

checkOfferExists(); 