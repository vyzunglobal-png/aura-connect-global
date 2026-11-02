<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application rules
- Reuse SuspenseReveals and PaidActionSheet for monetization offers; shared presentation prevents duplicate controls and fake unlocks.
- Reuse ReelStudio for every recording entry point; camera lifecycle and private export must remain consistent.
- Use withSponsoredSlots to place ads after every four organic reel entries; do not invent paid impressions or rewarded payouts.
- Route secret delivery through authenticated server-side AI moderation, consent and block checks; direct client inserts are intentionally revoked to prevent bypass.
- Block anonymous senders through an ownership-checked database function that never returns sender identity.
- Keep share links on the current app origin with recipient/referral parameters; never share an unimplemented branded domain.
- Use secretDropLink for recipient URLs and route them through /ask/$username; share destinations must remain functional without a custom domain.
- Reuse MessagesView in the full-screen messages route and chat sheet; never fabricate threads, delivery, calls, matches or campus totals when services are unavailable.
- Keep AI provider helpers server-only and invoke the authenticated companion function with explicit creative context; AI never receives private chat history implicitly.
- Recover deployment-stale route chunks with one session-scoped document refresh per minute; repeated failures must remain visible and manually retryable rather than reload-looping.
