# Mise en page : l'app dans l'iframe de Genuka

## Ce que Genuka affiche déjà

Le marchand ouvre l'app depuis le dashboard (`/apps-installed/<id>`). Genuka garde sa propre interface et affiche l'URL de l'app dans une iframe. Il n'y a **aucun échange** entre les deux : pas de `postMessage`, pas de langue ni de thème transmis.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Barre Genuka : logo, recherche, aide, réglages, avatar                    │
├───────────┬──────────────────────────────────────────────────────┬───────┤
│ Sidebar   │ ‹  [logo] Nom de l'app            [⋮ Menu]  ← h-20   │ Rail  │
│ Genuka    │    par Éditeur                                       │ des   │
│ w-60      ├──────────────────────────────────────────────────────┤ apps  │
│ (dès lg)  │                                                      │ w-14  │
│ Accueil   │                  IFRAME = TON APP                    │       │
│ Ventes    │          (fond blanc, toute la largeur de la carte)  │       │
│ …         │                                                      │       │
└───────────┴──────────────────────────────────────────────────────┴───────┘
```

La carte blanche de Genuka garde ses 12 px de marge (`p-3`) et sa bordure. Seul le `main` qui contient l'iframe perd sa marge (`bodyClassName="!p-0"`).

Genuka fournit donc déjà :
- **la navigation globale** : la sidebar à partir de `lg`, et la barre de pastilles en bas en dessous ;
- **l'identité de l'app** : logo, nom, éditeur, et le bouton **Menu** (épingler, plein écran, support, conditions, signaler, désinstaller) ;
- **le compte** : la boutique, l'utilisateur, la recherche globale, la langue.

### Ce que l'app ne doit jamais refaire

- **Une sidebar.** Deux colonnes de navigation côte à côte, c'est le défaut le plus visible. La navigation de l'app passe par une barre d'onglets en haut, `AppNav`.
- Un en-tête avec le logo et le nom de l'app : Genuka les affiche juste au-dessus. Exception : l'app ouverte en plein écran (voir plus bas).
- Le nom ou l'avatar de la boutique ou de l'utilisateur, un sélecteur de boutique, un bouton de déconnexion.
- Un sélecteur de thème : l'app reste en clair.
- Un sélecteur de langue dans la barre : la langue se règle dans les réglages de l'app (voir [patterns.md](patterns.md)).
- Un pied de page « © Genuka » ou des liens légaux : ils sont dans le Menu de Genuka.
- Un fond gris (`bg-slate-50`) sur toute la page : l'iframe est posée dans la carte **blanche** du dashboard.

## La coque de l'app

```tsx
// app/(app)/layout.tsx : voir kit/examples/layout.tsx
<AppShell nav={<AppNav label="…" items={NAV} brand={…} />}>{children}</AppShell>
```

- **`AppShell`** : `min-h-dvh bg-white`, puis `<main className="flex flex-1 flex-col px-2 py-6 md:px-6">`. Ce sont les marges du `main` du dashboard, que Genuka retire autour de l'iframe. **Les pages n'ajoutent ni marge extérieure ni largeur maximale** (pas de `mx-auto max-w-6xl px-4`). Seuls les formulaires centrent une colonne `max-w-3xl`.
- **`AppNav`** : une barre collée en haut (`sticky top-0 z-30 bg-white`, trait `slate-200` en bas) avec des **onglets soulignés**, comme les onglets du dashboard :
  - onglet actif : `border-b-2 border-primary font-medium text-primary` ;
  - au repos : `border-transparent text-slate-500 hover:bg-primary/5 hover:text-slate-800` ;
  - une icône lucide `size-4` avant le libellé, toujours avec le libellé ;
  - sur téléphone, la barre **défile sur le côté** (`overflow-x-auto hide-scrollbar`) au lieu d'aller à la ligne ou de se replier en burger, comme la barre de pastilles du dashboard sur mobile.
- **La barre ne contient que les onglets.** « Réglages » est le dernier onglet. L'emplacement `actions` (un lien « Aide », discret) n'apparaît qu'à partir de `md`. Sur un téléphone de 375 px, chaque pixel de la barre sert aux onglets.

### Plus de 6 pages : les groupes

**6 onglets au plus**, Réglages compris. Au-delà, regroupe les pages proches sous un onglet :

1. L'onglet du groupe pointe vers la première page et liste les autres dans `match`. Il reste actif sur toutes :
   ```ts
   { href: "/activities", label: "Ressources", icon: <Boxes />, match: ["/rooms", "/coaches"] }
   ```
2. Les pages du groupe affichent une ligne de `Tabs` (avec `href`) **juste sous la barre `AppNav`, au-dessus du titre de la page**. Un layout de groupe (`app/(app)/(resources)/layout.tsx`) rend ces `Tabs` puis `{children}`.
3. Si un rôle n'a pas accès à une page, retire-la du groupe. L'onglet du groupe pointe alors vers la première page permise. Masque l'onglet si le groupe est vide.

Exemple, Genuka Gym (11 pages en 6 onglets) : Vue d'ensemble (+ Rapports), Planning, Clients (+ Commandes), Catalogue (+ Politiques), Ressources (Activités, Salles, Coachs), Réglages.

### Ouverte en plein écran

Le Menu de Genuka propose « Ouvrir en plein écran », qui ouvre l'URL de l'app dans un onglet, hors de l'iframe. `AppNav` le détecte (`window.self === window.top`) et affiche alors une ligne avec le logo et le nom de l'app (`brand`) au-dessus des onglets. Dans l'iframe, cette ligne reste cachée.

## Anatomie d'une page

1. **`PageHeader`**, le seul `h1` de la page (`text-base font-semibold text-slate-800 md:text-xl`). On peut ajouter :
   - une phrase de description (`text-sm text-slate-500`) ;
   - un lien de retour vers la liste parente (`text-xs text-slate-400 hover:text-primary`) ;
   - des pastilles de statut à côté du titre ;
   - les **actions d'une fiche** à droite : le bouton principal en dernier, les secondaires dans un menu « Plus » au-delà de deux. Sur téléphone, elles s'empilent en pleine largeur.
2. **Le contenu**, dans un `flex flex-col gap-4` (fiche) ou `gap-6` (liste).
3. **`PageFooterActions`** sur les formulaires : la barre des boutons, collée en bas (`sticky bottom-0 border-t border-slate-100 bg-white`). D'abord Annuler (`secondary`), puis le bouton principal. Sur téléphone, les deux sont en pleine largeur.

**Les actions d'une liste ne vont pas dans le `PageHeader`.** Comme dans le dashboard (prop `rightItems` de `DataTable`), elles vont **à droite de la barre d'outils du tableau** : Filtres, puis « Nouveau ». La recherche est à gauche, avec le total en dessous.

### Gabarits

| Page | Structure | Modèle |
| --- | --- | --- |
| Vue d'ensemble (accueil de l'app) | `PageHeader`, `KpiStrip` (des cellules avec `href` vers la liste filtrée), puis une grille `lg:grid-cols-12` : en `lg:col-span-8` un `Card` avec un petit tableau (« À traiter »), en `lg:col-span-4` des `Card` d'activité récente | |
| Liste | `PageHeader` (titre, description), `KpiStrip` (facultatif), `DataTable` (barre d'outils : `SearchForm` et total, Filtres et création ; lignes ; pagination) | [kit/examples/list-page.tsx](../kit/examples/list-page.tsx) |
| Fiche | `PageHeader` (retour, pastilles, actions), `KpiStrip`, `Tabs`, puis une grille `grid grid-cols-1 gap-4 lg:grid-cols-12` : colonne principale `lg:col-span-8`, colonne de côté `lg:col-span-4` | [kit/examples/detail-page.tsx](../kit/examples/detail-page.tsx) |
| Formulaire (création et modification) | une colonne centrée `mx-auto w-full max-w-3xl` qui contient le `PageHeader`, des `FormSection`, les « Options avancées » repliées, `PageFooterActions`. La page de modification (`/[id]/edit`) réutilise le même composant de formulaire, rempli. | [kit/examples/form-page.tsx](../kit/examples/form-page.tsx) |
| Réglages | comme un formulaire, une `FormSection` par thème (dont la langue de l'app) | |
| Assistant (configuration, import) | `Steps` en haut, une `FormSection` par étape, `PageFooterActions` avec Précédent et Suivant | |
| Chargement | `loading.tsx` en `Skeleton`, à la forme de la page | [kit/examples/loading.tsx](../kit/examples/loading.tsx) |
| 404, erreur, session expirée | `StatusPage`. Sous un `loading.tsx`, `notFound()` répond 200 (la page est déjà en streaming) : le contenu 404 s'affiche, mais vérifie le contenu et non le code HTTP. | [not-found](../kit/examples/not-found.tsx), [error](../kit/examples/error.tsx), [unauthorized](../kit/examples/unauthorized-page.tsx) |

## Responsive

Le dashboard est pensé d'abord pour le téléphone : beaucoup de marchands n'ont qu'un Android d'entrée de gamme.

**La largeur qui compte est celle de l'iframe, pas celle de l'écran.** Les points de rupture Tailwind (`sm`, `md`, `lg`) se calculent sur la largeur de l'iframe. Celle-ci vaut :
- sous `lg` : l'écran − 26 px ;
- à partir de `lg` : l'écran − 322 px (sidebar 240, rail 56, marges et bordures 26).

| Écran du marchand | Iframe | Point de rupture actif |
| --- | --- | --- |
| Téléphone, 360 à 414 px | 334 à 388 px | aucun (mobile) |
| Tablette, 768 px | 742 px | `sm`, **pas `md`** : mise en page mobile |
| Petit portable, 1024 à 1089 px | 702 à 767 px | `sm` : mise en page mobile |
| Portable, 1280 px | 958 px | `md`, **pas `lg`** |
| Écran, 1440 px | 1 118 px | `lg` |
| Grand écran, 1920 px | 1 598 px | `xl` |

Conséquences :
- `md` est le point de rupture principal, comme dans le dashboard (1 360 usages, contre 405 pour `lg`). Il règle les cartes mobiles des tableaux, les titres, la largeur des boutons et les colonnes cachées. Une tablette reste en mise en page mobile.
- Une mise en page à deux colonnes passe à `lg`. Sur un portable de 1280 px, elle reste donc sur une colonne : vérifie que c'est lisible.
- **Teste à 375, 742 et 958 px de large.**

Règles :
- **Jamais de défilement horizontal de la page.** Seuls défilent sur le côté, volontairement :
  - la barre `AppNav` et les `Tabs` ;
  - le `KpiStrip` et les pastilles de période ;
  - un tableau sans carte mobile.
- **Tableaux** : sous `md`, une carte par ligne (`mobileCard`). Les colonnes secondaires sont `hideOnMobile`. On le fait en CSS, pas en détectant le téléphone en JavaScript.
- **Boutons** : en pleine largeur sous `md`, puis à leur taille. C'est le comportement par défaut de `Button` (`width="responsive"`), comme dans le dashboard, et il vaut aussi pour la barre d'outils d'une liste et les barres d'actions. Les boutons `sm`, `ghost`, `ghostPrimary`, `ghostDanger` et `link` gardent leur taille partout : ils vivent dans des lignes et des cartes.
- **Une rangée qui contient un bouton pleine largeur passe en ligne à `md`, pas à `sm`** (`flex flex-col gap-4 md:flex-row md:items-center md:justify-between`). Entre 640 et 768 px (une tablette), un bouton encore en pleine largeur dans une rangée `sm:flex-row` pousse le texte et fait défiler la page sur le côté. Seules exceptions : les conteneurs du kit qui gèrent eux-mêmes la largeur de leurs enfants (`PageHeader`, `PageFooterActions`, la barre d'outils de `DataTable`).
- **Grilles de champs** : une colonne, deux à partir de `sm` (`FormSection`).
- **Cibles tactiles** : 36 px de haut pour un bouton (`h-9`) ; 36 px pour un champ sur téléphone, 40 px à partir de `sm`.
- **Panneaux** : les filtres s'ouvrent à droite (`Sheet side="right"`) à toutes les largeurs. Une courte liste de choix propre au téléphone peut s'ouvrir par le bas (`Sheet side="bottom"`).
- **Texte long** : `truncate` ou `line-clamp-1` dans les cellules, et `min-w-0` sur les parents flex.

## Défilement et couches

- C'est le document de l'iframe qui défile, pas un conteneur interne. Pas de `h-screen overflow-hidden` sur la coque. Les barres `sticky` (`AppNav` en haut, `PageFooterActions` en bas) s'appuient sur ce défilement.
- Ordre des couches (`z-index`) : barres collées `z-20`/`z-30` ; dialogues, panneaux, menus et infobulles `z-50`.

## Pages publiques de l'app

Certaines apps ont des pages pour **leurs propres clients**, hors du dashboard. C'est le cas des pages de réservation des adhérents dans Genuka Gym. Le marchand ne les voit pas dans Genuka. Pour elles :
- même kit et mêmes tokens (police, slate, formes, composants) ;
- **pas d'`AppNav`** : un en-tête simple avec le logo et le nom **de la boutique**, et une colonne centrée (`mx-auto max-w-md` pour une connexion, `max-w-2xl` pour un parcours) ;
- la langue vient du navigateur du client, ou de son choix sur la page ;
- l'accent reste l'orange Genuka par défaut. Une app peut prendre la couleur de la boutique (Genuka Gym la tire de son logo), mais c'est une décision produit, à écrire dans le CLAUDE.md du projet.
