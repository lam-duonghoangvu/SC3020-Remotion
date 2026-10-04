import React from 'react';
import { Audio, Composition, Sequence, staticFile } from 'remotion';
import { sceneComponents } from './scenes/Scenes';
import { footageSlides } from './scenes/FootageSlides';
import { EditMarker } from './components/Visuals';
import { EDIT_MARKER_SECONDS, editPoints, footageSlideId, FPS, HEIGHT, masterDurationSeconds, scenes, voiceovers, WIDTH } from './data/timeline';

// Renders a segment with its voice-over clip, if one is mapped to this id.
const Voiced = ({ id, component: Component }: { id: string; component: React.FC }) => {
  const voice = voiceovers[id];
  return <>{voice && <Audio src={staticFile(voice)} />}<Component /></>;
};

export const MasterVideo: React.FC = () => {
  let cursor = 0;
  return <>
    {scenes.map((scene) => {
      const Component = sceneComponents[scene.id];
      const start = cursor;
      cursor += scene.durationSeconds * FPS;
      const editPointIndex = editPoints.findIndex((point) => point.after === scene.id);
      const editPoint = editPoints[editPointIndex];
      const section = <Sequence key={scene.id} from={start} durationInFrames={scene.durationSeconds * FPS} name={scene.title}><Voiced id={scene.id} component={Component} /></Sequence>;
      if (!editPoint) return section;
      const number = editPointIndex + 1;
      const label = String(number).padStart(2, '0');
      const Slide = footageSlides[number];
      let slide: React.ReactNode = null;
      if (editPoint.slideSeconds && Slide) {
        slide = <Sequence from={cursor} durationInFrames={editPoint.slideSeconds * FPS} name={`Real Footage ${label}`}><Voiced id={footageSlideId(number)} component={Slide} /></Sequence>;
        cursor += editPoint.slideSeconds * FPS;
      }
      let marker: React.ReactNode = null;
      if (editPoint.marker) {
        marker = <Sequence from={cursor} durationInFrames={EDIT_MARKER_SECONDS * FPS} name={`Edit Point ${label}`}><EditMarker number={number} insert={editPoint.insert} /></Sequence>;
        cursor += EDIT_MARKER_SECONDS * FPS;
      }
      return <React.Fragment key={`${scene.id}-with-edit`}>{section}{slide}{marker}</React.Fragment>;
    })}
  </>;
};

export const RemotionRoot: React.FC = () => <>
  <Composition id="Master" component={MasterVideo} durationInFrames={masterDurationSeconds * FPS} fps={FPS} width={WIDTH} height={HEIGHT} />
  {scenes.map((scene) => {
    const Component = sceneComponents[scene.id];
    return <Composition key={scene.id} id={scene.id} component={() => <Voiced id={scene.id} component={Component} />} durationInFrames={scene.durationSeconds * FPS} fps={FPS} width={WIDTH} height={HEIGHT} />;
  })}
  {editPoints.map((point, index) => {
    const Slide = footageSlides[index + 1];
    if (!point.slideSeconds || !Slide) return null;
    const id = footageSlideId(index + 1);
    return <Composition key={id} id={id} component={() => <Voiced id={id} component={Slide} />} durationInFrames={point.slideSeconds * FPS} fps={FPS} width={WIDTH} height={HEIGHT} />;
  })}
  {([
    { id: 'StorageLayout', sceneId: 'DataBlocks' },
    { id: 'NaiveVsGrouped', sceneId: 'GroupedRetrieval' },
  ] as const).map(({ id, sceneId }) => {
    const scene = scenes.find((candidate) => candidate.id === sceneId)!;
    const Component = sceneComponents[sceneId];
    return <Composition key={id} id={id} component={Component} durationInFrames={scene.durationSeconds * FPS} fps={FPS} width={WIDTH} height={HEIGHT} />;
  })}
</>;
