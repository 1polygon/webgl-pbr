import { Material } from "../material";

export class UnlitMaterial extends Material {
    constructor(color) {
        super("unlit/default");
        this.color = color || [1, 1, 1, 1];
    }

    /**
     * @param {Camera} camera 
     * @param {MeshRenderer} mesh 
     */
    updateParameters(camera, mesh) {
        super.updateParameters(camera, mesh);
        this.shader.setVector4("Color", this.color);
    }
}