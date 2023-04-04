import { Material } from "./material";
import { Mesh } from "./mesh";
import { SceneObject } from "./scene-object";

export class MeshRenderer extends SceneObject {
    /**
     * @param {Mesh} mesh 
     * @param {Material} material 
     */
    constructor(mesh, material) {
        super();
        this.mesh = mesh;
        this.material = material;
    }

    render(gl) {
        super.render(gl);
        if(this.mesh && this.material && this.mesh.indices.length > 2) {
            if(this.mesh.dirty) {
                this.mesh.updateBuffers(this.scene);
            }
            if(!this.material.initialized) {
                this.material.init(this.scene);
            }
            this.material.draw(this.scene.camera, this);
        }
    }
}