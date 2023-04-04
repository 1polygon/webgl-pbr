import { SceneContext } from "./scene-context";
import { vec2, vec3 } from "./utils/gl-matrix";

const vertexAttribIndex = 0;
const normalAttribIndex = 1;
const tangentAttribIndex = 4;
const uvAttribIndex = 2;

export class Mesh extends SceneContext {
    constructor() {
        super();
        this.vertices = [];
        this.normals = [];
        this.tangents = [];
        this.uv = [];
        this.indices = [];

        this.vao = null;
        this.vbo_index = null;
        this.vbo_vertex = null;
        this.vbo_normal = null;
        this.vbo_tangent = null;
        this.vbo_uv = null;

        this.dirty = false;
    }

    update() {
        this.dirty = true;
    }

    updateBuffers(scene) {
        if (!this.initialized) {
            this.init(scene);
        }

        const gl = this.gl;

        if (this.vao == null) {
            this.vao = gl.createVertexArray();
        }

        gl.bindVertexArray(this.vao);

        if (this.vertices.length > 0) {
            if (this.vbo_vertex == null) {
                this.vbo_vertex = gl.createBuffer();
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_vertex);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
            gl.vertexAttribPointer(vertexAttribIndex, 3, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
            gl.enableVertexAttribArray(vertexAttribIndex);
        }

        if (this.normals.length > 0) {
            if (this.vbo_normal == null) {
                this.vbo_normal = gl.createBuffer();
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_normal);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
            gl.vertexAttribPointer(normalAttribIndex, 3, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
            gl.enableVertexAttribArray(normalAttribIndex);
        }

        if (this.tangents.length > 0) {
            if (this.vbo_tangent == null) {
                this.vbo_tangent = gl.createBuffer();
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_tangent);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.tangents), gl.STATIC_DRAW);
            gl.vertexAttribPointer(tangentAttribIndex, 3, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
            gl.enableVertexAttribArray(tangentAttribIndex);
        }

        if (this.uv.length > 0) {
            if (this.vbo_uv == null) {
                this.vbo_uv = gl.createBuffer();
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo_uv);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uv), gl.STATIC_DRAW);
            gl.vertexAttribPointer(uvAttribIndex, 2, gl.FLOAT, false, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
            gl.enableVertexAttribArray(uvAttribIndex);
        }

        if (this.indices.length > 0) {
            if (this.vbo_index == null) {
                this.vbo_index = gl.createBuffer();
            }

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vbo_index);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.indices), gl.STATIC_DRAW);
        }

        console.log("Indices ", this.indices.length, " Vertices ", this.vertices.length);

        this.dirty = false;
    }

    #getTriangle(index) {
        const i1 = this.indices[index + 0];
        const i2 = this.indices[index + 1];
        const i3 = this.indices[index + 2];

        return {
            p1: [this.vertices[i1 * 3], this.vertices[i1 * 3 + 1], this.vertices[i1 * 3 + 2]],
            p2: [this.vertices[i2 * 3], this.vertices[i2 * 3 + 1], this.vertices[i2 * 3 + 2]],
            p3: [this.vertices[i3 * 3], this.vertices[i3 * 3 + 1], this.vertices[i3 * 3 + 2]],
            uv1: [this.uv[i1 * 2], this.uv[i1 * 2 + 1]],
            uv2: [this.uv[i2 * 2], this.uv[i2 * 2 + 1]],
            uv3: [this.uv[i3 * 2], this.uv[i3 * 2 + 1]],
        }
    }

    calculateTangents() {
        for (let i = 0; i < this.indices.length; i += 3) {
            const t = this.#getTriangle(i);

            const edge1 = vec3.create();
            vec3.sub(edge1, t.p2, t.p1);

            const edge2 = vec3.create();
            vec3.sub(edge2, t.p3, t.p1);

            const deltaUv1 = vec2.create();
            vec2.sub(deltaUv1, t.uv2, t.uv1);

            const deltaUv2 = vec2.create();
            vec2.sub(deltaUv2, t.uv3, t.uv1);

            const f = 1.0 / (deltaUv1[0] * deltaUv2[1] - deltaUv2[0] * deltaUv1[1]);
            const tangent = vec3.create();
            tangent[0] = f * (deltaUv2[1] * edge1[0] - deltaUv1[1] * edge2[0]);
            tangent[1] = f * (deltaUv2[1] * edge1[1] - deltaUv1[1] * edge2[1]);
            tangent[2] = f * (deltaUv2[1] * edge1[2] - deltaUv1[1] * edge2[2]);
            this.tangents[this.indices[i + 0] * 3 + 0] = tangent[0];
            this.tangents[this.indices[i + 0] * 3 + 1] = tangent[1];
            this.tangents[this.indices[i + 0] * 3 + 2] = tangent[2];

            this.tangents[this.indices[i + 1] * 3 + 0] = tangent[0];
            this.tangents[this.indices[i + 1] * 3 + 1] = tangent[1];
            this.tangents[this.indices[i + 1] * 3 + 2] = tangent[2];

            this.tangents[this.indices[i + 2] * 3 + 0] = tangent[0];
            this.tangents[this.indices[i + 2] * 3 + 1] = tangent[1];
            this.tangents[this.indices[i + 2] * 3 + 2] = tangent[2];
        }
    }

    /**
     * @param {number} mode 
     */
    draw(mode) {
        this.gl.bindVertexArray(this.vao);
        this.gl.drawElements(mode ? mode : this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_INT, 0);
    }
}