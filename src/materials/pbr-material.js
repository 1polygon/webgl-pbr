import { Material } from "../material";
import { MeshRenderer } from "../mesh-renderer";
import { getDebugTexture } from "../texture";

export class PbrMaterial extends Material {
    constructor() {
        super();

        this.albedo = getDebugTexture();
        this.normal = getDebugTexture();
        this.roughness = getDebugTexture();
    }

    /**
     * @param {Camera} camera 
     * @param {MeshRenderer} object
     */
    draw(camera, object) {
        super.draw(camera, object);

        this.scene.renderer.drawLit(this.scene.camera, object, this);
    }
}