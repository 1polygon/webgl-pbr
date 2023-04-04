#version 300 es
invariant gl_Position;
layout(location = 0) in vec3 VertexPosition;
layout(location = 1) in vec3 VertexNormal;

out vec3 Position;
out vec3 Normal;

uniform mat4 Projection;
uniform mat4 Model;
uniform mat4 NormalMatrix;

void main() {
    Normal = (NormalMatrix * vec4(VertexNormal, 0.0)).xyz;
    Position = (Model * vec4(VertexPosition, 1.0)).xyz;
    gl_Position = Projection * vec4(Position, 1.0);
}