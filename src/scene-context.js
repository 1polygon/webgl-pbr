//import { Scene } from "./scene";
import { EventEmitter } from "./utils/event-emitter";

export class SceneContext extends EventEmitter {
    /**
     * @param {Scene} scene 
     * @param {WebGL2RenderingContext} gl 
     */
    constructor(scene, gl) {
        super();
        this.scene = scene;
        this.input = scene?.input;
        this.gl = gl;
        this.initialized = false;
    }

    init(scene) {
        this.scene = scene;
        this.input = scene?.input;
        this.gl = scene.gl;
        this.initialized = true;
    }
}