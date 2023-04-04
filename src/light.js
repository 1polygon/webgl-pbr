import { SceneObject } from "./scene-object";

export const LightType = {
    Directional: 0,
    Point: 1,
    Spot: 2
};

export class Light extends SceneObject {
    
    constructor() {
        super();
        this.type = -1;
    }

}