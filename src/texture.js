import { SceneContext } from "./scene-context";

let debugTexture = null;

export class Texture2D extends SceneContext {
    constructor(src) {
        super();
        this.src = src;
        this.image = new Image();

        if (this.src) {
            this.image.src = this.src;
        }
    }

    init(scene) {
        super.init(scene);
        console.log("create texture", this.src);
        const gl = this.gl;
        this.format = gl.RGBA;
        this.pointer = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.pointer);
        gl.texImage2D(gl.TEXTURE_2D, 0, this.format, 1, 1, 0, this.format, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
        gl.bindTexture(gl.TEXTURE_2D, null);
        if (this.image.width > 0 && this.image.height > 0) {
            this.setImage(this.image);
        }
        this.image.addEventListener("load", () => {
            this.setImage(this.image);
        });
    }

    bind() {
        if (!this.initialized && this.scene) {
            this.init(this.scene);
            this.initialized = true;
        }
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.pointer);
    }

    setSource(src) {
        if (src) {
            this.image.src = src;
        } else {
            this.setPixels(1, 1, [0, 0, 0, 255]);
        }
        this.src = src;
    }

    /**
     * @param {HTMLImageElement} image 
     */
    setImage(image) {
        const gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D, this.pointer);
        gl.texImage2D(gl.TEXTURE_2D, 0, this.format, this.format, gl.UNSIGNED_BYTE, image);
        if (this.isPowerOf2(image.width) && this.isPowerOf2(image.height)) {
            // Yes, it's a power of 2. Generate mips.
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            // No, it's not a power of 2. Turn off mips and set
            // wrapping to clamp to edge
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.bindTexture(gl.TEXTURE_2D, null);
        console.log("texture ready", this.src);
    }

    setPixels(width, height, pixels) {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.pointer);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.format, width, height, 0, this.format, this.gl.UNSIGNED_BYTE, new Uint8Array(pixels));
    }

    isPowerOf2(value) {
        return (value & (value - 1)) === 0;
    }

    destroy() {
        console.log("destroy texture", this.src);
        this.gl.deleteTexture(this.pointer);
    }
}

export function getDebugTexture() {
    if (!debugTexture) {
        debugTexture = new Texture2D();
    }
    return debugTexture;
}