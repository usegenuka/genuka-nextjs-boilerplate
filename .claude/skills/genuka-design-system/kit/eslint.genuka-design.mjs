// The Genuka design rules as lint errors, so they hold even when nobody re-reads the skill.
// In eslint.config.mjs:
//   import genukaDesign from "./eslint.genuka-design.mjs";
//   export default defineConfig([...nextVitals, ...nextTs, ...genukaDesign, globalIgnores([...])]);

// Classes the dashboard does not use: bold weights, pure black, dark mode, greys other than slate, purple and pink,
// big radii, titles above text-xl, gradients. No "/" in the pattern: ESLint's selector parser would end the regex there.
const FORBIDDEN_CLASS =
  /(^|[\s:])(font-bold|font-extrabold|font-black|text-black|dark:[^\s"'`]+|[a-z]+-(gray|zinc|neutral|stone|purple|violet|fuchsia|pink|rose|indigo)-\d{2,3}|rounded(-[trbl]{1,2})?-[23]xl|text-[2-9]xl|bg-(gradient|linear|radial|conic)-[^\s"'`]+)(?=[\s"'`]|$)/;

const CLASS_MESSAGE =
  "Hors design Genuka : font-medium au plus (semibold pour les titres), slate pour les gris, pas de violet ni de rose, pas de dark:, pas de rounded-2xl, pas de titre au-dessus de text-xl, pas de dégradé. Voir .claude/skills/genuka-design-system/references/tokens.md.";

const genukaDesign = [
  {
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "src/**/*.{ts,tsx}"],
    // The kit's own controls wrap the native elements.
    ignores: ["components/ui/**", "src/components/ui/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXOpeningElement[name.name=/^(input|select|textarea)$/]",
          message: "Pas de champ brut : utilisez Field avec Input, Select, Textarea, Checkbox, RadioGroup ou PhoneInput du kit.",
        },
        { selector: `Literal[value=${FORBIDDEN_CLASS}]`, message: CLASS_MESSAGE },
        { selector: `TemplateElement[value.raw=${FORBIDDEN_CLASS}]`, message: CLASS_MESSAGE },
      ],
      "no-restricted-globals": [
        "error",
        { name: "confirm", message: "Utilisez ConfirmDialog." },
        { name: "alert", message: "Utilisez un toast (react-toastify)." },
        { name: "prompt", message: "Utilisez un Dialog avec un Field." },
      ],
      "no-restricted-properties": [
        "error",
        { object: "window", property: "confirm", message: "Utilisez ConfirmDialog." },
        { object: "window", property: "alert", message: "Utilisez un toast (react-toastify)." },
        { object: "window", property: "prompt", message: "Utilisez un Dialog avec un Field." },
      ],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "lucide-react",
              importNames: ["Star", "StarIcon", "StarHalf", "StarOff", "Stars", "Sparkles"],
              message: "Pas d'icône étoile dans Genuka.",
            },
            { name: "@tabler/icons-react", message: "Icônes : lucide-react uniquement." },
            { name: "@heroicons/react", message: "Icônes : lucide-react uniquement." },
          ],
          patterns: [{ group: ["react-icons", "react-icons/*"], message: "Icônes : lucide-react uniquement." }],
        },
      ],
    },
  },
];

export default genukaDesign;
