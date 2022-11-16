import { WindowEventListener } from "@solid-primitives/event-listener";
import { createSignal, JSX, Show } from "solid-js";

import IconPause from "~icons/material-symbols/pause-rounded";
import IconPlayArrowRounded from "~icons/material-symbols/play-arrow-rounded";
import "./VideoPlayer.scss";

function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time - minutes * 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export default function Counter({ src }: { src: string }) {
  const [progress, setProgress] = createSignal(0);
  const [playing, setPlaying] = createSignal(false);
  let videoRef: HTMLVideoElement;
  let containerEl: HTMLDivElement;

  const togglePlay = () => {
    if (playing()) {
      videoRef.pause();
    } else {
      videoRef.play();
    }
    setPlaying(!playing());
  };

  const handleKeyPress: JSX.EventHandler<HTMLDivElement, KeyboardEvent> = (event) => {
    if (event.key === " ") {
      togglePlay();
    }
    if (event.key === "f") {
      handleFullScreen();
    }
  };

  const handleFullScreen = (event?: Event) => {
    // check if already fullscreen
    if (document.fullscreenElement) {
      // exit fullscreen
      document.exitFullscreen();
    } else {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    }
  };

  return (
    <div class="video-player" ref={containerEl}>
      <WindowEventListener onKeydown={handleKeyPress} />
      <progress value={progress()} max={videoRef.duration} />
      <video
        controls
        src={src}
        ref={videoRef}
        onPlay={(e) => setPlaying(!e.currentTarget.paused)}
        onPause={(e) => setPlaying(!e.currentTarget.paused)}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        // on:fullscreenchange={handleFullScreen}
        // on:webkitpresentationmodechanged={handleFullScreen}
      />
      <div class="controls">
        <div class="current_time">{formatTime(progress())}</div>
        <button
          class="play_button"
          onClick={togglePlay}
          classList={{
            playing: playing(),
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
  );
}
