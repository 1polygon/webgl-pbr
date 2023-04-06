import { Camera } from "./camera";
import { InputHandler } from "./input";

//import { Light } from "./light";
import { SceneObject } from "./scene-object";
import { DebugRenderer } from "./render/debug-renderer";
import { EventEmitter } from "./utils/event-emitter";
import { Light } from "./light";
import { ForwardRenderer } from "./render/forward-renderer";
import { DeferredRenderer } from "./render/deferred-renderer";

export class Scene extends EventEmitter {
    /**
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) {
        super();
        if (!canvas || canvas?.tagName !== "CANVAS") {
            console.error("Failed to create scene. Invalid canvas element.");
            return;
        }
        this.canvas = canvas;
        this.gl = canvas.getContext("webgl2");
        this.input = new InputHandler(this);
        this.renderer = new ForwardRenderer();

        /**
         * @type {SceneObject[]}
         */
        this.objects = [];

        /**
         * @type {Light[]}
         */
        this.lights = [];

        /**
         * @type {Camera}
         */
        this.camera = null;

        this.deltaTime = 0.0;
        this.currentTime = performance.now() / 1000.0;
        this.fps = 0;
        this.running = true;

        this.width = canvas.width;
        this.height = canvas.height;
        this.resizeObserver = new ResizeObserver(this.#resize.bind(this));
        this.resizeObserver.observe(this.canvas);

        this.#init(this.gl);

        const loop = () => {
            if (this.running) {
                this.deltaTime = performance.now() / 1000.0 - this.currentTime;
                this.currentTime = performance.now() / 1000.0;
                this.fps = 1.0 / this.deltaTime;
                this.#tick(this.deltaTime);
                this.#render(this.gl);
                this.input.mouse.deltaX = 0.0;
                this.input.mouse.deltaY = 0.0;
            }
            requestAnimationFrame(loop);
        }

        loop();

        this.debug = this.add(new DebugRenderer());
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     */
    #init(gl) {
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.depthFunc(gl.LEQUAL);
        gl.depthMask(true);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        this.renderer.init(this);
    }

    #tick(deltaTime) {
        for (const object of this.objects) {
            object.tick(deltaTime);
        }
        this.emit("tick", deltaTime);
    }

    /**
     * @param {WebGL2RenderingContext} gl
     */
    #render(gl) {
        if (!this.camera) {
            return;
        }

        gl.clearColor(this.camera.clearColor[0], this.camera.clearColor[1], this.camera.clearColor[2], this.camera.clearColor[3]);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        for (const object of this.objects) {
            object.render(gl);
        }

        this.emit("render", this.deltaTime);
    }

    #resize() {
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.gl.viewport(0, 0, this.width, this.height);
        this.emit("resize");
    }

    /**
     * Adds an object to the scene
     * @param {SceneObject} object must inerhit from SceneObject
     */
    add(object) {
        if (!this.objects.includes(object) && object instanceof SceneObject) {
            this.objects.push(object);
            if (object instanceof Light) {
                this.lights.push(object);
            }
            object.init(this);
            return object;
        }
    }

    /**
     * Removes an object from the scene
     * @param {SceneObject} object 
     */
    remove(object) {
        const index = this.objects.indexOf(object);
        if (index != -1) {
            this.objects.splice(index, 1);
            if (object instanceof Light) {
                this.lights.splice(this.lights.indexOf(object), 1);
            }
            object.destroy();
        }
    }

    /**
     * Sets the camera to be used for rendering
     * @param {Camera} camera 
     */
    setCamera(camera) {
        if (camera != this.camera) {
            this.remove(this.camera);
            this.add(camera);
            this.camera = camera;
        }
    }

    requestPointerLock() {
        this.canvas.requestPointerLock();
    }

    hasPointerLock() {
        return document.pointerLockElement == this.canvas;
    }

    destroy() {
        this.input.destroy();
        this.resizeObserver.disconnect();
    }
}
