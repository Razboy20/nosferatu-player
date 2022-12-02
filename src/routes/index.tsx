import { createSignal, JSX, Show } from "solid-js";
import VideoPlayer from "~/components/VideoPlayer";
import IconVideoFile from "~icons/material-symbols/video-file-rounded";
import IconGithub from "~icons/mdi/github";

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
    <>
      <footer class="absolute bottom-0 w-full text-center text-gray-700 hover:text-gray-900 mb-2 p-1">
        <a href="https://github.com/razboy20/nosferatu-player/" target="_blank" rel="noopener noreferrer">
          <IconGithub class="inline -mt-0.5" /> Source
        </a>
      </footer>
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
    </>
  );
}
