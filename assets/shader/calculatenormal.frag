#version 330 core
layout(location = 0) out vec4 normal;
layout(location = 1) out float height;

uniform float offset;

void main() {
  const float delta = 0.01;
  // TODO: Generate the normal map.
  //   1. Get the position of the fragment. (screen space)
  //   2. Sample 4 points from combination of x +- delta, y +- delta
  //   3. Form at least 2 triangles from those points. Calculate their surface normal
  //   4. Average the surface normal, then tranform the normal [-1, 1] to RGB [0, 1]
  //   5. (Bonus) Output the H(x, y)
  // Note:
  //   1. Height at (x, y) = H(x, y) = sin(offset - 0.1 * y)
  //   2. A simple tranform from [-1, 1] to [0, 1] is f(x) = x * 0.5 + 0.5
  // normal = vec4(0.5, 0.5, sin(offset - 0.1 * gl_FragCoord.y), 1.0);
  height = sin(offset - 0.1 * gl_FragCoord.y);

  vec3 point1 = vec3(gl_FragCoord.x - delta, gl_FragCoord.y, sin(offset - 0.1 * gl_FragCoord.y));
  vec3 point2 = vec3(gl_FragCoord.x, gl_FragCoord.y + delta, sin(offset - 0.1 * (gl_FragCoord.y + delta)));
  vec3 point3 = vec3(gl_FragCoord.x + delta, gl_FragCoord.y, sin(offset - 0.1 * gl_FragCoord.y));
  vec3 point4 = vec3(gl_FragCoord.x, gl_FragCoord.y - delta, sin(offset - 0.1 * (gl_FragCoord.y - delta)));

  vec3 one_two = normalize(point2 - point1);
  vec3 one_three = normalize(point3 - point1);
  vec3 one_four = normalize(point4 - point1);

  vec3 plane_normal1 = cross(one_three, one_two);
  vec3 plane_normal2 = cross(one_four, one_three);
  vec3 fragment_normal = (plane_normal1 + plane_normal2) / 2;
  vec3 color_normal = fragment_normal * 0.5 + 0.5;
  normal = vec4(color_normal, 1.0);
}
