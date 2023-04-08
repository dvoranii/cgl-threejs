varying vec3 vertexNormal; 
void main() {
    float intensity = pow(0.6 - dot(vertexNormal, vec3(0,0,1.0)), 1.5);
    // this is smoother because we are multiplying with a vec4 and
    // not just adjusting the initial alpha value
    gl_FragColor = vec4(0.5608, 0.8392, 0.6706, 0.8)* intensity * vec4(1.0, 1.0, 1.0, 1);
    // gl_FragColor = vec4(0.3, 0.6, 1.0, 0.5 * intensity);


}