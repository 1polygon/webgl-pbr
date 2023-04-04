import { Material } from "../material";

export class DebugTextureMaterial extends Material {
    constructor() {
        super("debug/texture");
    }

    setAlbedo(texture) {
        this.albedo = texture;
    }

    updateParameters(camera, mesh) {
        super.updateParameters(camera, mesh);
        if(this.albedo) {
            this.shader.setTexture("Albedo", this.albedo);
        }
    }
}