#version 300 es

layout(location = 0) in vec3 VertexPosition;

uniform mat4 Projection;
uniform mat4 Model;

void main() {
  gl_Position = Projection * Model * vec4(VertexPosition, 1.0);
}