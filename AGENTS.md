# Instructions pour les agents

Boilerplate Next.js des applications Genuka : OAuth Genuka, session en cookies HTTP-only, Prisma, appels à l'Admin API. La documentation du projet est dans [docs/genuka-app.md](docs/genuka-app.md) (en français) et [README.md](README.md).

## Interface

L'app s'affiche **dans** le dashboard Genuka, dans une iframe, à côté de la sidebar de Genuka. Elle doit reprendre le design du dashboard à l'identique, sans sidebar à elle.

- Règles à suivre pour toute interface : [.claude/rules/genuka-design.md](.claude/rules/genuka-design.md).
- Tout le détail est dans la skill [.claude/skills/genuka-design-system/SKILL.md](.claude/skills/genuka-design-system/SKILL.md) : tokens exacts, gabarits de pages, responsive, textes, checklist de relecture.
- Le kit de composants prêt à copier, avec son installation, est dans [.claude/skills/genuka-design-system/kit/README.md](.claude/skills/genuka-design-system/kit/README.md).
