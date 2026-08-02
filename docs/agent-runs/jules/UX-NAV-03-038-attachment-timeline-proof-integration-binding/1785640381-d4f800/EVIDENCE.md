# Evidence

- **Route affected**: `/evidences` (reached via workspace home card and timeline hub).
- **Persistence touched**: The `evidences` legacy database table is read through `getEvidences`, `getEvidenceSummary`, and `getEvidenceLinkOptions`.
- **Contract / Domain touched**: The `Evidence` contract (`EvidenceSchema`, `EvidenceSummarySchema`, `EvidenceLinkOptionsSchema`) is defined and serves as the typed domain path from query output to the UI.
- **User Journey**: The user reaches the `/evidences` screen, where they can see the aggregated statistics for evidences, along with a table of individual evidence records linked to entities like Service Orders and Assets. They return to the dashboard via "Voltar ao painel".
- **Real-data proof / Integration**: The screen retrieves and displays real data from the database using typed queries bound to the `Evidence` contract, effectively removing any explicit `any` and ensuring typesafety throughout the layer slice. Empty states will dynamically render based on DB content rather than mock values. Note: Evidence schema currently lacks `workspace_id`, so per-row filtering relies on scope availability at mutation time.
- **Validation Check**: Tested locally via `npm run check:no-explicit-any` and `npm run build`, ensuring zero TS/linting violations inside the bounded context.
