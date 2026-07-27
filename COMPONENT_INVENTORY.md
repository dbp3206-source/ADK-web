# COMPONENT INVENTORY

## Layout
`SiteHeader`, `MobileNavDrawer`, `SiteFooter`, `EditorialSection`, `AsymmetricGrid`, `CaseStudyShell`, `StickyInspector`, `PrintOnlyHeader`

## Actions and navigation
`TextLink`, `PrimaryAction`, `IconAction`, `ProjectPrevNext`, `ExternalLinkGuard`, `DownloadAction`

## Narrative
`ThesisBlock`, `ProofStrip`, `CapabilityLadder`, `CapabilityCheckpoint`, `EngineeringHonesty`, `ContactTerminal`

## Discovery
`ProjectIndex`, `ProjectIndexRow`, `PatternFilterGroup`, `PatternChip`, `FilterEmptyState`

## Architecture
`ArchitectureDiagram`, `ArchitectureLegend`, `ArchitectureTextAlternative`, `ArchitectureNode`, `ArchitectureEdge`, `SignalPath`, `SystemExplorer`, `AgentCardInspector`, `RoutingReason`, `TracePlayer`, `TraceControls`, `TraceStepList`, `ArtifactCard`

## Evidence
`EvidenceBadge`, `EvidenceFooter`, `SourceLink`, `VerifiedCodeExcerpt`, `CodePendingState`, `CopyCodeButton`, `FailureModeList`, `RoadmapList`, `LastVerified`

## Project-specific
`RouteTrace`, `StateDrawer`, `ManuscriptPanel`, `MarginCritique`, `RevisionDiff`, `EvidenceLedger`, `CalculationTape`, `ParallelLanes`, `PartnerPlanSchema`, `QALoopTimeline`, `ClaimEvidenceMatrix`, `ReportArchive`

## Learning
`GlossaryTerm`, `GlossaryTooltip`, `LessonDurationSwitch`, `SelfCheckQuiz`, `QuizFeedback`

## States
`InlineLoading`, `BoundedError`, `EmptyState`, `OfflineFallback`, `SimulationNotice`

## Rules
- Compose global components; do not fork global controls per project.
- Every interactive component documents keyboard and focus behavior.
- Avoid excessive pill styling.
- Do not use a generic card as every section’s macro-layout.
