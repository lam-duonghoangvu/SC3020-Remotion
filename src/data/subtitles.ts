import { editPoints, EDIT_MARKER_SECONDS, footageSlideId, scenes } from './timeline';

export type SubtitleCue = { startSeconds: number; endSeconds: number; text: string };

const transcripts: Record<string, string> = {
  ProjectTitle: 'Our project implements two core parts of a database system: disk-based storage and a disk-resident B+ tree index. We use them to store, query, and delete NBA game records.',
  RealFootage01: 'Hi, we are Group 19. In this video, we will first explain our storage and B+ tree design, then demonstrate Tasks 1, 2, and 3, and finally analyze the query performance.',
  Architecture: 'The input starts from games.txt. The parser converts each valid row into a fixed-size record. StorageManager writes those records into 4-kilobyte data blocks. Each stored record receives a RecordId, containing a block ID and a slot ID. The B+ tree is stored separately and maps FG_PCT_home to these RecordIds. The data file and index file are therefore independent.',
  RealFootage02: 'In the code, the main modules are separated into storage, index, query, and experiment components. StorageManager does not know about the B+ tree. The QueryEngine connects them by using the RecordIds returned by the index.',
  RecordLayout: 'Each record is packed into exactly 26 bytes. We store the date and numeric game statistics using fixed-size primitive types. FG_PCT_home is the B+ tree key. The final byte is is_deleted, which acts as a tombstone for logical deletion.',
  DataBlocks: 'Each data block is 4,096 bytes. The first two bytes store the record count, followed by fixed-size 26-byte record slots. This gives 157 records per block, with 12 bytes unused. After removing incomplete input rows, 26,552 records require 170 data blocks. A record is addressed by its block ID and slot ID.',
  RealFootage03: 'Here is the record structure and the block implementation. StorageManager appends records into the active block and flushes it when needed. Now we run Task 1. The program reports a 26-byte record, 157 records per block, 26,552 stored records, and 170 data blocks.',
  BPlusTree: 'The B+ tree is also disk-based. Every node occupies one 4-kilobyte index page. Each page has a 20-byte header. A leaf entry stores a 4-byte key and a 6-byte RecordId, so each entry uses 10 bytes. This gives a maximum leaf capacity of 407 entries, which defines our parameter n. The final heap-built tree contains 97 nodes across two levels.',
  RealFootage04: 'The tree is built using iterative insertion. When a leaf overflows, it is split and the new child is inserted into its parent. The process can propagate upward. Running Task 2 gives n equals 407, 97 active nodes, two levels, and 95 separator keys in the root.',
  DuplicateKeys: 'FG_PCT_home contains many duplicate values. In fact, 848 records have the value 0.500. So a key alone cannot uniquely identify a record. We order leaf entries by the composite pair of key and RecordId. This lets multiple equal keys coexist while deletion can still identify one exact record.',
  QueryTraversal: 'For Task 3, we search for records with FG_PCT_home strictly greater than 0.5. The tree first descends from the root to a boundary leaf. Because duplicate 0.5 values can span several leaves, the implementation may walk left through previous pointers. It then scans forward through the linked leaves and collects matching RecordIds. The query returns 6,054 records, or 22.8 percent of the dataset, with mean FG_PCT_home equal to 0.536966.',
  RealFootage05: 'These are the three important functions. range_greater_than defines the range, leftmost_leaf_for_key handles duplicate boundary values, and collect_range follows the leaf chain to collect all matching entries.',
  NaiveRetrieval: 'The first retrieval strategy is naïve. After the B+ tree returns matching RecordIds, we fetch every record independently. If several RecordIds belong to the same data block, that block can be requested repeatedly. For the official predicate, this produces 6,052 application-level data-block read calls and a median runtime of 4.966 milliseconds.',
  GroupedRetrieval: 'The grouped strategy keeps exactly the same B+ tree result. The only change is how the returned RecordIds are fetched. We group them by block ID, read each required block once, and then access all required slots from that block. Application-level data reads fall from 6,052 to 169, a 97.21 percent reduction. Median runtime improves from 4.966 to 0.902 milliseconds, giving a 5.5 times speedup.',
  RealFootage06: 'Both versions use the same B+ tree, the same heap data layout, and return the same records. The naïve version calls record retrieval once for every RID. The grouped version first groups the RIDs by block and then performs block-oriented retrieval. So this experiment isolates only the retrieval strategy.',
  Locality: 'However, grouping alone does not make the heap-indexed query faster than a linear scan. The matching records are scattered across every one of the 170 data blocks. Grouped B+ retrieval therefore still touches all 170 blocks and takes 0.902 milliseconds, while the sequential linear scan takes 0.547 milliseconds.',
  HeapVsClustered: 'We therefore ran an additional experiment on physical locality. Instead of storing records in input order, we stably sort them by FG_PCT_home before writing the data file. The B+ tree remains a separate secondary index containing key and RecordId pairs. For the same query, qualifying records now occupy only 40 data blocks instead of 170. Median grouped retrieval falls from 0.902 to 0.432 milliseconds, a 2.09 times speedup.',
  Benchmark: 'These four configurations separate the main costs. Linear scan takes 0.547 milliseconds. Naïve B+ retrieval takes 4.966 milliseconds because of repeated data-block accesses. Grouping reduces it to 0.902 milliseconds. Finally, grouped retrieval over FG_PCT_home-clustered storage takes 0.432 milliseconds. The corresponding application read counts are 170, 6,052, 169, and 39. These are application-level reads, not physical-device reads.',
  Selectivity: 'The result also depends on query selectivity. At high selectivity, many records match and the heap index still touches most data blocks, so sequential scanning is efficient. As selectivity decreases, indexed retrieval becomes more attractive. At 4.91 percent selectivity, heap grouped retrieval slightly beats the linear scan. At 0.99 percent, it is clearly faster. Clustering improves locality further and shifts this crossover earlier. These crossover points are specific to this dataset and benchmark environment.',
  Deletion: 'After retrieval, Task 3 deletes all 6,054 matching records. In the B+ tree, deletion uses the exact key and RecordId pair. An underfilled node first attempts redistribution from a sibling; otherwise nodes are merged and the parent is repaired recursively. In the data file, deletion is logical: is_deleted changes from zero to one. Records are not moved, so existing RecordIds remain stable.',
  AfterDeletion: 'After deleting all values strictly above 0.5, the tree shrinks from 97 to 76 active nodes. The number of leaves falls from 96 to 75, while the height remains two levels. The root now contains 74 separator keys. The largest remaining key is exactly 0.500, which is correct because the predicate is strictly greater than 0.5. Structural validation passes after deletion.',
  RealFootage07: 'For Task 3, we use grouped retrieval on the heap-organized data file. Before deletion, the B-plus-tree query finds 6,054 records with FG_PCT_home above 0.5. A linear scan returns the same count and average of 0.536966, confirming the result. We then delete all matching records. When both queries are repeated, each returns zero matches. The final output confirms 76 active B-plus-tree nodes, two levels, and successful structural validation.',
  Conclusion: 'The B+ tree narrows the search, but it does not determine query performance. Grouping RecordIds cuts redundant reads, while clustering improves data locality. Selectivity determines how many records we fetch. Grouping reduced read calls from 6,052 to 169, and clustering reduced unique data blocks from 170 to 40. Together, these results show that storage layout and retrieval strategy matter as much as index traversal.',
};

const audioDurations: Record<string, number> = {
  ProjectTitle: 10.558667, RealFootage01: 11.924, Architecture: 30.014667, RealFootage02: 16.190667,
  RecordLayout: 18.814667, DataBlocks: 28.905333, RealFootage03: 23.38, BPlusTree: 30.761333,
  RealFootage04: 25.214667, DuplicateKeys: 21.14, QueryTraversal: 29.634, RealFootage05: 21.226,
  NaiveRetrieval: 23.364, GroupedRetrieval: 28.24, RealFootage06: 23.36, Locality: 20.427,
  HeapVsClustered: 28.245, Benchmark: 34.986, Selectivity: 30.014, Deletion: 24.773,
  AfterDeletion: 25.32, RealFootage07: 31.964, Conclusion: 25.22,
};

const splitIntoChunks = (text: string, maxWords = 10) => {
  const protectedPeriod = '\uE000';
  const protectedText = text.replace(/(?<=[A-Za-z0-9_])\.(?=[A-Za-z0-9_])/g, protectedPeriod);
  const sentences = (protectedText.match(/[^.!?]+[.!?]?/g) ?? [protectedText])
    .map((sentence) => sentence.replaceAll(protectedPeriod, '.'));
  return sentences.flatMap((sentence) => {
    const words = sentence.trim().split(/\s+/);
    const chunks: string[] = [];
    while (words.length > maxWords) {
      let splitAt = maxWords;
      for (let index = maxWords - 1; index >= 5; index -= 1) {
        if (/[,;:]$/.test(words[index])) { splitAt = index + 1; break; }
      }
      if (words.length - splitAt < 4) splitAt = Math.ceil(words.length / 2);
      chunks.push(words.splice(0, splitAt).join(' '));
    }
    if (words.length) chunks.push(words.join(' '));
    return chunks;
  }).filter(Boolean);
};

const cueWeight = (text: string) => text.split(/\s+/).length + (/[.!?]$/.test(text) ? 1.5 : /[,;:]$/.test(text) ? 0.7 : 0.25);

const cuesForSegment = (id: string, segmentStart: number, segmentDuration: number): SubtitleCue[] => {
  const text = transcripts[id];
  if (!text) return [];
  const chunks = splitIntoChunks(text);
  const usableDuration = Math.min(audioDurations[id] ?? segmentDuration, segmentDuration);
  const weights = chunks.map(cueWeight);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let cursor = segmentStart;
  return chunks.map((chunk, index) => {
    const duration = usableDuration * weights[index] / totalWeight;
    const cue = { startSeconds: cursor, endSeconds: cursor + duration, text: chunk };
    cursor += duration;
    return cue;
  });
};

const buildSubtitleCues = () => {
  const cues: SubtitleCue[] = [];
  let cursor = 0;
  scenes.forEach((scene) => {
    cues.push(...cuesForSegment(scene.id, cursor, scene.durationSeconds));
    cursor += scene.durationSeconds;
    const editIndex = editPoints.findIndex((point) => point.after === scene.id);
    const editPoint = editPoints[editIndex];
    if (!editPoint) return;
    if (editPoint.slideSeconds) {
      cues.push(...cuesForSegment(footageSlideId(editIndex + 1), cursor, editPoint.slideSeconds));
      cursor += editPoint.slideSeconds;
    }
    if (editPoint.marker) cursor += EDIT_MARKER_SECONDS;
  });
  return cues;
};

export const subtitleCues = buildSubtitleCues();
