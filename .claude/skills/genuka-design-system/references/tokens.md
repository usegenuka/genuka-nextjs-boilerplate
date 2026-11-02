# Tokens : couleurs, typographie, formes, espacements

Valeurs relevées dans le dashboard Genuka : sa configuration Tailwind, sa feuille de style globale, et les classes réellement utilisées dans les pages de l'app, comptées sur environ 1 100 fichiers. Elles sont déjà dans [kit/app/genuka-theme.css](../kit/app/genuka-theme.css).

**N'invente aucune autre valeur.** Si un besoin n'est pas couvert ici, prends la valeur la plus proche de ce tableau.

## Tailwind v3 dans le dashboard, v4 dans les apps

Le dashboard tourne en **Tailwind v3**, les apps en v4. Trois échelles ont changé de valeur entre les deux. Le thème du kit remet celles de la v3, pour que les recettes copiées du dashboard rendent pareil :

| Ce qui change | En v4 par défaut | Remis comme en v3 par le thème |
| --- | --- | --- |
| Couleurs | palette oklch plus vive (`red-500` ≈ `#FB2C36`) | `slate`, `red`, `green`, `emerald`, `amber`, `blue` et `orange` en hex v3 (`red-500` = `#EF4444`) |
| `shadow-sm` | l'ancien `shadow`, deux fois plus marqué | `0 1px 2px 0 rgb(0 0 0 / 0.05)` |
| `rounded-sm` | 4 px | 2 px |
| `border` ou `divide-*` sans couleur | `currentColor` (trait foncé) | `slate-200` |

## Couleurs

### Marque : un seul accent, l'orange Genuka

| Token | Valeur | Usage |
| --- | --- | --- |
| `primary` | `#FD982E` | bouton principal, onglet actif, liens, anneau de focus, interrupteur, case cochée |
| `primary-50` / `-100` | `#FFF7ED` / `#FFEDD5` | fonds teintés |
| `primary-200` → `-400` | `#FED7AA`, `#FDBA74`, `#FEA94E` | rare |
| `primary-500` | `#FD982E` | = `primary` |
| `primary-600` | `#EA7C0E` | texte orange qui manque de contraste en `primary` |
| `primary-700` | `#C2600A` | texte d'une pastille « marque » |
| `primary-800` → `950` | `#9A4D0E`, `#7C3F0F`, `#432005` | rare |

- Bouton principal : `bg-primary/90` au repos, `hover:bg-primary`. Comme le bouton maison du dashboard, le survol **éclaircit** vers l'orange plein.
- Fonds teintés : `bg-primary/5` pour le survol d'un onglet ou un choix sélectionné, `bg-primary/10` pour un rond d'icône.
- L'orange ne sert **pas** au texte courant, aux titres, aux fonds de section ni aux en-têtes de tableau.

### Couleurs sémantiques

| Token | Valeur | Rôle |
| --- | --- | --- |
| `success` | `#10B981` | réussite, payé, actif |
| `danger` | `#EF4444` | erreur, suppression, annulé |
| `warning` | `#F59E0B` | attention, en attente |
| `info` | `#3B82F6` | information |

Les teintes changent selon l'élément :

| Élément | Fond | Texte |
| --- | --- | --- |
| Pastilles de statut (`Badge`) | `-100` | `-700` |
| Bandeaux (`Banner`) | `-50` | `-800`, bordure `-400` ; l'avertissement y est orange, pas ambre (comme dans le dashboard) |
| Ronds d'icône des indicateurs | `-50` (`slate-100` pour le neutre ; `primary-50` pour l'orange) | `-600` |
| Variation en % | `bg-green-50 text-green-600` / `bg-red-50 text-red-600` | |
| Erreur de champ | | `text-red-500` |

### Neutres : `slate` uniquement

Le dashboard utilise slate dans 86 % des cas. Pas de `gray`, `zinc`, `neutral`, `stone`, ni de `text-black`.

| Rôle | Classe |
| --- | --- |
| Titres (page, dialogue, panneau) | `text-slate-800` ; titre de confirmation et de page d'erreur `text-slate-900` |
| Valeur saisie dans un champ | `text-slate-900` |
| Texte principal, valeurs | `text-slate-700` |
| Texte courant, cellules de tableau | `text-slate-600` |
| Libellés de champ, aide, sous-titres | `text-slate-500` |
| Méta, icônes discrètes, texte d'état vide | `text-slate-400` |
| Placeholder | `placeholder:text-slate-400` |
| Bordure de carte, de champ | `border-slate-200` / `ring-slate-200` |
| Séparateurs internes | `border-slate-100`, `divide-slate-100` |
| Fond discret (en-tête de tableau, survol) | `bg-slate-50` |
| Fond de puce, bouton secondaire | `bg-slate-100` (survol `bg-slate-200`) |
| Bouton désactivé | `bg-slate-300 text-slate-600` |
| Fond de la page de l'app | `bg-white` |

### Couleurs absentes du thème

Le thème **supprime** `purple`, `violet`, `fuchsia`, `pink`, `rose`, `indigo`, `gray`, `zinc`, `neutral` et `stone`. Leurs classes ne produisent rien, et le lint du kit les signale.

Les principes produit de Genuka interdisent les dégradés violet et rose. Le dashboard garde encore du violet par endroits (« partiellement payé », un thème d'indicateur) : c'est l'héritage que l'équipe veut faire disparaître. Les apps n'en mettent pas. « Partiellement payé » prend le ton `warning`.

### Mode sombre

Le dashboard n'a pas de thème sombre dans l'app (moins de 3 % des fichiers ont une variante `dark:`, presque tous sur une page publique). L'app reste en clair (`color-scheme: light`), sans variante `dark:` et sans bascule de thème.

Si le projet utilise `next-themes`, force le clair (`forcedTheme="light"`) ou retire-le. Sinon, l'iframe suit le réglage du téléphone et devient sombre au milieu d'un dashboard clair.

## Typographie

- **Police : Bricolage Grotesque pour tout le texte**, chargée avec `next/font` ([kit/lib/fonts.ts](../kit/lib/fonts.ts)), comme dans le dashboard (`body { font-family: var(--font-bricolage) }`). Outfit sert seulement aux toasts.
- `font-mono` pour les codes, références et SKU (`ORD-1490`). `tabular-nums` pour les nombres alignés (montants, quantités).

| Rôle | Classes |
| --- | --- |
| Titre de page (`h1`, un seul par page) | `text-base font-semibold text-slate-800 md:text-xl` |
| Titre de dialogue, de panneau, de confirmation | `text-lg font-semibold` |
| Titre de page d'erreur (404, accès) | `text-xl font-semibold text-slate-900` |
| Titre de section dans une page | `text-base font-medium text-slate-700` |
| Titre de carte, de section de formulaire | `text-sm font-medium text-slate-700` |
| Texte courant | `text-sm text-slate-600` |
| Libellé de champ | `text-sm text-slate-500` |
| Aide, légende, sous-titre de carte | `text-xs text-slate-500` |
| En-tête de tableau | `text-sm font-medium text-slate-500` |
| Valeur d'indicateur | `text-sm font-medium text-slate-700 md:text-base` |
| Bouton | `text-sm`, graisse normale |
| Pastille | `text-xs`, graisse normale |
| Sur-titre (rare) | `text-xs font-medium uppercase tracking-wide text-slate-400` |

**Graisses.** `font-medium` au plus dans le contenu. `font-semibold` est réservé aux titres : le `h1`, les titres de dialogue et de panneau, les pages d'erreur. Jamais `font-bold` ni `font-black`.

**Tailles.** Aucun titre n'est plus grand que `text-xl`. Dans le contenu de la page, rien ne dépasse le `h1`.

**Valeurs fixes reprises du dashboard** (les seules valeurs arbitraires permises) : `text-[10px]` pour la variation en %, `min-w-[180px]` pour une cellule d'indicateur, `max-w-[260px]` pour l'infobulle d'un indicateur, `shadow-[0px_3px_10px_#00000017]` pour les menus.

## Formes

| Élément | Arrondi |
| --- | --- |
| Boutons, champs, cartes d'information, menus d'éléments | `rounded-md` |
| Tableaux de données, sections de formulaire, menus, sélecteurs | `rounded-lg` |
| Dialogue | `sm:rounded-lg` (bord à bord sur téléphone) ; confirmation `rounded-xl` |
| Pastilles, avatars, ronds d'icône, interrupteurs | `rounded-full` |
| Panneau du bas (sheet mobile) | `rounded-t-xl` |
| `rounded-2xl`, `rounded-3xl` | non |

## Ombres et bordures

- Carte : bordure **et** ombre légère, `border border-slate-200 shadow-sm`. Une section de formulaire n'a que la bordure.
- Tableau de données : `shadow-md shadow-slate-100 ring-1 ring-slate-200/60`.
- Couches flottantes : menu et popover `shadow-[0px_3px_10px_#00000017]`, dialogue et panneau `shadow-lg`, confirmation `shadow-2xl`.
- Fond d'une modale : `bg-slate-700/80` ; fond d'une confirmation : `bg-slate-900/40`.
- Pas d'ombre colorée, pas d'ombre décorative.

## Espacements

- Marges de la page dans l'iframe : `px-2 py-6 md:px-6`, comme le `main` du dashboard. `AppShell` les applique : une page n'ajoute ni marge extérieure ni largeur maximale.
- Intérieur d'une carte : `p-4`. Barre d'outils d'un tableau : `p-4 md:p-5`.
- Écarts :
  - `gap-2` entre éléments liés ;
  - `gap-4` entre champs et entre cartes ;
  - `gap-6` entre grandes zones.
- Largeur d'un formulaire : `mx-auto max-w-3xl`. Les listes prennent toute la largeur.

## Icônes

- **lucide-react uniquement.**
- Tailles :
  - `size-4` par défaut ;
  - `size-3` dans les pastilles et les variations ;
  - `size-6`/`size-7` dans un rond d'état vide ou une zone de dépôt.
- Trait :
  - fin, `stroke-[1.3]`, dans les menus, la recherche, les listes déroulantes et les barres d'outils ;
  - par défaut partout ailleurs, y compris dans la navigation.
- **Pas d'icône étoile** (interdite par l'équipe). Le lint la refuse.
- Une icône accompagne un libellé visible. Seuls fermer, « plus », les flèches de pagination et les flèches de tri peuvent être des icônes seules, et toujours avec un nom accessible.

## Mouvement

- `transition-colors` (150 à 200 ms) sur les éléments interactifs.
- Entrées des dialogues, menus et panneaux : `tw-animate-css` (fondu, léger zoom). Rien d'autre ne bouge.
- Pas de framer-motion ni de Lottie pour l'interface. Respecter `prefers-reduced-motion` pour toute animation ajoutée.

## Graphiques

- Palette des séries, dans cet ordre : `#FD982E`, `#3B82F6`, `#10B981`, `#F59E0B`, `#0EA5E9`, `#64748B`.
- Camembert : `#FD982E`, `#10B981`, `#0EA5E9`, `#F59E0B`, `#14B8A6`, `#64748B`, `#EF4444`, `#84CC16`.
- Axes : graduations `#94a3b8` en 10 px, lignes `#e2e8f0`, grille `#f1f5f9`.
- Recettes en vert `#10b981`, dépenses en rouge `#ef4444`.
- Pas de bibliothèque imposée. Le dashboard utilise surtout `@mui/x-charts`. Pour une app, un graphique simple en SVG ou une bibliothèque légère suffit, à condition de garder ces couleurs.
