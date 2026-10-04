import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { projectData as d } from '../data/projectData';
import { Arrow, C, CodeFunctionLabel, MetricCard, Panel, Pill, Reveal, S, SceneFrame } from '../components/Visuals';

// Code excerpts are taken from SC3020_Project1 (trimmed for on-screen reading).

const KEYWORDS = new Set(['struct', 'class', 'const', 'return', 'if', 'while', 'for', 'true', 'false', 'static', 'constexpr', 'bool', 'void', 'float', 'auto', 'break', 'continue', 'private', 'public']);
const TYPES = /^(u?int\d+_t|size_t|std|Record|RecordId|Block|BlockHeader|Node|Entry|BPlusEntry|BPlusNode|BPlusNodeType|StorageManager|BPlusTree|IOStats|NodeType)$/;

const highlight = (line: string) => {
  const commentAt = line.indexOf('//');
  const code = commentAt >= 0 ? line.slice(0, commentAt) : line;
  const comment = commentAt >= 0 ? line.slice(commentAt) : '';
  const parts = code.split(/(\b[A-Za-z_][A-Za-z0-9_]*\b|\b\d+(?:\.\d+)?\b)/);
  return <>
    {parts.map((part, i) => {
      if (KEYWORDS.has(part)) return <span key={i} style={{ color: C.purple }}>{part}</span>;
      if (TYPES.test(part)) return <span key={i} style={{ color: C.blue }}>{part}</span>;
      if (/^\d/.test(part)) return <span key={i} style={{ color: C.amber }}>{part}</span>;
      if (/^[A-Za-z_]\w*$/.test(part) && parts[i + 1]?.startsWith('(')) return <span key={i} style={{ color: C.green }}>{part}</span>;
      return <span key={i}>{part}</span>;
    })}
    {comment && <span style={{ color: C.dim }}>{comment}</span>}
  </>;
};

const CodePanel = ({ file, code, at = 0, focus = [], fontSize = 18, style }: { file: string; code: string; at?: number; focus?: number[]; fontSize?: number; style?: React.CSSProperties }) => {
  const frame = useCurrentFrame();
  const glow = interpolate(frame, [at + 25, at + 45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const lines = code.replace(/^\n|\n$/g, '').split('\n');
  return <Reveal at={at} style={style}><div style={{ ...S.panel, padding: 0, overflow: 'hidden', height: '100%', boxSizing: 'border-box' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 18px', background: C.panel2, borderBottom: `1px solid ${C.line}` }}>
      {[C.red, C.amber, C.green].map((color) => <span key={color} style={{ width: 11, height: 11, borderRadius: 99, background: `${color}aa` }} />)}
      <span style={{ ...S.mono, color: C.muted, fontSize: 16, marginLeft: 10 }}>{file}</span>
    </div>
    <div style={{ ...S.mono, fontSize, lineHeight: 1.5, padding: '12px 0', whiteSpace: 'pre', color: C.text }}>
      {lines.map((line, i) => {
        const focused = focus.includes(i + 1);
        return <div key={i} style={{ display: 'flex', background: focused ? `rgba(255,196,92,${0.1 * glow})` : undefined, borderLeft: `3px solid ${focused ? `rgba(255,196,92,${glow})` : 'transparent'}` }}>
          <span style={{ width: 46, textAlign: 'right', paddingRight: 16, color: C.dim, flexShrink: 0 }}>{i + 1}</span>
          <span>{highlight(line)}</span>
        </div>;
      })}
    </div>
  </div></Reveal>;
};

// ---------------------------------------------------------------- 01 · Human intro

export const IntroFootageSlide = () => <SceneFrame section="Project 1 / Introduction" title="Hi, we are Group 19" accent={C.blue}>
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 40 }}>
    <Reveal at={10}><div style={{ color: C.muted, fontSize: 28, marginBottom: 46 }}>In this video, we will walk through:</div></Reveal>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', alignItems: 'stretch', gap: 18 }}>
      {[
        { n: '01', title: 'Design', detail: 'Disk-based storage and the B+ tree index', color: C.blue, at: 75 },
        { n: '02', title: 'Demonstration', detail: 'Tasks 1, 2 and 3 running on the NBA dataset', color: C.purple, at: 165 },
        { n: '03', title: 'Analysis', detail: 'Query performance of the different retrieval strategies', color: C.amber, at: 250 },
      ].map((step, i) => <React.Fragment key={step.n}>
        <Reveal at={step.at}><Panel accent={step.color} style={{ height: '100%', boxSizing: 'border-box', padding: '34px 34px' }}>
          <div style={{ ...S.mono, color: step.color, fontSize: 26, fontWeight: 700 }}>{step.n}</div>
          <div style={{ fontSize: 40, fontWeight: 720, marginTop: 12 }}>{step.title}</div>
          <div style={{ color: C.muted, fontSize: 23, lineHeight: 1.4, marginTop: 12 }}>{step.detail}</div>
        </Panel></Reveal>
        {i < 2 && <Reveal at={step.at + 50} style={{ display: 'flex' }}><Arrow color={C.dim} /></Reveal>}
      </React.Fragment>)}
    </div>
    <Reveal at={320}><div style={{ display: 'flex', gap: 14, marginTop: 56 }}>
      <Pill color={C.blue}>{d.records.valid.toLocaleString('en-US')} NBA GAME RECORDS</Pill>
      <Pill color={C.purple}>B+ TREE ON FG_PCT_home</Pill>
      <Pill color={C.amber}>STORE · QUERY · DELETE</Pill>
    </div></Reveal>
  </div>
</SceneFrame>;

// ---------------------------------------------------------------- 02 · Architecture / source tree

const TREE: { path: string; depth: number; color?: string; note?: string; at: number }[] = [
  { path: 'SC3020_Project1/', depth: 0, at: 0 },
  { path: 'main.cpp', depth: 1, at: 6, note: 'Tasks 1–3' },
  { path: 'src/', depth: 1, at: 10 },
  { path: 'block.cpp', depth: 2, color: C.blue, at: 30, note: 'storage' },
  { path: 'storage_manager.cpp', depth: 2, color: C.blue, at: 34, note: 'storage' },
  { path: 'disk_manager.cpp', depth: 2, color: C.blue, at: 38, note: 'storage' },
  { path: 'dataset_parser.cpp', depth: 2, color: C.blue, at: 42 },
  { path: 'index/', depth: 2, color: C.purple, at: 90, note: 'insert · search · delete · validate' },
  { path: 'query/', depth: 2, color: C.amber, at: 150, note: 'query_engine.cpp' },
  { path: 'experiment/', depth: 2, color: C.green, at: 200, note: 'linear scan · runner · timer' },
  { path: 'include/', depth: 1, at: 14, note: 'record.h · block.h · bplus_tree.h …' },
  { path: 'tests/', depth: 1, at: 18 },
];

const ModuleBox = ({ title, detail, color, at }: { title: string; detail: string; color: string; at: number }) => <Reveal at={at}><div style={{ ...S.panel, borderTop: `3px solid ${color}`, padding: '20px 22px', textAlign: 'center' }}>
  <div style={{ ...S.mono, color, fontSize: 25, fontWeight: 700 }}>{title}</div>
  <div style={{ color: C.muted, fontSize: 18, marginTop: 6 }}>{detail}</div>
</div></Reveal>;

export const ArchitectureFootageSlide = () => <SceneFrame section="System Design / Source Tree" title="Storage, index, query and experiment modules" accent={C.blue}>
  <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 40, height: '100%' }}>
    <Panel title="Source tree" style={{ boxSizing: 'border-box' }}>
      <div style={{ ...S.mono, fontSize: 21, lineHeight: 1.75 }}>
        {TREE.map((item) => <Reveal key={item.path} at={item.at} distance={6} duration={12}><div style={{ display: 'flex', alignItems: 'baseline', gap: 14, paddingLeft: item.depth * 30 }}>
          <span style={{ color: item.color ?? (item.path.endsWith('/') ? C.text : C.muted), fontWeight: item.color ? 700 : 500 }}>{item.depth > 0 ? '├ ' : ''}{item.path}</span>
          {item.note && <span style={{ color: C.dim, fontSize: 16 }}>{item.note}</span>}
        </div></Reveal>)}
      </div>
    </Panel>
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 26 }}>
      <ModuleBox title="QueryEngine" detail="connects the index to the data file" color={C.amber} at={150} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26 }}>
        <Reveal at={175}><div style={{ textAlign: 'center', color: C.purple, fontSize: 19 }}>① range_greater_than() ↙</div></Reveal>
        <Reveal at={235}><div style={{ textAlign: 'center', color: C.blue, fontSize: 19 }}>↘ ② fetch by RecordId</div></Reveal>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26 }}>
        <ModuleBox title="BPlusTree" detail="(FG_PCT_home, RecordId) → index_disk.bin" color={C.purple} at={90} />
        <ModuleBox title="StorageManager" detail="Record · Block → data_disk.bin" color={C.blue} at={30} />
      </div>
      <Reveal at={290}><Panel accent={C.red} style={{ padding: '18px 24px' }}>
        <div style={{ fontSize: 23, lineHeight: 1.4 }}><span style={{ ...S.mono, color: C.blue }}>StorageManager</span> does not know about the B+ tree.<br /><span style={{ color: C.muted }}>Only the</span> <span style={{ ...S.mono, color: C.amber }}>RecordIds</span> <span style={{ color: C.muted }}>returned by the index link the two files.</span></div>
      </Panel></Reveal>
      <ModuleBox title="experiment/" detail="linear scan baseline · benchmark runner · timer" color={C.green} at={200} />
    </div>
  </div>
</SceneFrame>;

// ---------------------------------------------------------------- 03 · Task 1 implementation

const RECORD_CODE = `
#pragma pack(push, 1)
struct Record {
    uint32_t game_date_est; // YYYYMMDD
    uint32_t team_id_home;
    float fg_pct_home;      // B+ tree key
    float ft_pct_home;
    float fg3_pct_home;
    uint16_t pts_home;
    uint8_t ast_home;
    uint8_t reb_home;
    uint8_t home_team_wins;
    bool is_deleted;        // tombstone
};
#pragma pack(pop)
static_assert(sizeof(Record) == 26);`;

const BLOCK_CODE = `
// (4096 - 2) / 26 = 157 record slots
MAX_RECORDS = (BLOCK_SIZE - HEADER_SIZE) / RECORD_SIZE;

bool Block::insert_record(const Record& record, uint16_t& out_slot_id) {
    uint16_t current_records = get_num_records();
    if (current_records >= MAX_RECORDS) return false; // full
    size_t offset = HEADER_SIZE + current_records * RECORD_SIZE;
    std::memcpy(data.data() + offset, &record, RECORD_SIZE);
    out_slot_id = current_records;
    return true;
}`;

const STORAGE_CODE = `
RecordId StorageManager::insert_record(const Record& record) {
    uint16_t slot_id;
    // Active block is full: flush it and start a new one
    if (!current_block.insert_record(record, slot_id)) {
        disk_manager.write_block(current_block_id, current_block);
        current_block_id = disk_manager.allocate_block();
        current_block = Block();
        current_block.insert_record(record, slot_id);
    }
    return {current_block_id, slot_id};
}`;

export const Task1FootageSlide = () => <SceneFrame section="Task 1 / Implementation" title="Record → Block → StorageManager" accent={C.blue}>
  <div style={{ display: 'grid', gridTemplateColumns: '0.72fr 1.28fr', gap: 26, height: '100%' }}>
    <CodePanel file="include/record.h" code={RECORD_CODE} focus={[5, 12, 15]} fontSize={19} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <CodePanel file="src/block.cpp" code={BLOCK_CODE} at={110} focus={[2, 6]} fontSize={17} />
      <CodePanel file="src/storage_manager.cpp" code={STORAGE_CODE} at={220} focus={[4, 5, 6, 10]} fontSize={17} />
      <Reveal at={330}><div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
        <Pill color={C.blue}>26 B RECORD</Pill><Arrow color={C.dim} /><Pill color={C.blue}>157 SLOTS / 4 KB BLOCK</Pill><Arrow color={C.dim} /><Pill color={C.amber}>RecordId (block_id, slot_id)</Pill>
      </div></Reveal>
    </div>
  </div>
</SceneFrame>;

// ---------------------------------------------------------------- 04 · B+ tree code

const NODE_CODE = `
struct BPlusEntry {
    float key;            // 4 B
    RecordId record_id;   // 6 B
};

// | magic 4 | type 1 | reserved 1 | count 2 |
// | parent 4 | previous 4 | next 4 | body  |
struct BPlusNode {
    static constexpr size_t HEADER_SIZE = 20;
    BPlusNodeType type;
    uint32_t parent, previous, next;
    std::vector<BPlusEntry> entries; // leaf
    std::vector<uint32_t> children;  // internal
    std::vector<float> keys;         // internal
};`;

const INSERT_CODE = `
bool BPlusTree::insert(float key, RecordId record_id) {
    leaf.entries.insert(position, new_entry);
    if (leaf.entries.size() <= order_) return true;

    // Leaf overflow: move the upper half to a new right leaf
    const size_t left_size = (leaf.entries.size() + 1) / 2;
    right.entries.assign(begin + left_size, leaf.entries.end());
    leaf.next = right.page_id;
    insert_sibling_into_parent(leaf.page_id, right.page_id);
}

void BPlusTree::insert_sibling_into_parent(uint32_t left, uint32_t right) {
    if (left.parent == INVALID_PAGE) { /* new root, ++height_ */ }
    parent.children.insert(index + 1, right_page);
    if (parent.children.size() > order_)
        split_internal(parent.page_id); // propagates upward
}`;

export const Task2FootageSlide = () => <SceneFrame section="Task 2 / Implementation" title="Node layout and iterative insertion with splits" accent={C.purple}>
  <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: 26, height: '100%' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <CodePanel file="include/bplus_node.h" code={NODE_CODE} focus={[2, 3, 9]} fontSize={18} />
      <Reveal at={150}><div style={{ ...S.mono, textAlign: 'center', fontSize: 23, fontWeight: 700 }}>⌊(4096 − 20) / 10⌋ = <span style={{ color: C.amber }}>n = {d.bplus.order}</span></div></Reveal>
    </div>
    <CodePanel file="src/index/bplus_insert.cpp" code={INSERT_CODE} at={60} focus={[6, 7, 9, 15, 16]} fontSize={18} />
  </div>
</SceneFrame>;

// ---------------------------------------------------------------- 05 · Range query code

const RANGE_CODE = `
std::vector<Entry> BPlusTree::range_greater_than(
        float key, IOStats& stats) const {
    // FG_PCT_home > key  ->  (key, +inf]
    return collect_range(key, +infinity, false, true);
}`;

const LEFTMOST_CODE = `
Node BPlusTree::leftmost_leaf_for_key(float key) const {
    Node leaf = descend_to_leaf(key);
    // Equal keys may span several leaves: walk left
    while (leaf.previous != INVALID_PAGE) {
        Node previous = read_node(leaf.previous);
        if (previous.entries.empty() ||
            previous.entries.back().key < key) break;
        leaf = std::move(previous);
    }
    return leaf;
}`;

const COLLECT_CODE = `
std::vector<Entry> BPlusTree::collect_range(
        float lower, float upper,
        bool incl_lower, bool incl_upper) const {
    Node leaf = leftmost_leaf_for_key(lower);
    while (true) {
        for (const Entry& entry : leaf.entries) {
            if (below_lower) continue;   // skip key <= 0.5
            if (above_upper) return result;
            result.push_back(entry);     // (key, RecordId)
        }
        if (leaf.next == INVALID_PAGE) break;
        leaf = read_node(leaf.next); // follow leaf chain
    }
    return result;
}`;

export const RangeQueryFootageSlide = () => <SceneFrame section="Task 3 / Range Query Code" title="Three functions answer FG_PCT_home > 0.5" accent={C.amber}>
  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 26, height: '100%' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <CodePanel file="src/index/bplus_search.cpp" code={RANGE_CODE} focus={[4]} fontSize={18} />
      <CodePanel file="src/index/bplus_search.cpp" code={LEFTMOST_CODE} at={200} focus={[4, 5, 6, 7, 8]} fontSize={18} />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <CodePanel file="src/index/bplus_search.cpp" code={COLLECT_CODE} at={400} focus={[4, 9, 12]} fontSize={18} />
      <Reveal at={560}><div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
        <CodeFunctionLabel color={C.amber}>range</CodeFunctionLabel><Arrow color={C.dim} />
        <CodeFunctionLabel color={C.purple}>leftmost leaf</CodeFunctionLabel><Arrow color={C.dim} />
        <CodeFunctionLabel color={C.green}>leaf chain</CodeFunctionLabel>
      </div></Reveal>
      <Reveal at={620}><MetricCard label="Matching entries" value={d.task3.matches.toLocaleString('en-US')} note={`${d.task3.selectivityPct}% of the dataset`} accent={C.amber} /></Reveal>
    </div>
  </div>
</SceneFrame>;

// ---------------------------------------------------------------- 06 · QueryEngine naïve vs grouped

const FlowBox = ({ title, detail, color, at, mono = true }: { title: string; detail?: string; color: string; at: number; mono?: boolean }) => <Reveal at={at}><div style={{ ...S.panel, borderLeft: `4px solid ${color}`, padding: '16px 22px' }}>
  <div style={{ ...(mono ? S.mono : {}), color, fontSize: 22, fontWeight: 700 }}>{title}</div>
  {detail && <div style={{ color: C.muted, fontSize: 18, marginTop: 5 }}>{detail}</div>}
</div></Reveal>;

const Down = ({ at, color = C.dim, label }: { at: number; color?: string; label?: string }) => <Reveal at={at} distance={6} duration={12}><Arrow vertical color={color} label={label} /></Reveal>;

const BlockReads = ({ blocks, color, at }: { blocks: number[]; color: string; at: number }) => <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
  {blocks.map((block, i) => <Reveal key={i} at={at + i * 8} distance={5} duration={10}><span style={{ ...S.mono, fontSize: 17, padding: '6px 10px', borderRadius: 6, color: blocks.indexOf(block) < i ? C.red : color, background: `${blocks.indexOf(block) < i ? C.red : color}18`, border: `1px solid ${blocks.indexOf(block) < i ? C.red : color}55` }}>read B{block}</span></Reveal>)}
</div>;

const Lane = ({ name, color, at, children, calls, ms }: { name: string; color: string; at: number; children: React.ReactNode; calls: number; ms: number }) => <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
  <Reveal at={at}><div style={{ ...S.label, color, fontSize: 18, textAlign: 'center' }}>{name}</div></Reveal>
  {children}
  <Reveal at={at + 150}><div style={{ ...S.panel, borderTop: `3px solid ${color}`, padding: '14px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
    <span style={{ color, fontSize: 34, fontWeight: 750 }}>{calls.toLocaleString('en-US')} <span style={{ fontSize: 18, color: C.muted, fontWeight: 500 }}>read calls</span></span>
    <span style={{ ...S.mono, color: C.muted, fontSize: 20 }}>{ms.toFixed(3)} ms</span>
  </div></Reveal>
</div>;

const SAMPLE_BLOCKS = d.task3.examples.rids.map((rid) => rid.block);

export const QueryEngineFootageSlide = () => <SceneFrame section="Task 3 / QueryEngine" title="One query path, two retrieval strategies" accent={C.green}>
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 4 }}>
    <div style={{ display: 'flex', justifyContent: 'center' }}><div style={{ width: 900 }}>
      <FlowBox title="tree_.range_greater_than(threshold)" detail={`Same B+ tree result for both strategies · ${d.task3.matches.toLocaleString('en-US')} (key, RecordId) entries`} color={C.amber} at={0} />
    </div></div>
    <Reveal at={40}><div style={{ ...S.mono, textAlign: 'center', color: C.text, fontSize: 21, margin: '6px 0' }}>if (strategy == RetrievalStrategy::Grouped) <span style={{ color: C.dim }}>…</span> else <span style={{ color: C.dim }}>…</span></div></Reveal>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, flex: 1 }}>
      <Lane name="Naïve · else branch" color={C.grey} at={60} calls={d.benchmark.naiveReads} ms={d.benchmark.naiveMedianMs}>
        <FlowBox title="for each entry:" detail="one call per RecordId, in index order" color={C.grey} at={75} />
        <Down at={95} />
        <FlowBox title="storage_.get_record(rid)" detail="reads the RID's data block every time" color={C.grey} at={105} />
        <Down at={125} />
        <Reveal at={130}><BlockReads blocks={SAMPLE_BLOCKS} color={C.grey} at={130} /></Reveal>
      </Lane>
      <Lane name="Grouped · if branch" color={C.green} at={260} calls={d.benchmark.groupedReads} ms={d.benchmark.groupedMedianMs}>
        <FlowBox title="get_records_grouped_by_block(ids)" detail="collect every RecordId first" color={C.green} at={275} />
        <Down at={295} />
        <FlowBox title="std::map<block_id, slots>" detail="group the requested slots by data block" color={C.green} at={305} />
        <Down at={325} />
        <Reveal at={330}><BlockReads blocks={[...new Set(SAMPLE_BLOCKS)]} color={C.green} at={330} /></Reveal>
      </Lane>
    </div>
    <Reveal at={520}><div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 14 }}>
      <Pill color={C.amber}>SAME B+ TREE</Pill><Pill color={C.blue}>SAME HEAP LAYOUT</Pill><Pill color={C.purple}>SAME {d.task3.matches.toLocaleString('en-US')} RECORDS</Pill><Pill color={C.green}>ONLY RETRIEVAL CHANGES</Pill>
    </div></Reveal>
  </div>
</SceneFrame>;

// ---------------------------------------------------------------- 07 · Task 3 execution

const executionLines = [
  { at: 20, color: C.muted, text: '$ ./sc3020_project1 --task 3' },
  { at: 75, color: C.blue, text: '[config] layout=heap  retrieval=grouped' },
  { at: 150, color: C.amber, text: '[b+ tree] predicate: FG_PCT_home > 0.5' },
  { at: 230, color: C.amber, text: '[b+ tree] matches=6,054  mean=0.536966' },
  { at: 335, color: C.grey, text: '[linear]  matches=6,054  mean=0.536966' },
  { at: 420, color: C.green, text: '[verify]  count=MATCH  average=MATCH' },
  { at: 510, color: C.red, text: '[delete]  removed 6,054 matching records' },
  { at: 625, color: C.green, text: '[b+ tree] matches=0    [linear] matches=0' },
  { at: 770, color: C.purple, text: '[tree] active_nodes=76  levels=2' },
  { at: 835, color: C.green, text: '[validate] PASS' },
] as const;

const ExecutionStep = ({ label, detail, color, at, active }: { label: string; detail: string; color: string; at: number; active: boolean }) => <Reveal at={at} distance={8} duration={14}>
  <div style={{ border: `1px solid ${active ? color : C.line}`, background: active ? `${color}18` : C.panel2, borderRadius: 10, padding: '13px 15px', boxShadow: active ? `0 0 22px ${color}20` : undefined }}>
    <div style={{ color: active ? color : C.muted, fontSize: 17, fontWeight: 750, letterSpacing: .5 }}>{label}</div>
    <div style={{ color: active ? C.text : C.dim, fontSize: 15, marginTop: 4 }}>{detail}</div>
  </div>
</Reveal>;

export const Task3ExecutionFootageSlide = () => {
  const frame = useCurrentFrame();
  const deleteProgress = interpolate(frame, [500, 590], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const steps = [
    { label: 'CONFIGURE', detail: 'grouped · heap', color: C.blue, at: 35, until: 145 },
    { label: 'QUERY', detail: 'B+ tree range', color: C.amber, at: 145, until: 325 },
    { label: 'VERIFY', detail: 'linear scan', color: C.grey, at: 325, until: 495 },
    { label: 'DELETE', detail: '6,054 records', color: C.red, at: 495, until: 615 },
    { label: 'RECHECK', detail: 'zero matches', color: C.green, at: 615, until: 755 },
    { label: 'VALIDATE', detail: 'tree passes', color: C.purple, at: 755, until: 990 },
  ] as const;

  return <SceneFrame section="Task 3 / Animated Execution" title="Query, verify, delete, and validate" accent={C.green}>
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 22 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
        {steps.map((step) => <ExecutionStep key={step.label} {...step} active={frame >= step.at && frame < step.until} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.35fr .65fr', gap: 24, flex: 1, minHeight: 0 }}>
        <Panel accent={C.green} title="TASK 3 · PROGRAM OUTPUT" style={{ padding: '22px 26px', overflow: 'hidden' }}>
          <div style={{ ...S.mono, background: '#080d13', border: `1px solid ${C.line}`, borderRadius: 12, height: 'calc(100% - 4px)', boxSizing: 'border-box', padding: '18px 22px', fontSize: 20, lineHeight: 1.7 }}>
            {executionLines.map((line) => <Reveal key={line.text} at={line.at} distance={5} duration={12}>
              <div style={{ color: line.color, whiteSpace: 'pre' }}>{line.text}</div>
            </Reveal>)}
            <Reveal at={500} distance={0} duration={10}>
              <div style={{ height: 6, background: C.redSoft, borderRadius: 99, overflow: 'hidden', marginTop: 7 }}>
                <div style={{ height: '100%', width: `${deleteProgress}%`, background: C.red, borderRadius: 99 }} />
              </div>
            </Reveal>
          </div>
        </Panel>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Reveal at={210}><MetricCard label="Before deletion" value={d.task3.matches.toLocaleString('en-US')} note={`mean · ${d.task3.meanFgPct.toFixed(6)}`} accent={C.amber} /></Reveal>
          <Reveal at={620}><MetricCard label="After deletion" value="0 matches" note="B+ tree = linear scan" accent={C.green} /></Reveal>
          <Reveal at={760}><Panel accent={C.purple} title="UPDATED B+ TREE" style={{ padding: '20px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><div style={{ color: C.purple, fontSize: 38, fontWeight: 760 }}>{d.bplus.afterDeletionNodes}</div><div style={{ color: C.muted, fontSize: 16 }}>active nodes</div></div>
              <div><div style={{ color: C.purple, fontSize: 38, fontWeight: 760 }}>{d.bplus.afterDeletionLevels}</div><div style={{ color: C.muted, fontSize: 16 }}>levels</div></div>
            </div>
            <Reveal at={825} distance={5} duration={12}><div style={{ marginTop: 16, borderRadius: 8, padding: '11px 14px', background: `${C.green}18`, border: `1px solid ${C.green}66`, color: C.green, fontSize: 19, fontWeight: 750, textAlign: 'center' }}>✓ STRUCTURAL VALIDATION PASSED</div></Reveal>
          </Panel></Reveal>
        </div>
      </div>
    </div>
  </SceneFrame>;
};

// Keyed by edit point number (1-based), matching editPoints in data/timeline.ts.
export const footageSlides: Record<number, React.FC> = {
  1: IntroFootageSlide,
  2: ArchitectureFootageSlide,
  3: Task1FootageSlide,
  4: Task2FootageSlide,
  5: RangeQueryFootageSlide,
  6: QueryEngineFootageSlide,
  7: Task3ExecutionFootageSlide,
};
