import { Light, LightType } from "./light";

export class PointLight extends Light {
    constructor() {
        super();
        this.type = LightType.Point;
        this.color = [1.0, 1.0, 1.0];
        this.attenuation = 1.0;
    }
}