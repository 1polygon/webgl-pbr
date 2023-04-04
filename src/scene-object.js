
import { SceneContext } from "./scene-context";
import { mat4, vec3 } from "./utils/gl-matrix";
import { toRadian } from "./utils/gl-matrix/common";

export class SceneObject extends SceneContext {
    constructor() {
        super();
        this.name = "SceneObject";
        this.parent = null;
        this.static = false;

        this.up = [0, 1, 0];
        this.forward = [0, 0, 1];
        this.right = [1, 0, 0];

        this.location = [0, 0, 0];
        this.rotation = [0, 0, 0];
        this.scale = [1, 1, 1];

        this.modelMatrix = mat4.create();
        this.normalMatrix = mat4.create();
    }

    /**
     * @param {Scene} scene 
     */
    init(scene) {
        super.init(scene);
        this.updateMatrix();
        this.emit("init");
    }

    updateMatrix() {
        mat4.identity(this.modelMatrix);
        mat4.translate(this.modelMatrix, this.modelMatrix, this.location);
        mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotation[0], [1, 0, 0]);
        mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotation[1], [0, 1, 0]);
        mat4.rotate(this.modelMatrix, this.modelMatrix, this.rotation[2], [0, 0, 1]);
        mat4.scale(this.modelMatrix, this.modelMatrix, this.scale);
        if (this.parent != null) {
            mat4.multiply(this.modelMatrix, this.modelMatrix, this.parent.modelMatrix);
        }
        mat4.invert(this.normalMatrix, this.modelMatrix);
        mat4.transpose(this.normalMatrix, this.normalMatrix);
    }

    updateVectors() {
        this.forward[0] = Math.cos(this.rotation[0]) * Math.sin(this.rotation[1]);
        this.forward[1] = -Math.sin(this.rotation[0]);
        this.forward[2] = Math.cos(this.rotation[0]) * Math.cos(this.rotation[1]);

        this.right[0] = Math.cos(this.rotation[1]);
        this.right[1] = 0;
        this.right[2] = -Math.sin(this.rotation[1]);

        this.up[0] = Math.sin(this.rotation[0]) * Math.sin(this.rotation[1]);
        this.up[1] = Math.cos(this.rotation[0]);
        this.up[2] = Math.sin(this.rotation[0]) * Math.cos(this.rotation[1]);
    }

    rotate(eulerX, eulerY, eulerZ) {
        this.rotation[0] += toRadian(eulerX);
        this.rotation[1] += toRadian(eulerY);
        this.rotation[2] += toRadian(eulerZ);
    }

    /**
     * @param {number} deltaTime 
     */
    tick(deltaTime) {
        if(!this.static) {
            this.updateMatrix();
            this.updateVectors();            
        }
        this.emit("tick", deltaTime);
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     */
    render(gl) {
        this.emit("render", gl);
    }

    destroy() {
        this.emit("destroy");
    }
}