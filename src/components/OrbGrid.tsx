"use client";

import { useEffect, useRef, useState } from "react";

export interface OrbGridItem {
  image: string;
  title: string;
  description: string;
  link?: string;
}

const VERT_SRC = `#version 300 es
uniform mat4 uWorld;
uniform mat4 uView;
uniform mat4 uProj;

in vec2 aPos;
in vec2 aUv;
in mat4 aInstance;

out vec2 vUv;
out float vShade;
flat out int vId;

void main() {
  vec4 world = uWorld * aInstance * vec4(aPos, 0.0, 1.0);
  gl_Position = uProj * uView * world;
  vec3 centerDir = normalize((uWorld * aInstance * vec4(0.0, 0.0, 0.0, 1.0)).xyz);
  vShade = smoothstep(-0.2, 1.0, centerDir.z) * 0.85 + 0.15;
  vUv = aUv;
  vId = gl_InstanceID;
}
`;

const FRAG_SRC = `#version 300 es
precision highp float;

uniform sampler2D uAtlas;
uniform int uItemCount;
uniform int uAtlasCols;

in vec2 vUv;
in float vShade;
flat in int vId;

out vec4 outColor;

void main() {
  int idx = vId % uItemCount;
  int cx = idx % uAtlasCols;
  int cy = idx / uAtlasCols;
  vec2 cell = vec2(1.0) / vec2(float(uAtlasCols));
  vec2 uv = vUv * cell + vec2(float(cx), float(cy)) * cell;
  vec4 tex = texture(uAtlas, uv);
  outColor = vec4(tex.rgb * vShade, tex.a);
}
`;

function m4Identity(): Float32Array {
  return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}

function m4Multiply(a: Float32Array, b: Float32Array): Float32Array {
  const out = new Float32Array(16);
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) sum += a[k * 4 + r] * b[c * 4 + k];
      out[c * 4 + r] = sum;
    }
  }
  return out;
}

function m4Perspective(fovY: number, aspect: number, near: number, far: number): Float32Array {
  const f = 1 / Math.tan(fovY / 2);
  const out = new Float32Array(16);
  out[0] = f / aspect;
  out[5] = f;
  out[10] = (far + near) / (near - far);
  out[11] = -1;
  out[14] = (2 * far * near) / (near - far);
  return out;
}

function m4LookAt(eye: [number, number, number], target: [number, number, number], up: [number, number, number]): Float32Array {
  let zx = eye[0] - target[0],
    zy = eye[1] - target[1],
    zz = eye[2] - target[2];
  let zl = Math.hypot(zx, zy, zz) || 1;
  zx /= zl;
  zy /= zl;
  zz /= zl;

  let xx = up[1] * zz - up[2] * zy;
  let xy = up[2] * zx - up[0] * zz;
  let xz = up[0] * zy - up[1] * zx;
  let xl = Math.hypot(xx, xy, xz) || 1;
  xx /= xl;
  xy /= xl;
  xz /= xl;

  const yx = zy * xz - zz * xy;
  const yy = zz * xx - zx * xz;
  const yz = zx * xy - zy * xx;

  return new Float32Array([
    xx,
    yx,
    zx,
    0,
    xy,
    yy,
    zy,
    0,
    xz,
    yz,
    zz,
    0,
    -(xx * eye[0] + xy * eye[1] + xz * eye[2]),
    -(yx * eye[0] + yy * eye[1] + yz * eye[2]),
    -(zx * eye[0] + zy * eye[1] + zz * eye[2]),
    1,
  ]);
}

function instanceMatrix(pos: [number, number, number], scale: number): Float32Array {
  const [nx, ny, nz] = pos;
  // tangent = worldUp x normal; degenerates only near the Y poles (top/bottom),
  // never near the camera-facing +Z hemisphere where most tiles are actually seen
  let ux = nz,
    uy = 0,
    uz = -nx;
  let ul = Math.hypot(ux, uy, uz);
  if (ul < 0.0001) {
    ux = 1;
    uy = 0;
    uz = 0;
    ul = 1;
  }
  ux /= ul;
  uy /= ul;
  uz /= ul;

  const vx = ny * uz - nz * uy;
  const vy = nz * ux - nx * uz;
  const vz = nx * uy - ny * ux;

  return new Float32Array([
    ux * scale,
    uy * scale,
    uz * scale,
    0,
    vx * scale,
    vy * scale,
    vz * scale,
    0,
    nx * scale,
    ny * scale,
    nz * scale,
    0,
    nx * 2,
    ny * 2,
    nz * 2,
    1,
  ]);
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function fibonacciSpherePositions(n: number): [number, number, number][] {
  const out: [number, number, number][] = [];
  for (let i = 0; i < n; i++) {
    const y = n > 1 ? 1 - (i / (n - 1)) * 2 : 0;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = GOLDEN_ANGLE * i;
    out.push([Math.cos(theta) * r, y, Math.sin(theta) * r]);
  }
  return out;
}

function buildDisc(steps: number): { verts: Float32Array; uvs: Float32Array; indices: Uint16Array } {
  const verts: number[] = [0, 0];
  const uvs: number[] = [0.5, 0.5];
  const indices: number[] = [];
  for (let i = 0; i < steps; i++) {
    const a = (Math.PI * 2 * i) / steps;
    const x = Math.cos(a) * 0.34;
    const y = Math.sin(a) * 0.34;
    verts.push(x, y);
    uvs.push(x / 0.68 + 0.5, y / 0.68 + 0.5);
    if (i > 0) indices.push(0, i, i + 1);
  }
  indices.push(0, steps, 1);
  return { verts: new Float32Array(verts), uvs: new Float32Array(uvs), indices: new Uint16Array(indices) };
}

function compileShader(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
  }
  return shader;
}

export default function OrbGrid({
  items,
  className = "",
}: {
  items: OrbGridItem[];
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [settled, setSettled] = useState(true);
  const [engaged, setEngaged] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper || items.length === 0) return;
    const gl = canvas.getContext("webgl2", { antialias: true, alpha: true });
    if (!gl) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, VERT_SRC));
    gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
    }

    const locPos = gl.getAttribLocation(program, "aPos");
    const locUv = gl.getAttribLocation(program, "aUv");
    const locInstance = gl.getAttribLocation(program, "aInstance");
    const uWorld = gl.getUniformLocation(program, "uWorld");
    const uView = gl.getUniformLocation(program, "uView");
    const uProj = gl.getUniformLocation(program, "uProj");
    const uAtlas = gl.getUniformLocation(program, "uAtlas");
    const uItemCount = gl.getUniformLocation(program, "uItemCount");
    const uAtlasCols = gl.getUniformLocation(program, "uAtlasCols");

    const disc = buildDisc(28);
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, disc.verts, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(locPos);
    gl.vertexAttribPointer(locPos, 2, gl.FLOAT, false, 0, 0);

    const uvBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
    gl.bufferData(gl.ARRAY_BUFFER, disc.uvs, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(locUv);
    gl.vertexAttribPointer(locUv, 2, gl.FLOAT, false, 0, 0);

    const indexBuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, disc.indices, gl.STATIC_DRAW);

    const count = items.length;
    const instanceBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuf);
    gl.bufferData(gl.ARRAY_BUFFER, count * 16 * 4, gl.DYNAMIC_DRAW);
    for (let i = 0; i < 4; i++) {
      const loc = locInstance + i;
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, 64, i * 16);
      gl.vertexAttribDivisor(loc, 1);
    }
    gl.bindVertexArray(null);

    const atlasCols = Math.ceil(Math.sqrt(count));
    const cellSize = 480;
    const atlasCanvas = document.createElement("canvas");
    atlasCanvas.width = atlasCols * cellSize;
    atlasCanvas.height = atlasCols * cellSize;
    const ctx = atlasCanvas.getContext("2d")!;
    ctx.fillStyle = "#0d0d0b";
    ctx.fillRect(0, 0, atlasCanvas.width, atlasCanvas.height);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlasCanvas);

    let disposed = false;
    Promise.all(
      items.map(
        (item) =>
          new Promise<HTMLImageElement>((resolve) => {
            const img = new window.Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = () => resolve(img);
            img.src = item.image;
          })
      )
    ).then((images) => {
      if (disposed) return;
      images.forEach((img, i) => {
        const x = (i % atlasCols) * cellSize;
        const y = Math.floor(i / atlasCols) * cellSize;
        if (img.complete && img.naturalWidth > 0) ctx.drawImage(img, x, y, cellSize, cellSize);
      });
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlasCanvas);
      gl.generateMipmap(gl.TEXTURE_2D);
    });

    const positions = fibonacciSpherePositions(count);
    const instanceData = new Float32Array(count * 16);

    let yaw = 0;
    let pitch = -0.15;
    let velYaw = 0;
    let velPitch = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let camZ = 3.4;
    let engagedOnce = false;

    const onEngage = () => {
      if (engagedOnce) return;
      engagedOnce = true;
      setEngaged(true);
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      onEngage();
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      yaw += dx * 0.005;
      pitch += dy * 0.005;
      pitch = Math.max(-1.2, Math.min(1.2, pitch));
      velYaw = dx * 0.0012;
      velPitch = dy * 0.0004;
    };
    const onUp = () => {
      dragging = false;
    };
    wrapper.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    let raf = 0;
    let lastActiveIdx = -1;
    let lastSettled = true;

    const frame = () => {
      if (!dragging) {
        yaw += velYaw;
        pitch += velPitch;
        velYaw *= 0.945;
        velPitch *= 0.945;
        pitch = Math.max(-1.2, Math.min(1.2, pitch));
      }

      const cosY = Math.cos(yaw),
        sinY = Math.sin(yaw);
      const cosX = Math.cos(pitch),
        sinX = Math.sin(pitch);

      let bestDot = -2;
      let bestIdx = 0;
      let bestX = 0;
      let bestY = 0;

      for (let i = 0; i < count; i++) {
        const [px, py, pz] = positions[i];
        const x1 = px * cosY + pz * sinY;
        const z1 = -px * sinY + pz * cosY;
        const y1 = py;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;
        const x2 = x1;

        if (z2 > bestDot) {
          bestDot = z2;
          bestIdx = i;
          bestX = x2;
          bestY = y2;
        }

        const depth = (z2 + 1) / 2;
        const scale = 0.55 + depth * 0.7;
        const m = instanceMatrix([x2, y2, z2], scale);
        instanceData.set(m, i * 16);
      }

      // magnet the nearest item to dead-center once the fling has mostly died down
      if (!dragging && Math.abs(velYaw) < 0.004 && Math.abs(velPitch) < 0.004) {
        yaw += -bestX * 0.08;
        pitch += bestY * 0.08;
        velYaw *= 0.8;
        velPitch *= 0.8;
      }

      const isMoving =
        dragging || Math.abs(velYaw) > 0.0006 || Math.abs(velPitch) > 0.0006 || Math.abs(bestX) > 0.01 || Math.abs(bestY) > 0.01;
      if (isMoving !== !lastSettled) {
        lastSettled = !isMoving;
        setSettled(!isMoving);
      }
      if (!isMoving && bestIdx !== lastActiveIdx) {
        lastActiveIdx = bestIdx;
        setActive(bestIdx);
      }

      const targetZ = dragging ? 3.4 + Math.min(1.2, Math.abs(velYaw) * 60) : 3.4;
      camZ += (targetZ - camZ) * 0.08;

      gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, instanceData);

      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.BACK);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.useProgram(program);
      const aspect = canvas.clientWidth / Math.max(1, canvas.clientHeight);
      const proj = m4Perspective(Math.PI / 4, aspect, 0.1, 40);
      const view = m4LookAt([0, 0, camZ], [0, 0, 0], [0, 1, 0]);
      const world = m4Multiply(m4Identity(), m4Identity());

      gl.uniformMatrix4fv(uWorld, false, world);
      gl.uniformMatrix4fv(uView, false, view);
      gl.uniformMatrix4fv(uProj, false, proj);
      gl.uniform1i(uItemCount, count);
      gl.uniform1i(uAtlasCols, atlasCols);
      gl.uniform1i(uAtlas, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);

      gl.bindVertexArray(vao);
      gl.drawElementsInstanced(gl.TRIANGLES, disc.indices.length, gl.UNSIGNED_SHORT, 0, count);
      gl.bindVertexArray(null);

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      wrapper.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      gl.deleteProgram(program);
      gl.deleteTexture(texture);
      gl.deleteBuffer(posBuf);
      gl.deleteBuffer(uvBuf);
      gl.deleteBuffer(indexBuf);
      gl.deleteBuffer(instanceBuf);
      gl.deleteVertexArray(vao);
    };
  }, [items]);

  const activeItem = items[active];
  const firstItem = items[0];

  return (
    <div ref={wrapperRef} className={`relative overflow-hidden rounded-2xl ${className}`}>
      {firstItem && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-cover bg-center transition-opacity duration-500 ${
            engaged ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          style={{ backgroundImage: `url(${firstItem.image})` }}
        >
          <span className="rounded-full bg-foreground/80 px-5 py-2 text-xs uppercase tracking-[0.2em] text-background backdrop-blur-sm">
            Press &amp; drag to explore
          </span>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className={`h-full w-full cursor-grab touch-none transition-opacity duration-500 active:cursor-grabbing ${
          engaged ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {activeItem && (
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-4 flex items-end justify-between gap-4 px-4 transition-all duration-300 ${
            engaged && settled ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          <div>
            <h3 className="font-display text-xl uppercase leading-tight text-foreground md:text-2xl">
              {activeItem.title}
            </h3>
            <p className="mt-1 max-w-[18ch] text-xs text-muted">{activeItem.description}</p>
          </div>
          {activeItem.link && (
            <a
              href={activeItem.link}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-background transition-transform hover:scale-110"
            >
              ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}
