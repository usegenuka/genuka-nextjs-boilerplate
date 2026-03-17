# Boilerplate Genuka Next.js

Date de mise à jour: 17 mars 2026

Ce document transforme ce projet en **base standard** pour lancer rapidement une application Next.js connectée à Genuka.

## 1) Objectif du boilerplate

Utiliser ce repo comme point de départ pour:

- brancher une app à Genuka via OAuth,
- gérer une session serveur sécurisée (JWT + cookies HTTP-only),
- stocker les tokens/sociétés en base via Prisma,
- exposer des routes API prêtes pour consommer l’Admin API Genuka.

## 2) Ce qui est déjà prêt

- Auth Genuka complète (`callback`, `refresh`, `logout`, `check`, `me`)
- Persistance DB Prisma (MySQL/MariaDB)
- Gestion de session double cookie (`session` 7h + `refresh_session` 30 jours)
- Helpers d’accès Genuka authentifiés côté serveur
- Endpoints exemples pour `customers`, `orders`, `products`
- Point d’entrée webhook Genuka

## 3) Démarrage rapide (5 étapes)

### Étape 1 — Installer les dépendances

```bash
bun install
```

### Étape 2 — Préparer l’environnement

```bash
cp .env.example .env
```

Variables obligatoires:

```env
DATABASE_URL="mysql://user:password@localhost:3306/database"
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="root"
DB_PASSWORD=""
DB_NAME=""

GENUKA_URL="https://api-staging.genuka.com"
GENUKA_CLIENT_ID=""
GENUKA_CLIENT_SECRET=""
GENUKA_REDIRECT_URI="http://localhost:3000/api/auth/callback"
```

### Étape 3 — Initialiser Prisma

```bash
bun run db:generate
bun run db:push
```

### Étape 4 — Lancer en local

```bash
bun run dev
```

### Étape 5 — Configurer l’app côté Genuka

Dans votre application Genuka, renseigner la redirect URI:

```text
http://localhost:3000/api/auth/callback
```

## 4) Workflow recommandé pour créer une nouvelle app

1. **Cloner ce boilerplate** et le renommer pour votre projet.
2. **Mettre à jour le schéma Prisma** selon votre domaine métier.
3. **Créer vos services métier** dans `services/` (lecture/écriture DB + appels externes).
4. **Ajouter vos routes API** dans `app/api/` en vous appuyant sur `requireAuth()`.
5. **Construire l’UI** avec `app/` (Server Components), en lisant la société connectée via `getAuthenticatedCompany()`.
6. **Brancher les webhooks** pour synchroniser les données entrantes Genuka.

## 5) Endpoints disponibles dans le boilerplate

### Auth

- `GET /api/auth/callback` — finalisation OAuth + création session
- `GET /api/auth/check` — vérifie l’état de connexion
- `POST /api/auth/refresh` — renouvelle la session via cookie refresh
- `GET /api/auth/me` — retourne la société authentifiée
- `POST /api/auth/logout` — suppression des cookies de session
- `POST /api/auth/webhook` — réception des événements Genuka

### Données Genuka (exemples)

- `GET /api/genuka/products`
- `GET /api/genuka/orders`
- `GET /api/genuka/customers`

Ces routes sont protégées par `requireAuth()` et utilisent un client Genuka initialisé avec les tokens de la société.

## 6) Structure à conserver

- `app/api/` → routes HTTP (auth + métier)
- `services/` → logique applicative (OAuth, DB, métier)
- `lib/` → utilitaires transverses (`auth`, `genuka`, `prisma`, `hmac`)
- `config/` → constantes et variables d’environnement validées
- `types/` → contrats TypeScript partagés
- `prisma/schema.prisma` → modèle de données

## 7) Règles de sécurité à ne pas casser

1. **Ne jamais exposer `GENUKA_CLIENT_SECRET` au frontend**.
2. **Toujours valider le callback OAuth** (`code`, `company_id`, `timestamp`, `hmac`).
3. **Toujours vérifier le type du JWT** (`session` vs `refresh`).
4. **Toujours utiliser les cookies HTTP-only** pour la session.
5. **Toujours contrôler l’auth sur les routes sensibles** avec `requireAuth()`.

## 8) Scripts utiles

```bash
bun run dev
bun run build
bun run start
bun run lint

bun run db:generate
bun run db:push
bun run db:dev
bun run db:studio
```

## 9) Checklist avant mise en production

- Passer `GENUKA_URL` vers l’environnement cible (staging/production).
- Mettre `GENUKA_REDIRECT_URI` sur votre domaine réel.
- Vérifier la base de données de production et les migrations Prisma.
- Ne pas utiliser de contournement TLS en production.
- Tester au minimum les flux: install OAuth, refresh, logout, webhook.

---

## 10) Référence détaillée — bonnes pratiques (génériques + exemples métier)

Cette section reprend les points opérationnels détaillés du document précédent, pour conserver la profondeur technique.

Note de lecture:

- Les points formulés de manière générique sont à appliquer dans toutes les apps dérivées du boilerplate.
- Les champs métier (ex: réservation, propriété, dates de séjour) sont des **exemples** à adapter ou supprimer selon votre domaine.

### 10.1 Connexion et authentification

- **OAuth côté backend uniquement** : l’échange `code -> token` est fait côté serveur, avec `client_id`, `client_secret`, `redirect_uri` depuis les variables d’environnement.
- **Validation forte du callback** : présence des paramètres critiques (`code`, `company_id`, `timestamp`, `hmac`) vérifiée avant traitement.
- **Vérification cryptographique HMAC** : la signature du callback est recalculée à partir des paramètres triés et encodés, puis comparée à la signature reçue.
- **Protection contre le replay** : rejet des callbacks trop anciens (fenêtre max de 5 minutes via `timestamp`).
- **Session serveur robuste (double cookie JWT)** :
	- cookie session court (7h),
	- cookie refresh long (30 jours),
	- cookies `httpOnly`, `sameSite=lax`, `secure` en production.
- **Séparation des types de JWT** : distinction explicite `type: session` vs `type: refresh` pour empêcher les usages croisés.
- **Refresh sans surexposition** : le refresh de session repose sur cookie `httpOnly`, avec revalidation de la société en base avant de régénérer les cookies.
- **Zéro fuite de secret en frontend** : le secret Genuka n’est utilisé que côté serveur (`env`, middleware/proxy, services).

### 10.2 Sécurisation des échanges avec Genuka

- **Centralisation des accès Genuka** : helpers/fonctions dédiées (`initializeAuthenticatedGenuka`, `genukaAdminFetch`) pour homogénéiser les appels.
- **Headers multi-tenant systématiques** : ajout de `Authorization: Bearer`, `X-Company`, et `X-Shop` (si boutique active) pour scoper les données.
- **Version d’API figée** : usage explicite de la version admin API (`2023-11`) pour limiter les effets de bord lors des évolutions API.
- **Payloads JSON structurés** : normalisation des requêtes avec `Content-Type: application/json` + désérialisation contrôlée.
- **Unwrap de réponses Laravel Resource** : prise en charge de `data` encapsulé pour éviter les divergences selon endpoints.
- **Validation de signature webhook** : vérification `x-genuka-signature` en production avec comparaison en temps constant (`timingSafeEqual`).
- **Fail-safe en environnement dev** : assouplissement contrôlé de certaines vérifications en local (utile pour tests d’intégration).

### 10.3 Synchronisation des données (sortante et entrante)

- **Sync sortante asynchrone non bloquante** : après création/mise à jour locale, la sync Genuka est lancée en arrière-plan pour préserver la réactivité API.
- **Sync manuelle possible (exemple)** : endpoint dédié (ex: `/api/sync`) pour resynchroniser un élément précis ou en masse.
- **Idempotence pragmatique create/update** :
	- si un lien Genuka existe, tentative d’update,
	- si la ressource distante n’existe plus, unlink local puis recréation.
- **Référentiel de liaison local** : stockage des IDs Genuka (`genukaProductId`, `genukaOrderId`, `genukaCustomerId`) pour maintenir la cohérence inter-systèmes.
- **Métadonnées de traçabilité** : conserver des clés de corrélation entre objets locaux et distants (ex: `metadata.source`, identifiant métier, période métier).
- **Déduplication client par email** : recherche d’un client existant avant création pour limiter les doublons.
- **Mapping métier explicite des statuts** : documenter la conversion entre statuts Genuka et statuts locaux (exemple: `order.status` -> statut interne de commande/réservation).
- **Reverse sync via webhooks** : mise à jour locale pilotée par événements (`order.updated`, `order.cancelled`, `product.updated`, etc.).
- **Traitement conditionnel des événements externes** : pour les commandes non créées par l’app, logique de vérification par produits liés.

### 10.4 Qualité des données et robustesse métier

- **Validation d’entrée côté API** : contrôler les champs obligatoires selon votre domaine (ex: `name`, prix, identifiant métier, dates, statut).
- **Contrôles métier avant écriture** : appliquer les règles de cohérence propres au domaine avant création/mise à jour.
- **Calculs métier côté serveur** : calcul du `totalPrice` et des nuitées côté backend pour garantir l’intégrité.
- **Normalisation d’identifiants métier** : génération de `handle` produit stable et SEO-friendly, enrichi d’un suffixe unique.
- **Construction d’URLs absolues pour médias** : conversion des chemins d’images en URLs absolues avant envoi à Genuka.
- **Préservation des configurations client** : setup initial des statuts produit uniquement si non déjà configurés (pas d’écrasement).

### 10.5 Résilience, observabilité et exploitation

- **Gestion d’erreurs défensive** : `try/catch` systématique autour des appels externes et retours HTTP adaptés (`400/401/404/409/500`).
- **Logs orientés exploitation** : messages explicites pour sync réussies/échouées, ressources manquantes, événements webhook.
- **Tâches non critiques en non-bloquant** : exécuter en arrière-plan les initialisations secondaires (ex: auto-sélection de shop, configuration de statuts) sans bloquer le parcours OAuth.
- **Endpoint d’état de sync (optionnel, exemple)** : exposer un endpoint de supervision (ex: `/api/sync/status`) pour suivre les éléments synchronisés vs en attente.
- **Configuration centralisée des variables d’environnement** : accès typé et validation centralisée via `config/env.ts`.

### 10.6 Rappels essentiels Genuka

1. **Ne jamais faire confiance au callback OAuth sans HMAC + timestamp**.
2. **Toujours scoper les appels admin avec `X-Company` et `X-Shop`**.
3. **Conserver les IDs Genuka dans la base locale pour garantir l’idempotence**.
4. **Utiliser les webhooks comme source de vérité de convergence** (et pas uniquement des cron/jobs).
5. **Mettre une signature/traçabilité fonctionnelle dans `metadata`** pour relier les objets inter-systèmes.
6. **Garder la sync asynchrone côté API utilisateur** pour éviter de dégrader l’UX sur des latences réseau tierces.
