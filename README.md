# MapsWebScout

**MapsWebScout** est un outil d'automatisation de prospection locale réalisé dans un but ludique et d'exercice. Il recherche des établissements sur Google Maps qui n'ont pas de site web référencé, génère un message de prospection personnalisé à l'aide d'un modèle génératif (Gemini / Google Generative Language) et centralise les leads dans Google Sheets pour un suivi et une relance faciles.
J'ai fait ce truc pour essayer et l'utiliser moi-même, donc soyez indulgents.

---

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Architecture](#-architecture-du-projet)
- [Installation rapide](#-installation-rapide)
- [Configuration des API Google](#-configuration-des-api-google)
- [Variables d'environnement](#-variables-denvironnement)
- [Utilisation](#-utilisation)
- [API & Endpoints](#-api--endpoints)
- [Flux de travail (workflow)](#-flux-de-travail-workflow)
- [Dépannage et bonnes pratiques](#-dépannage-et-bonnes-pratiques)
- [Contribuer](#-contribuer)
- [Licence](#-licence)

---

## 🚀 Fonctionnalités

- Extraction d'établissements via Google Places (recherche par mot-clé et rayon)
- Filtrage automatique des fiches sans champ `website`
- Génération de messages de prospection personnalisés avec Gemini (prompt configurable)
- Export et synchronisation des leads dans Google Sheets
- Interface web (Fastify + EJS) pour lancer des scans et visualiser les résultats
- Logs et gestion d'erreurs pour suivre l'état des tâches

---

## 🛠️ Technologies

- Node.js 18+ (ES Modules)
- Fastify (serveur HTTP)
- EJS (templates côté serveur)
- Google Places API, Google Sheets API v4
- Google Generative Language (Gemini) pour la génération de messages

---

## 📂 Architecture du projet

```
├── src/
│   ├── plugins/         # Config ENV, sessions, clients API (Google)
│   ├── routes/          # Routes HTTP (web UI et API JSON)
│   └── app.js           # Point d'entrée du serveur
├── views/               # Vues EJS (index, dashboard, partials)
├── public/              # Assets (CSS, JS)
├── .env.example         # Exemple de variables d'environnement
└── .gitignore
```

---

## ⚙️ Installation rapide

### Prérequis
- Node.js 18 ou supérieur
- Compte Google Cloud avec un projet actif
- APIs activées : Places API, Sheets API, (et Generative Language API pour la génération)

### Installation

1. Cloner le dépôt :

```bash
git clone https://github.com/votre-nom/map-scout.git
cd map-scout
```

2. Installer les dépendances :

```bash
npm install
```

3. Copier l'exemple d'environnement et remplir les variables :

```bash
cp .env.example .env
# Éditez .env avec vos clefs
```

4. Lancer en mode développement :

```bash
npm run dev
```

En production :

```bash
npm start
```

> Remarque : sur Windows, utilisez PowerShell ou Git Bash pour les commandes ci-dessus.

---

## 🔐 Configuration des API Google

1. Créez un projet dans Google Cloud Console.
2. Activez les APIs :
   - Places API
   - Sheets API
   - Generative Language API (ou API Gemini si disponible)
3. Obtenez les identifiants :
   - Pour Places et Generative Language : une clé API suffit dans la plupart des cas.
   - Pour Sheets API : préférez un compte de service si vous voulez que l'application écrive dans une feuille en production. Partagez la feuille Google avec l'adresse e-mail du compte de service.
4. Configurez les quotas et restrictions de la clé selon vos besoins (limit IPs ou referrers).

---

## 🔧 Variables d'environnement (.env)

Copiez `.env.example` et renseignez les variables suivantes :

```env
PORT=3000
NODE_ENV=development
SESSION_SECRET=une_chaine_aléatoire_de_32+_caracteres

# Google
GOOGLE_MAPS_API_KEY=AIza... (Places API key)
GEMINI_API_KEY=sk-... (Generative Language / Gemini API key)
SPREADSHEET_ID=1AbcDefGhI_jklmnopQRsT
SHEET_NAME=Leads

# Options (facultatif)
DEFAULT_RADIUS=5000   # en mètres
DEFAULT_KEYWORD=Plombier
```

> Important : ne versionnez jamais vos clés API. Ajoutez-les au `.gitignore`.

---

## ▶️ Utilisation

1. Ouvrez l'application dans votre navigateur : http://localhost:3000
2. Sur le dashboard, saisissez un mot-clé (ex. "Plombier") et un rayon en mètres (ex. 5000).
3. Démarrez le scan. L'application :
   - Interroge Google Places
   - Filtre les fiches sans site web
   - Pour chaque fiche retenue, génère un message via Gemini
   - Enregistre les données dans Google Sheets

### Exemple de payload (API)

POST /api/scan

```json
{
  "keyword": "Plombier",
  "radius": 5000,
  "location": "48.8566,2.3522"  // lat,lng
}
```

Réponse : statut de la tâche + ID du job pour consulter les logs.

---

## 🔁 Flux de travail (workflow)

1. Recherche : util. saisit mot-clé + rayon
2. Extraction : appel à Google Places (page de résultats)
3. Filtrage : suppression des fiches avec `website` défini
4. Génération IA : prompt personnalisé envoyé à Gemini
5. Enregistrement : nouvelle ligne ajoutée à Google Sheets

---

## 🪲 Dépannage & bonnes pratiques

- Si vous recevez une erreur 403 des APIs Google, vérifiez la clé et les restrictions (referrers/IP).
- Pour la Sheets API, utilisez un compte de service et partagez la feuille.
- Vérifiez les quotas sur la Google Cloud Console (Places et Generative Language peuvent coûter).
- Activez les logs (dans `src/plugins` et `src/routes`) pour diagnostiquer les erreurs.

---

## 🤝 Contribuer

Les contributions sont bienvenues :
1. Forkez le dépôt
2. Créez une branche feature (ex : `feat/gemini-prompt-config`)
3. Faites vos modifications et tests
4. Ouvrez une Pull Request

Ajoutez des tests et mettez à jour le README si nécessaire.

---

## ⚖️ Licence

Ce projet est distribué sous la licence **MIT**. Voir le fichier `LICENSE` pour plus de détails.

---

## Contact

Pour toute question : ouvrez une issue sur le dépôt GitHub ou contactez l'auteur du projet.

---

Merci d'utiliser MapsWebScout — facilitez la prospection locale avec l'IA ! 🚀