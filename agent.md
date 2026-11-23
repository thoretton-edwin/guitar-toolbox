# agent.md — guitar-toolbox

> Operating manual for contributors and AI agents. **Read §0, use the index, load only the section you need, then stop.** Do not dump this whole file or the whole repo into context for a small task.

**Source of truth:** committed config files (`package.json`, `eslint.config.js`, `.prettierrc`, test/coverage config, `.github/workflows/ci.yml`) win over this document. If you change a config, update the matching line here in the same PR.

---

## 0. Snapshot (read first)

| Item | Convention |
| --- | --- |
| Nature | Pure web client — no backend in this repo |
| Stack | TypeScript + React + React Router |
| Design system | MUI only (`@mui/material`, Emotion). No other UI/CSS framework |
| Tests | TDD mandatory: red → green → refactor |
| Coverage | 100% statements / branches / functions / lines, gated in CI |
| Type safety | `strict` tsconfig + extra flags, type-aware ESLint, `type-coverage --at-least 100` |
| Quality | ESLint + unicorn + sonarjs + Testing Library rules, Prettier, Knip, dependency-cruiser |
| CI | GitHub Actions: required `quality` + `secrets` jobs |
| Branches | `prod` = production, `main` = integration/default |
| Git flow | feature branch → PR into `main` → PR `main` into `prod` |

**Five golden rules**

1. No production code before a failing test.
2. No PR with coverage below 100% or with disabled checks.
3. `npm run check` must pass locally before push — it is the exact CI command.
4. Never commit directly to `main` or `prod`; never force-push them.
5. Prefer fixing code/config over suppressing a rule or a type error.

---

## Index — jump to your task

| Task | Go to |
| --- | --- |
| Start / finish a task, branch, commit, PR | [§1 Git workflow](#1-git-workflow) |
| Implement a feature or fix | [§2 TDD workflow](#2-tdd-workflow-mandatory) |
| Write or repair a test, coverage questions | [§3 Tests & coverage](#3-tests-and-coverage) |
| Naming, lint errors, types, `any`, dead code, cycles | [§4 Lint & static analysis](#4-lint--static-analysis) |
| Format a file, Prettier disagreement | [§5 Formatting — Prettier](#5-formatting--prettier) |
| Build a screen/component | [§6 UI — MUI](#6-ui--mui) |
| Add/change a route | [§7 Routing — React Router](#7-routing--react-router) |
| Why CI failed, what CI enforces | [§8 CI contract](#8-ci-contract) |
| Final checklist before asking for review | [§9 Definition of done](#9-definition-of-done) |
| Where files belong | [§10 Canonical layout](#10-canonical-layout) |
| Keep this document small | [§11 Context hygiene](#11-context-hygiene) |

---

## 1. Git workflow

- Branch from `main` for all work: `feature/<short-name>`, `fix/<short-name>`, `chore/<short-name>`, `docs/<short-name>`.
- Open a PR into `main`. Keep it small and single-purpose. CI must be green before review/merge.
- Promote to production with a PR `main` → `prod` (merge commit, never a force push). Tag releases on `prod` (`vX.Y.Z`).
- Hotfix: branch from `prod` as `hotfix/<short-name>` → PR into `prod` → back-merge/PR into `main` so the fix is not lost.
- No direct commits, no history rewriting, no `continue-on-error` on `main` or `prod`.
- Commits and PR titles use Conventional Commits: `feat:`, `fix:`, `test:`, `refactor:`, `chore:`, `docs:`, `ci:`.
- Local Husky hooks are convenience, not enforcement (CI always repeats them): `pre-commit` = [lint-staged](https://github.com/lint-staged/lint-staged) (ESLint --fix + Prettier on staged files only) + gitleaks `protect --staged`; `commit-msg` = [commitlint](https://commitlint.js.org/guides/local-setup.html) with `@commitlint/config-conventional`.
- `main` and `prod` are protected: require the `quality` and `secrets` checks to pass.

---

## 2. TDD workflow (mandatory)

1. **RED** — write the smallest test that describes the desired behaviour. Use role/name queries, assert observable output, not implementation details.
2. Run that test. Confirm it fails for the expected reason (not a typo or missing import).
3. **GREEN** — write the minimum production code that makes it pass. No speculative features.
4. Check coverage. If it dropped below 100%, add the missing case **before** refactoring.
5. **REFACTOR** — improve structure while tests stay green; re-run `npm run check`.
6. Repeat per behaviour. Tests are written *before* code, including bug fixes: reproduce the bug as a failing test first.

Never add a test after the fact to "tick the coverage box" without first confirming the missing behaviour (that is a new RED step).

---

## 3. Tests and coverage

- Co-locate tests: `foo.tsx` → `foo.test.tsx`. Test naming reads as behaviour: `it('shows an error when the password is too short', ...)`.
- Prefer unit + component tests (React Testing Library). Routing tested with a memory router. Keep tests deterministic: no network, no real timers.
- Thresholds are global and strict: `100 / 100 / 100 / 100` (branches / functions / lines / statements), declared in the test-runner config and enforced by the CI `quality` job.
- Lint the tests too: [eslint-plugin-testing-library](https://testing-library.com/docs/ecosystem-eslint-plugin-testing-library/) (`flat/react` config) + `eslint-plugin-vitest` (or the Jest equivalent). No `container`/`debug`, prefer `findBy*` and `userEvent.setup()`.
- Exclude only generated files, config files and test files from coverage — declare exclusions in config, never inline.
- No `/* istanbul ignore */`, `/* c8 ignore */`, skipped tests, or commented-out tests without explicit justification in the PR description. Never merge a red or skipped test to silence the gate.

---

## 4. Lint & static analysis

- Flat `eslint.config.js`: `@eslint/js` + [typescript-eslint](https://typescript-eslint.io/getting-started/typed-linting/) **typed** configs (`recommendedTypeChecked`, `stylisticTypeChecked`; `strictTypeChecked` when the team is ready) with `parserOptions.projectService: true`, then React, react-hooks, jsx-a11y, unicorn, [sonarjs](https://www.npmjs.com/package/eslint-plugin-sonarjs) (v4+), and Prettier **last** (disables style conflicts).
- Keep these typed rules on: `no-floating-promises`, `no-misused-promises`, `no-unsafe-*`, `restrict-template-expressions`, `switch-exhaustiveness-check`. Unicorn handles naming/modern APIs; sonarjs handles bug patterns and cognitive complexity.
- [`tsconfig`](https://www.typescriptlang.org/tsconfig): `strict: true` plus `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`, `noImplicitOverride`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`.
- [`type-coverage --at-least 100`](https://github.com/plantain-00/type-coverage) is a gate alongside test coverage: no new `any`. Use `unknown` + narrowing; no `!` assertions, `@ts-ignore` or `@ts-expect-error` without fixing the type first.
- **File names are kebab-case** (`guitar-fretboard.tsx`, `use-tuner.ts`); exported components/hooks are PascalCase / `useCamelCase`. This resolves unicorn's `filename-case` rule — do not mix conventions.
- Named exports by default; descriptive names, no `forEach` for transformation, no magic numbers without a named constant.
- [Knip](https://knip.dev): no unused files, exports or (ghost) dependencies; fix findings top-down (files → exports → dependencies), ignore only with a reason in the PR.
- [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) (or `eslint-plugin-boundaries` if layer policies are needed — pick one): no cycles, no orphans, `features/*` never imports another feature.
- No inline rule suppression (`eslint-disable`, `prettier-ignore`) unless unavoidable; when used, add a reason comment and mention it in the PR. Fix the root cause; never weaken a rule to make a PR pass.

---

## 5. Formatting — Prettier

- One root config: `.prettierrc.json` (+ `.prettierignore`). Never add per-file or editor-only overrides that conflict with it.
- `npm run format` writes; `npm run format:check` only checks and runs in CI. Never hand-format against Prettier.
- Do not reformat unrelated files in a PR ("formatter churn"). If a file was already unformatted, call it out and handle it as a separate `chore:` commit.

---

## 6. UI — MUI

- The theme (palette, typography, spacing, component defaults) lives in one module. Consume it via `useTheme` / `sx`; do not redefine tokens in components.
- Styling with `sx` or `styled()`. No inline `style` except genuinely dynamic values, no CSS modules, no Tailwind, no second component library.
- Compose small components; keep props typed and narrow. Accessibility is part of "done": labels, roles, keyboard focus, visible focus rings, contrast.
- Query by role/label in tests (`getByRole`, `getByLabelText`); use `data-testid` only when no accessible query exists.

---

## 7. Routing — React Router

- One router definition (routes as data where possible) at the app boundary; feature components never own route paths.
- Nested layouts use `<Outlet />`. Non-entry routes are lazy-loaded; always include a 404/not-found route.
- Guards are wrapper components around routes, not ad-hoc checks inside screens.
- Tests render through a memory router at the route under test.
- Keep paths in one typed constants module so links and tests cannot drift.

---

## 8. CI contract

`.github/workflows/ci.yml` runs on PRs to `main` and `prod`, and on pushes to both.

- Two required jobs: `quality` → checkout → setup Node (cache) → `npm ci` → `npm run check`; `secrets` → [gitleaks action](https://github.com/gitleaks/gitleaks) with `fetch-depth: 0` (full history).
- `npm run check` is the **same command locally and in CI**; it chains: `typecheck` → `type:coverage` → `lint` → `format:check` → `knip` → `deps:check` → `test:coverage` → `build`.
- Any failure fails the job, including a coverage or type-coverage drop, a cycle or a leaked secret. The PR is not mergeable while red. No skip flags, no manual "override".
- Define these scripts in `package.json` and use them exclusively: `dev`, `build`, `test`, `test:coverage`, `lint`, `format`, `format:check`, `typecheck`, `type:coverage`, `knip`, `deps:check`, `check`. Do not replace them with ad-hoc `npx` invocations.
- Optional extras (`cspell`, `size-limit`) stay out of the required gate until explicitly adopted; if enabled, they follow the same "local command == CI command" rule.

---

## 9. Definition of done

- [ ] Failing test written first, then minimal implementation, then refactor (§2).
- [ ] Tests co-located, behaviour-named, deterministic (§3).
- [ ] Test coverage 100% and type coverage 100% — no exclusions or skips added silently.
- [ ] No cycles, orphan files, unused exports/deps; no new `any` (§4).
- [ ] `npm run check` passes locally (types, lint, format, dead code, deps, tests, build).
- [ ] MUI + theme only; route changes go through the central router (§6–§7).
- [ ] Conventional Commit message/PR title; branch off `main`, PR into `main` (§1).
- [ ] Config or convention changes updated in this file in the same PR.

---

## 10. Canonical layout

Target structure as the scaffold is created; keep it flat and predictable.

```text
src/
  app/            # app shell, theme, router, providers
  components/     # shared presentational components
  features/       # feature folders (component + test + hooks)
  routes/         # screen-level components
  lib/            # pure helpers, typed utilities
  types/          # shared types
.github/workflows/ci.yml
eslint.config.js  .prettierrc.json  .prettierignore
tsconfig.json  knip.json  .dependency-cruiser.js  commitlint.config.js
.husky/  .gitleaks.toml  package.json  <test config>
```

Do not create a new top-level folder without adding it here.

---

## 11. Context hygiene

- For an AI task: load §0 + the index, then **only** the relevant section and the specific files you will touch. Do not re-read this file on every step.
- Read the canonical config for the exact rule values instead of guessing from this summary.
- Keep this file under ~220 lines. Long rationale goes into `docs/adr/` and is linked from the relevant section — never pasted here.
- If a section becomes stale, fix it in the same PR that changed the practice; do not accumulate exceptions.
