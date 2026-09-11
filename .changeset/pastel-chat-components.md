---
'sunkit-ui': minor
---

Add chat and layout components: `Avatar`/`AvatarGroup`, `Separator`, `Kbd`,
`EmptyState`, `ScrollArea`, `Sheet`, `Toast`/`ToastProvider`/`useToast`, and the
`Message` family (`MessageList`, `Message`, `MessageBubble`, `MessageMeta`,
`TypingIndicator`).

Also make components inherit the surrounding font (`font-sans` instead of a
hard-coded system stack) so consumers can supply their own type family, and
export `ButtonVariant` from the package root.

Accessibility fixes: `Button` and clickable shapes now show a visible
`focus-visible` ring; `Dialog` and `Sheet` restore focus to their trigger on
close; toasts carrying an `error` or an `action` stay until dismissed.

Contrast fixes: darken the rose/peach/lemon/mint/sky border tones (now ≥ 4.5:1
on their own fill), and raise the muted/description/placeholder text tokens in
both themes to meet 4.5:1 on their surfaces.

Mobile fixes: inputs and textareas render at 16px on small screens so iOS
Safari no longer zooms the page when a field is focused.
