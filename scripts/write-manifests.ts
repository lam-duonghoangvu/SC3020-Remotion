import { mkdir, writeFile } from 'node:fs/promises';
import { editPoints, EDIT_MARKER_SECONDS, masterDurationSeconds, scenes, type EditPoint } from '../src/data/timeline';

const time = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
const editByScene = new Map<string, EditPoint & { number: number }>(editPoints.map((point, index) => [point.after, { ...point, number: index + 1 }] as const));
let cursor = 0;
const timelineRows: string[] = [
  '# Master Video Timeline',
  '',
  `Total runtime: ${time(masterDurationSeconds)} (${masterDurationSeconds} seconds). Markers are included in the master and each lasts ${EDIT_MARKER_SECONDS} second.`,
  '',
  '| Scene | Start | End | Duration | Purpose | Suggested real footage after it |',
  '| --- | ---: | ---: | ---: | --- | --- |',
];
const editRows: string[] = ['timestamp | scene before | recommended inserted footage | scene after', '--- | --- | --- | ---'];

for (let index = 0; index < scenes.length; index += 1) {
  const scene = scenes[index];
  const start = cursor;
  const end = start + scene.durationSeconds;
  const edit = editByScene.get(scene.id);
  const next = scenes[index + 1]?.title ?? 'End of master';
  timelineRows.push(`| ${scene.title} | ${time(start)} | ${time(end)} | ${time(scene.durationSeconds)} | ${scene.purpose} | ${edit?.marker && !edit.slideSeconds ? edit.insert : edit?.slideSeconds ? `Real Footage ${String(edit.number).padStart(2, '0')} slide` : '—'} |`);
  cursor = end;
  if (edit?.slideSeconds) {
    timelineRows.push(`| REAL FOOTAGE ${String(edit.number).padStart(2, '0')} (slide) | ${time(cursor)} | ${time(cursor + edit.slideSeconds)} | ${time(edit.slideSeconds)} | Footage slide rendered in the master | ${edit.marker ? edit.insert : '—'} |`);
    cursor += edit.slideSeconds;
  }
  if (edit?.marker) {
    editRows.push(`${time(cursor)} | ${edit.slideSeconds ? `Real Footage ${String(edit.number).padStart(2, '0')} slide` : scene.title} | ${edit.insert} | ${next}`);
    timelineRows.push(`| EDIT POINT ${String(edit.number).padStart(2, '0')} | ${time(cursor)} | ${time(cursor + EDIT_MARKER_SECONDS)} | ${time(EDIT_MARKER_SECONDS)} | Post-production insertion slate | ${edit.insert} |`);
    cursor += EDIT_MARKER_SECONDS;
  }
}

await mkdir('out', { recursive: true });
await writeFile('out/timeline.md', `${timelineRows.join('\n')}\n`, 'utf8');
await writeFile('out/edit-points.txt', `${editRows.join('\n')}\n`, 'utf8');
console.log(`Wrote out/timeline.md and out/edit-points.txt for ${masterDurationSeconds}s master.`);
