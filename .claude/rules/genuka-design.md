# Interface : la direction artistique du dashboard Genuka

Cette app s'affiche dans le dashboard Genuka, dans une iframe, à côté de la sidebar de Genuka et sous le nom de l'app. Elle reprend le design du dashboard **à l'identique**.

Pour toute interface, charge la skill `genuka-design-system`. Elle contient le kit de composants, les tokens exacts, les gabarits de pages, le guide de migration et la checklist de relecture.

Règles toujours valables :

- **Pas de sidebar ni d'en-tête d'app.** Genuka affiche déjà sa navigation, ainsi que le logo, le nom et le Menu de l'app.
  - L'app navigue avec `AppNav` : des onglets soulignés en haut, 6 au plus, Réglages compris. Au-delà, on regroupe les pages.
  - Sur téléphone, la barre ne contient que les onglets.
  - Pas d'avatar, de sélecteur de thème, de langue ou de boutique, ni de pied de page « © Genuka ».
- **Couleurs** :
  - un seul accent, `primary` (#FD982E) ;
  - les neutres en `slate` uniquement ;
  - les statuts en teintes douces (`bg-green-100 text-green-700`…).
  - Pas de violet, de rose, de dégradé, de `gray`, de `zinc` ni de `text-black`. Pas de mode sombre ni de variante `dark:`.
  - Le fond de page est blanc.
- **Police** : Bricolage Grotesque pour tout le texte, chargée avec `next/font`.
  - `font-medium` au plus dans le contenu ; `font-semibold` seulement pour les titres. Le `h1` de la page est en `text-base md:text-xl`.
  - Aucun titre plus grand que `text-xl`.
- **Formes** : `rounded-md` ou `rounded-lg`, `rounded-full` pour les pastilles et les avatars. Cartes en `border border-slate-200 bg-white shadow-sm p-4`.
- **Composants** : ceux du kit (`components/ui`, `components/layout`).
  - Chaque contrôle va dans un `Field` avec un libellé visible. Pas de champ brut dans une page.
  - Pas de `window.confirm` ni d'`alert` : on utilise `ConfirmDialog` et les toasts.
  - Les icônes se passent en élément (`icon={<Users />}`). Les liens passent par `lib/navigation.ts`.
- **Listes** : `DataTable`, avec les actions (Filtres, Nouveau) à droite de la barre d'outils, une carte par ligne sur téléphone, et la page, le tri et la recherche dans l'URL.
- **Icônes** : lucide-react uniquement, `size-4` par défaut, pas d'étoile, toujours avec un libellé visible.
- **Responsive** : téléphone d'abord. La largeur qui compte est celle de l'iframe :
  - une tablette donne 742 px, donc la mise en page mobile ;
  - un portable de 1280 px donne 958 px, donc `md` et pas `lg`.
  - Vérifie à 375, 742 et 958 px. La page ne doit jamais défiler sur le côté.
- **Textes** :
  - tous via l'i18n (next-intl), avec chaque clé dans toutes les langues ;
  - phrases courtes, au vouvoiement ;
  - montants avec le symbole après le nombre (« 15 000 FCFA », `formatMoney`) ;
  - dates comme le dashboard (`formatDateTime`).
- **Valeurs** : aucune couleur, taille ni espacement inventé. Tout vient des tokens de la skill. Le lint `eslint.genuka-design.mjs` refuse les écarts les plus courants.
