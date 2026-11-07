/**
 * Site-wide keyboard shortcuts — the one list both the key handler and the
 * help overlay read, so what "?" shows is always what the keys do.
 *
 * Pages use a two-key `g` sequence (GitHub and Gmail style) so single letters
 * stay free and a stray keypress never navigates away.
 */

/** Fired on `window` to open the chat widget without reaching into its state. */
export const OPEN_CHAT_EVENT = "brignano:open-chat";

/** Fired on `window` to open the shortcuts help, e.g. from the footer button. */
export const OPEN_SHORTCUTS_EVENT = "brignano:open-shortcuts";

/** How long after `g` the second key still counts. */
export const SEQUENCE_TIMEOUT_MS = 1500;

export const PAGE_SHORTCUTS = [
  { key: "h", label: "Home", href: "/" },
  { key: "w", label: "Work", href: "/work" },
  { key: "p", label: "Projects", href: "/projects" },
  { key: "b", label: "Blog", href: "/blog" },
  { key: "r", label: "Resume", href: "/resume" },
  { key: "c", label: "Coding", href: "/coding" },
] as const;

export type ShortcutGroup = {
  title: string;
  items: { keys: string[]; label: string }[];
};

export const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: "Go to page",
    items: PAGE_SHORTCUTS.map((p) => ({ keys: ["g", p.key], label: p.label })),
  },
  {
    title: "On this page",
    items: [
      { keys: ["j"], label: "Next section" },
      { keys: ["k"], label: "Previous section" },
      { keys: ["Shift", "G"], label: "Bottom of page" },
      { keys: ["g", "g"], label: "Top of page" },
    ],
  },
  {
    title: "Anywhere",
    items: [
      { keys: ["t"], label: "Toggle light / dark theme" },
      { keys: ["/"], label: "Ask the AI assistant" },
      { keys: ["?"], label: "Show these shortcuts" },
      { keys: ["Esc"], label: "Close this dialog" },
    ],
  },
];
