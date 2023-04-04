import unlitDefaultFrag from "./shaders/unlit/default.frag";
import unlitDefaultVert from "./shaders/unlit/default.vert";

import unlitGridFrag from "./shaders/unlit/grid.frag";
import unlitGridVert from "./shaders/unlit/grid.vert";

import forwardAmbientFrag from "./shaders/forward/pbr-ambient.frag";
import forwardAmbientVert from "./shaders/forward/pbr-ambient.vert";

import forwardPointlightFrag from "./shaders/forward/pbr-pointlight.frag";
import forwardPointlightVert from "./shaders/forward/pbr-pointlight.vert";

import forwardDirlightFrag from "./shaders/forward/pbr-dirlight.frag";
import forwardDirlightVert from "./shaders/forward/pbr-dirlight.vert";

import debugNormalFrag from "./shaders/debug/normal.frag";
import debugNormalVert from "./shaders/debug/normal.vert";

import debugTextureFrag from "./shaders/debug/texture.frag";
import debugTextureVert from "./shaders/debug/texture.vert";

import deferredBaseFrag from "./shaders/deferred/base.frag";
import deferredBaseVert from "./shaders/deferred/base.vert";

import deferredLitFrag from "./shaders/deferred/lit.frag";
import deferredLitVert from "./shaders/deferred/lit.vert";

const data = {
    "unlit/default": {
        fragment: unlitDefaultFrag,
        vertex: unlitDefaultVert
    },
    "unlit/grid": {
        fragment: unlitGridFrag,
        vertex: unlitGridVert
    },
    "forward/pbr-ambient": {
        fragment: forwardAmbientFrag,
        vertex: forwardAmbientVert
    },
    "forward/pbr-pointlight": {
        fragment: forwardPointlightFrag,
        vertex: forwardPointlightVert
    },
    "forward/pbr-dirlight": {
        fragment: forwardDirlightFrag,
        vertex: forwardDirlightVert
    },
    "debug/normal": {
        fragment: debugNormalFrag,
        vertex: debugNormalVert
    },
    "debug/texture": {
        fragment: debugTextureFrag,
        vertex: debugTextureVert
    },
    "deferred/base": {
        fragment: deferredBaseFrag,
        vertex: deferredBaseVert
    },
    "deferred/lit": {
        fragment: deferredLitFrag,
        vertex: deferredLitVert
    }
}

export function getShaderSource(relativePath) {
    return data[relativePath];
}
