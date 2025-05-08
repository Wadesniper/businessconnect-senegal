const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://businessconnect:tlIQzehUEZnFPwoa@cluster0.gtehtk.mongodb.net/businessconnect?retryWrites=true&w=majority';
const dbName = 'businessconnect';
const collectionName = 'jobs';

async function countJobs() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const db = client.db(dbName);
    const count = await db.collection(collectionName).countDocuments();
    console.log(`Nombre total d'offres d'emploi : ${count}`);
  } catch (err) {
    console.error('Erreur lors du comptage des offres :', err);
  } finally {
    await client.close();
  }
}

countJobs(); 