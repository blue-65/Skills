export const skills = [
  {
    category: "common",
    name: "route-office-task",
    title: "Route an Office task",
    short: "Route work to the right Office artifact",
    description: "Route Microsoft Office work to Word, PowerPoint, Excel, or a deliberate multi-file package. Use when the requested output format is unclear, multiple Office formats are mentioned, or a source set must be split by communication job.",
    outcome: "Choose one primary editable artifact and a minimal supporting package whose formats match how the audience will read, decide, present, or calculate.",
    steps: [
      "State the audience, decision, action, and delivery setting in one sentence.",
      "Inspect every supplied file and identify which format currently owns each fact, calculation, and visual.",
      "Choose Word for narrative retention, PowerPoint for live decision communication, and Excel for calculations and structured updates.",
      "Assign one source of truth to repeated facts and metrics before creating a multi-file package.",
      "Route implementation to the narrowest matching skill and attach the required verification gate."
    ],
    checks: [
      "Every requested outcome has one owning artifact.",
      "No dense content is copied unchanged into all formats.",
      "Repeated metrics have one source of truth and one as-of date."
    ]
  },
  {
    category: "common",
    name: "control-office-with-com",
    title: "Control Office with COM",
    short: "Operate visible desktop Office safely",
    description: "Control visible Microsoft Word, PowerPoint, or Excel desktop applications with Windows COM automation. Use when editing an open Office file, preserving native fidelity, testing application behavior, or rendering through the installed Office application.",
    outcome: "Apply a bounded batch of changes in the real Office application without closing user work or inventing unsupported object-model behavior.",
    steps: [
      "Require the exact source path, Office application, output mode, and page, slide, or range target; ask for any missing required input instead of guessing.",
      "Confirm Windows desktop Office and the required COM library are available.",
      "Resolve every source and output path to an absolute path.",
      "Attach to the existing application and reuse an open document whose FullName matches the target.",
      "Resolve the target to an application-native page number, SlideID and slide index, or worksheet and address; assert that it exists and capture its before state.",
      "Probe uncertain methods or properties on a disposable artifact before touching the source.",
      "Execute related COM calls in one process, save explicitly, and read back the saved path and document state.",
      "For changed external claims or assets, run manage-office-sources and audit-office-claims; always run verify-office-deliverable and its format-specific verifier before reporting completion.",
      "Keep the application visible and reveal the changed page, slide, or range unless the user requested a closed batch job."
    ],
    checks: [
      "Collections are treated as one-based where the Office object model requires it.",
      "SaveAs uses an explicit format constant.",
      "No mutation begins until both FullName and the exact target assertion match the request.",
      "No application, document, presentation, or workbook is closed without authorization.",
      "Unsupported features are reported instead of silently replaced.",
      "The evidence record names the Office version, final FullName, exact target identifier, operation, before and after readback, and status."
    ]
  },
  {
    category: "common",
    name: "inspect-office-source",
    title: "Inspect an Office source",
    short: "Inventory source structure before editing",
    description: "Inspect Word, PowerPoint, Excel, PDF, image, and text sources before Office authoring or editing. Use when a request depends on an existing template, source document, reference deck, workbook, or mixed attachment set.",
    outcome: "Produce a compact source inventory that identifies structure, reusable assets, authoritative facts, template constraints, and unresolved gaps.",
    steps: [
      "List every supplied file with format, size, modified time, and intended role.",
      "Inspect Word styles and sections, PowerPoint masters and layouts, and Excel sheets, named ranges, tables, formulas, and charts.",
      "Extract text and metadata without treating extraction as visual verification.",
      "Identify which artifacts are authoritative, derivative, stale, or purely visual references.",
      "Record reusable logos, images, charts, tables, citations, and design tokens.",
      "Flag password protection, macros, external links, unsupported features, and missing dependencies."
    ],
    checks: [
      "The inventory distinguishes content authority from visual authority.",
      "All templates, masters, formulas, and external links that constrain editing are named.",
      "No write action occurs during inspection."
    ]
  },
  {
    category: "common",
    name: "preserve-template-fidelity",
    title: "Preserve Office template fidelity",
    short: "Keep native masters styles and formulas intact",
    description: "Preserve the structure and visual system of an existing Word, PowerPoint, or Excel template. Use when a supplied Office file controls layout, styles, masters, formulas, branding, or review conventions.",
    outcome: "Create or edit content inside the source template while retaining its native hierarchy, editability, and behavior.",
    steps: [
      "Treat the supplied template as the visual and structural authority.",
      "Map reusable Word styles, PowerPoint masters and layouts, or Excel sheet conventions before editing.",
      "Duplicate and edit inherited structures instead of rebuilding them from scratch.",
      "Apply the smallest local override that satisfies the request.",
      "Record every intentional deviation from the template.",
      "Render representative inherited and modified regions before reviewing the entire artifact."
    ],
    checks: [
      "Word styles remain semantic rather than direct-formatting copies.",
      "PowerPoint master and layout inheritance is not flattened.",
      "Excel formulas, tables, names, formats, and conditional formatting remain consistent.",
      "Unrequested global restyling is absent."
    ]
  },
  {
    category: "common",
    name: "apply-office-design-system",
    title: "Apply an Office design system",
    short: "Translate brand rules into Office tokens",
    description: "Translate a brand or project design system into Word, PowerPoint, and Excel-safe tokens. Use when creating unbranded Office files, applying DESIGN.md, or converting web-oriented visual rules into printable and editable Office output.",
    outcome: "Define format-specific typography, color, spacing, grid, table, chart, and image rules before content styling begins.",
    steps: [
      "Read the current project design contract and any supplied template before choosing defaults.",
      "Resolve fonts to installed Office-safe families with verified Korean glyph coverage when needed.",
      "Convert colors into named semantic roles and reserve saturated accents for meaningful emphasis.",
      "Define Word page and paragraph tokens, PowerPoint slide and type tokens, and Excel sheet and number-format tokens.",
      "Specify permitted exceptions for print, projector, accessibility, and locale constraints.",
      "Apply the token set consistently and audit direct-formatting drift."
    ],
    checks: [
      "Contrast is readable in the target medium.",
      "Typography survives font substitution.",
      "The system does not rely on gradients, glass effects, or tiny labels.",
      "Template or project rules take precedence over repository defaults."
    ]
  },
  {
    category: "common",
    name: "manage-office-sources",
    title: "Manage Office sources",
    short: "Track claim asset and data provenance",
    description: "Collect and preserve provenance for claims, data, images, logos, and external assets used in Office documents. Use when research or external material informs a Word document, PowerPoint deck, or Excel workbook.",
    outcome: "Make every material external claim and asset traceable without exposing internal research notes to the audience.",
    steps: [
      "Record canonical URLs, authors or organizations, titles, dates, page or table labels, and retrieval dates.",
      "Separate claim sources, data sources, image licenses, and template provenance.",
      "Place citations in the format-appropriate surface: Word notes or references, PowerPoint speaker notes, and Excel source cells or comments.",
      "Preserve original units, definitions, sample sizes, and as-of dates.",
      "Mark any claim that cannot be verified as unverified or remove it.",
      "Keep a compact source ledger alongside the working artifact until delivery."
    ],
    checks: [
      "Every non-trivial external claim has a traceable source.",
      "Every external visual has a license or usage basis.",
      "Citations point to the exact supporting page, section, or dataset when available."
    ]
  },
  {
    category: "common",
    name: "audit-office-claims",
    title: "Audit Office claims",
    short: "Verify claims before document delivery",
    description: "Audit factual claims, numbers, comparisons, and citations in Office deliverables. Use before sending proposals, reports, executive decks, financial models, dashboards, or any document containing externally verifiable assertions.",
    outcome: "Separate verified facts, calculations, assumptions, recommendations, and unsupported statements, then correct or qualify each risky claim.",
    steps: [
      "Extract material claims and numbers from the final saved artifact.",
      "Trace each claim to a source, formula, or clearly labeled assumption.",
      "Check dates, units, denominators, definitions, sample sizes, and comparison periods.",
      "Recalculate derived numbers independently or from auditable workbook formulas.",
      "Replace vague superlatives and unsupported compliance language with precise evidence.",
      "Record the remaining verification state without overstating certainty."
    ],
    checks: [
      "No derived number is presented as a sourced raw fact.",
      "No source supports a different time period or definition than the claim.",
      "Unverified items are visible to the author and not disguised as confirmed."
    ]
  },
  {
    category: "common",
    name: "compare-office-versions",
    title: "Compare Office versions",
    short: "Find material changes between Office files",
    description: "Compare two versions of Word, PowerPoint, or Excel files for content, structure, calculation, and visual changes. Use for redline review, regression checking, template fidelity, or delivery sign-off.",
    outcome: "Produce an evidence-backed change report that distinguishes intended edits from accidental drift.",
    steps: [
      "Confirm the baseline and candidate files and preserve both unchanged.",
      "Compare Word text, styles, sections, fields, comments, and pagination.",
      "Compare PowerPoint slide order, masters, layouts, objects, notes, and rendered geometry.",
      "Compare Excel sheets, names, formulas, values, formats, charts, and connections.",
      "Render both versions and inspect visual differences that structural comparison cannot explain.",
      "Classify every material difference as intended, defect, renderer variation, or unresolved."
    ],
    checks: [
      "The baseline is identified by path, hash, or version.",
      "Content, structure, and rendering are not collapsed into one vague comparison.",
      "No claim of equality is made from text comparison alone."
    ]
  },
  {
    category: "common",
    name: "redact-office-content",
    title: "Redact Office content",
    short: "Remove sensitive Office content safely",
    description: "Redact or anonymize sensitive information in Word, PowerPoint, and Excel while preserving usable layout. Use for external sharing, legal review, privacy requests, or client-safe sample preparation.",
    outcome: "Produce a new sanitized artifact with content, metadata, comments, hidden material, and embedded objects reviewed for disclosure risk.",
    steps: [
      "Define the sensitive data classes and the required irreversibility level.",
      "Work on a copy and inventory visible text, notes, comments, hidden rows or slides, formulas, metadata, and embedded files.",
      "Replace or remove sensitive values without leaving recoverable layers or linked sources.",
      "Scrub author, revision, custom property, and hidden content metadata when authorized.",
      "Reopen the final file and search for original values and patterns.",
      "Render the artifact and inspect spacing, broken references, and disclosure through context."
    ],
    checks: [
      "Redaction is not a black shape placed over live sensitive text.",
      "Speaker notes, comments, hidden sheets, and tracked changes are included in scope.",
      "The original remains preserved separately."
    ]
  },
  {
    category: "common",
    name: "audit-office-accessibility",
    title: "Audit Office accessibility",
    short: "Check Office files for accessible use",
    description: "Audit Word, PowerPoint, and Excel artifacts for accessibility. Use before public, regulated, educational, government, or broad internal distribution.",
    outcome: "Identify and fix barriers in structure, reading order, contrast, alt text, links, tables, charts, and document navigation.",
    steps: [
      "Identify the target audience, assistive technology expectations, and required standard.",
      "Run the Office Accessibility Checker when the target application is available.",
      "Inspect semantic headings, reading order, tables, links, alt text, color use, and language metadata.",
      "Verify keyboard and form interaction where controls are present.",
      "Fix high-impact issues without damaging template fidelity.",
      "Re-run the checker and visually review the changed artifact."
    ],
    checks: [
      "Color is not the only carrier of meaning.",
      "Decorative objects are marked appropriately.",
      "Tables have meaningful headers and avoid merged data cells.",
      "The audit result distinguishes checked, fixed, and untestable items."
    ]
  },
  {
    category: "common",
    name: "verify-office-deliverable",
    title: "Verify an Office deliverable",
    short: "Enforce save scan render and review gates",
    description: "Run the final delivery gate for Word, PowerPoint, or Excel artifacts. Use after any meaningful create or edit batch and before handing an Office file to the user.",
    outcome: "Confirm save integrity, structural correctness, calculation or field freshness, and complete visual quality in the final saved artifact.",
    steps: [
      "Require the final absolute path, artifact type, acceptance brief, and any exact page or slide count or named target; ask for missing inputs and otherwise return INCONCLUSIVE.",
      "Save and read back the final absolute path, format, size, and application state.",
      "Reopen or reattach to the saved artifact and refresh fields, calculations, links, and slide state as applicable.",
      "Run the relevant format verifier independently of the generator: Word production checks, verify-powerpoint, or verify-excel-workbook.",
      "Run a format-specific structural issue scan and placeholder search.",
      "Render every page, slide, or used worksheet and inspect each one individually.",
      "Test runtime-only behavior in the actual Office application.",
      "Repair defects and repeat the required gates, stopping after three non-converging cycles.",
      "Write UTF-8 evidence JSON with artifact path and SHA-256, verifier and Office version, expected and observed targets, and acceptance_checks records containing id, category, method, evidence location, expected, observed, tolerance, status, met, and limitations.",
      "Validate the report against evidence-report.schema.json and run validate_evidence_report.py with the matching generic, proposal, rfp, or financial-model profile before assigning PASS."
    ],
    checks: [
      "Required SKIP results produce INCONCLUSIVE, never PASS.",
      "Any required exact page or slide count and named target matches the reopened artifact.",
      "Every PASS cites independent readback, calculation, or render evidence rather than the generator's own assertion.",
      "Automated checks and visual inspection both completed.",
      "The evidence JSON is parseable and records every failed, skipped, or inconclusive check and unresolved limitation."
    ]
  },
  {
    category: "common",
    name: "prepare-client-delivery",
    title: "Prepare an Office delivery",
    short: "Package final Office files for handoff",
    description: "Prepare verified Office artifacts for client or executive handoff. Use when a working file must become a clean delivery package with controlled versions, filenames, metadata, and supporting exports.",
    outcome: "Deliver only intentional final files with clear version identity, matching metrics, clean metadata, and documented verification.",
    steps: [
      "Confirm the exact requested formats, filenames, version labels, and destination.",
      "Separate source, working, review, redline, and clean delivery copies.",
      "Reconcile repeated dates, units, metrics, terminology, and status labels across files.",
      "Remove temporary assets, unresolved placeholders, and unapproved comments.",
      "Run the complete verification gate on the exact files being delivered.",
      "Report what changed, what was verified, and what remains limited."
    ],
    checks: [
      "No scratch render or builder is included unless requested.",
      "The clean copy does not silently erase required review history.",
      "Every delivered file opens from its final path."
    ]
  },
  {
    category: "word",
    name: "create-business-document",
    title: "Create a business document",
    short: "Create polished editable Word documents",
    description: "Create a professional editable Word document from notes, sources, or a brief. Use for memos, guides, plans, summaries, internal documents, and general DOCX authoring that does not require a narrower Word skill.",
    outcome: "Produce a readable, semantic DOCX whose structure, styles, tables, fields, and pagination remain editable in Word.",
    steps: [
      "Choose the document archetype, audience, reading mode, and page budget.",
      "Define the heading outline and information form for each section before drafting.",
      "Apply real Word styles, numbering, captions, page setup, headers, and footers.",
      "Use tables only for comparable row-and-column data.",
      "Add sources, links, alt text, and document metadata.",
      "Update fields, save, render every page, and repair pagination defects."
    ],
    checks: [
      "Heading levels are logical and no headings are faked with direct formatting.",
      "Lists use real numbering definitions.",
      "Tables fit the page and contain no fixed-height clipping."
    ]
  },
  {
    category: "word",
    name: "edit-word-document",
    title: "Edit a Word document",
    short: "Make surgical edits to existing DOCX files",
    description: "Edit an existing Word document while preserving its structure and formatting. Use for targeted copy changes, restructuring, table updates, style repair, or template-safe revisions to a DOCX.",
    outcome: "Apply the smallest complete set of edits while preserving unrelated content, review history, fields, and page behavior.",
    steps: [
      "Inspect the document outline, styles, sections, tables, fields, comments, and tracked changes.",
      "Create a working copy unless in-place editing is explicitly requested.",
      "Identify the exact paragraphs, cells, fields, or styles affected by the request.",
      "Prefer local semantic edits over whole-document rewrites or broad restyling.",
      "Preserve or intentionally update comments and tracked changes.",
      "Save, update fields, compare against the source, and render every page."
    ],
    checks: [
      "Every changed region traces to the request.",
      "Unrelated styles and pagination remain stable.",
      "The source document remains recoverable."
    ]
  },
  {
    category: "word",
    name: "create-executive-brief",
    title: "Create an executive brief",
    short: "Write concise decision-ready Word briefs",
    description: "Create a concise executive or board-style Word brief. Use when leaders need a decision, recommendation, status, risk, or issue summarized in a short DOCX.",
    outcome: "Present the decision, recommendation, evidence, tradeoffs, risks, and next action in a compact document that can be read quickly.",
    steps: [
      "State the required decision and owner before writing background.",
      "Lead with the recommendation and its business consequence.",
      "Select only evidence that changes the decision.",
      "Separate known facts, assumptions, options, risks, and asks.",
      "Use a short page structure with restrained tables and callouts.",
      "Verify every headline number and render the complete brief."
    ],
    checks: [
      "The requested decision appears on the first page.",
      "Options use comparable criteria.",
      "Risks include owner, trigger, and mitigation when action is required."
    ]
  },
  {
    category: "word",
    name: "create-proposal",
    title: "Create a Word proposal",
    short: "Build persuasive evidence-backed proposals",
    description: "Create a persuasive Word proposal for a client, partner, grant, project, or internal initiative. Use when the deliverable must explain a problem, solution, scope, delivery plan, evidence, price, and next step in DOCX.",
    outcome: "Create a proposal that is commercially clear, buildable, measurable, and easy to approve.",
    steps: [
      "Define the buyer, problem, desired outcome, and approval criteria.",
      "Lead with what is being delivered and why it matters now.",
      "Connect scope items to outcomes, owners, dependencies, and acceptance criteria.",
      "Separate assumptions, exclusions, risks, commercial terms, and optional work.",
      "Support claims with sources, examples, or measurable proof.",
      "Render and review the proposal as a buyer would read it."
    ],
    checks: [
      "Scope can be priced and delivered without hidden interpretation.",
      "Acceptance criteria are measurable.",
      "Revenue, payment, and repeat-sale logic are explicit when commercial."
    ]
  },
  {
    category: "word",
    name: "create-rfp-response",
    title: "Create an RFP response",
    short: "Build compliant traceable RFP responses",
    description: "Create a Word response to an RFP, RFI, RFQ, or procurement questionnaire. Use when source requirements must be answered completely, traceably, and in the buyer's requested structure.",
    outcome: "Produce a compliant DOCX that answers every requirement, distinguishes evidence from commitments, and exposes gaps before submission.",
    steps: [
      "Require the buyer package, response instructions or template, submission constraints, and approved company evidence; ask for missing inputs or produce only a labeled skeleton with gaps and INCONCLUSIVE status.",
      "Use build-rfp-compliance-matrix to build the atomic Excel requirement ledger with exact source location, owner, status, evidence, and intended Word response location.",
      "Preserve the buyer's numbering, terminology, mandatory forms, and response order.",
      "Answer each requirement directly before adding context or marketing language.",
      "Separate current capability, configuration, roadmap, partner dependency, and exception.",
      "Record claim-level provenance for security, auditability, deployment, delivery, economics, pricing, and legal statements, including source, as-of date, owner, and exact file page or workbook cell.",
      "Use manage-word-comments-redlines to create a separate tracked-change review copy, preserve existing review history, and reconcile every disposition to its compliance-matrix row and clean Word section.",
      "Run manage-office-sources and audit-office-claims, then verify-office-deliverable on the clean DOCX and verify-excel-workbook on the matrix before submission.",
      "Validate the package evidence with validate_evidence_report.py --profile rfp and the exact counted-page target before assigning PASS."
    ],
    checks: [
      "Every mandatory requirement has one matrix status and one exact Word response location.",
      "No roadmap item is described as current capability.",
      "Every material security or economics claim has supporting evidence or an explicit unverified label.",
      "The matrix, clean DOCX, and redline share a version identifier and reconcile without discarded review history.",
      "A labeled skeleton, missing mandatory answer, or failed required companion workflow remains INCONCLUSIVE and is not submission-ready."
    ]
  },
  {
    category: "word",
    name: "create-business-report",
    title: "Create a business report",
    short: "Create structured evidence-led Word reports",
    description: "Create a structured business, research, audit, evaluation, or project report in Word. Use when evidence, method, findings, analysis, and recommendations must remain readable and referenceable over multiple pages.",
    outcome: "Produce a navigable report with a clear method, evidence trail, findings, implications, and actionable recommendations.",
    steps: [
      "Define the report question, scope, audience, method, and evidence boundary.",
      "Build the outline around findings and decisions rather than source order.",
      "Use figures and tables only when they improve comparison or comprehension.",
      "Distinguish observation, analysis, limitation, and recommendation.",
      "Add captions, cross-references, page numbers, and a usable contents structure.",
      "Verify citations and inspect every page for continuity and page breaks."
    ],
    checks: [
      "Findings are supported by the described method.",
      "Limitations qualify the conclusion without swallowing it.",
      "Figures and tables are referenced in the surrounding text."
    ]
  },
  {
    category: "word",
    name: "create-policy-document",
    title: "Create a policy document",
    short: "Create enforceable readable Word policies",
    description: "Create or revise a policy, standard, guideline, or governance document in Word. Use when roles, scope, rules, exceptions, controls, evidence, and review cycles must be explicit.",
    outcome: "Produce a policy that separates mandatory requirements from guidance and can be implemented, audited, and maintained.",
    steps: [
      "Define authority, scope, audience, effective date, and policy owner.",
      "Separate policy statements, procedures, standards, examples, and exceptions.",
      "Use consistent requirement language for must, should, and may.",
      "Assign control owners, evidence, review cadence, and escalation paths.",
      "Add definitions only for terms whose ambiguity changes compliance.",
      "Run a contradiction and enforceability review before visual QA."
    ],
    checks: [
      "Every mandatory control has an owner and evidence path.",
      "Exceptions have an approval authority and expiry or review condition.",
      "Normative language is consistent."
    ]
  },
  {
    category: "word",
    name: "create-sop",
    title: "Create a standard operating procedure",
    short: "Build executable step-by-step Word SOPs",
    description: "Create a Word standard operating procedure, runbook, work instruction, or operational checklist. Use when a reader must perform a repeatable process safely and consistently.",
    outcome: "Produce an executable SOP with prerequisites, steps, decision points, evidence, exceptions, and completion checks.",
    steps: [
      "Define the operator, trigger, goal state, prerequisites, permissions, and tools.",
      "Break the process into observable actions using verbs.",
      "Place warnings and decision criteria immediately before the risky action.",
      "Include expected result, evidence, rollback, and escalation for critical steps.",
      "Use real numbered lists and concise screenshots or figures when needed.",
      "Walk through the SOP from a fresh operator perspective and render every page."
    ],
    checks: [
      "Steps are sequential and individually verifiable.",
      "No required information exists only in an image.",
      "Failure and rollback paths are explicit."
    ]
  },
  {
    category: "word",
    name: "create-word-form",
    title: "Create a Word form",
    short: "Build usable protected Word forms",
    description: "Create a fillable Word form, questionnaire, checklist, or template with content controls or form fields. Use when users must enter structured responses directly in DOCX.",
    outcome: "Produce a protected, keyboard-usable Word form whose controls, labels, validation, and tab order work in the target Word version.",
    steps: [
      "Define each field, response type, required state, validation rule, and downstream use.",
      "Choose content controls or legacy form fields based on target compatibility.",
      "Give every control a unique title, tag, and visible label.",
      "Provide adequate response space and avoid using a spreadsheet-like grid for narrative answers.",
      "Apply the minimum necessary editing protection.",
      "Test every control, tab order, save cycle, and protected state in Word."
    ],
    checks: [
      "Controls remain fillable after protection.",
      "Dropdown choices and defaults are correct.",
      "Form-field names meet target length and uniqueness constraints.",
      "Static rendering is supplemented by live interaction testing."
    ]
  },
  {
    category: "word",
    name: "create-academic-paper",
    title: "Create an academic paper",
    short: "Create citation-safe academic Word papers",
    description: "Create or edit an academic, scientific, or technical paper in Word. Use when the DOCX needs formal citations, equations, captions, cross-references, bibliography, and stable long-document structure.",
    outcome: "Produce a citation-complete manuscript with semantic sections, stable equations and references, and a reproducible evidence trail.",
    steps: [
      "Confirm venue, style guide, section structure, citation style, and source boundary.",
      "Separate research notes from claims that appear in the manuscript.",
      "Use real captions, bookmarks, fields, equations, and cross-references.",
      "Maintain a consistent terminology, notation, unit, and abbreviation ledger.",
      "Check every in-text citation against the bibliography and source.",
      "Update fields and render the full manuscript, including equations and references."
    ],
    checks: [
      "Every citation resolves both directions.",
      "Figures and tables have sequential captions and live references.",
      "Equations render correctly in the target Word application."
    ]
  },
  {
    category: "word",
    name: "build-long-word-document",
    title: "Build a long Word document",
    short: "Structure stable multi-section Word files",
    description: "Build or restructure a long Word document such as a manual, handbook, report, book, or multi-section specification. Use when navigation, section breaks, numbering, fields, cross-references, and pagination stability are central.",
    outcome: "Create a maintainable long document whose hierarchy, navigation, page furniture, and references update correctly.",
    steps: [
      "Require purpose, audience, source set, template, required sections, and any hard page target; ask for missing inputs or produce only a labeled skeleton with INCONCLUSIVE status.",
      "Define section architecture, front matter, body, appendices, numbering, and a page budget when an exact page count is required.",
      "Create semantic styles and multilevel numbering before importing content.",
      "Use section breaks only when page geometry or headers require them.",
      "Add contents, lists of figures or tables, bookmarks, captions, and cross-references.",
      "Control keep-with-next, widow and orphan behavior, and page-break rules.",
      "Run manage-office-sources and audit-office-claims for all material external claims and assets.",
      "Update all fields and inspect every page, then run verify-office-deliverable with the Word production checks on the final saved DOCX."
    ],
    checks: [
      "Heading numbering and TOC levels agree.",
      "Headers, footers, and page numbers change only at intended section boundaries.",
      "A required exact page count equals the reopened Word page count; otherwise only the observed count is reported.",
      "No blank pages are created by accidental breaks.",
      "Unresolved evidence, a labeled skeleton, or a failed Word verification gate blocks delivery."
    ]
  },
  {
    category: "word",
    name: "manage-word-comments-redlines",
    title: "Manage Word comments and redlines",
    short: "Handle review history in Word safely",
    description: "Add, review, resolve, accept, reject, or summarize Word comments and tracked changes. Use for legal, editorial, procurement, or collaborative DOCX review workflows.",
    outcome: "Preserve an auditable review trail while producing the exact redline, clean copy, or comment state requested.",
    steps: [
      "Require the baseline file, requested output states, and authority to accept, reject, resolve, or add review items; ask when missing or provide only a read-only summary marked INCONCLUSIVE.",
      "Record the baseline path and SHA-256 plus author, comment, insertion, deletion, and move counts before editing.",
      "Inspect existing authors, tracked changes, comments, and document protection.",
      "Anchor comments to the narrowest relevant text and state the requested action.",
      "Resolve or preserve review items according to authority, never by blanket deletion.",
      "For an RFP, link each comment or tracked disposition to the exact compliance-matrix row and Word response section.",
      "Create separate clean and review copies when both are needed.",
      "When an approved edit changes a material claim, rerun manage-office-sources and audit-office-claims.",
      "Verify final review counts, anchors, visible markup, and both saved outputs with verify-office-deliverable because static renderers may omit review state."
    ],
    checks: [
      "No review history is discarded without authorization.",
      "Baseline-to-review count changes reconcile to an authorized disposition log.",
      "Clean and redline files are clearly named and not confused.",
      "Comment anchors and tracked-change ranges remain valid.",
      "Every RFP disposition resolves to an exact matrix row and Word response location.",
      "Missing authority or an unavailable live Word review remains INCONCLUSIVE."
    ]
  },
  {
    category: "word",
    name: "create-meeting-decision-record",
    title: "Create a meeting and decision record",
    short: "Turn meetings into owned decision records",
    description: "Create a Word meeting brief, minutes, decision log, or action record. Use when discussion must be converted into decisions, owners, deadlines, evidence, and follow-up.",
    outcome: "Produce a concise record that distinguishes discussion from decisions and makes follow-up operational.",
    steps: [
      "Identify meeting purpose, participants, date, source notes, and confidentiality.",
      "Separate context, evidence, options, decisions, open questions, and actions.",
      "Record each decision with owner, date, rationale, and affected scope.",
      "Record each action with owner, due date, dependency, and completion evidence.",
      "Flag uncertain wording for confirmation instead of inventing consensus.",
      "Render and review for rapid scanning."
    ],
    checks: [
      "Every action has one accountable owner.",
      "Decisions are not buried inside narrative minutes.",
      "Unconfirmed statements are labeled."
    ]
  },
  {
    category: "word",
    name: "match-business-writing-voice",
    title: "Match a business writing voice",
    short: "Adapt Word prose to an approved voice",
    description: "Match an existing executive, corporate, or editorial writing voice in Word documents. Use when source examples define tone, sentence rhythm, terminology, directness, or level of formality.",
    outcome: "Rewrite content in a traceable voice profile without copying distinctive source phrases or weakening factual precision.",
    steps: [
      "Build a voice profile from multiple authorized samples.",
      "Extract sentence length, paragraph rhythm, terminology, evidence style, and prohibited habits.",
      "Separate voice characteristics from source-specific facts and phrases.",
      "Rewrite the smallest necessary units while preserving meaning and commitments.",
      "Compare the result against the profile and a neutral business baseline.",
      "Check originality and factual consistency before delivery."
    ],
    checks: [
      "The result does not reproduce memorable source phrasing.",
      "Tone changes do not change scope, liability, or certainty.",
      "Korean honorific and formality choices remain consistent."
    ]
  },
  {
    category: "powerpoint",
    name: "plan-presentation-story",
    title: "Plan a presentation story",
    short: "Build a cumulative decision-focused slide story",
    description: "Plan the narrative arc, slide sequence, and communication job for a PowerPoint deck. Use before creating or substantially restructuring a presentation.",
    outcome: "Define a deck whose slides accumulate toward one audience decision, understanding, or action.",
    steps: [
      "Require the audience, setting, time limit, decision, central evidence, and any hard slide target; ask for missing inputs or label the outline as a skeleton with INCONCLUSIVE status.",
      "Write one takeaway claim for every numbered slide and, when an exact count is required, allocate exactly that many audience-facing slides while classifying appendix and hidden slides explicitly.",
      "Order slides by the audience's decision logic rather than source order.",
      "Assign a visual proof type and evidence owner to each claim: product, chart, comparison, process, image, or concise text.",
      "Make the production handoff require manage-office-sources and audit-office-claims before authoring and verify-powerpoint before delivery.",
      "Remove slides that repeat a point or exist only as decoration.",
      "Assert the planned slide count and check that the opening establishes stakes and the ending resolves the requested action."
    ],
    checks: [
      "A hard slide target equals the numbered audience-facing inventory, with appendix and hidden-slide treatment stated.",
      "Every slide has one narrative job.",
      "Adjacent slides change the audience's understanding.",
      "Every planned external claim has a source state and owner.",
      "A labeled skeleton is not represented as a complete presentation plan."
    ]
  },
  {
    category: "powerpoint",
    name: "create-pitch-deck",
    title: "Create a pitch deck",
    short: "Create commercial investor-ready pitch decks",
    description: "Create a PowerPoint pitch deck for investors, buyers, or strategic partners. Use when the deck must explain what is sold, why now, proof, economics, go-to-market, team, and the ask.",
    outcome: "Produce a credible commercial narrative with sourced evidence, repeat-sale logic, and a clear ask.",
    steps: [
      "Define pitch stage, audience, vertical, business model, and requested action.",
      "Lead with the product, customer problem, and why the timing matters.",
      "Show product mechanism and customer evidence before broad market claims.",
      "Explain revenue model, margins, acquisition, retention, and repeat-sale logic.",
      "Source market size, traction, team claims, and use of funds.",
      "Rehearse the narrative and verify every slide and speaker note."
    ],
    checks: [
      "TAM and growth claims include definitions and sources.",
      "Charts use honest axes and comparable periods.",
      "The ask and use of funds are explicit."
    ]
  },
  {
    category: "powerpoint",
    name: "create-proposal-deck",
    title: "Create a proposal deck",
    short: "Create enterprise-ready proposal presentations",
    description: "Create a PowerPoint proposal or solution deck for a client, procurement process, or internal sponsor. Use when the audience needs problem framing, solution scope, delivery, controls, evidence, commercials, and next steps.",
    outcome: "Produce a proposal deck that is persuasive in a meeting and precise enough to support delivery and approval.",
    steps: [
      "Require the buyer brief, operational problem, decision criteria, approved evidence, commercial assumptions, and any exact slide target; ask for missing inputs or produce only a labeled skeleton with INCONCLUSIVE status.",
      "Create a numbered storyboard that exactly matches any required audience-facing slide count and identifies appendix or hidden slides separately.",
      "Show what the solution does, where it stops, who approves actions, and how failures recover.",
      "Connect each capability to a workflow, owner, control, and measurable result.",
      "Separate current capability, configuration, customization, roadmap, and dependency.",
      "Record claim-level provenance in speaker notes: security and audit claims cite scope and evidence; economics cite definitions, source cells or formulas, assumptions, and as-of dates.",
      "Include delivery plan, governance, security, evidence, commercials, and decision path.",
      "Run manage-office-sources and audit-office-claims, then verify-powerpoint on the exact final saved deck.",
      "Validate the evidence with validate_evidence_report.py --profile proposal and the exact slide target before assigning PASS."
    ],
    checks: [
      "Scope and exclusions are visible.",
      "Any hard slide target equals the reopened deck count under the agreed appendix and hidden-slide rule.",
      "Security and auditability claims match scoped evidence rather than generic compliance language.",
      "Commercial and economics claims expose definitions, source formulas, assumptions, and dates.",
      "The deck contains a concrete next decision.",
      "Unresolved provenance, a labeled skeleton, or a failed verifier blocks delivery."
    ]
  },
  {
    category: "powerpoint",
    name: "create-executive-briefing",
    title: "Create an executive briefing",
    short: "Create concise executive decision decks",
    description: "Create a concise executive or board PowerPoint briefing. Use when leaders need a decision, status, risk, investment case, or operating issue presented in limited time.",
    outcome: "Deliver a short deck that makes the decision, evidence, tradeoffs, risks, and requested action immediately legible.",
    steps: [
      "Define the decision, executive audience, time box, and consequence of delay.",
      "Lead with the recommendation or state of play.",
      "Use one proof surface per slide and remove operational detail that does not change the decision.",
      "Show options with consistent criteria and name the recommended path.",
      "Assign owners and dates to decisions, risks, and next actions.",
      "Rehearse the deck within the time limit and inspect every slide."
    ],
    checks: [
      "The decision is clear within the first two slides.",
      "All options are comparable.",
      "Appendix detail does not leak into the main narrative."
    ]
  },
  {
    category: "powerpoint",
    name: "create-product-demo-deck",
    title: "Create a product demo deck",
    short: "Use product states as presentation evidence",
    description: "Create a PowerPoint product demo or product-proof deck. Use when the interface, workflow, or system behavior must demonstrate value instead of serving as decoration.",
    outcome: "Show a deterministic product journey from input through processing, review, approval, output, and recovery.",
    steps: [
      "Choose one realistic user job and one complete success path.",
      "Capture or recreate product states at consistent scale and resolution.",
      "Label input, processing, draft, edit, approval, publish, and exception states.",
      "Pair each product state with the business friction it removes and evidence it creates.",
      "Avoid screenshots that cannot be read at presentation distance.",
      "Run the demo sequence and verify every crop, label, and claim."
    ],
    checks: [
      "The interface is evidence, not a decorative thumbnail.",
      "Demo data is labeled as real, synthetic, or illustrative.",
      "Failure and approval states are represented."
    ]
  },
  {
    category: "powerpoint",
    name: "create-case-study-deck",
    title: "Create a case study deck",
    short: "Create evidence-led customer case decks",
    description: "Create a PowerPoint customer case study, success story, or project retrospective. Use when context, intervention, evidence, result, and lessons must be presented credibly.",
    outcome: "Produce a concise before-and-after story that connects verified outcomes to a specific intervention without overstating causality.",
    steps: [
      "Define client context, baseline, constraint, intervention, and measurement period.",
      "Separate customer quotes, observed facts, calculated results, and inferred impact.",
      "Show the workflow or implementation that produced the result.",
      "Use comparable before-and-after definitions and periods.",
      "Include limitations, dependencies, and transferable lessons.",
      "Obtain or record approval for client names, logos, and quotes."
    ],
    checks: [
      "Metrics reconcile with their source.",
      "Causality language matches the evidence.",
      "Customer identity and brand use are authorized."
    ]
  },
  {
    category: "powerpoint",
    name: "create-training-deck",
    title: "Create a training deck",
    short: "Create teachable practice-ready slide decks",
    description: "Create a PowerPoint training, onboarding, workshop, or instructional deck. Use when an audience must learn a concept, perform a process, practice a skill, and confirm understanding.",
    outcome: "Produce a teachable sequence with objectives, demonstrations, practice, feedback, and usable reference material.",
    steps: [
      "Define learners, prior knowledge, setting, duration, and observable learning objectives.",
      "Sequence concept, example, demonstration, guided practice, independent practice, and check.",
      "Keep instructions audience-facing and move facilitator notes into speaker notes.",
      "Use progressive disclosure only when it improves teaching and survives static export.",
      "Provide realistic scenarios and answer keys or debrief guidance.",
      "Run the deck as a session and verify timing and readability."
    ],
    checks: [
      "Each objective has a corresponding activity or assessment.",
      "Instructions are complete without presenter improvisation.",
      "Static handouts remain understandable."
    ]
  },
  {
    category: "powerpoint",
    name: "create-data-story",
    title: "Create a PowerPoint data story",
    short: "Turn verified data into clear slide evidence",
    description: "Create a PowerPoint data story using charts, tables, annotations, and narrative sequence. Use when quantitative evidence must support a decision or explain a trend, comparison, distribution, or relationship.",
    outcome: "Build a truthful data narrative in which every visual has one claim, correct scale, readable labels, and traceable source.",
    steps: [
      "Define the decision question and the minimum data needed to answer it.",
      "Validate definitions, units, time periods, sample sizes, and missing data.",
      "Choose a chart form that matches comparison, trend, distribution, relationship, or range.",
      "Write a takeaway title and annotate only the evidence needed for that claim.",
      "Keep source data editable or linked to an auditable workbook when appropriate.",
      "Reconcile chart values and inspect every label at presentation size."
    ],
    checks: [
      "Axes, baselines, sorting, and denominators are truthful.",
      "Colors have consistent semantic meaning.",
      "The source and as-of date are present in notes or the approved citation surface."
    ]
  },
  {
    category: "powerpoint",
    name: "create-architecture-diagram",
    title: "Create an architecture diagram",
    short: "Create readable editable technical diagrams",
    description: "Create a PowerPoint architecture, system, network, data-flow, or integration diagram. Use when components, boundaries, flows, controls, ownership, or failure paths must remain editable.",
    outcome: "Produce a diagram with explicit boundaries, consistent connector semantics, concise labels, and a clear reading path.",
    steps: [
      "Define the diagram question, audience, system boundary, and level of detail.",
      "Inventory actors, systems, stores, interfaces, controls, and external dependencies.",
      "Choose one direction of flow and one connector vocabulary.",
      "Create connectors before nodes when z-order could cause crossings.",
      "Use native shapes for simple diagrams and an appropriate graph tool for complex topology.",
      "Check every connector, label, boundary, and legend in the rendered slide."
    ],
    checks: [
      "No connector crosses a label or node unnecessarily.",
      "Security and ownership boundaries are named.",
      "The diagram answers one technical question rather than showing everything."
    ]
  },
  {
    category: "powerpoint",
    name: "create-process-roadmap-slides",
    title: "Create process and roadmap slides",
    short: "Create executable process and roadmap views",
    description: "Create PowerPoint process, timeline, phased plan, dependency, or roadmap slides. Use when sequence, ownership, milestones, gates, and timing must be communicated.",
    outcome: "Produce an ordered visual that distinguishes activities, milestones, decisions, dependencies, owners, and uncertainty.",
    steps: [
      "Define the time scale, phases, workstreams, owners, and decision gates.",
      "Separate duration-bearing work from point milestones.",
      "Show dependencies and critical handoffs without decorative connector clutter.",
      "Use consistent date granularity and status language.",
      "Move low-level task detail to an appendix or workbook.",
      "Verify that the sequence reads correctly in static and presentation modes."
    ],
    checks: [
      "Milestones and activities are visually distinct.",
      "Dates do not mix incompatible granularities.",
      "Dependencies and owners are not implied only by proximity."
    ]
  },
  {
    category: "powerpoint",
    name: "create-comparison-slide",
    title: "Create a comparison slide",
    short: "Create fair decision-ready comparisons",
    description: "Create a PowerPoint comparison, option, vendor, before-and-after, or competitive slide. Use when alternatives must be evaluated against shared criteria.",
    outcome: "Present a fair, readable comparison that exposes criteria, evidence, tradeoffs, and the recommended choice.",
    steps: [
      "Define the decision and a small set of material comparison criteria.",
      "Use the same definition, unit, and evidence standard for every option.",
      "Choose a split layout, matrix, slope, or small multiple based on the data.",
      "Separate verified facts from assessments and weights.",
      "State the recommendation and the tradeoff it accepts.",
      "Check visual emphasis for accidental bias."
    ],
    checks: [
      "Criteria are mutually understandable and consistently applied.",
      "Missing information is shown as unknown, not zero.",
      "The recommended option is supported by the displayed criteria."
    ]
  },
  {
    category: "powerpoint",
    name: "apply-slide-grid",
    title: "Apply a slide grid",
    short: "Build disciplined PowerPoint slide layouts",
    description: "Apply a consistent grid, margins, alignment, and spacing system to PowerPoint. Use when a deck lacks layout discipline or when creating a reusable set of slide compositions.",
    outcome: "Create a small family of balanced layouts with consistent margins, alignment lines, media frames, and typographic rhythm.",
    steps: [
      "Inspect the template grid or define slide margins and columns from the canvas size.",
      "Create a small set of distinct silhouettes for title, narrative, data, image, and comparison slides.",
      "Align visible objects to shared guides and preserve intentional open space.",
      "Use one composition per slide rather than nested interface panels.",
      "Place repeated elements on layouts or masters.",
      "Render a montage and inspect rhythm across adjacent slides."
    ],
    checks: [
      "Left and right margins are intentional and usually equal.",
      "Adjacent slides do not repeat the same silhouette without reason.",
      "No object sits almost, but not exactly, on an alignment line."
    ]
  },
  {
    category: "powerpoint",
    name: "compose-editorial-slide",
    title: "Compose an editorial slide",
    short: "Create restrained editorial slide layouts",
    description: "Compose a PowerPoint slide with editorial hierarchy, asymmetry, columns, rules, media bands, and deliberate negative space. Use for chapter, strategy, technology, or case-study slides that need a premium but restrained voice.",
    outcome: "Create an asymmetric but stable composition that prioritizes one headline, one evidence surface, and a disciplined reading order.",
    steps: [
      "Choose the primary claim and one dominant visual or text block.",
      "Establish columns, alignment anchors, and a controlled asymmetry.",
      "Use rules, metadata, and mono labels only when they carry information.",
      "Keep body copy short and avoid ornamental editorial scaffolding.",
      "Balance dense and open regions without shrinking type.",
      "Inspect reading order, contrast, and static export."
    ],
    checks: [
      "Asymmetry remains aligned rather than accidental.",
      "Tiny uppercase labels are not repeated as decoration.",
      "The slide has one unmistakable focal point."
    ]
  },
  {
    category: "powerpoint",
    name: "compose-split-layout-slide",
    title: "Compose a split-layout slide",
    short: "Create clear two-part PowerPoint slides",
    description: "Compose a PowerPoint slide with two clear panels or regions. Use for problem and solution, before and after, product and explanation, diagram and specification, or two-option comparison.",
    outcome: "Create a two-part composition in which one side carries the focal evidence and the other provides the explanation or comparison.",
    steps: [
      "Define the relationship between the two regions and whether the split is equal or weighted.",
      "Choose one hero side and one explanatory side unless the task requires equal comparison.",
      "Align titles, baselines, and shared anchors across the split.",
      "Use contrast, not heavy frames, to distinguish regions.",
      "Keep the relationship visible when the slide is exported to PDF.",
      "Check that neither side becomes a miniature dense slide."
    ],
    checks: [
      "The two regions express one relationship.",
      "The split ratio reflects content importance.",
      "Repeated use across the deck does not create monotony."
    ]
  },
  {
    category: "powerpoint",
    name: "compose-image-first-slide",
    title: "Compose an image-first slide",
    short: "Use imagery as the presentation stage",
    description: "Compose a PowerPoint slide around one dominant photograph, product image, or visual artifact. Use for covers, vision, customer stories, location context, and moments where an image is primary evidence.",
    outcome: "Create a legible image-led slide with controlled crop, safe text placement, and traceable asset provenance.",
    steps: [
      "Define the image's communication job and required crop before sourcing it.",
      "Choose an asset with sufficient resolution, license, and subject placement.",
      "Crop for the actual slide frame rather than shrinking to fit.",
      "Place concise text in a naturally quiet image region or separate band.",
      "Use overlays only when needed for contrast and keep them visually restrained.",
      "Inspect the final crop at full-slide size."
    ],
    checks: [
      "The image supports the claim instead of supplying generic atmosphere.",
      "Faces, products, and horizon lines are not awkwardly cropped.",
      "Text contrast remains accessible."
    ]
  },
  {
    category: "powerpoint",
    name: "compose-technical-wireframe-slide",
    title: "Compose a technical wireframe slide",
    short: "Explain systems with annotated slide views",
    description: "Compose a PowerPoint technical wireframe, exploded view, annotated product view, or component breakdown. Use when parts, layers, interfaces, or specifications need precise callouts.",
    outcome: "Create an editable annotated view with sparse labels, routed connectors, clear hierarchy, and enough context to understand the whole.",
    steps: [
      "Choose the object, system, or interface boundary being explained.",
      "Separate the base view, layers, callouts, connectors, and supporting metrics.",
      "Place labels outside the focal object when possible and route leaders cleanly.",
      "Use consistent numbering or label syntax only when sequence matters.",
      "Limit annotations to facts required for the slide's claim.",
      "Inspect at presentation distance and in exported PDF."
    ],
    checks: [
      "Callouts do not overlap or cross ambiguously.",
      "Labels identify real parts or behaviors.",
      "The base object remains recognizable after annotation."
    ]
  },
  {
    category: "powerpoint",
    name: "preserve-powerpoint-template",
    title: "Preserve a PowerPoint template",
    short: "Edit decks without flattening masters",
    description: "Create or edit slides inside an existing PowerPoint template or reference deck. Use when masters, layouts, placeholders, theme fonts, branding, or inherited elements must remain faithful.",
    outcome: "Reuse the source deck's native master and layout hierarchy while replacing content safely.",
    steps: [
      "Inspect all masters, layouts, placeholders, theme tokens, and representative slides.",
      "Select source layouts whose hierarchy and media frames match the new content.",
      "Duplicate or instantiate layouts and edit inherited placeholders in place.",
      "Make repeated changes at the layout level and global changes at the master only when authorized.",
      "Avoid mixing the template with an unrelated layout library.",
      "Render representative descendants after every master or layout change."
    ],
    checks: [
      "No inherited element was flattened without reason.",
      "Placeholder types and reading order remain correct.",
      "Font, footer, and page-marker behavior matches the source."
    ]
  },
  {
    category: "powerpoint",
    name: "create-morph-presentation",
    title: "Create a Morph presentation",
    short: "Build purposeful PowerPoint Morph sequences",
    description: "Create a PowerPoint deck that uses Morph to explain spatial change, sequence, comparison, or transformation. Use when shared object identity and state changes materially improve understanding.",
    outcome: "Produce a planned set of Morph pairs with stable object naming, controlled state changes, static comprehensibility, and live slideshow verification.",
    steps: [
      "Write the communication brief and Morph pair plan before building slides.",
      "Define scene objects, shared actor names, state changes, and ghost lifecycles.",
      "Duplicate source slides so shared objects retain identity.",
      "Change only properties required for the intended movement or transformation.",
      "Provide a static reading path for PDF and reduced-motion contexts.",
      "Run the actual slide show and audit every Morph pair."
    ],
    checks: [
      "Shared objects use consistent names.",
      "Each Morph communicates a real state change.",
      "Static renders remain understandable.",
      "Live slideshow behavior was tested in Microsoft PowerPoint."
    ]
  },
  {
    category: "powerpoint",
    name: "optimize-powerpoint-motion",
    title: "Optimize PowerPoint motion",
    short: "Use restrained reliable slide animation",
    description: "Design, simplify, or repair PowerPoint animation and transition behavior. Use when motion must clarify sequence or state without harming reliability, accessibility, or static exports.",
    outcome: "Use the smallest motion system that improves comprehension and performs reliably in the target presentation environment.",
    steps: [
      "Inventory transitions, entrance, emphasis, exit, trigger, video, and Morph effects.",
      "Assign each effect a communication purpose and remove effects without one.",
      "Standardize timing, easing, order, and click behavior.",
      "Avoid fragile chains, excessive object counts, and unsupported media dependencies.",
      "Create a static fallback and confirm reduced-motion or PDF usability.",
      "Run the full slide show on the target PowerPoint version."
    ],
    checks: [
      "Every animation has a purpose.",
      "Build order matches narration and reading order.",
      "The deck works without internet or missing media.",
      "Runtime behavior was tested rather than inferred."
    ]
  },
  {
    category: "powerpoint",
    name: "source-presentation-assets",
    title: "Source presentation assets",
    short: "Find licensed slide-ready visual assets",
    description: "Source photographs, screenshots, logos, icons, illustrations, and generated visuals for PowerPoint. Use when a deck needs external or AI-created assets with known provenance, crop, resolution, and licensing.",
    outcome: "Deliver a compact asset set that is slide-ready, legally traceable, visually consistent, and matched to exact frame requirements.",
    steps: [
      "Define the communication job, aspect ratio, crop, subject placement, and resolution for each asset.",
      "Prefer product evidence and real artifacts over generic lifestyle imagery.",
      "Use official brand assets and verify trademark guidance for logos.",
      "Record canonical source, creator, license, retrieval date, and modifications.",
      "Rasterize or convert only when required by PowerPoint compatibility.",
      "Inspect every final crop at full-slide size."
    ],
    checks: [
      "No asset is blurry, distorted, or ambiguously licensed.",
      "Logos share a consistent visual baseline without altering brand marks.",
      "Generated visuals are labeled and do not fabricate evidence."
    ]
  },
  {
    category: "powerpoint",
    name: "write-speaker-notes",
    title: "Write PowerPoint speaker notes",
    short: "Add useful notes and source blocks to slides",
    description: "Write or edit PowerPoint speaker notes, talk tracks, facilitation cues, and source blocks. Use when visible slides must remain concise but the presenter needs evidence, transitions, timing, or discussion guidance.",
    outcome: "Create notes that support delivery without leaking production instructions into audience-facing slide content.",
    steps: [
      "Define presenter, audience, time limit, and delivery style.",
      "Write one purpose, opening sentence, evidence point, and transition per slide.",
      "Add facilitation cues, timing, and anticipated questions only where useful.",
      "Place external claim and asset sources in a consistent Sources block.",
      "Avoid reading visible slide text verbatim.",
      "Rehearse the deck and revise notes for natural pacing."
    ],
    checks: [
      "Notes align with the current slide order and content.",
      "Sources are traceable.",
      "Internal production commentary is absent from visible slides."
    ]
  },
  {
    category: "powerpoint",
    name: "verify-powerpoint",
    title: "Verify a PowerPoint deck",
    short: "Inspect every slide and runtime behavior",
    description: "Verify a final PowerPoint deck for structure, visual quality, narrative, accessibility, sources, and runtime behavior. Use after creating or editing a PPTX and before delivery.",
    outcome: "Confirm the exact saved deck is coherent, readable, editable, sourced, and free of unintended slide defects.",
    steps: [
      "Require the final absolute PPTX path, acceptance brief, exact expected slide count or named slide targets, and runtime requirements; ask for missing inputs and otherwise return INCONCLUSIVE.",
      "Save and reopen the exact final PPTX, record its SHA-256, and assert the observed slide count and each target by slide index, SlideID, and title.",
      "Run a structural scan independent of the deck generator for placeholders, blank slides, canvas overflow, text overflow, overlaps, low contrast, and broken links.",
      "Render every slide individually and inspect a montage for pacing.",
      "Verify charts, tables, diagrams, image crops, footers, and page markers.",
      "Run the slide show for animation, Morph, media, links, and triggers.",
      "Repair defects and repeat the complete visual and runtime gates.",
      "Write UTF-8 evidence JSON with artifact path and SHA-256, Office and verifier versions, expected and observed slide targets, and acceptance_checks records containing method, evidence location, expected, observed, tolerance, status, met, and limitations.",
      "Validate the report against evidence-report.schema.json and run validate_evidence_report.py with the matching profile and exact slide target before assigning PASS."
    ],
    checks: [
      "The exact slide count and every named target match the reopened deck under the agreed appendix and hidden-slide rule.",
      "No title wraps unexpectedly.",
      "No connector crosses through a node or label.",
      "Every external claim and asset has a source.",
      "Static export communicates all required points.",
      "Every PASS is backed by independent scan, render, or runtime evidence, and required SKIP results remain INCONCLUSIVE.",
      "The evidence JSON is parseable and includes every failed, skipped, or inconclusive check."
    ]
  },
  {
    category: "excel",
    name: "create-business-workbook",
    title: "Create a business workbook",
    short: "Create auditable editable Excel workbooks",
    description: "Create a general-purpose Excel workbook for analysis, tracking, planning, or reporting. Use when structured data, formulas, filters, controls, or repeatable updates are central and no narrower Excel skill applies.",
    outcome: "Produce an editable XLSX with clear sheet roles, typed values, auditable formulas, readable formatting, and verified outputs.",
    steps: [
      "Define users, update cadence, inputs, calculations, outputs, and control checks.",
      "Design descriptive sheets and ranges before populating data.",
      "Use typed values, explicit number formats, Excel Tables, and visible assumptions.",
      "Write consistent formulas with correct absolute and relative references.",
      "Add filters, freeze panes, validation, and charts only where they improve use.",
      "Recalculate, inspect key ranges, scan formula errors, and render every used sheet."
    ],
    checks: [
      "No unexplained blank sheet remains.",
      "Derived outputs are formulas rather than hardcoded values.",
      "Users can identify inputs, calculations, and outputs."
    ]
  },
  {
    category: "excel",
    name: "edit-excel-workbook",
    title: "Edit an Excel workbook",
    short: "Make targeted safe changes to XLSX files",
    description: "Edit an existing Excel workbook while preserving formulas, formats, tables, names, charts, and user conventions. Use for targeted range, formula, layout, chart, or data updates.",
    outcome: "Apply the smallest complete change set without damaging workbook logic or established visual patterns.",
    steps: [
      "Inspect sheet names, used ranges, formulas, tables, names, charts, validation, and connections.",
      "Create a working copy unless in-place editing is explicitly requested.",
      "Trace precedents and dependents for every formula or range being changed.",
      "Extend adjacent formulas, formats, validation, and chart ranges consistently.",
      "Avoid sheet-wide autofit, wrapping, or restyling unless requested.",
      "Recalculate, compare key outputs to the source, and render every affected sheet."
    ],
    checks: [
      "Unrelated formulas and formats remain unchanged.",
      "Dependent charts and summaries include new data.",
      "The source workbook remains recoverable."
    ]
  },
  {
    category: "excel",
    name: "clean-tabular-data",
    title: "Clean tabular data in Excel",
    short: "Normalize raw data without losing lineage",
    description: "Clean, normalize, and prepare tabular data in Excel. Use when CSV, TSV, copied tables, exports, or inconsistent worksheets must become typed, documented, analysis-ready data.",
    outcome: "Produce a clean table with preserved raw input, explicit transformations, stable types, and quality checks.",
    steps: [
      "Preserve the raw data unchanged and record source and as-of date.",
      "Profile columns for type, missingness, duplicates, invalid values, and inconsistent categories.",
      "Define transformation rules before applying them.",
      "Use helper columns, Power Query, or formulas so changes remain auditable.",
      "Create a clean Excel Table with typed dates, numbers, percentages, and identifiers.",
      "Reconcile row counts, totals, and rejected records."
    ],
    checks: [
      "Identifiers retain leading zeros where meaningful.",
      "Missing values are not silently converted to zero.",
      "Raw and cleaned row counts reconcile."
    ]
  },
  {
    category: "excel",
    name: "build-auditable-formulas",
    title: "Build auditable Excel formulas",
    short: "Create clear traceable spreadsheet logic",
    description: "Design or repair Excel formulas so calculations are correct, consistent, and easy to audit. Use for model logic, lookups, mappings, scoring, schedules, and repeated calculations.",
    outcome: "Create simple formula chains with visible assumptions, consistent patterns, clear checks, and no magic numbers.",
    steps: [
      "Separate assumptions, source data, helper calculations, outputs, and controls.",
      "Replace embedded constants with labeled input cells where practical.",
      "Choose simple functions and helper columns over opaque monolithic formulas.",
      "Apply correct absolute, relative, structured, and quoted cross-sheet references.",
      "Add comments to material assumptions and complex formulas.",
      "Test edge cases, scan errors, and trace representative outputs to inputs."
    ],
    checks: [
      "Formula patterns are consistent across comparable ranges.",
      "Zero, blank, negative, and missing-value cases behave intentionally.",
      "No unintended circular reference remains."
    ]
  },
  {
    category: "excel",
    name: "build-financial-model",
    title: "Build a financial model",
    short: "Build auditable finance-grade Excel models",
    description: "Build or extend a financial model in Excel. Use for three-statement models, valuation, unit economics, investment cases, financing, returns, or scenario analysis.",
    outcome: "Produce an auditable model with clear inputs, calculations, outputs, checks, scenarios, and source-backed assumptions.",
    steps: [
      "Require source actuals, accounting and metric definitions, horizon, scenarios, required outputs, and tolerances; ask for missing inputs or produce only a labeled skeleton with INCONCLUSIVE status.",
      "Record every source and assumption with definition, unit, period, as-of date, owner, and exact file, sheet, range, or external location.",
      "Separate inputs, calculations, outputs, and checks into clear zones or sheets.",
      "Build operating drivers before valuation; for SaaS models, create a metric dictionary and explicit ARR and logo bridges from beginning through new, expansion, contraction, churn, other adjustments, and ending.",
      "Build linked income statement, balance sheet, and cash flow with opening-to-closing roll-forwards for cash, working capital, fixed assets, debt, and equity.",
      "Propagate each selected scenario through all affected drivers, statements, bridges, valuation, and outputs without scenario-specific hardcoded results.",
      "Add independent accounting identities and source-to-output recomputations that do not reuse the model's output formulas, with explicit absolute and relative tolerances and rounding rules.",
      "Run manage-office-sources and audit-office-claims, then verify-excel-workbook on the recalculated final XLSX.",
      "Validate the evidence with validate_evidence_report.py --profile financial-model before assigning PASS."
    ],
    checks: [
      "Calculation areas contain no unexplained hardcodes.",
      "The three statements link and roll forward, the balance sheet balances, and ending cash reconciles within the stated tolerance.",
      "SaaS metric definitions are unambiguous and ARR and logo bridges close when applicable.",
      "Changing one scenario selector propagates to every declared dependent output while locked actuals remain unchanged.",
      "Valuation and return outputs trace to sourced assumptions.",
      "Independent checks use a different calculation path and disclose residuals rather than masking them with rounding.",
      "Circular logic is intentional and converges.",
      "A labeled skeleton, unresolved provenance, or failed workbook verifier blocks delivery."
    ]
  },
  {
    category: "excel",
    name: "build-budget-forecast",
    title: "Build a budget and forecast",
    short: "Create driver-based budgets and forecasts",
    description: "Build an Excel budget, forecast, rolling plan, or variance model. Use when actuals, assumptions, scenarios, periods, departments, or accounts must produce updateable projections.",
    outcome: "Create a driver-based workbook with transparent assumptions, scenario controls, variance analysis, and management-ready outputs.",
    steps: [
      "Define grain, periods, entities, accounts, scenarios, and source actuals.",
      "Separate locked actuals from forecast assumptions and calculations.",
      "Use operational drivers instead of flat growth where evidence permits.",
      "Build baseline, upside, and downside scenarios through explicit selectors.",
      "Add actual-versus-budget-versus-forecast variance views.",
      "Reconcile totals and test period roll-forward behavior."
    ],
    checks: [
      "Scenario selection changes all dependent outputs consistently.",
      "Actual periods are not overwritten by forecast logic.",
      "Totals reconcile across department, account, and consolidated views."
    ]
  },
  {
    category: "excel",
    name: "build-kpi-dashboard",
    title: "Build an Excel KPI dashboard",
    short: "Create decision-ready Excel KPI dashboards",
    description: "Build an Excel KPI, management, operational, or performance dashboard. Use when leaders need a compact view of defined metrics, targets, trends, exceptions, and drill-down data.",
    outcome: "Produce a formula-driven dashboard with traceable KPI definitions, visible source data, restrained charts, and reliable print or screen layout.",
    steps: [
      "Define audience, decision cadence, KPI owner, formula, target, unit, and as-of date.",
      "Keep source data and calculations separate from the dashboard sheet.",
      "Use a small set of charts matched to trend, comparison, variance, or exception.",
      "Pair status color with labels or symbols.",
      "Show target, actual, variance, and trend only when they aid action.",
      "Recalculate and render the dashboard at its intended viewing size."
    ],
    checks: [
      "Every KPI is formula-driven and defined.",
      "Charts have meaningful titles and series names.",
      "The dashboard is the active and readable starting sheet."
    ]
  },
  {
    category: "excel",
    name: "build-management-report",
    title: "Build an Excel management report",
    short: "Create repeatable Excel reporting packs",
    description: "Build a recurring Excel management report or reporting pack. Use when a workbook must combine period data, variance explanations, tables, charts, and controlled refresh steps.",
    outcome: "Create a repeatable workbook whose inputs, transformations, period controls, outputs, and refresh checks are clear to the next operator.",
    steps: [
      "Define reporting period, cutoff, owners, source systems, and distribution audience.",
      "Separate raw imports, mappings, calculations, checks, and published outputs.",
      "Create period selectors and consistent report sections.",
      "Reconcile totals to source systems before formatting outputs.",
      "Add refresh instructions and visible control checks.",
      "Render every published sheet and inspect print settings."
    ],
    checks: [
      "The reporting period is visible on every output.",
      "Source totals reconcile before derived analysis.",
      "Refresh steps do not require hidden author knowledge."
    ]
  },
  {
    category: "excel",
    name: "build-planning-model",
    title: "Build an Excel planning model",
    short: "Create operational scenario planning models",
    description: "Build an Excel capacity, staffing, demand, delivery, resource, or scenario planning model. Use when operational inputs and constraints must produce a schedule, allocation, or recommendation.",
    outcome: "Produce a transparent model that exposes assumptions, constraints, scenarios, outputs, and capacity or feasibility checks.",
    steps: [
      "Require the planning horizon, grain, source demand, resources, constraints, scenarios, outputs, and tolerances; ask for missing inputs or produce only a labeled skeleton with INCONCLUSIVE status.",
      "Record each observed input and controllable assumption with definition, unit, period, owner, as-of date, and exact source location.",
      "Separate controllable assumptions from observed inputs.",
      "Build capacity, demand, allocation, and exception calculations in auditable stages.",
      "Drive every scenario from explicit selectors and propagate it through capacity, demand, allocation, exceptions, summaries, and recommendations.",
      "Show bottlenecks, unmet demand, and constraint violations explicitly.",
      "Test boundary fixtures and add independent conservation and capacity checks that do not reuse the allocation formulas, with explicit absolute and relative tolerances.",
      "Run manage-office-sources and audit-office-claims, then verify-excel-workbook on the recalculated final XLSX."
    ],
    checks: [
      "Allocations do not exceed available capacity unless visibly flagged.",
      "Demand, capacity, assigned, and unmet totals reconcile within the stated tolerance.",
      "Changing one scenario selector updates every declared dependent output and leaves locked actuals unchanged.",
      "Independent checks use a separate formula path or test fixture and expose every residual.",
      "A labeled skeleton, unresolved provenance, or failed workbook verifier blocks delivery."
    ]
  },
  {
    category: "excel",
    name: "build-rfp-compliance-matrix",
    title: "Build an RFP compliance matrix",
    short: "Track procurement requirements in Excel",
    description: "Build an Excel RFP, RFI, RFQ, or compliance matrix. Use when requirements, owners, evidence, response status, gaps, and submission locations must be tracked across a procurement response.",
    outcome: "Create a filterable requirement register that proves completeness and exposes ownership, evidence, risk, and exceptions.",
    steps: [
      "Extract each atomic requirement with source section and exact wording.",
      "Assign requirement type, mandatory status, owner, evidence, response location, and status.",
      "Use controlled status values and validation lists.",
      "Distinguish compliant, configurable, roadmap, partner-dependent, exception, and unanswered.",
      "Add summary formulas without hiding the underlying rows.",
      "Reconcile the final matrix to the submitted Word and PowerPoint files."
    ],
    checks: [
      "Every source requirement appears exactly once or has an explained split.",
      "Mandatory gaps are visible.",
      "Response locations resolve to real sections or slides."
    ]
  },
  {
    category: "excel",
    name: "build-data-validation-inputs",
    title: "Build Excel data-entry controls",
    short: "Create safe usable Excel input sheets",
    description: "Build Excel input sheets with validation, controlled lists, guidance, and error prevention. Use when users must enter assumptions, status, dates, categories, or structured operational data.",
    outcome: "Produce a clear input experience that protects calculations while keeping data typed, validated, and easy to complete.",
    steps: [
      "Define every input field, data type, allowed values, required state, and downstream use.",
      "Separate inputs from formulas and protect calculation areas.",
      "Create named lookup ranges and validation rules.",
      "Use input messages and concise instructions near the entry area.",
      "Highlight invalid or missing entries without relying only on color.",
      "Test valid, invalid, blank, pasted, and boundary inputs."
    ],
    checks: [
      "Validation references remain valid after save and reopen.",
      "Users can identify editable cells.",
      "Pasted data cannot silently bypass critical controls."
    ]
  },
  {
    category: "excel",
    name: "build-pivot-analysis",
    title: "Build an Excel pivot analysis",
    short: "Create refreshable pivot-based analysis",
    description: "Build or repair Excel PivotTables, PivotCharts, slicers, and grouped analyses. Use when users need refreshable aggregation, drill-down, segmentation, or period comparison.",
    outcome: "Create a refreshable pivot analysis with a clean source table, stable fields, meaningful labels, and reconciled totals.",
    steps: [
      "Normalize the source into one rectangular Excel Table with stable headers.",
      "Define the analytical question, dimensions, measures, filters, and time grouping.",
      "Create the pivot cache and place fields deliberately.",
      "Format values and labels for the audience rather than accepting defaults.",
      "Add slicers or charts only when they improve exploration.",
      "Refresh, reconcile totals to the source, and test filters."
    ],
    checks: [
      "Source data contains no blank header or merged cell.",
      "Calculated fields and grouped dates behave as intended.",
      "Grand totals reconcile to the source table."
    ]
  },
  {
    category: "excel",
    name: "build-excel-charts",
    title: "Build Excel charts",
    short: "Create truthful editable Excel charts",
    description: "Create or repair native Excel charts. Use when trends, comparisons, distributions, relationships, ranges, or exceptions must remain editable and connected to workbook data.",
    outcome: "Produce charts with correct ranges, honest scales, concise labels, consistent semantics, and traceable source data.",
    steps: [
      "Define the chart question and verify the source range and data types.",
      "Choose a chart form matched to the analytical relationship.",
      "Include category labels and series names explicitly.",
      "Set axes, baselines, units, sorting, and number formats deliberately.",
      "Use direct labels or annotations only when they improve comprehension.",
      "Recalculate, inspect source values, and render the final chart at intended size."
    ],
    checks: [
      "Series ranges include the intended rows and columns.",
      "Axes do not distort the comparison.",
      "Legends, titles, and units are meaningful."
    ]
  },
  {
    category: "excel",
    name: "reconcile-workbook-values",
    title: "Reconcile workbook values",
    short: "Trace and reconcile critical Excel outputs",
    description: "Reconcile Excel values between sources, sheets, versions, systems, or reporting outputs. Use when totals differ, formula chains are uncertain, or delivery requires independent numeric verification.",
    outcome: "Identify and explain every material difference with a traceable bridge from source inputs to final outputs.",
    steps: [
      "Require the exact files, sheets, ranges, keys, totals, periods, units, and acceptance tolerances; ask for missing inputs and otherwise return INCONCLUSIVE.",
      "Preserve raw source values and record each source path, SHA-256, as-of date, extraction method, and build a normalized reconciliation table.",
      "Trace formula precedents and mapping rules rather than comparing only displayed totals.",
      "Separate timing, scope, classification, currency, sign, and true error differences.",
      "Define absolute and relative tolerance plus rounding rules per metric, and never net unrelated residuals solely to reach zero.",
      "Recompute representative items and final control totals independently from raw data through a separate formula or aggregation path.",
      "Write UTF-8 evidence JSON with source hashes, sheet and cell locations, formulas or methods, and acceptance_checks records containing expected and observed values, tolerances, difference classifications, status, met, and limitations.",
      "Run manage-office-sources and audit-office-claims, then verify-excel-workbook on any delivered reconciliation workbook."
    ],
    checks: [
      "The reconciliation closes to zero or an explained residual.",
      "Units and signs are consistent.",
      "Every PASS meets its declared absolute or relative tolerance using an independent calculation path.",
      "No difference is hidden by rounding or offset against an unrelated variance.",
      "The evidence JSON is parseable and every compared total resolves to exact source and output cells.",
      "Missing inputs, unresolved residuals, or a failed workbook verifier remain INCONCLUSIVE."
    ]
  },
  {
    category: "excel",
    name: "protect-share-workbook",
    title: "Protect and share an Excel workbook",
    short: "Prepare safe editable Excel handoffs",
    description: "Protect and prepare an Excel workbook for controlled sharing. Use when inputs, formulas, sheets, sensitive content, links, macros, or collaboration behavior must be managed before delivery.",
    outcome: "Deliver a workbook whose editable areas, protection, metadata, links, and operational instructions match the sharing policy.",
    steps: [
      "Define who may view, edit inputs, edit formulas, refresh data, and change structure.",
      "Inventory hidden sheets, names, external links, macros, queries, comments, and metadata.",
      "Unlock intended input cells before applying sheet or workbook protection.",
      "Remove or preserve external dependencies according to the delivery policy.",
      "Add a concise usage note and version or as-of date.",
      "Test the protected workflow in the target Excel version."
    ],
    checks: [
      "Intended inputs remain editable.",
      "Protected formulas and structure cannot be changed accidentally.",
      "No sensitive hidden content or broken external link remains."
    ]
  },
  {
    category: "excel",
    name: "verify-excel-workbook",
    title: "Verify an Excel workbook",
    short: "Verify formulas values charts and layout",
    description: "Verify a final Excel workbook for formulas, values, data types, structure, charts, print layout, accessibility, and save integrity. Use after creating or editing an XLSX and before delivery.",
    outcome: "Confirm the exact saved workbook recalculates correctly, contains no obvious errors, and is readable and usable in Excel.",
    steps: [
      "Require the final absolute XLSX path, acceptance brief, exact key cells or ranges, expected sheet and print targets, scenarios, and tolerances; ask for missing inputs and otherwise return INCONCLUSIVE.",
      "Save and reopen the exact XLSX with automatic calculation enabled, record its SHA-256, then run a full calculation.",
      "Inspect key ranges with values and formulas and trace representative outputs to inputs.",
      "Recompute critical totals independently from raw inputs through a different formula or aggregation path and compare them under explicit absolute and relative tolerances.",
      "Scan used ranges for formula errors, circular references, placeholders, blank sheets, and clipped values.",
      "Check tables, names, validation, conditional formatting, charts, links, and print areas.",
      "For applicable models, verify three-statement roll-forwards, SaaS metric definitions and ARR or logo bridges, and scenario propagation through every declared dependent output.",
      "Render every used sheet or intended print area and inspect it.",
      "Repair defects and repeat calculation, structural, and visual gates.",
      "Write UTF-8 evidence JSON with artifact path and SHA-256, Excel and verifier versions, exact target cells or ranges, and acceptance_checks records containing method, evidence location, expected, observed, tolerance, status, met, and limitations.",
      "Validate the report against evidence-report.schema.json and run validate_evidence_report.py with the matching profile before assigning PASS."
    ],
    checks: [
      "No unexplained formula error or displayed ### remains.",
      "Key totals reconcile through an independent calculation path within stated tolerances.",
      "Every chart uses the intended source range.",
      "Scenario changes propagate to all declared dependents while locked actuals remain unchanged.",
      "Required SKIP results produce INCONCLUSIVE.",
      "The evidence JSON is parseable and includes every failed, skipped, or inconclusive check."
    ]
  }
];

export const categoryOrder = ["common", "word", "powerpoint", "excel"];
