# Rapport de modernisation : Emoji-notes v4

Branche `modernize-2026`, 29 septembre 2026.

## En bref

Le projet datait de 2019-2022. Il ne démarrait plus avec Node 22, exposait publiquement tous les messages « secrets » et n'avait aucun test fonctionnel. Il a été audité en mode red team, entièrement réécrit sur une stack actuelle, puis ré-audité par un second passage red team indépendant, dont tous les constats ont été corrigés.

| Indicateur                           | Avant (v3)                              | Après (v4)                                        |
| ------------------------------------ | --------------------------------------- | ------------------------------------------------- |
| Vulnérabilités connues (`npm audit`) | **117** (dont **12 critiques**)         | **0**                                             |
| Paquets installés                    | 1 553                                   | 512 (outillage de dev compris)                    |
| Tests automatisés                    | 1 test, cassé (import inexistant)       | **42 tests** (25 API + 17 UI), tous verts         |
| Démarre sur Node 22                  | Non (`node-sass`, `engines: node 10.x`) | Oui (`npm install && npm run dev`, aucune config) |
| Typage                               | Aucun                                   | TypeScript strict                                 |
| Lint / format / CI                   | Aucun                                   | ESLint + Prettier + GitHub Actions + Dependabot   |
| Déploiement                          | Heroku (offre gratuite supprimée)       | Image Docker multi-stage, portable sur tout PaaS  |
| Bundle JS de production              | non mesurable (le build ne passe plus)  | 91 Ko gzip                                        |

## 1. Audit red team initial (code v3)

### Sécurité

| Gravité      | Constat                                                                                                                                                                      |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Critique** | `GET /emojinote` renvoyait **toutes les notes avec leurs tokens**. N'importe qui pouvait lire tous les messages « secrets » d'un simple appel.                               |
| **Élevée**   | Token généré **côté client** avec `Math.random()` (prévisible), puis accepté tel quel par le serveur. Un client pouvait choisir son token, et rien n'empêchait les doublons. |
| **Élevée**   | Aucune validation serveur : emoji libre, longueur non contrôlée (la limite de 150 caractères n'existait que dans le front), corps de requête non borné.                      |
| **Élevée**   | 117 vulnérabilités connues dans les dépendances, dont 12 critiques.                                                                                                          |
| Moyenne      | Les erreurs SQL étaient renvoyées telles quelles au client (`res.json(err)`), ce qui fuit des informations internes.                                                         |
| Moyenne      | Promesses sans `catch` : une erreur base de données laissait la requête pendre.                                                                                              |
| Moyenne      | Aucun en-tête de sécurité (CSP, HSTS, nosniff…) ni rate limiting.                                                                                                            |
| Faible       | QR code et lien pointant en dur vers `http://emojinotes.herokuapp.com` (HTTP non chiffré, domaine mort).                                                                     |
| Faible       | Instructions `debugger` et `console.log` de debug livrées en production.                                                                                                     |

### Bugs fonctionnels

- **Chargement infini** sur une note introuvable : `const [setMessage] = useState('')` récupère la valeur au lieu du setter. Le `catch` plantait donc à son tour.
- **Page blanche** si on recharge `/new` : l'état du parcours vivait dans Redux et repartait à `'home'`, une valeur qu'aucune branche ne gérait.
- **QR code dupliqué** à chaque rendu : un `useEffect` sans dépendances recréait un QR code à chaque fois.
- Un effet de bord (`setTimeout`) était lancé directement dans le rendu. On trouvait aussi `class=` au lieu de `className`, et `rol="img"`.
- Il était possible de valider sans choisir d'emoji.
- La fonction `emoji()` était copiée-collée 3 fois, et le CSS `.card` 2 fois. Il restait du code mort (`containers/Exemple.js` importait un composant inexistant).

### Dette technique

Plusieurs briques étaient mortes ou dépréciées : Create React App (déprécié), `node-sass`, Node 10, React 17 et `ReactDOM.render`, un service worker CRA. Redux et axios étaient disproportionnés pour 3 champs de formulaire. Le serveur embarquait à la fois `mysql2` et `pg`, plus `axios` et `body-parser` inutilisés. Le `package.json` s'appelait encore `heroku-cra-node`, et le `.gitignore` ignorait… le `Dockerfile`.

## 2. Changements et bénéfices

### Backend : Express 5, sécurisé et testable

| Changement                                                                                                                                                                      | Bénéfice                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Suppression de la route qui listait tout                                                                                                                                        | Faille critique fermée : on ne peut plus lire les notes des autres.                                                               |
| Token généré côté serveur (`crypto.randomBytes`, 128 bits), index unique en base                                                                                                | Liens impossibles à deviner ou à énumérer, aucune collision possible.                                                             |
| Validation stricte : liste blanche d'emojis, 1 à 150 caractères comptés en points de code, rejet des caractères de contrôle                                                     | Données toujours cohérentes, compatibles avec Postgres (qui refuse les octets NUL). La même règle s'applique en front et en back. |
| Helmet (CSP, HSTS, nosniff, `Referrer-Policy: no-referrer`…)                                                                                                                    | Protection XSS et clickjacking, et les tokens ne fuient pas via l'en-tête Referer.                                                |
| Rate limiting (30 créations et 300 requêtes API / 15 min / IP), corps limité à 4 Ko                                                                                             | Protège contre le spam et les abus.                                                                                               |
| Gestionnaire d'erreurs central, Express 5 (gestion native de l'async)                                                                                                           | Plus aucune fuite d'erreur interne ni de requête qui pend.                                                                        |
| API REST propre sous `/api` (`POST /api/notes` → `201`, `GET /api/notes/:token`, `/api/health`)                                                                                 | Contrat clair, codes HTTP corrects, health check pour l'orchestrateur.                                                            |
| `Cache-Control: no-store` sur les notes, `X-Robots-Tag: noindex` et `robots.txt` sur `/n/` et `/share/`                                                                         | Les messages privés ne restent ni dans les caches partagés ni dans les moteurs de recherche.                                      |
| Assets fingerprintés servis avec `immutable, max-age=1y`, et un vrai 404 si un asset manque                                                                                     | Chargements répétés instantanés, et aucune erreur MIME sur un onglet resté ouvert après un déploiement.                           |
| Migrations Umzug exécutées au démarrage, compatibles avec l'historique `sequelize-cli` de la v3. La migration qui ajoute l'index unique commence par dédupliquer les tokens v3. | Déploiement sans étape manuelle, et la base de production existante est reprise sans casse.                                       |
| SQLite automatique en dev et en test, Postgres en production                                                                                                                    | `npm install && npm run dev` suffit pour lancer le projet, sans installer de base.                                                |
| Arrêt propre sur `SIGTERM`, configuration validée au démarrage                                                                                                                  | Redéploiements sans requêtes coupées, et échec immédiat avec un message clair si la config est invalide.                          |
| Les anciens liens v3 restent lisibles                                                                                                                                           | Aucun lien déjà partagé n'est cassé.                                                                                              |

### Frontend : React 19 + TypeScript + Vite

| Changement                                                                                                                        | Bénéfice                                                                                   |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| CRA remplacé par **Vite**, JS par **TypeScript strict**                                                                           | Démarrage et build en millisecondes, erreurs détectées à la compilation.                   |
| Redux + axios remplacés par un `useReducer` typé et `fetch`                                                                       | Environ 1 000 paquets en moins, un état local au parcours, plus simple à lire et à tester. |
| Composants partagés (`EmojiCard`, `Heading`, `Toast`, `Loader`, `NoteError`), un hook `useNote`, une seule source pour les emojis | Plus de copier-coller : on ajoute un emoji à un seul endroit.                              |
| La page de partage devient une route (`/share/:token`)                                                                            | Recharger la page ou faire Précédent ne fait plus perdre le lien d'une note créée.         |
| Lien construit sur `window.location.origin`                                                                                       | Fonctionne sur n'importe quel domaine, en HTTPS.                                           |
| API Clipboard moderne, partage natif (`navigator.share`) sur mobile                                                               | Remplace `execCommand` (déprécié), et l'expérience mobile est native.                      |
| QR code `qrcode.react` (SVG) avec l'emoji au centre et correction d'erreur niveau H                                               | Plus de doublons, un rendu net à toutes les tailles, toujours lisible malgré l'emoji.      |
| États de chargement, 404 et erreur réseau gérés partout, bouton désactivé pendant la sauvegarde                                   | Plus de chargement infini ni de double envoi.                                              |
| CSS natif moderne (custom properties, nesting, `:has()`, `dvh`, `clamp()`), responsive                                            | Plus de dépendance Sass, et le design d'origine est conservé.                              |
| Balise `<title>` par page (React 19), meta description, Open Graph, manifest et favicon SVG                                       | Meilleur SEO et meilleur aperçu quand le lien est partagé.                                 |

### Accessibilité (WCAG)

- HTML sémantique : `main`, un seul `h1` par écran, `fieldset`/`legend` pour le choix d'emoji, `figure`/`blockquote` pour la note.
- Tous les champs ont un label, et le compteur est relié au textarea par `aria-describedby` et `aria-invalid`.
- Choix d'emoji avec de vrais boutons radio, donc utilisable au clavier et à la voix. Focus visible partout.
- **Gestion du focus** à chaque changement d'étape ou de page (WCAG 2.4.3), sans jamais voler le focus pendant la saisie.
- Régions live (`role="status"`, `role="alert"`) pour le toast, les erreurs et le chargement.
- Contrastes vérifiés (entre 5:1 et 8,8:1) et respect de `prefers-reduced-motion`.

### Qualité et livraison

- **42 tests** :
  - API avec `node:test` + Supertest : validation, sécurité, rate limiting, en-têtes, migration, fichiers statiques ;
  - UI avec Vitest + Testing Library : parcours complet, erreurs, focus, presse-papier, 404, XSS.
- ESLint (dont les règles du React Compiler, qui ont repéré deux vrais anti-patterns), Prettier et EditorConfig.
- `npm run check` exécute exactement ce que fait la CI : lint, format, types, tests et build.
- GitHub Actions (qualité puis build Docker) et Dependabot hebdomadaire pour les dépendances et les actions.
- Dockerfile multi-stage : image sans dépendances de dev, utilisateur non-root, `HEALTHCHECK`. Un `docker-compose.yml` fournit une stack de type production avec Postgres.
- Monorepo en npm workspaces (`client/`, `server/`), `.nvmrc`, `.env.example` documenté, README réécrit (captures, stack, API, configuration).

## 3. Second passage red team (sur le nouveau code)

Un agent indépendant a audité la v4 en mode adversarial. Il n'a trouvé aucun problème critique. Il a vérifié notamment : les tentatives de path traversal, les open redirects, le XSS, l'entropie des tokens, les fuites via Referer et la CSP. Tous ses constats ont été corrigés et couverts par des tests :

| Gravité | Constat                                                                                                                               | Correction                                                                                                              |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Élevée  | L'index unique pouvait planter au démarrage (boucle de crash) si la base v3 contenait des tokens en double                            | La migration déduplique d'abord : elle garde la note la plus ancienne, la seule qui était lisible. Couvert par un test. |
| Moyenne | Une valeur `TRUST_PROXY` invalide passait silencieusement, et le rate limit était partagé par tous les utilisateurs derrière un proxy | Valeur validée au démarrage, avertissement en production si elle vaut 0, documentation.                                 |
| Moyenne | Focus perdu à chaque changement d'étape                                                                                               | Composant `Heading` qui reçoit le focus. Couvert par un test.                                                           |
| Moyenne | Lien de partage perdu si on recharge la page                                                                                          | Route `/share/:token`. Couvert par un test.                                                                             |
| Moyenne | `upgrade-insecure-requests` cassait l'accès en HTTP (test du QR code depuis un téléphone sur le réseau local)                         | Directive retirée (HTTPS reste imposé par HSTS et la plateforme).                                                       |
| Faible  | Un asset manquant renvoyait du HTML avec un statut 200                                                                                | Vrai 404. Couvert par un test.                                                                                          |
| Faible  | Octet NUL accepté (erreur 500 sur Postgres)                                                                                           | Caractères de contrôle rejetés. Couvert par un test.                                                                    |
| Faible  | Le toast « sauvegardé » n'était pas annoncé par les lecteurs d'écran                                                                  | Message injecté après le montage du composant.                                                                          |
| Faible  | `HEALTHCHECK` codé en dur sur le port 5000, TLS Postgres non vérifié par défaut, chemin SQLite relatif                                | `${PORT}`, `DATABASE_SSL=true` vérifie le certificat (`no-verify` en option explicite), chemin absolu.                  |

En testant en local après ce passage, un problème de plus est apparu : le port par défaut (5000) est occupé sur macOS par le récepteur AirPlay. L'API ne répondait donc pas sur les Mac récents. Le port par défaut est passé à **3000**, et le serveur s'arrête avec un message clair si le port est déjà pris.

**Risque connu, accepté** : les liens créés en v3 reposent sur `Math.random()` côté client. Ils sont moins robustes que les nouveaux. On les accepte pour ne casser aucun lien existant. Une expiration des anciennes notes est possible si besoin.

## 4. Vérifications effectuées

- `npm run check` : lint, format, types, 42 tests et build, tous verts.
- Smoke test sur le vrai serveur : création et lecture d'une note, 404 sur la route de listing, fallback SPA, en-têtes de sécurité, cache des assets, `noindex`.
- Captures Chrome headless en mobile et en desktop (accueil, saisie, lecture, partage).
- Installation de production de l'image simulée (`npm ci --omit=dev --workspace server`) : seules les dépendances serveur sont installées, et le serveur refuse de démarrer sans `DATABASE_URL`.
- **Non vérifié** : `docker build` / `docker compose up`, car le démon Docker n'était pas lancé. Ce build est couvert par le job `docker` de la CI.

## 5. Ce qu'il te reste à faire

1. **Supprimer l'ancien code.** La suppression de fichiers m'a été bloquée par les permissions, donc la v3 cohabite encore avec la v4 :
   ```sh
   git rm -r react-ui server/index.js server/config server/models server/migrations server/routes server/relations_and_seeds app.json .stylelintrc
   ```
2. **LICENSE** : le copyright est encore « 2016 Mars Hall » (hérité du template Heroku). La licence MIT impose de conserver cette mention d'origine. Tu peux ajouter ta propre ligne de copyright.
3. **Déployer** sur Render, Fly.io ou Railway avec le Dockerfile, en définissant `DATABASE_URL` et `TRUST_PROXY=1`, puis ajouter le lien de démo au README.
4. **Commit et PR** vers `master`, une fois la relecture faite.
