import { EventEmitter } from "./utils/event-emitter";

export class InputHandler extends EventEmitter {
    #keys = {};
    #buttons = {};

    constructor(scene) {
        super();
        this.scene = scene;
        this.mouse = {
            x: 0.0,
            y: 0.0,
            deltaX: 0.0,
            deltaY: 0.0
        };

        document.addEventListener("keydown", this.#keydown.bind(this));
        document.addEventListener("keyup", this.#keyup.bind(this));
        scene.canvas.addEventListener("mousedown", this.#mousedown.bind(this));
        document.addEventListener("mouseup", this.#mouseup.bind(this));
        document.addEventListener("mousemove", this.#mousemove.bind(this));
    }

    #keydown(e) {
        const key = e.key.replace(" ", "space");
        this.#keys[key] = true;
        this.emit("keydown", key);
    }

    #keyup(e) {
        const key = e.key.replace(" ", "space");
        this.#keys[key] = false;
        this.emit("keyup", key);
    }

    #mousemove(e) {
        this.mouse.deltaX = e.movementX;
        this.mouse.deltaY = e.movementY;
    }

    #mousedown(e) {
        if(!this.#buttons[e.button]) {
            this.emit("click", e);
        }
        this.#buttons[e.button] = true;
    }

    #mouseup(e) {
        this.#buttons[e.button] = false;
    }

    /**
     * @param {string} key 
     * @returns {boolean} 
     */
    isKeyDown(key) {
        return this.#keys[key];
    }

    /**
     * @param {number} button 
     * @returns {boolean}
     */
    isMouseDown(button) {
        return this.#buttons[button];
    }

    destroy() {
        document.removeEventListener("keydown", this.#keydown);
        document.removeEventListener("keyup", this.#keyup);
        document.removeEventListener("mousedown", this.#mousedown);
        document.removeEventListener("mouseup", this.#mouseup);
        document.removeEventListener("mousemove", this.#mousemove);
    }
}