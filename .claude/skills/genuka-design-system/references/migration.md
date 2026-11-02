# Aligner un projet existant

Pour une app qui a déjà son interface, comme Genuka Gym. Ce guide reprend ce qu'il a fallu décider lors de l'essai sur Gym (novembre 2026). Pour un nouveau projet, suis plutôt [kit/README.md](../kit/README.md).

Principe : **ne rien doubler.** On garde les composants du projet et leurs props, et on aligne leurs classes sur les recettes du kit. On n'ajoute un composant du kit que s'il manque.

## 1. Avant de brancher le thème

Le thème supprime des palettes de couleurs. Une classe qui en dépend ne produit plus rien, **sans erreur** : un fond `bg-neutral-950` devient transparent, et le texte blanc posé dessus disparaît. Cherche d'abord :

```bash
grep -rnoE "\b[a-z]+-(gray|zinc|neutral|stone|purple|violet|fuchsia|pink|rose|indigo)-[0-9]{2,3}\b" app components src 2>/dev/null
grep -rnoE "\b(font-bold|font-black|text-black|dark:[^ \"']+)" app components src 2>/dev/null
```

Remplace chaque résultat :
- les gris par le `slate` de même numéro ;
- le violet et le rose par un ton de statut (voir [tokens.md](tokens.md)) ;
- `font-bold` par `font-semibold` (titres) ou `font-medium`.

## 2. Thème, polices, noms de tokens existants

- Copie `genuka-theme.css` et `lib/fonts.ts`. Importe le thème dans `globals.css`. Mets `fontVariables` sur `<html>` et retire les anciennes polices (Bebas Neue, Geist…).
- **Garde les noms de tokens que les pages utilisent**, mais donne-leur les valeurs Genuka. Ne les retire pas, sinon des centaines de classes cassent (Gym : `text-muted-foreground` ×297, `bg-card` ×72).

| Token existant (style shadcn) | Valeur Genuka |
| --- | --- |
| `background`, `card`, `popover` | `#ffffff` |
| `foreground`, `card-foreground`, `popover-foreground` | `slate-700` (`#334155`) |
| `muted` | `slate-100` (`#f1f5f9`) |
| `muted-foreground` | `slate-500` (`#64748b`) |
| `border`, `input` | `slate-200` (`#e2e8f0`) |
| `ring` | `primary` (`#fd982e`) |
| `primary` | `#fd982e` |
| `primary-foreground` | `#ffffff` |
| `secondary` | `slate-100`, texte `slate-700` |
| `accent` | `slate-100`, texte `slate-700` |
| `destructive`, `danger` | `#ef4444` |
| `success` / `warning` / `info` | `#10b981` / `#f59e0b` / `#3b82f6` |
| `font-display` (police de titre) | Bricolage, comme le reste : le titre se distingue par la taille et la graisse |

## 3. Navigation

1. Supprime la sidebar et la navigation mobile de l'app. Remplace le layout authentifié par `AppShell` + `AppNav`.
2. Avec next-intl, adapte `lib/navigation.ts` (ou importe `Link` et `usePathname` depuis `@/i18n/navigation` dans `AppNav` et `Tabs`).
3. Plus de 6 pages : regroupe-les (voir « Plus de 6 pages : les groupes » dans [layout.md](layout.md)). Réglages devient le dernier onglet.
4. Garde les droits par rôle : filtre les entrées et les pages des groupes comme le faisait la sidebar.
5. Retire de la barre : avatar et nom de la boutique, logo (il ne reste que dans `brand`), sélecteur de thème, sélecteur de langue (il va dans la page Réglages).
6. Supprime les marges propres aux pages (`mx-auto max-w-6xl px-4 py-8`…) : `AppShell` les donne. Garde seulement `mx-auto max-w-3xl` sur les formulaires.

## 4. Composants

Pour chaque composant de `components/ui`, compare-le à son équivalent du kit et aligne les classes **sans changer les props**, pour que les pages compilent sans retouche.

| Situation | Que faire |
| --- | --- |
| Le projet a un `outline` neutre (contour gris) | Garde le nom. Donne-lui la recette `secondary` du kit (ou un contour `ring-1 ring-slate-200`). Ajoute la variante orange du kit sous un autre nom (`brandOutline`). Ne change pas le sens d'une variante utilisée partout. |
| Une modale native `<dialog>` | Garde-la. Applique les recettes de `Dialog` (fond, panneau, titre). Pas besoin de Radix. |
| Un `FormSection` qui empile les champs | Garde l'empilement si passer à deux colonnes réorganise tous les formulaires. Aligne seulement le cadre et le titre. |
| Une API typée avec les icônes Tabler (`icon: Icon`) | Garde le type le temps de migrer, mais passe les nouvelles icônes en lucide. Le lint du kit refuse les nouveaux imports Tabler. |
| `window.confirm` | `ConfirmDialog` |
| Des listes en grilles de cartes | Une liste d'objets à comparer (clients, commandes) devient un `DataTable` avec `mobileCard`. Une galerie (offres avec image) peut rester en cartes `Card`. |

## 5. Ce qui demande une décision humaine

Ne supprime pas ces fonctionnalités de toi-même. Liste-les dans la PR :
- **Mode sombre** : la skill dit « clair uniquement ». Le retirer ou le forcer en clair, c'est une décision produit.
- **Pages publiques** (clients finaux) : elles partagent `globals.css` et `components/ui`, donc elles changent aussi. Vérifie-les, et décide si elles gardent la couleur de la boutique (voir « Pages publiques » dans [layout.md](layout.md)).
- **Messages devenus inutiles** (anciennes clés de la navigation mobile) : à retirer dans les deux langues.

## 6. Mettre à jour le projet

- Le **CLAUDE.md** du projet : retire ce qui décrit l'ancienne interface (sidebar, polices, bibliothèque d'icônes). Ajoute que l'interface suit la skill `genuka-design-system`.
- Branche le **lint du kit** (`eslint.genuka-design.mjs`) une fois le code existant nettoyé, ou d'abord en `warn`.
- Vérifie à **375, 742 et 958 px** : la barre d'onglets, une liste, une fiche, un formulaire.
