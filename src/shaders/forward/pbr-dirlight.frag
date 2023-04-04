#version 300 es

precision mediump float;

#include ./pbr-utils.glsl

out vec4 FragColor;

in vec3 Position;
in vec3 Normal;
in vec2 Uv;
in vec3 Tangent;
in mat3 TBN;

uniform vec3 LightColor;
uniform vec3 LightDirection;
uniform float LightAttenuation;
uniform vec3 CameraPosition;

uniform sampler2D AlbedoMap;
uniform sampler2D NormalMap;
uniform sampler2D RoughnessMap;

void main() {
    vec3 albedo = texture(AlbedoMap, Uv).rgb;
    float metallic = 0.0;
    float roughness = texture(RoughnessMap, Uv).r;
    float ao = 0.0;

    vec3 PixelNormal = sampleNormalmap(NormalMap, Uv, 1.0);
    vec3 N = normalize(TBN * PixelNormal);
    vec3 V = normalize(CameraPosition - Position);

    vec3 F0 = vec3(0.04); 
    F0 = mix(F0, albedo, metallic);
	           
    // reflectance equation
    vec3 Lo = vec3(0.0);

    vec3 lightPosition = vec3(0.0);
    vec3 lightColor = LightColor;

    // calculate per-light radiance
    vec3 L = LightDirection;
    vec3 H = normalize(V + L);
    float dist    = 0.0;//length(lightPosition - Position);
    float attenuation = 1.0;
    attenuation *= LightAttenuation;
    vec3 radiance     = lightColor * attenuation;        
    
    // cook-torrance brdf
    float NDF = DistributionGGX(N, H, roughness);        
    float G   = GeometrySmith(N, V, L, roughness);      
    vec3 F    = fresnelSchlick(max(dot(H, V), 0.0), F0);       
    
    vec3 kS = F;
    vec3 kD = vec3(1.0) - kS;
    kD *= 1.0 - metallic;	  
    
    vec3 numerator    = NDF * G * F;
    float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0) + 0.0001;
    vec3 specular     = numerator / denominator;  
        
    // add to outgoing radiance Lo
    float NdotL = max(dot(N, L), 0.0);                
    Lo += (kD * albedo / PI + specular) * radiance * NdotL;
  
    vec3 ambient = vec3(0.03) * albedo * ao;
    vec3 color = ambient + Lo;
	
    color = color / (color + vec3(1.0));
    color = pow(color, vec3(1.0/2.2));  
   
    FragColor = vec4(color, 1.0);
}