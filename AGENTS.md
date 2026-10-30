# Architecture
- Keep search transport and response classification in `src/lib/search-company.ts` so search and diagnostics use the same contract.
- Use the VPS API through the Vite proxy for development; published sites require an HTTPS endpoint with CORS because Vite proxies are not deployed.
- Keep demo records opt-in and never substitute them for real search results.
- Configure an external HTTPS API with `VITE_COMPANY_API_BASE_URL`; leave it unset for same-origin development proxying so HTTP upstreams never become browser mixed-content requests.
- Retain complete raw response bodies separately from the 500-character diagnostic snippet so JSON export and fixtures are not truncated.