import { UnlitMaterial } from "../materials/unlit-material";
import { Mesh } from "../mesh";
import { SceneObject } from "../scene-object";
import { vec3 } from "../utils/gl-matrix";

export class DebugRenderer extends SceneObject {
    constructor() {
        super();
    }

    init(scene) {
        super.init(scene);
        this.material = new UnlitMaterial();
        this.lineMesh = new Mesh();
        this.lineMesh.vertices = [0.0, 0.0, 0.0, 0.0, 0.0, 1.0];
        this.lineMesh.indices = [0, 1];
        this.lineMesh.update();
        this.dir = [0.0, 0.0, 0.0];
    }

    render() {
        super.render();
        if (this.lineMesh.dirty) {
            this.lineMesh.updateBuffers(this.scene);
        }
        if (!this.material.initialized) {
            this.material.init(this.scene);
        }
    }

    drawLine(start, end, color) {
        this.material.color = color;
        this.location = vec3.clone(start);
        this.scale[2] = vec3.dist(start, end);
        vec3.sub(this.dir, start, end);
        vec3.normalize(this.dir, this.dir);
        const yaw = Math.atan2(-this.dir[0], -this.dir[2]);
        const pitch = Math.asin(-this.dir[1]);
        this.rotation[0] = pitch;
        this.rotation[1] = yaw;

        this.updateMatrix();
        this.material.use(this.scene.camera, this.modelMatrix);
        this.material.shader.setVector4("Color", color);
        this.lineMesh.draw(this.gl.LINES);
    }


}