#version 330 core
layout(location = 0) out vec4 FragColor;

in VS_OUT {
  vec3 position;
  vec3 normal;
  flat vec3 viewPosition;
} fs_in;

uniform samplerCube skybox;

uniform float fresnelBias;
uniform float fresnelScale;
uniform float fresnelPower;

void main() {
  // Refractive index of R, G, and B respectively
  vec3 Eta = vec3(1/ 1.39, 1 / 1.44, 1 / 1.47);
  // TODO: fresnel reflection and refraction
  // Hint:
  //   1. You should query the texture for R, G, and B values respectively to create dispersion effect.
  //   2. You should use those uniform variables in the equation(1).
  // Note:
  //   1. The link 1 is not GLSL you just check the concept.
  //   2. We use the empirical approach of fresnel equation.
  //      clamp(fresnelBias + fresnelScale * pow(1 + dot(I, N), fresnelPower), 0.0, 1.0); (1)
  // Reference:
  //   1. Overview: https://developer.download.nvidia.com/CgTutorial/cg_tutorial_chapter07.html
  //   2. Refract : https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/refract.xhtml
  //   3. Reflect : https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/reflect.xhtml
  //   3. Clamp   : https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/clamp.xhtml
  //   3. Mix     : https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/mix.xhtml
  vec3 I = normalize(fs_in.position - fs_in.viewPosition);
  vec3 N = normalize(fs_in.normal);
  vec3 reflection = reflect(I, N);
  vec3 reflectColor = texture(skybox, reflection).rgb;

  vec3 red = refract(I, N, Eta.x);
  vec3 green = refract(I, N, Eta.y);
  vec3 blue = refract(I, N, Eta.z);
  vec3 refractColor;
  refractColor.r = texture(skybox, red).r;
  refractColor.g = texture(skybox, green).g;
  refractColor.b = texture(skybox, blue).b;

  float reflectCoefficient = max(0, min(1, fresnelBias + fresnelScale * (pow(1 + dot(I, N), fresnelPower))));

  // FragColor = vec4(0.5, 0.5, 0.5, 1.0);
  FragColor = vec4(reflectCoefficient * reflectColor + (1 - reflectCoefficient) * refractColor, 1.0);
}
