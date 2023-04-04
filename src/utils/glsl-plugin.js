const fileRegex = /\.(frag|vert|fs|vs|glsl)$/
import fs from "fs";
import path from "path";

function processShader(src, id) {
    const lines = src.split("\n");
    let result = "";
    for (const line of lines) {
        if (line.startsWith("#include ")) {
            const relativeFile = line.split(" ")[1];
            if (relativeFile) {
                const absoluteFile = path.join(path.dirname(id), relativeFile).trim();
                try {
                    const includeSource = processShader(fs.readFileSync(absoluteFile).toString(), id);
                    result += includeSource;
                } catch (err) {
                    console.error(err);
                }
            }
        } else {
            result += line + "\n";
        }
    }
    return result;
}

function compileFileToJS(src, id) {
    const result = processShader(src, id);
    return "export default `" + result + "`";
}

export default function glsl() {
    return {
        name: 'vite-plugin-glsl',

        transform(src, id) {
            if (fileRegex.test(id)) {
                return {
                    code: compileFileToJS(src, id),
                    map: null
                }
            }
        }
    }
}