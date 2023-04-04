import { Material } from "../material";

export class GridMaterial extends Material {
    constructor(color) {
        super("unlit/grid");
        this.twoSided = true;
        this.color = color || [.5, .5, .5, .5];
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