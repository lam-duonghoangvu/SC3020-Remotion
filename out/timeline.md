# Master Video Timeline

Total runtime: 08:07 (487 seconds). Markers are included in the master and each lasts 1 second.

| Scene | Start | End | Duration | Purpose | Suggested real footage after it |
| --- | ---: | ---: | ---: | --- | --- |
| Project Title | 00:00 | 00:08 | 00:08 | Introduce the project and its storage, index, and retrieval themes. | Real Footage 01 slide |
| REAL FOOTAGE 01 (slide) | 00:08 | 00:28 | 00:20 | Footage slide rendered in the master | — |
| Architecture Overview | 00:28 | 00:53 | 00:25 | Trace records from the input file into separate data and index files. | Real Footage 02 slide |
| REAL FOOTAGE 02 (slide) | 00:53 | 01:13 | 00:20 | Footage slide rendered in the master | — |
| Record Layout | 01:13 | 01:33 | 00:20 | Show the packed 26-byte record and the key and tombstone fields. | — |
| 4 KB Data Blocks | 01:33 | 01:58 | 00:25 | Explain block capacity, heap pages, and RecordId addressing. | Real Footage 03 slide |
| REAL FOOTAGE 03 (slide) | 01:58 | 02:13 | 00:15 | Footage slide rendered in the master | Run Task 1 in the terminal |
| EDIT POINT 03 | 02:13 | 02:14 | 00:01 | Post-production insertion slate | Run Task 1 in the terminal |
| B+ Tree Page Design | 02:14 | 02:44 | 00:30 | Show the page format, fanout, leaf links, and tree shape. | Real Footage 04 slide |
| REAL FOOTAGE 04 (slide) | 02:44 | 02:54 | 00:10 | Footage slide rendered in the master | Run Task 2 in the terminal |
| EDIT POINT 04 | 02:54 | 02:55 | 00:01 | Post-production insertion slate | Run Task 2 in the terminal |
| Duplicate-Key Handling | 02:55 | 03:15 | 00:20 | Explain unique composite ordering for repeated key values. | — |
| Range-Query Traversal | 03:15 | 03:45 | 00:30 | Trace the greater-than range scan and report its result set. | Real Footage 05 slide |
| REAL FOOTAGE 05 (slide) | 03:45 | 04:10 | 00:25 | Footage slide rendered in the master | — |
| Naïve RID Retrieval | 04:10 | 04:30 | 00:20 | Show repeated block reads when each returned RID is fetched independently. | — |
| Grouped RID Retrieval | 04:30 | 04:55 | 00:25 | Compare grouping RIDs by block while holding tree results constant. | Show QueryEngine naïve vs grouped implementation |
| EDIT POINT 06 | 04:55 | 04:56 | 00:01 | Post-production insertion slate | Show QueryEngine naïve vs grouped implementation |
| Why Grouping Is Not Enough | 04:56 | 05:16 | 00:20 | Contrast heap block coverage with a full linear scan. | — |
| Heap vs FG_PCT_home-Clustered Layout | 05:16 | 05:46 | 00:30 | Show how physical record organization affects range retrieval. | — |
| Four-Way Benchmark | 05:46 | 06:21 | 00:35 | Compare runtime and application-level data-block read calls. | — |
| Selectivity Experiment | 06:21 | 06:51 | 00:30 | Compare observed retrieval times across query selectivities. | — |
| Deletion | 06:51 | 07:16 | 00:25 | Separate logical index deletion from storage tombstoning. | — |
| B+ Tree After Deletion | 07:16 | 07:41 | 00:25 | Show the resulting tree shape and validation outcome. | Run real Task 3 deletion and show updated tree output |
| EDIT POINT 07 | 07:41 | 07:42 | 00:01 | Post-production insertion slate | Run real Task 3 deletion and show updated tree output |
| Technical Takeaway | 07:42 | 08:07 | 00:25 | Summarize index search, RID grouping, locality, and selectivity. | — |
