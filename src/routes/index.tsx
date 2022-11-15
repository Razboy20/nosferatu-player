import { createMemo, createSignal, JSX, Show } from "solid-js";

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
        <input type="file" accept="video/*" onChange={processFile} />
      </Show>
      <Show when={videoURL()}>
        <video controls src={videoURL()} />
      </Show>
    </main>
  );
}
