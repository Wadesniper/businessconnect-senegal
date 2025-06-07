// Correction ESM : import dynamique de fs-extra
import('fs-extra').then(fs => {
  fs.default.copySync('src/generated', 'dist/generated', { overwrite: true });
  console.log('✅ Copie de src/generated vers dist/generated réussie.');
}).catch(err => {
  console.error('❌ Erreur lors de la copie de src/generated:', err);
  process.exit(1);
}); 