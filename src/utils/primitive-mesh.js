import { Mesh } from "../mesh";

export function createPlane(sizeX, sizeY, uvScale) {
    const mesh = new Mesh();
    const uvscale = uvScale || 1.0;
    mesh.vertices = [
        0, 0, 0,
        sizeX, 0, 0,
        0, 0, sizeY,
        sizeX, 0, sizeY
    ];
    mesh.normals = [
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0
    ];
    mesh.tangents = [
        1.0, 0, 0,
        1.0, 0, 0,
        1.0, 0, 0,
        1.0, 0, 0
    ]
    mesh.uv = [
        0.0, 0.0,
        1.0 * uvscale, 0.0,
        0.0, 1.0 * uvscale,
        1.0 * uvscale, 1.0 * uvscale
    ]
    mesh.indices = [2, 3, 1, 1, 0, 2];
    mesh.update();
    return mesh;
}

export function createCube(size) {
    const s = size || [.5, .5, .5];
    const mesh = new Mesh();
    mesh.vertices = [
        -s[0], -s[1], s[2],
        s[0], -s[1], s[2],
        s[0], s[1], s[2],
        -s[0], s[1], s[2],
        -s[0], -s[1], -s[2],
        -s[0], s[1], -s[2],
        s[0], s[1], -s[2],
        s[0], -s[1], -s[2],
        -s[0], s[1], -s[2],
        -s[0], s[1], s[2],
        s[0], s[1], s[2],
        s[0], s[1], -s[2],
        -s[0], -s[1], -s[2],
        s[0], -s[1], -s[2],
        s[0], -s[1], s[2],
        -s[0], -s[1], s[2],
        s[0], -s[1], -s[2],
        s[0], s[1], -s[2],
        s[0], s[1], s[2],
        s[0], -s[1], s[2],
        -s[0], -s[1], -s[2],
        -s[0], -s[1], s[2],
        -s[0], s[1], s[2],
        -s[0], s[1], -s[2]
    ];
    mesh.normals = [
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
    ];
    mesh.indices = [
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23
    ];
    mesh.update();
    return mesh;
}

/**
 * @param {number} radius 
 * @param {number} verticalSegments 
 * @param {number} horizontalSegments 
 * @returns {Mesh}
 */
export function createSphere(radius, verticalSegments, horizontalSegments) {
    const mesh = new Mesh();
    const horizontal = verticalSegments || 16;
    const vertical = horizontalSegments || verticalSegments || 16;
    let horizontalAng = 0;
    let horizontalDiff = (2 * Math.PI) / horizontal;

    let verticalAng = Math.PI / 2;
    let verticalDiff = -(Math.PI / vertical);
    const r = radius || 1.0;

    for (var i = 0; i <= vertical; i++) {
        const cosVert = Math.cos(verticalAng);
        const sinVert = Math.sin(verticalAng);

        for (var j = 0; j <= horizontal; j++) {
            const cosHor = Math.cos(horizontalAng);
            const sinHor = Math.sin(horizontalAng);

            const x = cosVert * sinHor;
            const y = sinVert;
            const z = cosVert * cosHor;

            mesh.vertices.push(x * r, y * r, z * r);
            mesh.normals.push(x, y, z);

            mesh.uv.push(j / horizontal);
            mesh.uv.push(i / vertical);

            horizontalAng += horizontalDiff;
        }

        verticalAng += verticalDiff;
    }

    /*const horizontal = 4;
    const vertical = 4;
    for (let i = 0; i <= horizontal; i++) {
        for (let j = 0; j <= vertical; j++) {
            mesh.vertices.push(
                Math.sin(Math.PI * i / horizontal) * Math.cos(2.0 * j / vertical),
                Math.sin(Math.PI * i / horizontal) * Math.sin(2.0 * j / vertical),
                Math.cos(Math.PI * i / horizontal)
            );
        }
    }*/
    for (var i = 0; i < vertical; i++) {
        let k1 = i * (horizontal + 1);
        let k2 = k1 + horizontal + 1;

        for (var j = 0; j < horizontal; j++) {

            if (i != 0) {
                mesh.indices.push(k1);
                mesh.indices.push(k2);
                mesh.indices.push(k1 + 1);
            }

            if (i != (vertical - 1)) {
                mesh.indices.push(k1 + 1);
                mesh.indices.push(k2);
                mesh.indices.push(k2 + 1);
            }

            k1++;
            k2++;
        }
    }
    mesh.calculateTangents();
    mesh.update();
    return mesh;
}