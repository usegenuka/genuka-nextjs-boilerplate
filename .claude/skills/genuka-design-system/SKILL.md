---
name: genuka-design-system
description: Direction artistique du dashboard Genuka pour les apps Genuka (Next.js + Tailwind CSS v4) affichées dans l'iframe du dashboard. Tokens exacts (orange #FD982E, slate, Bricolage Grotesque, valeurs Tailwind v3 du dashboard), kit de composants prêt à copier (boutons, champs, téléphone, sélection multiple, tableaux triables, indicateurs, onglets, dialogues, bandeaux, étapes), mise en page sans sidebar avec une barre d'onglets en haut, responsive dans l'iframe, langues, montants et dates, pages d'erreur, lint du design, guide de migration d'un projet existant. À utiliser pour créer ou modifier une page, un composant, un formulaire, une liste, une modale, la navigation ou le style d'une app Genuka, et pour relire une interface avant une PR.
paths:
  - "app/**/*.tsx"
  - "components/**/*.tsx"
  - "src/**/*.tsx"
  - "**/*.css"
---

# Design system Genuka pour les apps

Une app Genuka s'ouvre **dans** le dashboard Genuka : dans une iframe, à côté de la sidebar de Genuka et sous le nom de l'app. Le marchand doit avoir l'impression de rester dans Genuka. L'app reprend donc la direction artistique du dashboard **à l'identique** : mêmes couleurs, même police, mêmes composants, et surtout aucune deuxième navigation latérale.

Tout ce qui suit vient du dashboard Genuka : son code, ses principes produit et le design system unifié de l'équipe. Les valeurs ont été relevées et comptées le 2 novembre 2026. La skill a été relue contre ce code, puis essayée sur Genuka Gym.

## Les règles qui ne se discutent pas

1. **Pas de sidebar.** Genuka affiche déjà la sienne, ainsi que le logo, le nom et le Menu de l'app au-dessus de l'iframe.
   - L'app navigue avec `AppNav`, des onglets soulignés en haut : 6 au plus, Réglages compris, avec des groupes au-delà.
   - Sur téléphone, la barre ne contient que les onglets.
   - Pas de logo, d'avatar, de sélecteur de thème, de langue ou de boutique, ni de pied de page.
2. **Un seul accent, l'orange `primary` (#FD982E). Les neutres sont en `slate`.** Pas de violet, de rose, de dégradé, de `gray` ni de `text-black`. Pas de mode sombre. Le thème du kit supprime ces couleurs et remet les valeurs Tailwind v3 du dashboard.
3. **Bricolage Grotesque pour tout le texte**, via `next/font`. `font-medium` au plus dans le contenu ; `font-semibold` seulement pour les titres. Aucun titre au-dessus de `text-xl`.
4. **Formes sobres** : `rounded-md`/`rounded-lg`, une bordure `slate-200` et `shadow-sm` sur les cartes, du blanc partout.
5. **Composants du kit uniquement.**
   - Chaque contrôle va dans un `Field`, une liste dans un `DataTable`, une confirmation dans un `ConfirmDialog`, un résultat d'action dans un toast.
   - Pas de champ brut, pas de `window.confirm`.
   - Le lint du kit (`eslint.genuka-design.mjs`) le vérifie.
6. **Téléphone d'abord.** La largeur qui compte est celle de l'iframe : une tablette donne 742 px (mise en page mobile), un portable de 1280 px donne 958 px (`md`, pas `lg`). Vérifie à 375, 742 et 958 px. Aucun défilement horizontal de la page.
7. **lucide-react seulement**, aucune icône étoile, toujours un libellé visible.
8. **Textes** : tous via l'i18n (next-intl). Montants avec le symbole après le nombre (« 15 000 FCFA »). Dates comme le dashboard (« Aujourd'hui à 14:30 »).

## Démarrer

Le dossier [kit/](kit/) contient :
- le thème Tailwind v4, les polices et le lint du design ;
- une quarantaine de composants ;
- des pages modèles : liste, fiche, formulaire, chargement, erreur, 404, session expirée, vitrine.

Le kit a été vérifié avec Next 16 : types, lint, build de production, rendu dans une iframe.

- **Nouveau projet** (tiré du boilerplate) : suis [kit/README.md](kit/README.md). Il donne les dépendances, les fichiers à copier, le thème, les polices, le lint et la coque `app/(app)/layout.tsx`.
- **Projet qui a déjà son interface** (comme Genuka Gym) : suis [references/migration.md](references/migration.md). On n'y double rien, on aligne. Ce guide donne la recherche des couleurs supprimées, la table des anciens tokens, le passage de la sidebar aux onglets, et les décisions à faire valider.

Vérifie toujours ce qui existe (`components/ui`, `components/layout`, `app/globals.css`, `lib/navigation.ts`) avant de copier.

## Façon de travailler

1. **Choisir le gabarit** : liste, fiche, formulaire, réglages, assistant ou page publique ([references/layout.md](references/layout.md)). Pars de la page modèle de `kit/examples/`.
2. **Composer avec le kit** : la table ci-dessous dit quel composant prendre pour quel besoin. Le détail est dans [references/components.md](references/components.md).
3. **N'inventer aucune valeur.** Couleur, taille, graisse, arrondi, ombre et espacement viennent de [references/tokens.md](references/tokens.md). S'il manque un composant, construis-le avec ces recettes et range-le dans `components/ui`.
4. **Écrire les textes et les états** : chargement, vide, erreur, succès ; libellés i18n ; montants et dates formatés ([references/patterns.md](references/patterns.md)).
5. **Vérifier** :
   - `tsc --noEmit`, le lint (avec celui du design) et le build ;
   - si l'utilisateur le demande, regarde l'écran à 375, 742 et 958 px. Sinon, dis clairement ce qui n'a pas été vu ;
   - passe la [checklist](references/checklist.md) avant la PR.

## Quel composant pour quel besoin

| Besoin | Composant |
| --- | --- |
| Naviguer entre les pages | `AppNav` dans `AppShell` (`app/(app)/layout.tsx`), `match` pour un groupe |
| Pages d'un groupe | `Tabs` avec `href`, dans le layout du groupe |
| Titre, description, retour, actions d'une fiche | `PageHeader` |
| Boutons d'un formulaire | `PageFooterActions` |
| Une action | `Button` : `primary` (une par zone), `secondary`, `outline`, `ghost`, `ghostPrimary`, `danger`, `ghostDanger`, `link` |
| Un champ | `Field` avec `Input`, `Textarea`, `Select`, `MultiSelect`, `PhoneInput`, `Checkbox`, `RadioGroup`, `Switch` ou `FileDrop` |
| Une valeur en lecture seule | `FieldValue` |
| Grouper des champs | `FormSection`, avec `AdvancedOptions` pour les réglages rares |
| Une liste d'objets | `DataTable` (`toolbar` avec `SearchForm` et total, Filtres, Nouveau ; `mobileCard` ; `sort` ; `empty` ; `Pagination`), liens construits avec `hrefWith` (`lib/url.ts`) |
| Des chiffres clés | `KpiStrip` |
| Un bloc d'information | `Card` |
| Un statut | `Badge` (`success`, `warning`, `danger`, `info`, `brand`, `neutral`) |
| Une personne | `Avatar` |
| Une période, un mode d'affichage | `SegmentedControl` (`pills` ou `segmented`) |
| Les étapes d'un assistant | `Steps` |
| Une petite tâche sans quitter la page | `Dialog` |
| Confirmer une action irréversible | `ConfirmDialog` (depuis un menu : `onSelect`, voir `examples/customer-actions.tsx`) |
| Des filtres | `Sheet` à droite avec un formulaire GET (`HiddenFields`, Effacer, Appliquer) |
| Plus d'actions | `DropdownMenu` |
| Un petit contenu ancré | `Popover` |
| Un message sur la page | `Banner` |
| Le résultat d'une action | `toast.success` / `toast.error` |
| Rien à afficher | `EmptyState` |
| Chargement | `loading.tsx` en `Skeleton`, ou `loading` sur le bouton |
| 404, erreur, session expirée | `StatusPage` |
| Montant, nombre, date | `formatMoney`, `formatNumber`, `formatDate`, `formatDateTime` (`lib/format.ts`) |

## Références

- [references/tokens.md](references/tokens.md) : couleurs, écarts entre Tailwind v3 et v4, typographie, formes, ombres, espacements, icônes, mouvement, graphiques.
- [references/layout.md](references/layout.md) : ce que Genuka affiche autour de l'iframe, la coque, les groupes d'onglets, l'anatomie des pages, le responsive, les pages publiques.
- [references/components.md](references/components.md) : chaque composant du kit, ses variantes, sa correspondance dans le dashboard, et les écarts voulus.
- [references/patterns.md](references/patterns.md) : les utilisateurs, les gabarits, les états, les langues, les textes, l'accessibilité, la performance.
- [references/migration.md](references/migration.md) : aligner un projet existant.
- [references/checklist.md](references/checklist.md) : la relecture avant la PR.
- [kit/README.md](kit/README.md) : l'installation du kit.
