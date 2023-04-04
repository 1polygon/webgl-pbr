#version 300 es

precision mediump float;

out vec4 o_color;
uniform vec4 Color;

void main() {
  o_color = Color;
}