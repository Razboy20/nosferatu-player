import { Motion, Presence } from "@motionone/solid";
import { createEffect, For, on, Show, VoidComponent } from "solid-js";
import CloseIcon from "~icons/material-symbols/close-rounded";
import TrashcanIcon from "~icons/material-symbols/delete-rounded";
import { useTimeline } from "./TimelineProvider";

import { DocumentEventListener } from "@solid-primitives/event-listener";
import { Portal } from "solid-js/web";
import styles from "./Timeline.module.scss";

function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time - minutes * 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function parseTime(time: string, prev: number) {
  const [minutes, seconds] = time.split(":");
  const newTime = Number(minutes) * 60 + Number(seconds);
  return !isNaN(newTime) ? newTime : prev;
}

interface TimelineDrawerProps {
  currentTime: number;
}

export const TimelineDrawer: VoidComponent<TimelineDrawerProps> = (props) => {
  const [timeline, { addItem, removeItem, updateTimeCode, updateName, sortByTimeCode }, [active, setActive]] = useTimeline();

  createEffect(on(active, () => sortByTimeCode(), { defer: true }));

  return (
    <Portal>
      <DocumentEventListener
        onkeyup={(e) => {
          if (e.key == "Escape") {
            setActive(false);
          }
        }}
      />
      <Presence>
        <Show when={active()}>
          <Motion.div
            class={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, easing: "ease-out" }}
            onClick={(e) => {
              e.stopPropagation();
              setActive(false);
            }}
          ></Motion.div>
        </Show>
      </Presence>
      <Presence>
        <Show when={active()}>
          <Motion.div
            class={styles.drawer}
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.2, easing: "ease-out" }}
          >
            <div class={styles.header}>
              <h2>Timeline</h2>
              <CloseIcon class={styles.close} onClick={[setActive, false]} tabIndex={0} />
            </div>
            <button onClick={() => addItem({ timeCode: props.currentTime, name: "" })} tabIndex={0}>
              Add Marker
            </button>
            <div
              class={styles.items}
              onKeyUp={(e) => {
                e.stopImmediatePropagation();
              }}
            >
              <For each={timeline}>
                {(item) => (
                  <div class={styles.drawer_item} onFocusOut={() => sortByTimeCode()}>
                    <div class={styles.item_descriptors}>
                      <div class={styles.name}>
                        <input
                          type="text"
                          value={item.name}
                          placeholder="Name"
                          onInput={(e) => {
                            updateName(item.id, e.currentTarget.value);
                          }}
                        />
                      </div>
                      <div class={styles.timeCode}>
                        <input
                          type="text"
                          value={formatTime(item.timeCode)}
                          placeholder="0:00"
                          onInput={(e) => {
                            const newTime = parseTime(e.currentTarget.value, item.timeCode);
                            updateTimeCode(item.id, newTime);
                          }}
                        />
                      </div>
                    </div>
                    <TrashcanIcon
                      class={styles.remove}
                      onClick={(e) => {
                        e.preventDefault();
                        removeItem(item.id);
                      }}
                      tabIndex={0}
                    />
                  </div>
                )}
              </For>
            </div>
          </Motion.div>
        </Show>
      </Presence>
    </Portal>
  );
};
