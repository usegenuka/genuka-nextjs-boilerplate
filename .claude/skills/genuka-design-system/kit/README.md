# Kit Genuka : installation

Composants React + Tailwind CSS v4 qui reproduisent le dashboard Genuka. Ils ont été vérifiés avec React 19.2, d'une part avec Next.js 16.1 et Tailwind CSS 4.1 (les versions du boilerplate), d'autre part avec Next.js 16.4 et Tailwind CSS 4.3. La vérification couvre les types, le lint, le build de production, et le rendu dans une iframe à 375 et 958 px.

Les chemins ci-dessous suivent la structure du boilerplate : `app/`, `components/` et `lib/` à la racine, alias `@/*` → `./*`. Dans un projet en `src/`, préfixe-les par `src/`. Pour un projet qui a déjà son interface, lis d'abord [../references/migration.md](../references/migration.md).

## 1. Dépendances

Installe les versions vérifiées. lucide-react 1.x a renommé des icônes : ne prends pas la dernière sans vérifier.

```bash
bun add class-variance-authority@0.7.1 clsx@2.1.1 tailwind-merge@3.7.0 lucide-react@0.563.0 \
  @radix-ui/react-slot@1.5.0 @radix-ui/react-dialog@1.3.1 @radix-ui/react-dropdown-menu@2.2.1 \
  @radix-ui/react-popover@1.3.1 @radix-ui/react-tooltip@1.4.1 \
  react-toastify@11.2.0 react-international-phone@4.8.0 tw-animate-css@1.4.0
```

Versions :

| Paquet | Version |
| --- | --- |
| `class-variance-authority` | 0.7.1 |
| `clsx` | 2.1.1 |
| `tailwind-merge` | 3.7.0 |
| `lucide-react` | 0.563.0 |
| `@radix-ui/react-slot` | 1.5.0 |
| `@radix-ui/react-dialog` | 1.3.1 |
| `@radix-ui/react-dropdown-menu` | 2.2.1 |
| `@radix-ui/react-popover` | 1.3.1 |
| `@radix-ui/react-tooltip` | 1.4.1 |
| `react-toastify` | 11.2.0 |
| `react-international-phone` | 4.8.0 |
| `tw-animate-css` | 1.4.0 |

## 2. Retirer les restes du boilerplate

Le boilerplate contient encore l'interface du scanner de billets de MboaTickets, d'où il vient. Elle ne suit pas le design Genuka, et le lint du design la refuse. Supprime-la :
- `components/qr-scanner.tsx`, `scanner-app.tsx`, `ticket-sheet.tsx`, `tickets-list.tsx` et `sw-register.tsx` ;
- `app/page.tsx` (la page d'accueil de l'app viendra du groupe `(app)`) ;
- dans `app/layout.tsx`, `SwRegister`, `manifest` et `appleWebApp` des métadonnées, et la `themeColor` sombre.

Garde `lib/db.ts`, `lib/sync.ts` et `lib/qr.ts` seulement si l'app travaille hors ligne. Garde aussi `public/sw.js` : c'est un service worker qui se désinstalle tout seul.

## 3. Copier les fichiers

```bash
KIT=.claude/skills/genuka-design-system/kit
mkdir -p components/ui components/layout lib
cp -n $KIT/components/ui/*.tsx components/ui/
cp -n $KIT/components/layout/*.tsx components/layout/
cp -n $KIT/lib/* lib/
cp -n $KIT/app/genuka-theme.css app/
cp -n $KIT/eslint.genuka-design.mjs .
```

`cp -n` n'écrase rien. Si le projet a déjà un composant du même nom, aligne ses classes sur celles du kit au lieu d'avoir deux versions.

`lib/navigation.ts` fournit les liens à tout le kit. Avec next-intl (langue dans l'URL), remplace son contenu par :

```ts
export { Link, usePathname } from "@/i18n/navigation";
```

## 4. Thème, polices, infobulles, toasts

`app/globals.css` :

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "./genuka-theme.css";
```

Retire les anciennes variables de thème qui ne servent plus (`--font-geist-*`…) et le fond sombre. Avant de brancher le thème, cherche les classes de couleurs qu'il supprime : voir l'étape 1 de [migration.md](../references/migration.md).

`app/layout.tsx` :

```tsx
import { ToastContainer } from "react-toastify";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getAuthenticatedCompany } from "@/lib/auth";
import { fontVariables } from "@/lib/fonts";
import { AuthProvider } from "@/stores";
import "./globals.css";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const company = await getAuthenticatedCompany();
  return (
    <html lang="fr" className={fontVariables}>
      <body>
        <AuthProvider company={company}>
          <TooltipProvider>{children}</TooltipProvider>
        </AuthProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
```

`AuthProvider` et `getAuthenticatedCompany` viennent du boilerplate : garde-les.

Retire les autres polices (Geist…) et la `themeColor` sombre du `viewport`. Si le projet utilise `next-themes`, force le clair (`forcedTheme="light"`).

## 5. Le lint du design

`eslint.config.mjs` :

```js
import genukaDesign from "./eslint.genuka-design.mjs";

export default defineConfig([...nextVitals, ...nextTs, ...genukaDesign, globalIgnores([/* … */])]);
```

Hors de `components/ui`, il refuse :
- les champs bruts ;
- `font-bold`, `text-black`, `dark:`, les gris autres que slate, le violet et le rose ;
- `rounded-2xl`/`3xl`, les titres au-dessus de `text-xl`, les dégradés ;
- `window.confirm`, `alert` et `prompt` ;
- les icônes étoile, et les icônes qui ne viennent pas de lucide.

## 6. Les pages

| Fichier du kit | À copier en |
| --- | --- |
| [examples/layout.tsx](examples/layout.tsx) | `app/(app)/layout.tsx` (remplace les entrées de `NAV`) |
| [examples/list-page.tsx](examples/list-page.tsx) | modèle de liste |
| [examples/detail-page.tsx](examples/detail-page.tsx) et [examples/customer-actions.tsx](examples/customer-actions.tsx) | modèle de fiche, avec le menu « Plus » et la suppression confirmée (dans le même dossier que la page) |
| [examples/form-page.tsx](examples/form-page.tsx) | modèle de formulaire |
| [examples/loading.tsx](examples/loading.tsx) | `loading.tsx` d'une liste |
| [examples/error.tsx](examples/error.tsx) | `app/(app)/error.tsx` |
| [examples/not-found.tsx](examples/not-found.tsx) | `app/not-found.tsx` |
| [examples/unauthorized-page.tsx](examples/unauthorized-page.tsx) | `app/unauthorized/page.tsx` (remplace la page du boilerplate) |
| [examples/showcase-page.tsx](examples/showcase-page.tsx) | `app/(app)/design-system/page.tsx` : tous les composants sur une page, à comparer au dashboard |

## 7. Vérifier

```bash
bunx tsc --noEmit && bun run lint && bun run build
```

Ouvre ensuite l'app dans Genuka (Applications installées) et regarde-la à 375, 742 et 958 px de large.
