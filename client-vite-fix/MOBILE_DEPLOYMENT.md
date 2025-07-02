# 📱 Guide de Déploiement Mobile - BusinessConnect Senegal

## 🎯 Vue d'ensemble
Ce guide explique comment déployer BusinessConnect sur le Play Store en tant qu'application mobile native.

## ✅ Prérequis
- [Android Studio](https://developer.android.com/studio) installé
- [Java JDK 11+](https://adoptium.net/) installé
- Compte développeur Google Play Console
- Clé de signature pour l'APK

## 🚀 Étapes de déploiement

### 1. Build de l'application
```bash
# Build du projet web
npm run build

# Synchronisation avec Capacitor
npx cap sync

# Ouverture dans Android Studio
npm run cap:open:studio
```

### 2. Configuration dans Android Studio
1. Ouvrir le projet dans Android Studio
2. Vérifier la configuration dans `android/app/build.gradle`
3. Configurer la signature de l'APK
4. Tester sur un émulateur ou appareil

### 3. Génération de l'APK
```bash
# APK de debug (pour tests)
npm run cap:build:apk

# APK de release (pour Play Store)
npm run cap:build:release
```

### 4. Préparation pour le Play Store
1. **Icônes** : Vérifier les icônes dans `android/app/src/main/res/mipmap-*`
2. **Splash Screen** : Configurer dans `android/app/src/main/res/drawable-*`
3. **Permissions** : Vérifier dans `android/app/src/main/AndroidManifest.xml`
4. **Version** : Mettre à jour dans `android/app/build.gradle`

### 5. Upload sur Play Store
1. Créer un compte Google Play Console
2. Créer une nouvelle application
3. Upload de l'APK/AAB
4. Remplir les informations de l'application
5. Soumettre pour review

## 📋 Checklist Play Store

### Métadonnées
- [ ] Nom de l'application
- [ ] Description courte et longue
- [ ] Captures d'écran (téléphone et tablette)
- [ ] Icône haute résolution (512x512)
- [ ] Vidéo promotionnelle (optionnel)

### Configuration technique
- [ ] APK/AAB signé
- [ ] Version code et version name
- [ ] Permissions justifiées
- [ ] Politique de confidentialité
- [ ] Contenu approprié

### Catégories suggérées
- **Catégorie principale** : Business
- **Catégorie secondaire** : Productivity
- **Tags** : emploi, CV, recrutement, Sénégal

## 🔧 Scripts disponibles

```bash
# Développement
npm run cap:preview          # Prévisualisation mobile
npm run cap:run:android      # Lancer sur appareil connecté

# Build
npm run cap:build:apk        # APK de debug
npm run cap:build:release    # APK de release
npm run cap:open:studio      # Ouvrir Android Studio

# Synchronisation
npm run cap:sync             # Sync web → mobile
```

## 🐛 Dépannage

### Problèmes courants
1. **Gradle sync failed** : Vérifier Java JDK
2. **Build failed** : Nettoyer le projet (`./gradlew clean`)
3. **APK trop gros** : Optimiser les images
4. **Permissions manquantes** : Vérifier AndroidManifest.xml

### Commandes utiles
```bash
# Nettoyer le projet Android
cd android && ./gradlew clean

# Vérifier les dépendances
npx cap doctor

# Mettre à jour Capacitor
npm update @capacitor/core @capacitor/cli @capacitor/android
```

## 📞 Support
Pour toute question sur le déploiement mobile, consulter :
- [Documentation Capacitor](https://capacitorjs.com/docs)
- [Google Play Console](https://play.google.com/console)
- [Android Developer](https://developer.android.com/) 