import { VoidComponent } from "solid-js";

interface TimelineSeekerProps {
  currentTime: number;
  max: number;
  seekRatio: number;
  onSeek: (seeking: boolean, time?: number) => void;
}

export const TimelineSeeker: VoidComponent<TimelineSeekerProps> = (props) => {
  let pointerId: number = undefined;
  let mouseOffset = 0;
  let startTime = 0;

  return (
    <div
      class="h-full w-full touch-none"
      onPointerDown={(e) => {
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        pointerId = e.pointerId;
        mouseOffset = e.clientX;
        startTime = props.currentTime;
      }}
      onPointerMove={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (pointerId === e.pointerId) {
          const time = startTime - (e.clientX - mouseOffset) * props.seekRatio;
          props.onSeek(true, Math.max(0, Math.min(time, props.max)));
        }
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        if (pointerId === e.pointerId) {
          pointerId = undefined;
          e.currentTarget.releasePointerCapture(e.pointerId);
          props.onSeek(false);
        }
      }}
    />
  );
};
