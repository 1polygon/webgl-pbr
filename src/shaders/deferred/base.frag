#version 300 es

precision highp float;

in vec3 Position;
in vec3 Normal;
in vec2 Uv;
in mat3 TBN;

layout(location = 0) out vec4 fragPosition;
layout(location = 1) out vec4 fragNormal;
layout(location = 2) out vec4 fragUV; 

void main() {
  fragNormal = vec4(Normal, 1.0);
  fragUV = vec4(Uv.x, Uv.y, 0.0, 1.0);
  fragPosition = vec4(Position, 1.0);
}