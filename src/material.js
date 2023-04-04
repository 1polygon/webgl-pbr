import { Camera } from "./camera";
import { Mesh } from "./mesh";
import { MeshRenderer } from "./mesh-renderer";
import { Scene } from "./scene";
import { SceneContext } from "./scene-context";
import { getShader } from "./shader";
import { mat4 } from "./utils/gl-matrix";

export class Material extends SceneContext {
    constructor(id) {
        super();
        this.shader = getShader(id);
        this.twoSided = false;
    }

    init(scene) {
        super.init(scene);
        if (this.shader) {
            this.shader.init(scene);
        }
    }

    /**
     * @param {Camera} camera 
     * @param {MeshRenderer} object 
     */
    updateParameters(camera, object) {
        this.shader.setVector3("CameraPosition", camera.location);
        this.shader.setMatrix4("Projection", camera.projectionMatrix);
        this.shader.setMatrix4("Model", object.modelMatrix);
        this.shader.setMatrix4("NormalMatrix", object.modelMatrix);
    }

    use(camera, modelMatrix) {
        this.shader.use();
        this.shader.setMatrix4("Projection", camera.projectionMatrix);
        this.shader.setMatrix4("Model", modelMatrix);
    }

    /**
     * @param {Camera} camera 
     * @param {MeshRenderer} object 
     */
    draw(camera, object) {
        if (!this.shader) {
            return;
        }
        if (this.twoSided) {
            this.gl.disable(this.gl.CULL_FACE);
        } else {
            this.gl.enable(this.gl.CULL_FACE);
        }
        this.shader.use();
        this.updateParameters(camera, object);
        this.shader.bindTextures();
        object.mesh.draw();
    }
}