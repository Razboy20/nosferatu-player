import { DocumentEventListener } from "@solid-primitives/event-listener";
import { Accessor, createContext, createSignal, ParentComponent, useContext } from "solid-js";
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

export const TimelineProvider: ParentComponent = (props) => {
  const [timeline, setTimeline] = createStore<ITimeline>([]);

  let id = 1;

  // @ts-ignore
  const updateTimeline: typeof setTimeline = (...args: Parameters<typeof setTimeline>) => {
    setTimeline(...args);
    // update the timeline in localStorage
    localStorage.setItem("timeline", JSON.stringify(timeline));
  };

  const addItem = (item: Omit<TimelineItem, "id">) => {
    updateTimeline(produce((timeline: ITimeline) => timeline.push({ ...item, id: id++ })));
  };

  const removeItem = (id: number) => {
    updateTimeline(
      produce((timeline: ITimeline) =>
        timeline.splice(
          timeline.findIndex((item) => item.id === id),
          1
        )
      )
    );
  };

  const updateTimeCode = (id: number, timeCode: number) => {
    updateTimeline((item) => item.id == id, "timeCode", timeCode);
  };

  const updateName = (id: number, name: string) => {
    updateTimeline((item) => item.id == id, "name", name);
  };

  const sortByTimeCode = () => {
    updateTimeline(produce((timeline: ITimeline) => timeline.sort((a, b) => a.timeCode - b.timeCode)));
  };

  // load timeline from localstorage
  const storedTimeline = localStorage.getItem("timeline");
  if (storedTimeline) {
    setTimeline(JSON.parse(storedTimeline));
  }

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
