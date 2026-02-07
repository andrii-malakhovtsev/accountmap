if (typeof globalThis !== "undefined" && !globalThis.GPUShaderStage) {
  globalThis.GPUShaderStage = { VERTEX: 1, FRAGMENT: 2, COMPUTE: 4 };
}
