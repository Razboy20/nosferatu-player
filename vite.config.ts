import vercel from "solid-start-vercel";
import solid from "solid-start/vite";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [solid({ adapter: vercel() }), Icons({ compiler: "solid" })],
});
