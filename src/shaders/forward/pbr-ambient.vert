#version 300 es
invariant gl_Position;
layout(location = 0) in vec3 VertexPosition;
layout(location = 1) in vec3 VertexNormal;
layout(location = 2) in vec2 VertexUv;

out vec3 Position;
out vec3 Normal;
out vec2 Uv;

uniform mat4 ProjectionMatrix;
uniform mat4 ModelMatrix;
uniform mat4 NormalMatrix;

void main() {
    Uv = VertexUv;
    Normal = (NormalMatrix * vec4(VertexNormal, 1.0)).xyz;
    Position = (ModelMatrix * vec4(VertexPosition, 1.0)).xyz;
    gl_Position = ProjectionMatrix * vec4(Position, 1.0);
}