#version 300 es
invariant gl_Position;

layout(location = 0) in vec3 VertexPosition;
layout(location = 1) in vec3 VertexNormal;
layout(location = 2) in vec2 VertexUV;
layout(location = 4) in vec3 VertexTangent;

uniform mat4 ProjectionMatrix;
uniform mat4 ModelMatrix;
uniform mat4 NormalMatrix;

out vec3 Position;
out vec3 Normal;
out vec2 Uv;
out vec3 Tangent;
out mat3 TBN;

void main() {
    Uv = VertexUV;
    Position = VertexPosition;//(ModelMatrix * vec4(VertexPosition, 1.0)).xyz;
    gl_Position = vec4(Position, 1.0);//ProjectionMatrix * vec4(Position, 1.0);

    vec3 T = normalize(vec3(NormalMatrix * vec4(VertexTangent, 0.0)));
    vec3 N = normalize(vec3(NormalMatrix * vec4(VertexNormal, 0.0)));
    T = normalize(T - dot(T, N) * N);
    vec3 B = cross(N, T);
    TBN = mat3(T, B, N);
}