import { Camera } from "./camera";
import { vec3 } from "./utils/gl-matrix";
import { toRadian } from "./utils/gl-matrix/common";

export class FreeCam extends Camera {
    constructor() {
        super();

        this.forwardDir = vec3.create();
        this.rightDir = vec3.create();
        this.upDir = vec3.create();

        this.targetLocation = vec3.create();

        this.sensitivity = 0.0075;
    }

    init(scene) {
        super.init(scene);
        this.targetLocation = vec3.clone(this.location);
        this.input.on("click", this.#click.bind(this));
        this.input.on("keydown", this.#keydown.bind(this));
    }

    destroy() {
        super.destroy();
        this.input.off("click", this.#click);
        this.input.off("keydown", this.#keydown);
    }

    #click() {
        this.scene.requestPointerLock()
    }

    #keydown(key) {
        if (key == "p") console.log(this.location, this.rotation);
    }

    tick(deltaTime) {
        super.tick(deltaTime);

        if (!this.scene.hasPointerLock()) return;

        const moveHorizontal = this.input.isKeyDown("a") ? 1.0 : this.input.isKeyDown("d") ? -1.0 : 0.0;
        const moveVertical = this.input.isKeyDown("w") ? 1.0 : this.input.isKeyDown("s") ? -1.0 : 0.0;
        const moveUp = this.input.isKeyDown("e") ? 1.0 : this.input.isKeyDown("q") ? -1.0 : 0.0;

        this.rotation[0] += this.input.mouse.deltaY * this.sensitivity;
        this.rotation[1] -= this.input.mouse.deltaX * this.sensitivity;

        if (this.rotation[0] > toRadian(85)) this.rotation[0] = toRadian(85);
        if (this.rotation[0] < toRadian(-85)) this.rotation[0] = toRadian(-85);

        vec3.mul(this.forwardDir, this.forward, [moveVertical, moveVertical, moveVertical]);
        vec3.add(this.targetLocation, this.targetLocation, this.forwardDir);

        vec3.mul(this.rightDir, this.right, [moveHorizontal, moveHorizontal, moveHorizontal]);
        vec3.add(this.targetLocation, this.targetLocation, this.rightDir);

        vec3.mul(this.upDir, this.up, [moveUp, moveUp, moveUp]);
        vec3.add(this.targetLocation, this.targetLocation, this.upDir);

        vec3.lerp(this.location, this.location, this.targetLocation, deltaTime * 10.0);
    }
}