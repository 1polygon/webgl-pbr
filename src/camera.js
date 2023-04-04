import { SceneObject } from "./scene-object";
import { mat4, vec3 } from "./utils/gl-matrix";
import { toRadian } from "./utils/gl-matrix/common";

export class Camera extends SceneObject {
    constructor() {
        super();
        this.name = "Camera";

        this.near = 0.1;
        this.far = 1000;
        this.fov = 75;

        this.center = vec3.create();

        this.viewMatrix = mat4.create();
        this.perspectiveMatrix = mat4.create();
        this.projectionMatrix = mat4.create();

        this.clearColor = [.1, .1, .1, 1];
    }

    updateMatrix() {
        super.updateMatrix();
        
        vec3.add(this.center, this.location, this.forward);
        mat4.lookAt(this.viewMatrix, this.location, this.center, this.up);
        mat4.perspective(this.perspectiveMatrix, toRadian(this.fov), this.scene.width / this.scene.height, this.near, this.far);
        mat4.mul(this.projectionMatrix, this.perspectiveMatrix, this.viewMatrix);
    }
}