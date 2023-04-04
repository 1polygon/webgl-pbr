import { Camera } from "../camera";
import { PbrMaterial } from "../materials/pbr-material";
import { SceneContext } from "../scene-context";
import { getShader } from "../shader";
import { LightType } from "../light";

export class ForwardRenderer extends SceneContext {
    constructor() {
        super();
    }

    init(scene) {
        super.init(scene);

        this.ambientColor = [0.0, 0.0, 0.0, 1.0];
        this.shaders = {
            ambient: getShader("forward/pbr-ambient"),
            point: getShader("forward/pbr-pointlight"),
            directional: getShader("forward/pbr-dirlight")
        };
        this.shaders[LightType.Point] = this.shaders.point;
        this.shaders[LightType.Directional] = this.shaders.directional;

        this.shaders.ambient.init(scene);
        this.shaders.point.init(scene);
        this.shaders.directional.init(scene);
    }

    /**
     * @param {Camera} camera 
     * @param {MeshObject} model 
     * @param {PbrMaterial} material 
     */
    drawLit(camera, model, material) {
        this.shaders.ambient.use();
        this.shaders.ambient.setVector4("Color", this.ambientColor);
        this.shaders.ambient.setTexture("AlbedoMap", material.albedo);
        this.shaders.ambient.setMatrix4("ProjectionMatrix", camera.projectionMatrix);
        this.shaders.ambient.setMatrix4("ModelMatrix", model.modelMatrix);
        this.shaders.ambient.setVector3("CameraPosition", camera.location);
        this.shaders.ambient.bindTextures();
        model.mesh.draw();

        this.gl.blendFunc(this.gl.ONE, this.gl.ONE);
        this.gl.depthMask(false);
        this.gl.depthFunc(this.gl.EQUAL);

        for (const light of this.scene.lights) {
            const shader = this.shaders[light.type];
            shader.use();
            shader.setTexture("AlbedoMap", material.albedo);
            shader.setTexture("NormalMap", material.normal);
            shader.setTexture("RoughnessMap", material.roughness);
            shader.setMatrix4("ProjectionMatrix", camera.projectionMatrix);
            shader.setMatrix4("ModelMatrix", model.modelMatrix);
            shader.setMatrix4("NormalMatrix", model.normalMatrix);
            shader.setVector3("CameraPosition", camera.location);
            shader.setVector3("LightPosition", light.location);
            shader.setVector3("LightDirection", light.forward);
            shader.setVector3("LightColor", light.color);
            shader.setFloat("LightAttenuation", light.attenuation);
            shader.bindTextures();
            model.mesh.draw();
        }

        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.depthMask(true);
    }
}