import "./VideoPlayer.scss";

import { DocumentEventListener } from "@solid-primitives/event-listener";
import { createEffect, createSignal, JSX, on, Show } from "solid-js";
import IconPause from "~icons/material-symbols/pause-rounded";
import IconPlayArrowRounded from "~icons/material-symbols/play-arrow-rounded";
import { Slider } from "./Slider";
import { TimelineDrawer } from "./TimelineDrawer";
import { TimelineProvider } from "./TimelineProvider";
import { TimelineView } from "./TimelineView";

function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time - minutes * 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export default function Counter({ src }: { src: string }) {
  const [progress, setProgress] = createSignal(0);
  const [videoDuration, setVideoDuration] = createSignal(0);
  const [playing, setPlaying] = createSignal(false);
  const [seeking, setSeeking] = createSignal(false);
  const [videoRef, setVideoRef] = createSignal<HTMLVideoElement>(null);
  let containerEl: HTMLDivElement;

  const togglePlay = () => {
    setPlaying(!playing());
  };

  const handleKeyPress: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (event) => {
    event.preventDefault();

    if (event.key === " ") {
      togglePlay();
    }
    if (event.key === "f") {
      toggleFullScreen();
    }
  };

  const toggleFullScreen = () => {
    // check if already fullscreen
    if (document.fullscreenElement) {
      // exit fullscreen
      document.exitFullscreen();
    } else {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
        // handle safari
      } else if ((containerEl as any).webkitRequestFullscreen) {
        (containerEl as any).webkitRequestFullscreen();
      }
    }
  };

  createEffect(
    on(playing, () => {
      if (!playing()) {
        videoRef().pause();
      } else {
        videoRef().play();
      }
    })
  );

  const setTime = (time: number) => {
    setProgress(time);
    videoRef().currentTime = progress();
  };

  createEffect(() => {
    if (seeking()) {
      setPlaying(false);
    }
  });

  return (
    <TimelineProvider>
      <div class="video-player" ref={containerEl}>
        <DocumentEventListener onkeyup={handleKeyPress} />
        <div class="slider_container">
          <Slider
            value={progress()}
            max={videoDuration()}
            step={0.2}
            onChange={(val) => {
              playing() && !seeking() ? setProgress(val) : setTime(val);
            }}
            onSeeking={setSeeking}
            class="slider"
          />
        </div>
        <TimelineView
          currentTime={progress()}
          onSeek={(seeking, val) => {
            setSeeking(seeking);
            if (val !== undefined) setTime(val);
          }}
          max={videoDuration()}
        />
        <TimelineDrawer currentTime={progress()} />
        <div class="player">
          <video
            // controls
            src={src}
            ref={setVideoRef}
            onPlay={(e) => setPlaying(!e.currentTarget.paused)}
            onPause={(e) => setPlaying(!e.currentTarget.paused)}
            onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
            onDurationChange={(e) => setVideoDuration(e.currentTarget.duration)}
            onMouseDown={(e) => {
              e.preventDefault();
              togglePlay();
            }}
          />
          <div class="controls">
            <div>
              <div class="current_time">{formatTime(progress())}</div>
              <button
                class="button"
                onClick={togglePlay}
                classList={{
                  active: playing(),
                }}
              >
                <Show when={playing()} fallback={<IconPlayArrowRounded />}>
                  <IconPause
                    style={{
                      "font-size": "0.9em",
                    }}
                  />
                </Show>
              </button>
            </div>
          </div>
        </div>
      </div>
    </TimelineProvider>
  );
}
