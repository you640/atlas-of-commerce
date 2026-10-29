# Architecture
- Keep search transport and response classification in `src/lib/search-company.ts` so search and diagnostics use the same contract.
- Use the VPS API through the Vite proxy for development; published sites require an HTTPS endpoint with CORS because Vite proxies are not deployed.
- Keep demo records opt-in and never substitute them for real search results.