export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const EDIT_MARKER_SECONDS = 1;

export const scenes = [
  { id: 'ProjectTitle', title: 'Project Title', durationSeconds: 12, purpose: 'Introduce the project and its storage, index, and retrieval themes.' },
  { id: 'Architecture', title: 'Architecture Overview', durationSeconds: 32, purpose: 'Trace records from the input file into separate data and index files.' },
  { id: 'RecordLayout', title: 'Record Layout', durationSeconds: 20, purpose: 'Show the packed 26-byte record and the key and tombstone fields.' },
  { id: 'DataBlocks', title: '4 KB Data Blocks', durationSeconds: 30, purpose: 'Explain block capacity, heap pages, and RecordId addressing.' },
  { id: 'BPlusTree', title: 'B+ Tree Page Design', durationSeconds: 32, purpose: 'Show the page format, fanout, leaf links, and tree shape.' },
  { id: 'DuplicateKeys', title: 'Duplicate-Key Handling', durationSeconds: 23, purpose: 'Explain unique composite ordering for repeated key values.' },
  { id: 'QueryTraversal', title: 'Range-Query Traversal', durationSeconds: 31, purpose: 'Trace the greater-than range scan and report its result set.' },
  { id: 'NaiveRetrieval', title: 'Naïve RID Retrieval', durationSeconds: 25, purpose: 'Show repeated block reads when each returned RID is fetched independently.' },
  { id: 'GroupedRetrieval', title: 'Grouped RID Retrieval', durationSeconds: 30, purpose: 'Compare grouping RIDs by block while holding tree results constant.' },
  { id: 'Locality', title: 'Why Grouping Is Not Enough', durationSeconds: 22, purpose: 'Contrast heap block coverage with a full linear scan.' },
  { id: 'HeapVsClustered', title: 'Heap vs FG_PCT_home-Clustered Layout', durationSeconds: 30, purpose: 'Show how physical record organization affects range retrieval.' },
  { id: 'Benchmark', title: 'Four-Way Benchmark', durationSeconds: 35, purpose: 'Compare runtime and application-level data-block read calls.' },
  { id: 'Selectivity', title: 'Selectivity Experiment', durationSeconds: 30, purpose: 'Compare observed retrieval times across query selectivities.' },
  { id: 'Deletion', title: 'Deletion', durationSeconds: 25, purpose: 'Separate logical index deletion from storage tombstoning.' },
  { id: 'AfterDeletion', title: 'B+ Tree After Deletion', durationSeconds: 25, purpose: 'Show the resulting tree shape and validation outcome.' },
  { id: 'Conclusion', title: 'Technical Takeaway', durationSeconds: 25, purpose: 'Summarize index search, RID grouping, locality, and selectivity.' },
] as const;

export type SceneId = (typeof scenes)[number]['id'];

// slideSeconds: a REAL FOOTAGE slide rendered at this edit point.
// marker: a 1-second insertion slate (after the slide, if any) for footage recorded separately.
export type EditPoint = { after: SceneId; insert: string; slideSeconds?: number; marker: boolean };

export const editPoints: readonly EditPoint[] = [
  { after: 'ProjectTitle', insert: 'Human project introduction', slideSeconds: 13, marker: false },
  { after: 'Architecture', insert: 'Explain project architecture / show source directory', slideSeconds: 18, marker: false },
  { after: 'DataBlocks', insert: 'Run Task 1 in the terminal', slideSeconds: 25, marker: true },
  { after: 'BPlusTree', insert: 'Run Task 2 in the terminal', slideSeconds: 27, marker: true },
  { after: 'QueryTraversal', insert: 'Show range_greater_than(), collect_range(), leftmost_leaf_for_key()', slideSeconds: 23, marker: false },
  { after: 'GroupedRetrieval', insert: 'Show QueryEngine naïve vs grouped implementation', slideSeconds: 25, marker: false },
  { after: 'AfterDeletion', insert: 'Run real Task 3 deletion and show updated tree output', marker: true },
];

// Voice-over clips in public/voice, keyed by scene id or RealFootageNN slide id.
// Segments carrying a clip are sized to the clip length rounded up, plus 1 second.
export const voiceovers: Partial<Record<string, string>> = {
  ProjectTitle: 'voice/1 - Project Title.m4a',
  RealFootage01: 'voice/2 - REAL FOOTAGE 01 - Human Intro.m4a',
  Architecture: 'voice/3 - Architecture Overview.m4a',
  RealFootage02: 'voice/4 - REAL FOOTAGE 02.m4a',
  RecordLayout: 'voice/5 - Record Layout.m4a',
  DataBlocks: 'voice/6 - 4 KB Data Blocks.m4a',
  RealFootage03: 'voice/7 - REAL FOOTAGE 03.m4a',
  BPlusTree: 'voice/8 - B+ Tree Page Design.m4a',
  RealFootage04: 'voice/9 - REAL FOOTAGE 04.m4a',
  DuplicateKeys: 'voice/10 - Duplicate-Key Handling.m4a',
  QueryTraversal: 'voice/11 - Range-Query Traversal.m4a',
  RealFootage05: 'voice/12 - REAL FOOTAGE 05.m4a',
  NaiveRetrieval: 'voice/13 - Naive RID Retrieval.m4a',
  GroupedRetrieval: 'voice/14 - Grouped RID Retrieval.m4a',
  RealFootage06: 'voice/15 - REAL FOOTAGE 06.m4a',
  Locality: 'voice/16 - Why Grouping Is Not Enough.m4a',
  HeapVsClustered: 'voice/17 - Heap vs FG-clustered Layout.m4a',
};

export const footageSlideId = (number: number) => `RealFootage${String(number).padStart(2, '0')}`;

export const editPointSeconds = (point: EditPoint) => (point.slideSeconds ?? 0) + (point.marker ? EDIT_MARKER_SECONDS : 0);

const editSecondsAfter = (sceneId: SceneId) => {
  const point = editPoints.find((candidate) => candidate.after === sceneId);
  return point ? editPointSeconds(point) : 0;
};

export const sceneStartSeconds = (index: number) => scenes
  .slice(0, index)
  .reduce((seconds, scene) => seconds + scene.durationSeconds + editSecondsAfter(scene.id), 0);

export const masterDurationSeconds = scenes.reduce((seconds, scene) => seconds + scene.durationSeconds + editSecondsAfter(scene.id), 0);
