#version 300 es

precision highp float;

#include ../forward/pbr-utils.glsl

in vec2 Uv;
in vec3 Position;
in mat3 TBN;

out vec4 o_color;

uniform sampler2D positionBuffer;
uniform sampler2D normalBuffer;
uniform sampler2D uvBuffer;

uniform vec3 CameraPosition;

uniform vec3 LightColor;
uniform vec3 LightPosition;
uniform float LightAttenuation;

uniform sampler2D AlbedoMap;
uniform sampler2D NormalMap;
uniform sampler2D RoughnessMap;

void main() {
    ivec2 fragCoord = ivec2(gl_FragCoord.xy); 
    vec3 position = texelFetch(positionBuffer, fragCoord, 0).xyz;
    vec3 normal = normalize(texelFetch(normalBuffer, fragCoord, 0).xyz);
    vec2 uv = texelFetch(uvBuffer, fragCoord, 0).xy;

    vec3 albedo = texture(AlbedoMap, uv).rgb; //vec3(1, 1, 1);
    float metallic = 0.0;
    float roughness = texture(RoughnessMap, uv).r;
    float ao = 0.0;

    //vec3 PixelNormal = sampleNormalmap(NormalMap, uv, 1.0);
    vec3 N = normal;//normalize(TBN * PixelNormal);
    vec3 V = normalize(CameraPosition - position);

    vec3 F0 = vec3(0.04); 
    F0 = mix(F0, albedo, metallic);
	           
    // reflectance equation
    vec3 Lo = vec3(0.0);

    vec3 lightPosition = LightPosition;
    vec3 lightColor = LightColor;

    // calculate per-light radiance
    vec3 L = normalize(lightPosition - position);
    vec3 H = normalize(V + L);
    float dist    = length(lightPosition - position);
    float attenuation = 1.0 / (dist * dist);
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
   
    o_color = vec4(position, 1.0);


/*
    vec4 baseColor = vec4(1.0, 1.0, 1.0, 1.0);
    
    vec3 lightPosition = LightPosition;
    vec3 lightColor = LightColor;

    vec3 eyeDirection = normalize(CameraPosition - position);
    vec3 lightVec = lightPosition - position;
    lightVec *= 0.1;
    float attenuation = 1.0 - length(lightVec);
    vec3 lightDirection = normalize(lightVec);
    vec3 reflectionDirection = reflect(-lightDirection, normal);
    float nDotL = max(dot(lightDirection, normal), 0.0);
    vec3 diffuse = nDotL * lightColor;
    float ambient = 0.1;
    vec3 specular = pow(max(dot(reflectionDirection, eyeDirection), 0.0), 20.0) * lightColor;

    o_color = vec4(attenuation * (ambient + diffuse + specular) * baseColor.rgb, baseColor.a);*/
    //o_color = vec4(position, 1.0);

    //o_color = vec4(texture(positionBuffer, Uv).rgb, 1.0); //vec4(texelFetch(positionBuffer, ivec2(gl_FragCoord.xy), 0).rgb, 1.0);//texelFetch(positionBuffer, fragCoord, 0);
}
