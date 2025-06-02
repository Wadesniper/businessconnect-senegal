const bcrypt = require('bcrypt');

const motDePasse = 'Admin@2025!'; // Modifie ici si tu veux un autre mot de passe

bcrypt.hash(motDePasse, 10, function(err, hash) {
  if (err) {
    console.error('Erreur lors du hash :', err);
  } else {
    console.log('Hash bcrypt généré :');
    console.log(hash);
  }
}); 