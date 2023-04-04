#version 300 es

layout(location = 0) in vec3 VertexPosition;

out vec3 Position;
uniform mat4 Projection;
uniform mat4 Model;

void main() {
    Position = VertexPosition.xyz;
    Position = (Model * vec4(VertexPosition, 1.0)).xyz;
    gl_Position = Projection * vec4(Position, 1.0);
}