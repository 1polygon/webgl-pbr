#version 300 es

precision mediump float;

in vec3 Position;
in vec3 Normal;
in vec2 Uv;

out vec4 o_color;

uniform sampler2D Albedo;

void main() {
  o_color.rgb = texture(Albedo, Uv.xy).rgb;
  o_color.a = 1.0;
}