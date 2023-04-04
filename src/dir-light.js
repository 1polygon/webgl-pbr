import { Light, LightType } from "./light";

export class DirectionalLight extends Light {
    constructor() {
        super();
        this.type = LightType.Directional;
        this.color = [1.0, 1.0, 1.0];
        this.attenuation = 1.0;
    }
}