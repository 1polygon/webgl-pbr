import { Mesh } from "../mesh";

export async function loadOBJ(url) {
    const res = await fetch(url);

    if (res.status == 200) {
        const text = await res.text();

        const vertices = [];
        const uv = [];
        const normals = [];
        const indices = [];

        for (const line of text.split("\n")) {
            if (line.startsWith("v ")) {
                const data = line.split(" ");
                vertices.push(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
            }

            else if (line.startsWith("vt ")) {
                const data = line.split(" ");
                uv.push(parseFloat(data[1]), parseFloat(data[2]));
            }

            else if (line.startsWith("vn ")) {
                const data = line.split(" ");
                normals.push(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
            }

            else if (line.startsWith("f ")) {
                const data = line.split(" ");
                for (var i = 1; i < data.length; i++) {
                    indices.push(data[i].split("/").map(value => parseInt(value) - 1));
                }
            }
        }
        
        const mesh = new Mesh();
        mesh.vertices = [];
        mesh.uv = [];
        mesh.normals = [];
        mesh.indices = [];
        
        const indexMap = new Map();

        let currentVertexIndex = 0;
        for (var i = 0; i < indices.length; i++) {
            let currentIndex = indices[i];

            let modelVertexIndex = 0;

            const key = currentIndex.join(":");
            if (!indexMap.has(key)) {
                indexMap.set(key, currentVertexIndex);

                mesh.vertices.push(vertices[currentIndex[0] * 3], vertices[currentIndex[0] * 3 + 1], vertices[currentIndex[0] * 3 + 2]);
                mesh.uv.push(uv[currentIndex[1] * 2], uv[currentIndex[1] * 2 + 1]);
                mesh.normals.push(normals[currentIndex[2] * 3], normals[currentIndex[2] * 3 + 1], normals[currentIndex[2] * 3 + 2]);
                modelVertexIndex = currentVertexIndex;
                currentVertexIndex++;
            } else {
                modelVertexIndex = indexMap.get(key);
            }
            mesh.indices.push(modelVertexIndex);
        }
        mesh.calculateTangents();
        mesh.update();
        return mesh;
    }
}
