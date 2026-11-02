# Composants du kit

Le kit ([kit/](../kit/)) reprend les composants du dashboard. Ses recettes viennent de deux sources :
- les composants du dashboard, ce que le marchand voit aujourd'hui ;
- le design system unifié que l'équipe Genuka a désigné comme source de vérité.

Quand les deux diffèrent, le kit suit **ce que le marchand voit**.

**Réutilise avant d'inventer.** Une page se compose de ces composants. N'écris un nouveau composant que si aucun ne convient. Dans ce cas, garde les recettes de [tokens.md](tokens.md) et range-le dans `components/ui`.

Règles d'API communes :
- **Les icônes se passent en élément** (`icon={<Users />}`), jamais en composant (`icon={Users}`). Un layout serveur ne peut pas passer une fonction à un composant client, et le build casse.
- **Les liens passent par `lib/navigation.ts`.** Avec next-intl, on change ce fichier une fois et tout le kit garde la langue dans l'URL.
- **Les textes visibles sont des props** (`labels`, `closeLabel`…), à traduire par l'i18n du projet. Les valeurs par défaut sont en anglais, comme les textes de repli du dashboard (`t("key", "English fallback")`).

## Structure

| Composant | Fichier | Quand | Équivalent dashboard |
| --- | --- | --- | --- |
| `AppShell` | `components/layout/app-shell.tsx` | coque de toutes les pages authentifiées | la carte blanche et les marges des pages |
| `AppNav` | `components/layout/app-nav.tsx` | navigation de l'app : onglets soulignés en haut, `match` pour les groupes, **jamais de sidebar** | onglets soulignés et barre mobile défilante |
| `PageHeader` | `components/layout/page-header.tsx` | `h1`, description, retour, pastilles, actions d'une fiche | titre des pages, en-tête d'une fiche client |
| `PageFooterActions` | `components/layout/page-footer-actions.tsx` | boutons d'un formulaire, collés en bas | barre d'actions en bas des formulaires |
| `FormSection` | `components/layout/form-section.tsx` | un bloc de formulaire, une puis deux colonnes de champs | sections du formulaire d'immobilisation |
| `AdvancedOptions` | `components/layout/form-section.tsx` | réglages rares, repliés | « Options avancées » |
| `StatusPage` | `components/layout/status-page.tsx` | 404, erreur, session expirée | pages 404 et d'erreur |

## Actions

`Button`, d'après le bouton maison du dashboard (332 fichiers) : graisse normale, `text-sm`, `rounded-md`, `h-9 px-7`. Il est en **pleine largeur sous `md`** et prend sa taille ensuite (`width="responsive"`, par défaut). Désactivé, il passe en `bg-slate-300 text-slate-600`.

| Variante | Quand |
| --- | --- |
| `primary` (défaut) | l'action principale de la zone, **une seule** |
| `secondary` | Annuler, Filtres, Modifier : l'action neutre la plus courante |
| `outline` | une action orange moins forte que `primary` (Exporter, Importer) |
| `ghost` | action discrète grise dans une ligne, bouton d'icône |
| `ghostPrimary` | action discrète orange (« Ajouter une ligne ») |
| `danger` | supprimer, annuler une commande |
| `ghostDanger` | supprimer discrètement, dans une ligne |
| `success` | valider un paiement, rare |
| `link` | action qui ressemble à un lien |

Tailles :
- `default` ;
- `sm` (`h-7 px-2 text-xs`, la taille « small » du dashboard) ;
- `lg` ;
- `icon` (avec un `aria-label`).

`loading` désactive le bouton et ajoute un spinner. `asChild` donne l'apparence d'un bouton à un `Link`.

## Formulaires

Chaque contrôle va dans un **`Field`**. Le `Field` affiche le libellé au-dessus (`text-sm text-slate-500`), avec un `*` rouge si le champ est obligatoire, puis l'aide ou l'erreur dessous. Il **donne lui-même** au contrôle son `id`, `aria-invalid` et `aria-describedby`. Il attend **un seul contrôle** : si tu dois l'envelopper dans un `<div>`, passe `htmlFor` et mets le même `id` sur le champ toi-même.

Exceptions, qui portent leur propre libellé et ne vont pas dans un `Field` :
- `Checkbox`, `Switch` et `RadioGroup` ont leur libellé à côté de la case (et `RadioGroup` un `label` de groupe) ;
- `SearchForm` n'a qu'un `aria-label`, comme les barres d'outils du dashboard ;
- `FileDrop` affiche son texte dans le cadre : mets-le sous le titre d'une `FormSection` ou d'un petit `h3`.

| Composant | Quand | À savoir |
| --- | --- | --- |
| `Input` | texte, nombre, e-mail, date (`type="date"`), heure | `leading` (icône) et `trailing` (devise, unité) dans le champ. Montant : `type="number" inputMode="numeric" trailing="FCFA"`. |
| `Textarea` | texte long | même style |
| `Select` | une valeur dans une liste | **`<select>` natif stylé**, comme les champs du dashboard : le téléphone ouvre son propre sélecteur |
| `MultiSelect` | plusieurs valeurs | champ à pastilles, liste avec recherche et cases (`react-select isMulti` dans le dashboard) |
| `PhoneInput` | téléphone | pays et indicatif, Cameroun par défaut, numéro au format E.164 (`react-international-phone`, comme le dashboard) |
| `Checkbox` | une option oui/non, une sélection | case orange cochée de blanc, libellé à droite, description facultative |
| `RadioGroup` | un choix parmi 2 à 5 | `list`, ou `cards` (cartes encadrées, choisie en orange) |
| `Switch` | un réglage qui s'applique tout de suite | `h-5 w-9`, orange quand il est activé |
| `SearchForm` | recherche dans la barre d'outils d'une liste | formulaire GET : `?q=` va dans l'URL et les autres paramètres sont gardés (`keep={keptParams(params, ["q"])}`), le total en dessous. `Search` est le champ seul. |
| `FileDrop` | envoyer un fichier, une image | cadre en pointillés `slate-300`, bleu pendant le glisser-déposer. Un clic ouvre le sélecteur, donc ça marche sur téléphone (comme le dashboard). |
| `FieldValue` | une valeur qu'on lit sans la changer | texte sur un trait en pointillés, comme un champ désactivé du dashboard |

Pas de `<input>`, `<select>` ni `<textarea>` brut dans une page : le lint du kit les refuse hors de `components/ui`.

Dates : une date seule s'écrit avec `Input type="date"` (sélecteur natif, léger sur Android). Une période se choisit avec des pastilles (`SegmentedControl variant="pills"`, 7 j / 30 j / 90 j) et, pour « Personnalisée », deux `Input type="date"`. Le dashboard a son propre calendrier en popover. Le kit garde le sélecteur natif, plus léger dans l'iframe.

## Données

| Composant | Quand | À savoir |
| --- | --- | --- |
| `DataTable` | toute liste d'objets | carte blanche, en-tête `bg-slate-50`, lignes en pointillé, survol `bg-slate-50`. Props : `toolbar`, `empty` (un `EmptyState`), `footer` (une `Pagination`), `mobileCard` (une carte par ligne sous `md`), `sort` + colonnes `sortable` (flèches, tri dans l'URL), `hideOnMobile`, `align: "right"` pour les montants. |
| `Pagination` | sous une liste | premières, précédentes, numéros (la page courante encadrée), suivantes, dernières. Liens, page dans l'URL. `aside` : « Affichés : 10 sur 118 » ou le choix 10 / 25 / 50 / 100. |
| `KpiStrip` | 2 à 5 indicateurs en tête de liste ou de fiche | bandeau blanc à filets ; rond d'icône teinté (`orange` = l'orange de la marque, `amber`, `green`, `blue`, `red`, `slate`) ; `delta` en % (caché à 0) ; `hint` dans une infobulle blanche ; `href` pour une cellule cliquable |
| `Card` | un panneau d'une fiche, un bloc d'information | `rounded-md border border-slate-200 bg-white p-4 shadow-sm`, titre `text-sm font-medium`, `action` à droite (« Tout voir ») |
| `Badge` | un statut | `tone` : `neutral`, `brand`, `success`, `warning`, `danger`, `info` ; fond `-100`, texte `-700` ; icône `size-3` facultative |
| `Avatar` | une personne, une boutique | photo ronde, ou initiales vertes (`bg-emerald-100 text-emerald-800`). Nom et `tagline` à droite, ou `hideName`. |

Statuts courants :

| Statut | Ton |
| --- | --- |
| payé, livré, actif, réussi | `success` |
| en attente, partiellement payé, à valider | `warning` |
| annulé, échoué, bloqué, expiré | `danger` |
| expédié, en cours | `info` |
| nouveau, mis en avant | `brand` |
| brouillon, archivé, sans statut | `neutral` |

**Sélection de lignes et actions groupées** (18 listes du dashboard) : ajoute une première colonne avec une `Checkbox` (`aria-label` « Sélectionner »), et une case dans l'en-tête pour tout sélectionner. Tant qu'une ligne est cochée, la barre d'outils montre « 3 sélectionnés » et les actions groupées (`secondary`, ou `danger` pour supprimer, avec `ConfirmDialog`). Cela demande un composant client autour du tableau.

## Navigation dans une page

| Composant | Quand |
| --- | --- |
| `Tabs` | sections d'une fiche, pages d'un groupe : liens (`href`) ; ou onglets dans la page (`onChange`, rôles `tablist`/`tab`) |
| `SegmentedControl variant="pills"` | période, filtre rapide |
| `SegmentedControl variant="segmented"` | mode d'affichage (liste / grille) |
| `Steps` | étapes d'un assistant (configuration, import) |

## Superpositions et retours

| Composant | Quand | À savoir |
| --- | --- | --- |
| `Dialog` | une petite tâche sans quitter la page | `max-w-lg`, bord à bord sur téléphone, `sm:rounded-lg`, fond `bg-slate-700/80`, titre `text-lg font-semibold`. Pas de formulaire long dedans : fais une page. |
| `ConfirmDialog` | avant une action irréversible | remplace `window.confirm()`. Le titre est une question, la description dit la conséquence. Annuler est encadré, et le bouton de confirmation prend la couleur du `tone` (`danger`, `warning`, `info`, `success`) et répète le verbe. Ses boutons gardent la recette de la confirmation du dashboard (`rounded-lg`, `font-medium`, `red-600`) : c'est la seule exception aux recettes de `Button`. Depuis un menu « Plus » : `DropdownMenuItem onSelect={() => setOpen(true)}`, voir [kit/examples/customer-actions.tsx](../kit/examples/customer-actions.tsx). |
| `Sheet` | filtres : toujours `side="right"` (il prend les trois quarts de la largeur sur téléphone) ; `side="bottom"` pour une courte liste de choix sur téléphone | Filtres : un formulaire GET dans le panneau, `HiddenFields` pour garder la recherche et le tri, « Effacer » (lien sans les filtres) et « Appliquer » (envoi). Le bouton affiche le nombre de filtres actifs (« Filtres · 2 »). Voir [kit/examples/list-page.tsx](../kit/examples/list-page.tsx). |
| `Popover` | un petit contenu ancré (aide détaillée, choix rapide) | même look que les menus |
| `DropdownMenu` | « Plus d'actions », actions d'une ligne | icône fine à gauche, `destructive` pour supprimer, séparateur avant les actions dangereuses |
| `Tooltip` | un détail en plus | orange, comme le dashboard (une variante blanche dans `KpiStrip`). Jamais le seul libellé d'une action. `TooltipProvider` va une fois dans le layout racine. |
| `Banner` | message sur toute une page ou section : réglage manquant, limite atteinte, synchro en cours | `info`, `success`, `warning`, `error` ; une action à droite. Son avertissement est orange (comme dans le dashboard), celui des pastilles ambre (`Badge`). |
| toasts | résultat d'une action (`toast.success`, `toast.error`) | `react-toastify`, `<ToastContainer />` sans réglage (en haut à droite, 5 s), police Outfit. Phrases courtes au passé : « Client enregistré ». Un `toastId` évite les doublons. |
| `EmptyState` | liste ou zone vide | rond gris, icône fine, titre `font-medium`, une phrase, **une** action |
| `Skeleton` | zone qui charge | `animate-pulse rounded bg-slate-100`, à la forme du contenu |
| `Spinner` | ligne qui charge | sur un bouton, préfère `loading` |

### Écarts voulus avec le dashboard

| Dashboard | Kit | Pourquoi |
| --- | --- | --- |
| Liste vide : animation Lottie de 300 px | rond gris avec une icône (le style « aucun résultat avec ces filtres » du dashboard) | pas de fichier d'animation à charger dans l'iframe, sur des téléphones lents |
| Chargement : page de chargement plein écran | `Skeleton` à la forme de la page | l'iframe est déjà sous l'en-tête de Genuka : un squelette montre la page plus vite |
| Calendrier en popover pour les dates | `Input type="date"` | sélecteur natif, sans dépendance |
| Violet pour « partiellement payé » | `warning` | pas de violet dans les apps |

## Recettes sans composant

- **Lien dans le texte** : `text-primary hover:underline`. « Tout voir » : `text-xs text-primary hover:underline`.
- **Total sous la recherche** : `rounded-full border border-slate-200 bg-slate-100 px-1.5 text-xs font-medium text-slate-600`.
- **Liste clé-valeur** : `<dl className="grid gap-3 text-sm">`, clé `text-xs text-slate-500`, valeur `text-slate-700`.
- **Petit tableau dans une carte** :
  - en-têtes `py-2 text-left text-xs font-normal text-slate-500` ;
  - lignes `divide-y divide-slate-100` ;
  - cellules `py-2.5` ;
  - colonnes secondaires `hidden md:table-cell`.
- **Référence, code, SKU** : `font-mono text-xs text-slate-700`.
- **Montant** : `tabular-nums`, à droite dans un tableau, via `formatMoney` ([kit/lib/format.ts](../kit/lib/format.ts)).
