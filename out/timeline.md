# Master Video Timeline

Total runtime: 09:21 (561 seconds). Markers are included in the master and each lasts 1 second.

| Scene | Start | End | Duration | Purpose | Suggested real footage after it |
| --- | ---: | ---: | ---: | --- | --- |
| Project Title | 00:00 | 00:12 | 00:12 | Introduce the project and its storage, index, and retrieval themes. | Real Footage 01 slide |
| REAL FOOTAGE 01 (slide) | 00:12 | 00:25 | 00:13 | Footage slide rendered in the master | — |
| Architecture Overview | 00:25 | 00:57 | 00:32 | Trace records from the input file into separate data and index files. | Real Footage 02 slide |
| REAL FOOTAGE 02 (slide) | 00:57 | 01:15 | 00:18 | Footage slide rendered in the master | — |
| Record Layout | 01:15 | 01:35 | 00:20 | Show the packed 26-byte record and the key and tombstone fields. | — |
| 4 KB Data Blocks | 01:35 | 02:05 | 00:30 | Explain block capacity, heap pages, and RecordId addressing. | Real Footage 03 slide |
| REAL FOOTAGE 03 (slide) | 02:05 | 02:30 | 00:25 | Footage slide rendered in the master | Run Task 1 in the terminal |
| EDIT POINT 03 | 02:30 | 02:31 | 00:01 | Post-production insertion slate | Run Task 1 in the terminal |
| B+ Tree Page Design | 02:31 | 03:03 | 00:32 | Show the page format, fanout, leaf links, and tree shape. | Real Footage 04 slide |
| REAL FOOTAGE 04 (slide) | 03:03 | 03:30 | 00:27 | Footage slide rendered in the master | Run Task 2 in the terminal |
| EDIT POINT 04 | 03:30 | 03:31 | 00:01 | Post-production insertion slate | Run Task 2 in the terminal |
| Duplicate-Key Handling | 03:31 | 03:54 | 00:23 | Explain unique composite ordering for repeated key values. | — |
| Range-Query Traversal | 03:54 | 04:25 | 00:31 | Trace the greater-than range scan and report its result set. | Real Footage 05 slide |
| REAL FOOTAGE 05 (slide) | 04:25 | 04:48 | 00:23 | Footage slide rendered in the master | — |
| Naïve RID Retrieval | 04:48 | 05:13 | 00:25 | Show repeated block reads when each returned RID is fetched independently. | — |
| Grouped RID Retrieval | 05:13 | 05:43 | 00:30 | Compare grouping RIDs by block while holding tree results constant. | Real Footage 06 slide |
| REAL FOOTAGE 06 (slide) | 05:43 | 06:08 | 00:25 | Footage slide rendered in the master | — |
| Why Grouping Is Not Enough | 06:08 | 06:30 | 00:22 | Contrast heap block coverage with a full linear scan. | — |
| Heap vs FG_PCT_home-Clustered Layout | 06:30 | 07:00 | 00:30 | Show how physical record organization affects range retrieval. | — |
| Four-Way Benchmark | 07:00 | 07:35 | 00:35 | Compare runtime and application-level data-block read calls. | — |
| Selectivity Experiment | 07:35 | 08:05 | 00:30 | Compare observed retrieval times across query selectivities. | — |
| Deletion | 08:05 | 08:30 | 00:25 | Separate logical index deletion from storage tombstoning. | — |
| B+ Tree After Deletion | 08:30 | 08:55 | 00:25 | Show the resulting tree shape and validation outcome. | Run real Task 3 deletion and show updated tree output |
| EDIT POINT 07 | 08:55 | 08:56 | 00:01 | Post-production insertion slate | Run real Task 3 deletion and show updated tree output |
| Technical Takeaway | 08:56 | 09:21 | 00:25 | Summarize index search, RID grouping, locality, and selectivity. | — |
