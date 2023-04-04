
import {
  Scene,
  FreeCam,
  MeshRenderer,
  PbrMaterial,
  loadOBJ,
  Texture2D,
  PointLight,
  DirectionalLight,
  createPlane,
  colors
} from "./src/index";

const canvas = document.createElement("canvas");
canvas.width = 1280;
canvas.height = 720;
document.body.appendChild(canvas);

const scene = new Scene(canvas);

// Material
const pbrMaterial = new PbrMaterial();
pbrMaterial.albedo = new Texture2D("/textures/laminate_floor_02_albedo_4k.jpg");
pbrMaterial.normal = new Texture2D("/textures/laminate_floor_02_normal_4k.jpg");
pbrMaterial.roughness = new Texture2D("/textures/laminate_floor_02_roughness_4k.jpg");

// Meshes
const mesh = await loadOBJ("/meshes/suzanne-hq.obj");
const suzanne = new MeshRenderer(mesh, pbrMaterial);
suzanne.location = [0, 10, 0];
suzanne.scale = [10, 10, 10];
suzanne.on("tick", deltaTime => {
  suzanne.rotation[1] += deltaTime * 0.1;
});
scene.add(suzanne);

const floor = new MeshRenderer(createPlane(100, 100), pbrMaterial);
floor.location = [-50.0, 0, -50.0];
scene.add(floor);

// Lights
const sun = new DirectionalLight();
sun.rotate(-90, 0, 0);
sun.color = [1.0, .8, .8];
sun.attenuation = 0.1;
scene.add(sun);

const light1 = new PointLight();
light1.color = colors.green;
light1.attenuation = 55.0;
light1.location = [10, 1, 5];
scene.add(light1);

const light2 = new PointLight();
light2.color = colors.red;
light2.attenuation = 55.0;
light2.location = [-10, 1, 5];
scene.add(light2);

// Camera
const camera = new FreeCam();
camera.location = [-0.8, 15.8, 18.4];
camera.rotation = [0.33, -3.14, 0];
scene.setCamera(camera);
