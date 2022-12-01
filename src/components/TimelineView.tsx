import { For, Show, VoidComponent } from "solid-js";
import TimelineIcon from "~icons/material-symbols/view-timeline-outline-rounded";
import TimelineFilledIcon from "~icons/material-symbols/view-timeline-rounded";
import styles from "./Timeline.module.scss";
import { useTimeline } from "./TimelineProvider";

interface TimelineViewProps {
  currentTime: number;
  onChange: (time: number) => void;
}

export const TimelineView: VoidComponent<TimelineViewProps> = (props) => {
  const [timeline, _, [active, setActive]] = useTimeline();
  // console.log(useTimeline());

  const computePosition = (timeCode: number) => {
    return (timeCode - props.currentTime) / 5;
  };

  function formatTime(time: number) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time - minutes * 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  const TimelineItem: VoidComponent<{ item: ReturnType<typeof useTimeline>[0][number]; clickHandler: () => void }> = (itemProps) => {
    return (
      <div
        class={styles.item}
        style={{
          "--item-x": `${computePosition(itemProps.item.timeCode)}rem`,
        }}
        onClick={itemProps.clickHandler}
      >
        <div class={styles.name}>{itemProps.item.name}</div>
        <div class={styles.timeCode}>{formatTime(itemProps.item.timeCode)}</div>
      </div>
    );
  };

  return (
    <div class={styles.timeline}>
      <For each={timeline}>{(item) => <TimelineItem item={item} clickHandler={() => props.onChange(item.timeCode)} />}</For>
      <div
        class={styles.toggle_button}
        onClick={(e) => {
          e.preventDefault();
          setActive(!active());
        }}
      >
        <Show when={active()}>
          <TimelineFilledIcon />
        </Show>
        <Show when={!active()}>
          <TimelineIcon />
        </Show>
      </div>
    </div>
  );
};
