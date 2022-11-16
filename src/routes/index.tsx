import { createSignal, JSX, Show } from "solid-js";
import VideoPlayer from "~/components/VideoPlayer";
import IconVideoFile from "~icons/material-symbols/video-file-rounded";

export default function NosferatuPlayer() {
  const [videoBlob, setVideoBlob] = createSignal<File | null>(null);

  const processFile: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setVideoBlob(file);
    }
  };

  const videoURL = () => {
    if (videoBlob()) {
      return URL.createObjectURL(videoBlob());
    }
  };

  let uploadRef: HTMLInputElement;

  return (
    <main class="text-center p-4">
      <Show when={!videoBlob()}>
        <input type="file" accept="video/*" hidden ref={uploadRef} onChange={processFile} />
        <button class="btn-upload flex items-center gap-1" onClick={() => uploadRef.click()}>
          <IconVideoFile />
          Select Video
        </button>
      </Show>
      <Show when={videoURL()}>
        <VideoPlayer src={videoURL()}></VideoPlayer>
      </Show>
    </main>
  );
}
