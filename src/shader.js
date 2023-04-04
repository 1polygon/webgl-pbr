import { SceneContext } from "./scene-context";
import { getShaderSource } from "./shader-source";

const shaders = new Map();

export class Shader extends SceneContext {
    /**
     * @param {WebGL2RenderingContext} gl 
     */
    constructor(id, source) {
        super();
        this.id = id;
        this.source = source;
        this.textures = new Map(); // key, Texture2D
    }

    init(scene) {
        super.init(scene);
        const success = this.reload();
        if (success) {
            shaders.set(this.id, this);
            console.log("shader ready", this.id);
        }
    }

    reload() {
        const vertex = this.compile(this.source.vertex, this.gl.VERTEX_SHADER);
        const fragment = this.compile(this.source.fragment, this.gl.FRAGMENT_SHADER);
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertex);
        this.gl.attachShader(program, fragment);
        this.gl.linkProgram(program);
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            throw ("failed to link shader: " + this.gl.getProgramInfoLog(program));
        } else {
            if (this.program) {
                this.gl.deleteProgram(this.program);
            }
            this.program = program;
            this.vertex = vertex;
            this.fragment = fragment;
            return true;
        }
    }

    compile(src, type) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, src);
        this.gl.compileShader(shader);
        const success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
        if (!success) {
            throw "failed to compile shader: " + this.gl.getShaderInfoLog(shader);
        }
        return shader;
    }

    use() {
        this.gl.useProgram(this.program);
        this.setFloat("Time", this.scene.currentTime);
    }

    bindTextures() {
        let unit = 0;
        for (const [key, texture] of this.textures) {
            if (!texture.initialized) {
                texture.init(this.scene);
            }
            const location = this.gl.getUniformLocation(this.program, key);
            this.gl.uniform1i(location, unit);
            this.gl.activeTexture(this.gl.TEXTURE0 + unit);
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture.pointer);
            unit++;
        }
    }

    setFloat(key, value) {
        const location = this.gl.getUniformLocation(this.program, key);
        this.gl.uniform1f(location, value);
    }

    setVector2(key, value) {
        const location = this.gl.getUniformLocation(this.program, key);
        this.gl.uniform2f(location, value[0], value[1]);
    }

    setVector3(key, value) {
        const location = this.gl.getUniformLocation(this.program, key);
        this.gl.uniform3f(location, value[0], value[1], value[2]);
    }

    setVector4(key, value) {
        const location = this.gl.getUniformLocation(this.program, key);
        this.gl.uniform4f(location, value[0], value[1], value[2], value[3]);
    }

    setMatrix4(key, value) {
        const location = this.gl.getUniformLocation(this.program, key);
        this.gl.uniformMatrix4fv(location, false, value);
    }

    setTexture(key, texture) {
        if (texture) {
            this.textures.set(key, texture);
        } else {
            this.textures.delete(key);
        }
    }
}

/**
 * @param {string} id
 * @return {Shader} shader 
 */
export function getShader(id) {
    let shader = shaders.get(id);
    if (!shader) {
        const source = getShaderSource(id);
        if (source) {
            shader = new Shader(id, source);
        } else {
            console.log(id + " not found");
        }
    }
    return shader;
}