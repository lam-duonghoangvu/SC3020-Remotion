import React from 'react';
import { Composition, Sequence } from 'remotion';
import { sceneComponents } from './scenes/Scenes';
import { footageSlides } from './scenes/FootageSlides';
import { EditMarker } from './components/Visuals';
import { EDIT_MARKER_SECONDS, editPoints, FPS, HEIGHT, masterDurationSeconds, scenes, WIDTH } from './data/timeline';

export const MasterVideo: React.FC = () => {
  let cursor = 0;
  return <>
    {scenes.map((scene) => {
      const Component = sceneComponents[scene.id];
      const start = cursor;
      cursor += scene.durationSeconds * FPS;
      const editPointIndex = editPoints.findIndex((point) => point.after === scene.id);
      const editPoint = editPoints[editPointIndex];
      const section = <Sequence key={scene.id} from={start} durationInFrames={scene.durationSeconds * FPS} name={scene.title}><Component /></Sequence>;
      if (!editPoint) return section;
      const number = editPointIndex + 1;
      const label = String(number).padStart(2, '0');
      const Slide = footageSlides[number];
      let slide: React.ReactNode = null;
      if (editPoint.slideSeconds && Slide) {
        slide = <Sequence from={cursor} durationInFrames={editPoint.slideSeconds * FPS} name={`Real Footage ${label}`}><Slide /></Sequence>;
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
    return <Composition key={scene.id} id={scene.id} component={Component} durationInFrames={scene.durationSeconds * FPS} fps={FPS} width={WIDTH} height={HEIGHT} />;
  })}
  {editPoints.map((point, index) => {
    const Slide = footageSlides[index + 1];
    if (!point.slideSeconds || !Slide) return null;
    return <Composition key={`footage-${index + 1}`} id={`RealFootage${String(index + 1).padStart(2, '0')}`} component={Slide} durationInFrames={point.slideSeconds * FPS} fps={FPS} width={WIDTH} height={HEIGHT} />;
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
