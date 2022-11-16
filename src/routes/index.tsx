import { createMemo, createSignal, JSX, Show } from "solid-js";
import VideoPlayer from "~/components/VideoPlayer";

export default function NosferatuPlayer() {
  const [videoBlob, setVideoBlob] = createSignal<File | null>(null);

  const processFile: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setVideoBlob(file);
    }
  };

  const videoURL = createMemo(() => {
    if (videoBlob()) {
      return URL.createObjectURL(videoBlob());
    }
  });

  return (
    <main class="text-center p-4">
      <Show when={!videoBlob()}>
        <input class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-fit" type="file" accept="video/*" onChange={processFile} />
      </Show>
      <Show when={videoBlob()}>
        <VideoPlayer src={videoURL()}></VideoPlayer>
      </Show>
    </main>
  );
}
