import { PrismaClient as SupabasePrismaClient } from '../../src/generated/prisma/index.js';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin résolu vers le fichier .env dans le dossier server
const envPath = path.resolve(__dirname, '..', '..', '.env');
dotenv.config({ path: envPath });

// const supabase = new SupabasePrismaClient(); // Mis en commentaire, pas de connexion directe à Supabase

// Récupérez MONGODB_URI depuis les variables d'environnement
const mongoUri = process.env.MONGODB_URI;
console.log(`MONGODB_URI utilisée par le script: ${mongoUri}`);
if (!mongoUri) {
  console.error('Erreur: MONGODB_URI n\'est pas défini dans le fichier .env');
  process.exit(1);
}

const mongoClient = new MongoClient(mongoUri);

// --- Fonctions Utilitaires ---
/**
 * Convertit un ObjectId de MongoDB en sa représentation string.
 * Si l'id est déjà une string, la retourne telle quelle.
 * Retourne null si l'id est null ou undefined.
 */
function convertMongoIdToString(id: any): string | null {
  if (id instanceof ObjectId) {
    return id.toHexString();
  }
  if (typeof id === 'string') {
    return id;
  }
  return null;
}

/**
 * Tente de convertir une valeur en Date.
 * Gère les strings de date, les nombres (timestamps) et les objets Date.
 */
function safeToDate(value: any): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return null; // Vérifie si la date est valide
    return date;
  } catch (e) {
    return null;
  }
}

// Fonction pour échapper les apostrophes dans les chaînes SQL
function escapeSqlString(value: string | null | undefined): string {
  if (value === null || value === undefined) return 'NULL';
  return "'" + value.replace(/'/g, "''") + "'";
}

function formatSqlDate(date: Date | null | undefined): string {
  if (!date) return 'NULL';
  return escapeSqlString(date.toISOString());
}

async function main() {
  console.log('--- GÉNÉRATION DE SCRIPT SQL POUR LA MIGRATION (ADMIN SEUL + JOBS LIÉS À L\'ADMIN) ---');
  let sqlOutput = '-- Script de migration généré (Admin seul + Jobs liés à l\'Admin)\n\n';
  const sqlOutputFilePath = path.resolve(__dirname, 'migration_admin_jobs.sql');
  const ADMIN_EMAIL = 'contact@businessconnectsenegal.com'; // À confirmer/modifier si besoin
  let adminSupabaseId: string | null = null;

  try {
    await mongoClient.connect();
    console.log('Connecté à MongoDB');
    const mongoDb = mongoClient.db();

    sqlOutput += '-- Migration de l\'Utilisateur Admin --\n';
    const mongoAdminUser = await mongoDb.collection('users').findOne({ email: ADMIN_EMAIL });

    if (!mongoAdminUser) {
      sqlOutput += `-- UTILISATEUR ADMIN AVEC EMAIL ${ADMIN_EMAIL} NON TROUVÉ DANS MONGODB. ARRÊT.\n`;
      console.error(`UTILISATEUR ADMIN AVEC EMAIL ${ADMIN_EMAIL} NON TROUVÉ DANS MONGODB. ARRÊT.`);
      process.exit(1);
    } else {
      const adminMongoIdStr = convertMongoIdToString(mongoAdminUser._id);
      if (!adminMongoIdStr) {
        sqlOutput += `-- ID MongoDB de l'admin (${ADMIN_EMAIL}) invalide. ARRÊT.\n`;
        console.error(`ID MongoDB de l'admin (${ADMIN_EMAIL}) invalide. ARRÊT.`);
        process.exit(1);
      }
      adminSupabaseId = adminMongoIdStr; // Assigner l'ID pour les jobs

      const adminData: any = {
        id: adminSupabaseId,
        firstName: "Admin",
        lastName: "Principal",
        email: mongoAdminUser.email,
        password: mongoAdminUser.password,
        role: 'admin',
        phoneNumber: '+221786049485',
        isVerified: typeof mongoAdminUser.isVerified === 'boolean' ? mongoAdminUser.isVerified : false,
        verificationToken: mongoAdminUser.verificationToken,
        resetPasswordToken: mongoAdminUser.resetPasswordToken,
        resetPasswordExpire: safeToDate(mongoAdminUser.resetPasswordExpire),
        preferences_notifications: typeof mongoAdminUser.preferences_notifications === 'boolean' ? mongoAdminUser.preferences_notifications : true,
        preferences_newsletter: typeof mongoAdminUser.preferences_newsletter === 'boolean' ? mongoAdminUser.preferences_newsletter : true,
        preferences_language: mongoAdminUser.preferences_language ? mongoAdminUser.preferences_language.toLowerCase() : 'fr',
        name: mongoAdminUser.name,
        status: 'active',
        createdAt: safeToDate(mongoAdminUser.createdAt),
        updatedAt: safeToDate(mongoAdminUser.updatedAt),
      };
      
      if (adminData.preferences_language && !['fr', 'en'].includes(adminData.preferences_language)) {
         sqlOutput += `-- Langue invalide '${adminData.preferences_language}' pour l'admin (${adminData.email}). Sera 'fr'.\n`;
         adminData.preferences_language = 'fr';
      }

      const userInsertSql = `INSERT INTO "User" ("id", "firstName", "lastName", "email", "password", "role", "phoneNumber", "isVerified", "verificationToken", "resetPasswordToken", "resetPasswordExpire", "preferences_notifications", "preferences_newsletter", "preferences_language", "name", "status", "createdAt", "updatedAt") VALUES (${escapeSqlString(adminData.id)}, ${escapeSqlString(adminData.firstName)}, ${escapeSqlString(adminData.lastName)}, ${escapeSqlString(adminData.email)}, ${escapeSqlString(adminData.password)}, '${adminData.role}'::"UserRole", ${escapeSqlString(adminData.phoneNumber)}, ${adminData.isVerified}, ${escapeSqlString(adminData.verificationToken)}, ${escapeSqlString(adminData.resetPasswordToken)}, ${formatSqlDate(adminData.resetPasswordExpire)}, ${adminData.preferences_notifications}, ${adminData.preferences_newsletter}, ${adminData.preferences_language === null ? 'NULL' : `'${adminData.preferences_language}'::"Language"`}, ${escapeSqlString(adminData.name)}, '${adminData.status}'::"UserStatus", ${formatSqlDate(adminData.createdAt)}, ${formatSqlDate(adminData.updatedAt)}) ON CONFLICT ("id") DO UPDATE SET "firstName" = EXCLUDED."firstName", "lastName" = EXCLUDED."lastName", "email" = EXCLUDED."email", "password" = EXCLUDED."password", "role" = EXCLUDED."role", "phoneNumber" = EXCLUDED."phoneNumber", "isVerified" = EXCLUDED."isVerified", "verificationToken" = EXCLUDED."verificationToken", "resetPasswordToken" = EXCLUDED."resetPasswordToken", "resetPasswordExpire" = EXCLUDED."resetPasswordExpire", "preferences_notifications" = EXCLUDED."preferences_notifications", "preferences_newsletter" = EXCLUDED."preferences_newsletter", "preferences_language" = EXCLUDED."preferences_language", "name" = EXCLUDED."name", "status" = EXCLUDED."status", "updatedAt" = EXCLUDED."updatedAt";`;
      sqlOutput += userInsertSql + '\n';
      sqlOutput += `-- Instruction INSERT pour l'admin (${ADMIN_EMAIL}) générée.\n`;
      console.log(`Instruction INSERT pour l'admin (${ADMIN_EMAIL}) générée.`);
    }

    sqlOutput += '\n-- Migration des Offres d\'Emploi (liées à l\'admin) --\n';
    if (!adminSupabaseId) {
      sqlOutput += '-- ID Admin Supabase non disponible, impossible de migrer les jobs. ARRÊT.\n';
      console.error('ID Admin Supabase non disponible, impossible de migrer les jobs. ARRÊT.');
    } else {
      const mongoJobs = await mongoDb.collection('jobs').find().toArray();
      let jobsInsertCount = 0;

      if (mongoJobs.length === 0) {
        sqlOutput += '-- Aucune offre d\'emploi trouvée dans MongoDB.\n';
        console.log('Aucune offre d\'emploi trouvée dans MongoDB.');
      } else {
        for (const mongoJob of mongoJobs) {
          const mongoJobIdStr = convertMongoIdToString(mongoJob._id);
          if (!mongoJobIdStr) {
            sqlOutput += `-- Job MongoDB avec _id invalide ou manquant, skippé: ${mongoJob._id}\n`;
            console.warn(`Job MongoDB avec _id invalide ou manquant, skippé: ${mongoJob._id}`);
            continue;
          }

          // Tous les jobs sont liés à l'admin
          const jobData: any = {
            id: mongoJobIdStr,
            title: mongoJob.title,
            company: mongoJob.company,
            location: mongoJob.location,
            description: mongoJob.description,
            requirements: Array.isArray(mongoJob.requirements) ? mongoJob.requirements : [],
            salary_min: mongoJob.salary_min === undefined || mongoJob.salary_min === null ? null : parseFloat(mongoJob.salary_min),
            salary_max: mongoJob.salary_max === undefined || mongoJob.salary_max === null ? null : parseFloat(mongoJob.salary_max),
            salary_currency: mongoJob.salary_currency,
            type: mongoJob.type ? mongoJob.type.toUpperCase().replace('-', '_') : null,
            status: mongoJob.status ? mongoJob.status.toLowerCase() : 'active',
            postedById: adminSupabaseId, // Lier à l'admin
            createdAt: safeToDate(mongoJob.createdAt),
            updatedAt: safeToDate(mongoJob.updatedAt),

            // New fields from MongoDB
            sector: mongoJob.sector,
            jobTypeDetail: mongoJob.jobType, // Original string value from MongoDB's jobType
            missions: Array.isArray(mongoJob.missions) ? mongoJob.missions : [],
            contactEmail: mongoJob.contactEmail,
            contactPhone: mongoJob.contactPhone,
            keywords: Array.isArray(mongoJob.keywords) ? mongoJob.keywords : [],
            isActive: mongoJob.isActive === undefined ? null : mongoJob.isActive,
          };

          let jobTypeSql = 'NULL';
          if (jobData.type) {
            if (!['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'].includes(jobData.type)) {
              sqlOutput += `-- Type de job MongoDB invalide ou non mappable '${mongoJob.type}' pour le job ${mongoJobIdStr}. Sera NULL.\n`;
            } else {
              jobTypeSql = `'${jobData.type}'::"JobType"`;
            }
          }
          
          let jobStatusSql = `'active'::"JobStatus"`;
          if (jobData.status) {
            if (!['active', 'closed'].includes(jobData.status)) {
              sqlOutput += `-- Statut de job MongoDB invalide ou non mappable '${mongoJob.status}' pour le job ${mongoJobIdStr}. Sera 'active'.\n`;
            } else {
              jobStatusSql = `'${jobData.status}'::"JobStatus"`;
            }
          }
          
          // Pour les tableaux de string comme 'requirements', PostgreSQL attend un format comme ARRAY['req1', 'req2']
          // Si jobData.requirements est vide, cela produira ARRAY[] ce qui est correct pour un tableau vide.
          const requirementsSql = jobData.requirements.length > 0 ? `ARRAY[${jobData.requirements.map((r: string) => escapeSqlString(r)).join(',')}]` : 'ARRAY[]::TEXT[]';
          const missionsSql = jobData.missions.length > 0 ? `ARRAY[${jobData.missions.map((m: string) => escapeSqlString(m)).join(',')}]` : 'ARRAY[]::TEXT[]';
          const keywordsSql = jobData.keywords.length > 0 ? `ARRAY[${jobData.keywords.map((k: string) => escapeSqlString(k)).join(',')}]` : 'ARRAY[]::TEXT[]';

          const jobInsertSql = `INSERT INTO "Job" ("id", "title", "company", "location", "description", "requirements", "salary_min", "salary_max", "salary_currency", "type", "status", "postedById", "createdAt", "updatedAt", "sector", "jobTypeDetail", "missions", "contactEmail", "contactPhone", "keywords", "isActive") VALUES (${escapeSqlString(jobData.id)}, ${escapeSqlString(jobData.title)}, ${escapeSqlString(jobData.company)}, ${escapeSqlString(jobData.location)}, ${escapeSqlString(jobData.description)}, ${requirementsSql}, ${jobData.salary_min === null ? 'NULL' : jobData.salary_min}, ${jobData.salary_max === null ? 'NULL' : jobData.salary_max}, ${escapeSqlString(jobData.salary_currency)}, ${jobTypeSql}, ${jobStatusSql}, ${escapeSqlString(jobData.postedById)}, ${formatSqlDate(jobData.createdAt)}, ${formatSqlDate(jobData.updatedAt)}, ${escapeSqlString(jobData.sector)}, ${escapeSqlString(jobData.jobTypeDetail)}, ${missionsSql}, ${escapeSqlString(jobData.contactEmail)}, ${escapeSqlString(jobData.contactPhone)}, ${keywordsSql}, ${jobData.isActive === null ? 'NULL' : jobData.isActive}) ON CONFLICT ("id") DO NOTHING;`;
          sqlOutput += jobInsertSql + '\n';
          jobsInsertCount++;
        }
        sqlOutput += `-- ${jobsInsertCount} instructions INSERT pour jobs générées.\n`;
        console.log(`${jobsInsertCount} instructions INSERT pour jobs générées.`);
      }
    }

    sqlOutput += '\n-- Migration des Ads, Subscriptions, Transactions: Skippée (supposées vides).\n';
    console.log('\nMigration des Ads, Subscriptions, Transactions: Skippée (supposées vides).');

    console.log('\n--- FIN DE LA GÉNÉRATION DU SCRIPT SQL ---');

    try {
      fs.writeFileSync(sqlOutputFilePath, sqlOutput);
      console.log(`\n--- SCRIPT SQL COMPLET SAUVEGARDÉ DANS : ${sqlOutputFilePath} ---`);
      console.log(`--- IMPORTANT: Veuillez copier le contenu de ce fichier pour l'exécuter dans Supabase. ---`);

    } catch (writeError) {
      console.error(`\n\n--- ERREUR LORS DE L'ÉCRITURE DU SCRIPT SQL DANS LE FICHIER ${sqlOutputFilePath} ---`);
      console.error(writeError);
      console.log("\n\n--- AFFICHAGE DU SCRIPT SQL DANS LA CONSOLE COMME SOLUTION DE REPLI (ATTENTION À LA TRONCATURE ÉVENTUELLE) ---");
      console.log(sqlOutput);
    }

  } catch (error) {
    console.error('Erreur durant la génération du script SQL:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    sqlOutput += '-- ERREUR DURANT LA GÉNÉRATION DU SCRIPT SQL: ' + errorMessage + '\n';
    // Attempt to write the error-annotated SQL to file
    try {
      fs.writeFileSync(sqlOutputFilePath, sqlOutput);
      console.log(`\n--- SCRIPT SQL (AVEC ERREUR INFO) SAUVEGARDÉ DANS : ${sqlOutputFilePath} ---`);
    } catch (writeErrorDuringCatch) {
      console.error(`\n--- IMPOSSIBLE D'ÉCRIRE LE SCRIPT (AVEC ERREUR INFO) DANS ${sqlOutputFilePath}. AFFICHAGE CONSOLE: ---`);
      console.log(sqlOutput); // Fallback if even error file writing fails
    }
  } finally {
    // await supabase.$disconnect(); // Mis en commentaire
    await mongoClient.close();
    console.log('Déconnecté de MongoDB.');
  }
}

main().catch(e => {
  console.error('Erreur non gérée dans la fonction main:', e);
  process.exit(1);
}); 