import { Camera } from "../camera";
import { PbrMaterial } from "../materials/pbr-material";
import { SceneContext } from "../scene-context";
import { getShader } from "../shader";
import { LightType } from "../light";
import { createSphere } from "../utils/primitive-mesh";
import { Mesh } from "../mesh";

export class DeferredRenderer extends SceneContext {
    constructor() {
        super();
    }

    init(scene) {
        super.init(scene);

        this.ambientColor = [0.0, 0.0, 0.0, 1.0];

        if (!this.gl.getExtension("EXT_color_buffer_float")) {
            console.error("FLOAT color buffer not available");
        }

        this.gbuffer = this.gl.createFramebuffer();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.gbuffer);

        this.gl.activeTexture(this.gl.TEXTURE0);

        this.positionTexture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.positionTexture);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texStorage2D(this.gl.TEXTURE_2D, 1, this.gl.RGBA16F, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.positionTexture, 0);

        this.normalTexture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.normalTexture);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texStorage2D(this.gl.TEXTURE_2D, 1, this.gl.RGBA16F, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT1, this.gl.TEXTURE_2D, this.normalTexture, 0);

        this.uvTexture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.uvTexture);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texStorage2D(this.gl.TEXTURE_2D, 1, this.gl.RG16F, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT2, this.gl.TEXTURE_2D, this.uvTexture, 0);

        this.depthTexture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.depthTexture);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texStorage2D(this.gl.TEXTURE_2D, 1, this.gl.DEPTH_COMPONENT16, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_2D, this.depthTexture, 0);

        this.gl.drawBuffers([
            this.gl.COLOR_ATTACHMENT0,
            this.gl.COLOR_ATTACHMENT1,
            this.gl.COLOR_ATTACHMENT2
        ]);

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

        this.baseShader = getShader("deferred/base");
        this.baseShader.init(scene);
        this.litShader = getShader("deferred/lit");
        this.litShader.init(scene);

        this.screenQuad = new Mesh();
        const size = 0.5;
        this.screenQuad.vertices = [
            -size, -size, 0.0,
            -size, size, 0.0,
            size, size, 0.0,
            size, -size, 0.0
        ];
        this.screenQuad.uv = [
            0.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
            1.0, 0.0
        ];
        this.screenQuad.indices = [
            0, 2, 1,
            0, 3, 2
        ];
        this.screenQuad.updateBuffers(this.scene);

        this.sphereMesh = createSphere(220.0, 6, 6);
        //this.sphereMesh.indices = this.sphereMesh.indices.reverse();
        this.sphereMesh.updateBuffers(this.scene);
        this.firstRender = true;
        this.scene.on("tick", () => {
            this.firstRender = true;
        });
    }

    /**
     * @param {Camera} camera 
     * @param {MeshObject} model 
     * @param {PbrMaterial} material 
     */
    drawLit(camera, model, material) {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.gbuffer);

        this.gl.depthMask(true);
        this.gl.disable(this.gl.BLEND);

        if (this.firstRender) {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            this.firstRender = false;
        }

        this.baseShader.use();
        this.baseShader.setMatrix4("ProjectionMatrix", camera.projectionMatrix);
        this.baseShader.setMatrix4("ModelMatrix", model.modelMatrix);
        this.baseShader.setMatrix4("NormalMatrix", model.normalMatrix);
        model.mesh.draw();


        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.ONE, this.gl.ONE);
        this.gl.depthMask(false);
        //this.gl.depthFunc(this.gl.EQUAL);

        this.litShader.use();
        this.litShader.setVector3("CameraPosition", camera.location);
        this.litShader.setMatrix4("ProjectionMatrix", camera.projectionMatrix);
        this.gl.uniform1i(this.gl.getUniformLocation(this.litShader.program, "positionBuffer"), 0);
        this.gl.activeTexture(this.gl.TEXTURE0 + 0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.positionTexture);
        this.gl.uniform1i(this.gl.getUniformLocation(this.litShader.program, "normalBuffer"), 1);
        this.gl.activeTexture(this.gl.TEXTURE0 + 1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.normalTexture);
        this.gl.uniform1i(this.gl.getUniformLocation(this.litShader.program, "uvBuffer"), 2);
        this.gl.activeTexture(this.gl.TEXTURE0 + 2);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.uvTexture);     
        // TODO -> render base color first
        //for(const light of this.scene.lights) {
        //    if(light.type == LightType.Point) {
        //        //this.litShader.setMatrix4("ModelMatrix", light.modelMatrix);
        //        this.litShader.setVector3("LightPosition", light.location);
        //        this.litShader.setVector3("LightDirection", light.forward);
        //        this.litShader.setVector3("LightColor", light.color);
        //        this.litShader.setFloat("LightAttenuation", light.attenuation);
//
        //        this.screenQuad.draw();                    
        //    }
        //
        //}
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.depthMask(true);
    }
}