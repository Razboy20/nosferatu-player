import { DocumentEventListener } from "@solid-primitives/event-listener";
import { Accessor, createContext, createEffect, createSignal, ParentComponent, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";

interface TimelineItem {
  id: number;
  timeCode: number;
  name: string;
}

type ITimeline = TimelineItem[];

type TimelineContext = [
  get: ITimeline,
  update: {
    addItem: (item: Omit<TimelineItem, "id">) => void;
    removeItem: (id: number) => void;
    updateTimeCode: (id: number, timeCode: number) => void;
    updateName: (id: number, name: string) => void;
    sortByTimeCode: () => void;
  },
  drawer: [active: Accessor<boolean>, setActive: (active: boolean) => void]
];

const TimelineContext = createContext<TimelineContext>();

const initialTimeline: ITimeline = [{ id: 0, timeCode: 0, name: "Start" }];

export const TimelineProvider: ParentComponent = (props) => {
  const storedTimeline = localStorage.getItem("timeline");
  const [timeline, setTimeline] = createStore<ITimeline>(storedTimeline ? JSON.parse(storedTimeline) : initialTimeline);

  let id = timeline.reduce((max, item) => Math.max(max, item.id), 0) + 1;

  createEffect(() => {
    localStorage.setItem("timeline", JSON.stringify(timeline));
  });

  // @ts-ignore
  const updateTimeline: typeof setTimeline = (...args: Parameters<typeof setTimeline>) => {
    setTimeline(...args);
    // update the timeline in localStorage
    localStorage.setItem("timeline", JSON.stringify(timeline));
  };

  const addItem = (item: Omit<TimelineItem, "id">) => {
    setTimeline(timeline.length, { ...item, id: id++ });
  };

  const removeItem = (id: number) => {
    setTimeline((timeline: ITimeline) => timeline.filter((item) => item.id !== id));
  };

  const updateTimeCode = (id: number, timeCode: number) => {
    setTimeline((item) => item.id == id, "timeCode", timeCode);
  };

  const updateName = (id: number, name: string) => {
    setTimeline((item) => item.id == id, "name", name);
  };

  const sortByTimeCode = () => {
    setTimeline(produce((timeline: ITimeline) => timeline.sort((a, b) => a.timeCode - b.timeCode)));
  };

  const [drawerActive, setDrawerActive] = createSignal(false);

  return (
    <TimelineContext.Provider
      value={[
        timeline,
        {
          addItem,
          removeItem,
          updateTimeCode,
          updateName,
          sortByTimeCode,
        },
        [drawerActive, setDrawerActive],
      ]}
    >
      <DocumentEventListener
        onkeyup={(e) => {
          if (e.key == "t") {
            setDrawerActive(!drawerActive());
          }
        }}
      />
      {props.children}
    </TimelineContext.Provider>
  );
};

export function useTimeline() {
  return useContext(TimelineContext);
}
