#version 330 core
layout (location = 0) in vec3 position_in;

out vec3 textureCoordinate;

uniform mat4 view;
uniform mat4 projection;

void main() {
  textureCoordinate = position_in;
  // TODO: Set gl_Position
  // Hint:
  //   1. We want skybox infinite far from us. So the z should be 1.0 after perspective division.
  //   2. We don't want the skybox moving when we move. So the translation in view matrix should be removed.
  mat4 no_tranlation_view = mat4(mat3(view));
  vec4 pos = projection * no_tranlation_view * vec4(position_in, 1.0);
  gl_Position = pos.xyww;
}
