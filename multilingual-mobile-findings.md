# Multilingual mobile QA findings

The RU, UZ, and EN language switch was tested across 11 public routes at 375px and 390px: 66 of 66 combinations passed. Each route reported the expected `document.documentElement.lang`, had visible translated text, no blank visible `data-i18n` elements, no horizontal overflow, and no title outside the viewport.

About Us captures at 390px also passed in all three languages. The title remained inside the content column at x=31 and right=359, with viewport scroll width equal to 390px. After copy optimization, the About description lengths were RU 138 characters, UZ 159 characters, and EN 139 characters. The shortened copy preserves the core message while reducing long-page density on mobile.

A real mobile drawer interaction test at 390px clicked UZ, then RU, then EN. Each click updated the document language and About title correctly, while scroll width remained exactly 390px.

The same click-based sequence was then run on representative Home, About, and Contact pages: 9 of 9 language changes passed, with the expected language, visible body content, and no horizontal overflow on every page.

The all-route harness was corrected to use the proper query separator for routes with and without existing parameters. Its blank-translation check now validates input and textarea placeholders instead of their intentionally empty textContent. The corrected run passed 66 of 66 route/language/width combinations.

## EN mobile switch regression note

The reported phone-specific EN failure was not reproducible in the current preview: starting from UZ, a real mobile drawer click changed `document.documentElement.lang` and `localStorage.fyzen_lang` to `en`, updated the About title, and produced no browser errors. To harden the flow against the suspected conditions, mobile language buttons now expose `type="button"` and `data-lang`, while `lang.js` uses a delegated capture-phase handler that prevents overlay/form interference and calls the validated language update directly. The targeted Vitest guardrail checks these markers; the 18-click representative test passed across Home, About, and Contact at 375px and 390px, including the EN step.
