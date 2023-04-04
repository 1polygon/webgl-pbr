#version 300 es

precision mediump float;

in vec3 Position;
in vec3 Normal;

out vec4 o_color;

void main() {
  o_color = vec4(normalize(Normal), 1.0);
}