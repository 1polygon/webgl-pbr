export function clamp01(value) {
    return value < 0.0 ? 0.0 : value > 1.0 ? 1.0 : value;
}

export function lerp(a, b, t) {
    return a + (b - a) * clamp01(t);
}