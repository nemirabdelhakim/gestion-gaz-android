# Gestion Coupures Gaz – District Sidi Ali

Application de préparation des missions quotidiennes, rapprochement d'une liste Excel avec une base géographique, affichage cartographique, calcul d'un parcours routier indicatif et suivi des interventions.

## Plateformes
- Android : APK debug générée par GitHub Actions (Capacitor).
- Windows : installateur EXE généré par GitHub Actions (Electron).

## Fonctionnalités du premier MVP
- Import de `Base_Abonnes.xlsx` et mise à jour des références géographiques.
- Import de `Liste_Coupures.xlsx` et rapprochement par référence.
- Détection des références sans coordonnées et des doublons.
- Carte Leaflet et marqueurs colorés selon l'état.
- Récupération GPS avec le navigateur / appareil compatible.
- Itinéraire routier OSRM et ordre de visite heuristique par proximité.
- Fiche d'intervention et historique local.
- Export Excel, CSV et sauvegarde JSON.

## Schémas Excel acceptés
### Base géographique
`Référence`, `Nom et prénom` (ou `Nom`), `Adresse`, `Commune`, `Longitude`, `Latitude`, `Numéro compteur` (ou `Compteur`), `Observation`.

### Liste quotidienne
`Numéro`, `Référence`, `Nom et prénom` (ou `Nom`), `Adresse`, `Nombre de factures impayées` (ou `Nb factures`), `Montant des factures` (ou `Montant`), `Numéro compteur gaz` (ou `Compteur`), `Observation`.

Les références sont traitées comme du texte. Les coordonnées sont attendues en WGS84 (longitude puis latitude).

## Développement local
Prérequis : Node.js 22 et npm.

```bash
npm install
npm run dev
```

## Compiler Windows
```bash
npm install
npm run dist:win
```
Le résultat se trouve dans `release/`.

## Compiler Android
```bash
npm install
npm run build
npx cap add android
npx cap sync android
```
Ouvrir ensuite `android/` dans Android Studio ou compiler avec Gradle :

```bash
cd android
./gradlew assembleDebug
```

## GitHub Actions
1. Créer un dépôt GitHub nommé `gestion-coupures-gaz`.
2. Téléverser le contenu de ce dossier à la racine du dépôt (y compris `.github/workflows/build.yml`).
3. Ouvrir l'onglet **Actions**.
4. Lancer **Build Android APK and Windows EXE** avec **Run workflow**.
5. Télécharger les deux artefacts : APK Android et installateur Windows.

Le workflow utilise `npm install` et Node.js 22. Il génère une APK de test non signée pour distribution publique et un installateur Windows non signé. Une signature de production devra être configurée séparément avec des secrets GitHub.

## Limites connues du MVP
- Les données sont conservées dans IndexedDB local à chaque appareil (Dexie). Elles ne se synchronisent pas automatiquement entre Windows et Android. Utiliser la sauvegarde/export et un transfert contrôlé. Une synchronisation centrale et une base SQLite native pourront être ajoutées dans une version ultérieure.
- Le calcul d'ordre est une heuristique du plus proche voisin ; OSRM calcule ensuite le trajet routier. Ce n'est pas une preuve d'optimum mathématique global.
- Le routage et les fonds de carte nécessitent Internet. Le serveur public OSRM est fourni à titre de démonstration et n'offre aucune garantie de disponibilité ; choisir un fournisseur professionnel ou héberger son propre serveur pour l'exploitation.
- L'export PDF et la capture photo ne sont pas encore intégrés dans cette première version.
- Aucun paiement n'est automatiquement considéré comme confirmé sans vérification par l'agent selon la procédure applicable. L'application n'actionne aucun organe de coupure.
- Protéger les fichiers et données nominatives conformément aux règles internes de l'entreprise. Utiliser des données fictives/anonymisées pour les essais.

## Sécurité
Ne pas publier de vraies listes d'abonnés, coordonnées nominatives, factures ou justificatifs dans un dépôt public. Préférer un dépôt privé et ne jamais ajouter de secrets ou certificats de signature au code source.
