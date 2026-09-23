# Local intent search

AI Dive Deep keeps its public search catalog and ranking deterministic. The local operator command can prepare a bounded candidate set for the installed Jev search helper when a query benefits from an intent check:

~~~sh
node scripts/jev-search.mjs --query "permissions sandbox"
node scripts/jev-search.mjs --mock --query "permissions sandbox"
~~~

The default is inspect: it validates the packet through the installed shared CLI without a provider request. Mock mode exercises the same packet offline and always abstains. A provider request is possible only when the operator explicitly supplies both flags:

~~~sh
node scripts/jev-search.mjs --live --consent --query "permissions sandbox"
~~~

The repository tests inject a fixed child and do not require a private skill installation. On an approved local workstation, run the installed-entrypoint acceptance explicitly with:

~~~sh
JEV_SEARCH_INSTALLED_ACCEPTANCE=1 node --test tests/jev-search.test.mjs
~~~

The process-managed TYPESAFE_API_KEY stays in the trusted child environment. It is never placed in arguments, the packet, or output. The default child entrypoint is ~/.codex/skills/jev-review/scripts/search-cli.mjs; an operator can pass an approved alternate path with --cli /absolute/path/search-cli.mjs.

The command ranks the existing public catalog locally, sends at most twelve candidates with exactly id, title, and summary, and resolves a returned ID through the local candidate map only for a consented live response whose reported mode matches the request. Candidate IDs are opaque positional tokens; the provider never receives or controls an href. Inspect and mock selections, mode mismatches, empty and unknown queries, unavailable CLI results, unknown IDs, and abstentions produce no href. Child output and execution time are bounded.

The authored query fixtures compare each deterministic top result with candidate recall. The offline Jev mock report is intentionally N/A; it is a transport and abstention check, not an accuracy claim.
