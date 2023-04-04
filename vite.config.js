import { defineConfig } from "vite";
import glsl from "./src/utils/glsl-plugin";
export default defineConfig({
    plugins: [glsl()],
    build: {
        lib: {
            entry: "src/index.js",
            fileName: "lib/webgl-pbr",
            formats: ["es"]
        }
    },
});