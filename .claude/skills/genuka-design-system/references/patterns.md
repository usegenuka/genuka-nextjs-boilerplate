# Parcours et contenus

## Pour qui on dessine

Les apps Genuka servent des commerçants d'Afrique francophone (Cameroun d'abord) et leurs équipes. Beaucoup travaillent sur un **Android d'entrée de gamme**, avec une connexion lente, souvent interrompus. Leur aisance avec le numérique varie beaucoup. D'où :
- un langage simple et des libellés visibles, pas d'interface faite seulement d'icônes ;
- des cibles assez grandes, et les actions principales à portée du pouce ;
- quelque chose d'utile à l'écran tout de suite (squelettes, pas d'écran blanc) ;
- la familiarité avant la nouveauté : l'app doit avoir l'air d'une page du dashboard.

La personnalité de la marque est **pragmatique, chaleureuse, fiable**. L'app est une assistante compétente, pas un SaaS tape-à-l'œil.

## Les pages

### Liste

1. `PageHeader` : le titre et une phrase. Pas de bouton ici : les actions d'une liste vont dans la barre d'outils du tableau, comme dans le dashboard.
2. `KpiStrip` s'il y a des chiffres utiles (total, nouveaux sur 30 jours, montant).
3. `DataTable` :
   - **barre d'outils** : à gauche, `Search` avec le total en dessous (« 1 248 au total ») ; à droite, les filtres (bouton `secondary` avec l'icône `Filter`, qui ouvre un `Sheet` et affiche le nombre de filtres actifs), puis la création (`Button` principal avec `Plus`) ;
   - **tri** : les colonnes utiles sont `sortable`, et le tri vit dans l'URL (`?sort=-created_at`) ;
   - **lignes** : la première colonne est un lien vers la fiche ;
   - **carte mobile** : l'avatar ou le nom, le statut, puis une ligne `border-t border-slate-100 pt-2` avec deux ou trois chiffres en `text-xs` ;
   - **état vide** : sans filtre, une incitation à créer le premier élément. Avec filtres, « Aucun résultat », plus un bouton `secondary` « Effacer les filtres ».

La recherche, les filtres, le tri et la page vivent **dans l'URL** (`?q=&status=&page=`), pour pouvoir partager le lien, revenir en arrière ou recharger.

### Fiche

1. `PageHeader` : lien retour, nom, pastille de statut ; actions : « Modifier » (`secondary`), le reste dans un menu « Plus ».
2. `KpiStrip` de l'objet.
3. `Tabs` pour les sections (Vue d'ensemble, Commandes, Notes…).
4. Grille `lg:grid-cols-12` : le contenu principal en `lg:col-span-8`, les `Card` d'information en `lg:col-span-4`.

### Formulaire

- Une colonne centrée `mx-auto w-full max-w-3xl` qui contient **aussi** le `PageHeader`.
- Des `FormSection` par thème. Les champs vont deux par deux à partir de `sm`, et un champ long prend `col-span-full`.
- Les options rares dans `AdvancedOptions`, repliées.
- `PageFooterActions` : Annuler (`secondary`), puis Enregistrer (principal, `loading` pendant l'envoi).
- Validation à la soumission, puis au fil de la saisie pour le champ en erreur. Le message dit **quoi faire** : « Saisissez un numéro avec l'indicatif », pas « Entrée invalide ».
- Après l'enregistrement : `toast.success`, puis retour à la fiche ou à la liste. En cas d'échec : `toast.error` avec la raison, et le formulaire reste rempli.
- Un formulaire long ne va jamais dans un `Dialog`.

### Réglages

Comme un formulaire, avec une `FormSection` par thème. Un `Switch` s'applique tout de suite (toast de confirmation). Les autres champs s'enregistrent avec le bouton du bas.

## États

| Situation | Affichage |
| --- | --- |
| Chargement d'une page | `Skeleton` à la forme du contenu (lignes du tableau, cellules du `KpiStrip` avec `loading`) ; jamais un écran blanc |
| Chargement d'une action | `loading` sur le bouton, qui se désactive : pas de double envoi |
| Liste vide | `EmptyState` avec une action |
| Erreur de chargement | un `EmptyState` avec l'icône `CircleAlert`, ce qui s'est passé en une phrase, et « Réessayer » |
| Genuka ne répond pas | afficher ce qu'on a, signaler ce qui manque, ne pas bloquer toute la page |
| Succès d'une action | `toast.success` court |
| Action irréversible | `ConfirmDialog` avant, avec la conséquence |

## Langues (i18n)

Le dashboard est en français, anglais et espagnol. Le français est la langue d'usage, l'anglais la langue de repli. Une app suit le même principe :
- **Outil** : `next-intl`, comme Genuka Gym. Un fichier de messages par langue (`messages/fr.json`, `en.json`, et `es.json` si l'app le prévoit) ; chaque clé est ajoutée dans toutes les langues dans le même commit. Le boilerplate n'a pas encore d'i18n : l'installer est la première étape d'une app qui a une interface.
- **Liens** : avec la langue dans l'URL (`/fr/…`), remplace le contenu de `lib/navigation.ts` par l'export de `@/i18n/navigation`. Sans cela, les onglets ne s'allument plus en français et les liens perdent la langue.
- **D'où vient la langue** : Genuka ne la transmet pas à l'iframe. L'app l'enregistre dans ses réglages (par exemple à la configuration, comme Genuka Gym), à défaut prend celle du navigateur, et le français en dernier. Le choix se fait dans la page Réglages, jamais dans la barre de navigation : une `FormSection` « Langue » avec un `Select` (Français, English, Español), enregistrée avec les autres réglages, puis la page se recharge dans la nouvelle langue.
- **Composants** : aucun texte en dur dans un composant partagé. Les textes du kit sont des props (`labels`, `closeLabel`) à remplir avec `t()`.

## Textes
- **Ton** : phrases courtes, vouvoiement, verbes d'action sur les boutons (« Enregistrer », « Créer une commande »), pas de jargon technique (« identifiant », « requête », « token »).
- **Majuscule** seulement au premier mot : « Nouveau client », pas « Nouveau Client ».
- **Devise** : toujours le **symbole**, après le montant, avec des espaces entre les milliers : « 15 000 FCFA ». Jamais « XAF », jamais « 15000 ». Utilise `formatMoney`.
- **Montants abrégés** : dans un indicateur, `formatMoney(montant, devise, { short: true })` donne « 18.45M FCFA » à partir de 100 000, comme le dashboard.
- **Dates** : « Aujourd'hui à 14:30 », « Hier à 09:05 », sinon « 2 nov. 2026 à 14:30 » (`formatDateTime`) ; une date seule « 2 nov. 2026 » (`formatDate`). Le dashboard affiche l'heure du navigateur. Une app qui rend côté serveur doit passer un fuseau : celui de la boutique si l'app l'a dans ses réglages (Genuka Gym le demande à la configuration). Sinon, le serveur écrit l'heure de son propre fuseau.
- **Téléphone** : avec l'indicatif (`+237 6 00 00 00 00`). Le Cameroun (`cm`) est le pays par défaut d'un champ téléphone.

## Accessibilité

Le dashboard n'a pas de cible WCAG formelle, mais ces points sont non négociables :
- un libellé visible pour chaque champ (`Field`) et chaque bouton ;
- un focus visible (anneau orange, déjà dans les composants) ;
- un seul `h1` par page (`PageHeader`) ;
- `aria-label` sur un bouton fait d'une icône seule (fermer, « plus ») ;
- les couleurs de statut sont toujours doublées d'un mot (la pastille porte le texte du statut) ;
- les contrôles du kit sont natifs ou viennent de Radix : clavier et lecteur d'écran fonctionnent. Ne les remplace pas par des `div` cliquables.

## Performance

- Rendre côté serveur ce qui peut l'être. Les composants du kit sans `"use client"` sont des composants serveur.
- Images Genuka : `loading="lazy"`, dimensions fixées.
- Pas de bibliothèque lourde pour un besoin simple : pas de framer-motion, pas de bibliothèque d'icônes en plus de lucide, pas de kit d'UI tiers.
