# Relecture d'une interface avant la PR

Passe chaque point. Un « non » se corrige avant d'ouvrir la PR.

## Intégration dans Genuka

- [ ] Aucune sidebar.
- [ ] Aucun logo ni nom d'app en en-tête, sauf la ligne `brand` d'`AppNav` en plein écran.
- [ ] Aucun avatar, sélecteur de thème ou de langue dans la barre, aucun pied de page « © Genuka ».
- [ ] La navigation passe par `AppNav` : 6 onglets au plus, Réglages compris, avec des groupes au-delà.
- [ ] Le fond de page est blanc. La page défile dans le document (pas de `h-screen overflow-hidden`), et les pages n'ont ni marge ni largeur maximale propre (sauf `max-w-3xl` des formulaires).

## Tokens

- [ ] Le lint du kit passe (`eslint.genuka-design.mjs`) : pas de gris autre que slate, pas de violet ni de rose, pas de `font-bold`, `text-black` ni `dark:`.
- [ ] L'orange `primary` est le seul accent.
- [ ] Bricolage Grotesque partout, chargée par `next/font`.
- [ ] `font-semibold` seulement sur les titres. Aucun titre au-dessus de `text-xl`.
- [ ] Arrondis et ombres de [tokens.md](tokens.md). Aucune valeur arbitraire (`text-[13px]`, `#ff9900`, `p-[7px]`) qui n'y figure pas.
- [ ] Icônes lucide, aucune étoile. Libellé visible, ou nom accessible pour les seules icônes permises (fermer, « plus », pagination, tri).

## Composants

- [ ] Chaque contrôle est dans un `Field` (libellé visible, erreur reliée). Aucun champ brut dans les pages.
- [ ] Les listes utilisent `DataTable` : `mobileCard`, `empty`, pagination et tri dans l'URL, actions à droite de la barre d'outils.
- [ ] Les actions irréversibles passent par `ConfirmDialog`. Les résultats d'action, par un toast. Aucun `window.confirm`, `alert` ni `prompt`.
- [ ] Les icônes sont passées en éléments (`icon={<Users />}`). Les liens passent par `lib/navigation.ts`.

## Responsive (dans l'iframe)

- [ ] Vérifié à **375, 742 et 958 px** de large : aucun défilement horizontal de la page.
- [ ] Sur téléphone, comme sur une tablette à 742 px :
  - les tableaux deviennent des cartes ;
  - les boutons des barres d'actions passent en pleine largeur ;
  - les champs vont sur une colonne ;
  - la barre de navigation ne montre que les onglets.
- [ ] À 958 px, une mise en page à deux colonnes (`lg`) est encore sur une colonne, et reste lisible.
- [ ] Aucune rangée `sm:flex-row` ne contient un bouton pleine largeur (elle passe en ligne à `md`).
- [ ] Les textes longs sont tronqués ou passent à la ligne sans casser la mise en page.

## Contenu

- [ ] Tous les libellés passent par l'i18n, avec la clé ajoutée dans chaque langue.
- [ ] Montants avec `formatMoney` (« 15 000 FCFA »). Dates avec `formatDate` / `formatDateTime`, avec un fuseau explicite côté serveur.
- [ ] Chaque écran a ses états :
  - chargement : `loading.tsx` en squelette ;
  - vide : `EmptyState` avec une action ;
  - erreur : `error.tsx` ou un message avec « Réessayer » ;
  - 404 : `not-found.tsx`.
- [ ] Les messages d'erreur disent quoi faire.

## Vérification

- [ ] `tsc --noEmit`, le lint et le build passent.
- [ ] Les écrans ont été regardés dans le navigateur, si l'utilisateur l'a demandé. Sinon, ils sont listés comme « non vérifiés visuellement ».
