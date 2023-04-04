#version 300 es

precision mediump float;

in vec3 Position;
in vec3 Normal;
in vec2 Uv;

out vec4 o_color;
uniform vec4 Color;

uniform sampler2D AlbedoMap;

void main() {
  o_color = Color * texture(AlbedoMap, Uv);
}