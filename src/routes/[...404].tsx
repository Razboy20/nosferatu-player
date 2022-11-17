import { A } from "solid-start";
export default function NotFound() {
  return (
    <main class="text-center flex flex-col items-center justify-center h-screen text-gray-100 p-4 bg-gray-900">
      <h1 class="max-6-xs text-6xl text-sky-200 font-bold uppercase -mt-10">404: Not Found</h1>
      <p class="mt-8">
        Click{" "}
        <A href="/" class="text-sky-400 underline">
          here
        </A>{" "}
        to go back.
      </p>
    </main>
  );
}
