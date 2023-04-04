#version 300 es

precision mediump float;

out vec4 FragColor;
in vec3 Position;
uniform vec4 Color;
uniform vec3 CameraPosition;

float grid(float scale) {
    vec2 coord = Position.xz * scale;

    vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
    float line = min(grid.x, grid.y);
  
    float v = 1.0 - min(line, 1.0);
    return pow(v, 1.0 / 2.2);
}

void main() {
    float v0 = grid(0.1);
    float v1 = grid(1.0);

    float dist = distance(CameraPosition.xz, Position.xz);

    float value = mix(v0, v1,  1.0 - clamp(0.0, 1.0, abs(CameraPosition.y - Position.y) * 0.1));

    vec4 color = vec4(value) * Color;
    color.a *= smoothstep(200.0, 0.0, dist);

    FragColor = color;
}