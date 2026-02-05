///////////////////////////////////
// //
// Guide des Tests Frontend //
// //
///////////////////////////////////

Pour assurer la qualité et la stabilité de l'application, chaque composant ou fonction logique doit être accompagné de tests.

### Outils

Nous utilisons **Jest** (inclus par défaut avec Expo/React Native) et **React Native Testing Library** pour écrire des tests qui simulent le comportement des utilisateurs.

### Où créer les tests ?

La convention est de créer un dossier `__tests__` à la racine du dossier `src/` et d'y répliquer la structure des dossiers du code source.

**Exemples :**

- Pour tester `src/components/MyButton.js`, créez le fichier `src/__tests__/components/MyButton.test.js`.
- Pour tester une fonction dans `src/redux/userSlice.js`, créez `src/__tests__/redux/userSlice.test.js`.

> **Convention de nommage :** Le nom du fichier de test doit être `NomDuFichier.test.js`.

### Comment lancer les tests ?

Pour lancer l'ensemble des tests et vérifier que rien n'est cassé :

```bash
npm test
```
