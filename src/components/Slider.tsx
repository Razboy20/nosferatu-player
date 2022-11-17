import { createElementSize } from "@solid-primitives/resize-observer";
import clsx from "clsx";
import { createEffect, createMemo, createSignal, JSX, mergeProps, VoidComponent } from "solid-js";

import styles from "./Slider.module.scss";

interface ISliderProps {
  value?: number;
  min?: number;
  max: number;
  step?: number;
  onChange?: (value: number) => void;
  onSeeking?: (seeking: boolean) => void;
  style?: string | JSX.CSSProperties;
  class?: string;
}

export const Slider: VoidComponent<ISliderProps> = (props) => {
  const local = mergeProps({ value: 0, min: 0, step: 1 }, props);

  const [sizeRef, setSizeRef] = createSignal(null);
  const [thumbRef, setThumbRef] = createSignal(null);
  const elementSize = createElementSize(sizeRef);

  const [seeking, setSeeking] = createSignal(false);

  createEffect(() => {
    if (local.onSeeking) local.onSeeking(seeking());
  }, [seeking]);

  let dragPointer: number = undefined;
  let dragOffset = 0;

  const position = createMemo(() => {
    const { min, max, value } = local;
    const range = max - min;
    if (range <= 0) {
      return 0;
    }
    // console.log("Pos: ", { range, value, max, min });
    return Math.max(0, Math.min(range, value - min)) / range;
  });

  const setValue = (value: number) => {
    if (local.onChange) {
      const { min, max, step } = local;
      if (min >= max) {
        return;
      }
      let newValue = Math.max(min, Math.min(max, value));
      if (step > 0) {
        newValue = Math.round(newValue / step) * step;
      }
      local.onChange(newValue);
    }
  };

  const drag = (pos: number) => {
    const { min, max } = local;
    const range = max - min;
    if (range <= 0) {
      return 0;
    }
    // console.log("Drag: ", { pos, range, elementSize, min });
    setValue((pos * range) / elementSize.width + min);
  };

  return (
    <div
      class={clsx(styles.slider, local.class)}
      style={local.style}
      ref={setSizeRef}
      onPointerDown={(e) => {
        // Don't want to prevent default because we want focus
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        dragOffset = 0;
        dragPointer = e.pointerId;
        drag(e.clientX - e.currentTarget.getBoundingClientRect().left);
        setSeeking(true);
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        if (dragPointer) {
          e.currentTarget.releasePointerCapture(dragPointer);
          dragPointer = undefined;
        }
        setSeeking(false);
      }}
      onPointerMove={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (dragPointer !== undefined && e.currentTarget.hasPointerCapture(dragPointer)) {
          drag(e.clientX - e.currentTarget.getBoundingClientRect().left);
        }
      }}
    >
      <div class={styles.slider__rail}></div>
      <div
        class={styles.slider__track}
        style={{
          width: `${position() * 100}%`,
        }}
      ></div>
      <div
        class={clsx(styles.slider__thumb, { [styles.seeking]: seeking() })}
        style={{
          left: `${position() * 100}%`,
        }}
        ref={setThumbRef}
        onPointerDown={(e) => {
          // Don't want to prevent default because we want focus
          e.stopPropagation();
          e.currentTarget.setPointerCapture(e.pointerId);
          dragPointer = e.pointerId;
          dragOffset = position() * elementSize.width - e.offsetX - e.currentTarget.offsetLeft;
          drag(dragOffset + e.offsetX + e.currentTarget.offsetLeft);
          setSeeking(true);
        }}
        onPointerUp={(e) => {
          e.stopPropagation();
          if (dragPointer) {
            e.currentTarget.releasePointerCapture(dragPointer);
            dragPointer = undefined;
          }
          setSeeking(false);
        }}
        onPointerMove={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (dragPointer !== undefined && thumbRef()?.hasPointerCapture(dragPointer)) {
            drag(dragOffset + e.offsetX + e.currentTarget.offsetLeft);
          }
        }}
      ></div>
    </div>
  );
};
