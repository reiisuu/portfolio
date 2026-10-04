"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  siAssemblyscript,
  siC,
  siCplusplus,
  siDocker,
  siExpress,
  siGithub,
  siGithubcopilot,
  siHtml5,
  siJavascript,
  siLinux,
  siMongodb,
  siNodedotjs,
  siNextdotjs,
  siPostgresql,
  siPython,
  siReact,
  siRedis,
  siTailwindcss,
  siTypescript,
} from "simple-icons";
import { IconButton } from "@/components/ui/IconButton";
import { useTheme, type Theme } from "@/components/theme/ThemeProvider";
import { TECHS as DATA_TECHS } from "@/lib/data";

type Axis = 0 | 1 | 2;
type Position = [number, number, number];
type IconFn = (ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, col: string) => void;

interface Tech {
  name: string;
  icon: IconFn;
  color: string;
}

interface StickerDefinition {
  normal: Position;
  rotation: Position;
  techIndex: number;
}

interface CubieState {
  id: number;
  position: Position;
  stickers: StickerDefinition[];
}

interface TurnRequest {
  axis: Axis;
  layer: number;
  direction: 1 | -1;
}

const RAW_STICKERS: { normal: Position; rotation: Position }[] = [
  { normal: [1, 0, 0], rotation: [0, Math.PI / 2, 0] },
  { normal: [-1, 0, 0], rotation: [0, -Math.PI / 2, 0] },
  { normal: [0, 1, 0], rotation: [-Math.PI / 2, 0, 0] },
  { normal: [0, -1, 0], rotation: [Math.PI / 2, 0, 0] },
  { normal: [0, 0, 1], rotation: [0, 0, 0] },
  { normal: [0, 0, -1], rotation: [0, Math.PI, 0] },
];

const CUBE_SIZE = 0.92;
const STICKER_OFFSET = CUBE_SIZE / 2 + 0.012;
const TURN_DURATION = 250;
const textureCache = new Map<string, THREE.CanvasTexture>();

function iconLabel(label: string): IconFn {
  return (ctx, cx, cy, s, col) => {
    ctx.fillStyle = col;
    ctx.font = `700 ${Math.round(s * (label.length > 2 ? 0.72 : 1.05))}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, cx, cy + s * 0.04);
  };
}

function iconSimple(path: string): IconFn {
  return (ctx, cx, cy, s, col) => {
    ctx.save();
    ctx.fillStyle = col;
    ctx.translate(cx - s / 2, cy - s / 2);
    ctx.scale(s / 24, s / 24);
    ctx.fill(new Path2D(path));
    ctx.restore();
  };
}

function iconPaths(paths: string[]): IconFn {
  return (ctx, cx, cy, s, col) => {
    ctx.save();
    ctx.fillStyle = col;
    ctx.translate(cx - s / 2, cy - s / 2);
    ctx.scale(s / 128, s / 128);
    for (const path of paths) ctx.fill(new Path2D(path));
    ctx.restore();
  };
}

const AZURE_PATHS = [
  "M46.09.002h40.685L44.541 125.137a6.485 6.485 0 01-6.146 4.413H6.733a6.482 6.482 0 01-5.262-2.699 6.474 6.474 0 01-.876-5.848L39.944 4.414A6.488 6.488 0 0146.09 0z",
  "M97.28 81.607H37.987a2.743 2.743 0 00-1.874 4.751l38.1 35.562a5.991 5.991 0 004.087 1.61h33.574z",
  "M98.055 4.408A6.476 6.476 0 0091.917.002H46.575a6.478 6.478 0 016.137 4.406l39.35 116.594a6.476 6.476 0 01-6.137 8.55h45.344a6.48 6.48 0 006.136-8.55z",
];

const ORACLE_PATHS = [
  "M9.059 72.198c-4.483 0-8.122-3.629-8.122-8.114s3.638-8.127 8.122-8.127h9.439c4.485 0 8.121 3.643 8.121 8.127s-3.636 8.114-8.121 8.114H9.059zm9.229-2.865a5.25 5.25 0 005.258-5.249 5.262 5.262 0 00-5.258-5.263H9.267a5.262 5.262 0 00-5.256 5.263 5.25 5.25 0 005.256 5.249h9.021z",
  "M77.602 72.198c-4.484 0-8.126-3.629-8.126-8.114s3.642-8.127 8.126-8.127h11.212l-1.829 2.864H77.81a5.267 5.267 0 00-5.264 5.263c0 2.903 2.36 5.249 5.264 5.249h11.263l-1.84 2.865h-9.631z",
  "M105.799 72.198a5.25 5.25 0 01-5.055-3.824h13.35l1.84-2.864h-15.19a5.266 5.266 0 015.055-3.824h9.163l1.854-2.864h-11.225c-4.484 0-8.126 3.643-8.126 8.127s3.642 8.114 8.126 8.114h9.631l1.841-2.865h-11.264z",
  "M40.945 66.936c3.033 0 5.496-2.449 5.496-5.482s-2.462-5.496-5.496-5.496H28.28v16.241h3.123V58.822h10.335c1.452 0 2.618 1.18 2.618 2.631s-1.167 2.631-2.618 2.631l-8.806-.013 9.324 8.127h4.538l-6.274-5.263h1.425z",
  "M55.387 66.469h8.333l-4.407-7.09-8.088 12.819h-3.681L57.382 56.8a2.324 2.324 0 011.931-.998c.765 0 1.478.363 1.892.972l9.876 15.424H67.4l-1.736-2.865h-8.438l-1.839-2.864z",
  "M93.622 55.958h-3.123v14.685c0 .402.156.791.454 1.089.298.298.7.466 1.141.466h14.244l1.841-2.865H93.622V55.958z",
];

function iconJava(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, col: string) {
  ctx.save();
  ctx.strokeStyle = col;
  ctx.fillStyle = col;
  ctx.lineCap = "round";
  ctx.lineWidth = s * 0.07;
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.34, cy - s * 0.02);
  ctx.quadraticCurveTo(cx - s * 0.34, cy + s * 0.38, cx, cy + s * 0.38);
  ctx.quadraticCurveTo(cx + s * 0.34, cy + s * 0.38, cx + s * 0.34, cy - s * 0.02);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.43, cy + s * 0.46);
  ctx.quadraticCurveTo(cx, cy + s * 0.68, cx + s * 0.43, cy + s * 0.46);
  ctx.stroke();
  ctx.lineWidth = s * 0.045;
  for (const offset of [-0.16, 0.04]) {
    ctx.beginPath();
    ctx.moveTo(cx + s * offset, cy - s * 0.45);
    ctx.bezierCurveTo(
      cx + s * (offset - 0.14),
      cy - s * 0.28,
      cx + s * (offset + 0.14),
      cy - s * 0.22,
      cx + s * offset,
      cy - s * 0.08,
    );
    ctx.stroke();
  }
  ctx.restore();
}

function iconForTech(name: string, label: string): IconFn {
  const icons: Record<string, IconFn> = {
    MongoDB: iconSimple(siMongodb.path),
    Express: iconSimple(siExpress.path),
    Node: iconSimple(siNodedotjs.path),
    React: iconSimple(siReact.path),
    "React Native": iconSimple(siReact.path),
    HTML: iconSimple(siHtml5.path),
    TailwindCSS: iconSimple(siTailwindcss.path),
    JavaScript: iconSimple(siJavascript.path),
    C: iconSimple(siC.path),
    "C++": iconSimple(siCplusplus.path),
    Python: iconSimple(siPython.path),
    Docker: iconSimple(siDocker.path),
    "Copilot CLI": iconSimple(siGithubcopilot.path),
    Copilot: iconSimple(siGithubcopilot.path),
    Linux: iconSimple(siLinux.path),
    PostgreSQL: iconSimple(siPostgresql.path),
    Redis: iconSimple(siRedis.path),
    GitHub: iconSimple(siGithub.path),
    TypeScript: iconSimple(siTypescript.path),
    "Next.js": iconSimple(siNextdotjs.path),
    Java: iconJava,
    Assembly: iconSimple(siAssemblyscript.path),
    Azure: iconPaths(AZURE_PATHS),
    "Oracle SQL": iconPaths(ORACLE_PATHS),
  };

  return icons[name] ?? iconLabel(label);
}

// Keep the cube catalog sourced from the shared portfolio data so every listed technology
// is represented by the sticker assignment and tooltip.
export const TECHS: Tech[] = DATA_TECHS.map((tech) => ({
  name: tech.name,
  icon: iconForTech(tech.name, tech.icon),
  color: tech.color,
}));

// Same face-seed + row/col formula as the prototype, so each of the 9 stickers on a face
// cycles through a different tech, baked once per sticker at cube-creation time (a physical
// sticker never changes what it shows just because the piece it's on gets shuffled elsewhere).
// The camera is positioned on the positive X/Y/Z side, so the initial view shows
// the right, top, and front faces. Start each of those
// faces at a different section of the catalog so every technology is visible
// without requiring the user to rotate the cube first.
const FACE_SEED: Record<string, number> = { right: 0, top: 9, front: 18, bottom: 2, back: 6, left: 10 };
function faceNameFromNormal(normal: Position): keyof typeof FACE_SEED {
  const [x, y, z] = normal;
  if (x === 1) return "right";
  if (x === -1) return "left";
  if (y === 1) return "top";
  if (y === -1) return "bottom";
  if (z === 1) return "front";
  return "back";
}
function idxFor(a: number, b: number) {
  return (a + 1) * 3 + (b + 1);
}
function getTechIndexForSticker(position: Position, normal: Position) {
  const face = faceNameFromNormal(normal);
  const [x, y, z] = position;
  let idx: number;
  if (normal[0] !== 0) idx = idxFor(y, z);
  else if (normal[1] !== 0) idx = idxFor(x, z);
  else idx = idxFor(x, y);
  return (FACE_SEED[face] + idx) % TECHS.length;
}

function pickTextColor(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? "#0a0a0a" : "#ffffff";
}

function blendColors(first: string, second: string, secondWeight: number) {
  const firstValue = parseInt(first.slice(1), 16);
  const secondValue = parseInt(second.slice(1), 16);
  const weight = Math.max(0, Math.min(1, secondWeight));
  const channel = (shift: number) => {
    const firstChannel = (firstValue >> shift) & 255;
    const secondChannel = (secondValue >> shift) & 255;
    return Math.round(firstChannel * (1 - weight) + secondChannel * weight);
  };
  return `#${[16, 8, 0].map((shift) => channel(shift).toString(16).padStart(2, "0")).join("")}`;
}

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

// Default state: frosted glass panel, monochrome, accent corner dot.
// Hover state: solid fill in the tech's real native brand color. Matches the prototype exactly.
function createStickerTexture(techIndex: number, hovered: boolean, theme: Theme) {
  const key = `${theme}:${techIndex}:${hovered ? "native" : "glass"}`;
  const cached = textureCache.get(key);
  if (cached) return cached;

  const tech = TECHS[techIndex];
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Unable to create cube sticker texture");

  ctx.fillStyle = theme === "dark" ? "#050505" : "#f7f3f8";
  ctx.fillRect(0, 0, size, size);

  const m = size * 0.06;
  const w = size - 2 * m;
  const h = size - 2 * m;
  const r = size * 0.11;

  if (hovered) {
    const hoverFill = theme === "dark" ? tech.color : blendColors(tech.color, "#d8c9dc", 0.62);
    ctx.fillStyle = hoverFill;
    roundedRect(ctx, m, m, w, h, r);
    ctx.fill();
    ctx.lineWidth = size * 0.012;
    ctx.strokeStyle = theme === "dark" ? "rgba(255,255,255,0.55)" : tech.color;
    roundedRect(ctx, m, m, w, h, r);
    ctx.stroke();
    tech.icon(
      ctx,
      size / 2,
      size / 2,
      size * 0.34,
      theme === "dark" ? pickTextColor(tech.color) : "#241126",
    );
  } else {
    const sheenColor = theme === "dark" ? "255,255,255" : "36,17,38";
    const grad = ctx.createLinearGradient(m, m, m + w, m + h);
    grad.addColorStop(0, `rgba(${sheenColor},${theme === "dark" ? 0.16 : 0.08})`);
    grad.addColorStop(0.5, `rgba(${sheenColor},${theme === "dark" ? 0.05 : 0.025})`);
    grad.addColorStop(1, `rgba(${sheenColor},${theme === "dark" ? 0.12 : 0.06})`);
    ctx.fillStyle = grad;
    roundedRect(ctx, m, m, w, h, r);
    ctx.fill();
    ctx.lineWidth = size * 0.012;
    ctx.strokeStyle = theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(36,17,38,0.24)";
    roundedRect(ctx, m, m, w, h, r);
    ctx.stroke();
    ctx.fillStyle = theme === "dark" ? "#cf67e3" : "#241126";
    ctx.beginPath();
    ctx.arc(size - m - size * 0.07, m + size * 0.07, size * 0.02, 0, Math.PI * 2);
    ctx.fill();
    tech.icon(ctx, size / 2, size / 2, size * 0.32, theme === "dark" ? "#f2f2f2" : "#150517");
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  textureCache.set(key, texture);
  return texture;
}

function isOuterFace(position: Position, normal: Position) {
  return position[0] * normal[0] + position[1] * normal[1] + position[2] * normal[2] === 1;
}

function createCubies(): CubieState[] {
  const cubies: CubieState[] = [];
  let id = 0;
  for (let x = -1; x <= 1; x += 1) {
    for (let y = -1; y <= 1; y += 1) {
      for (let z = -1; z <= 1; z += 1) {
        const position: Position = [x, y, z];
        const stickers: StickerDefinition[] = RAW_STICKERS.filter(({ normal }) => isOuterFace(position, normal)).map(
          ({ normal, rotation }) => ({
            normal,
            rotation,
            techIndex: getTechIndexForSticker(position, normal),
          }),
        );
        cubies.push({ id, position, stickers });
        id += 1;
      }
    }
  }
  return cubies;
}

function roundQuarter(value: number) {
  return Math.round(value / (Math.PI / 2)) * (Math.PI / 2);
}

function snapCubie(cubie: THREE.Group) {
  cubie.position.set(
    Math.round(cubie.position.x),
    Math.round(cubie.position.y),
    Math.round(cubie.position.z),
  );
  const euler = new THREE.Euler().setFromQuaternion(cubie.quaternion, "XYZ");
  cubie.rotation.set(roundQuarter(euler.x), roundQuarter(euler.y), roundQuarter(euler.z));
}

function rotatePosition(position: Position, axis: Axis, direction: 1 | -1): Position {
  const [x, y, z] = position;
  if (axis === 0) return [x, direction > 0 ? -z : z, direction > 0 ? y : -y];
  if (axis === 1) return [direction > 0 ? z : -z, y, direction > 0 ? -x : x];
  return [direction > 0 ? -y : y, direction > 0 ? x : -x, z];
}

function Sticker({
  normal,
  rotation,
  techIndex,
  cubieId,
  theme,
  onHover,
}: StickerDefinition & {
  cubieId: number;
  theme: Theme;
  onHover: (techIndex: number | null, clientX?: number, clientY?: number) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const texture = useMemo(() => createStickerTexture(techIndex, hovered, theme), [hovered, techIndex, theme]);

  return (
    <group position={normal.map((value) => value * STICKER_OFFSET) as Position} rotation={rotation}>
      <mesh
        userData={{ isCubeSticker: true, cubieId, normal }}
        onPointerEnter={(event) => {
          event.stopPropagation();
          setHovered(true);
          onHover(techIndex, event.clientX, event.clientY);
        }}
        onPointerLeave={(event) => {
          event.stopPropagation();
          setHovered(false);
          onHover(null);
        }}
      >
        <planeGeometry args={[0.72, 0.72]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}

function Cubie({
  cubie,
  cubieRef,
  theme,
  onHover,
}: {
  cubie: CubieState;
  cubieRef: (node: THREE.Group | null) => void;
  theme: Theme;
  onHover: (techIndex: number | null, clientX?: number, clientY?: number) => void;
}) {
  return (
    <group ref={cubieRef} position={cubie.position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} />
        <meshStandardMaterial color={theme === "dark" ? "#0c0a0d" : "#eee8f0"} roughness={0.42} metalness={0.25} />
      </mesh>
      {cubie.stickers.map((sticker) => (
        <Sticker
          key={sticker.normal.join(",")}
          normal={sticker.normal}
          rotation={sticker.rotation}
          techIndex={sticker.techIndex}
          cubieId={cubie.id}
          theme={theme}
          onHover={onHover}
        />
      ))}
    </group>
  );
}

function CubeScene({
  shuffleRequest,
  theme,
  onHoverChange,
}: {
  shuffleRequest: number;
  theme: Theme;
  onHoverChange: (payload: { x: number; y: number; techIndex: number } | null) => void;
}) {
  const { camera, gl } = useThree();
  const cubeRef = useRef<THREE.Group>(null);
  const cubieRefs = useRef(new Map<number, THREE.Group>());
  const [cubies] = useState(createCubies);
  const hoveredTechRef = useRef<number | null>(null);
  const onHoverChangeRef = useRef(onHoverChange);
  useEffect(() => {
    onHoverChangeRef.current = onHoverChange;
  }, [onHoverChange]);
  const animating = useRef(false);
  const shuffleQueue = useRef<Promise<void>>(Promise.resolve());
  const interaction = useRef<{
    cubie: CubieState;
    normal: THREE.Vector3;
    start: THREE.Vector3;
    plane: THREE.Plane;
    pointerId: number;
  } | null>(null);
  const orbitInteraction = useRef<{
    pointerId: number;
    lastX: number;
    lastY: number;
  } | null>(null);

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointer = useMemo(() => new THREE.Vector2(), []);
  const localDrag = useMemo(() => new THREE.Vector3(), []);
  const localNormal = useMemo(() => new THREE.Vector3(), []);

  const updatePointer = (clientX: number, clientY: number) => {
    const rect = gl.domElement.getBoundingClientRect();
    pointer.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
  };

  const finishTurn = async (request: TurnRequest) => {
    const cube = cubeRef.current;
    if (!cube) return;
    animating.current = true;

    const affected = cubies.filter((cubie) => cubie.position[request.axis] === request.layer);
    const pivot = new THREE.Group();
    cube.add(pivot);
    affected.forEach((cubie) => pivot.attach(cubieRefs.current.get(cubie.id)!));

    const start = performance.now();
    const angle = (request.direction * Math.PI) / 2;
    const axisVector = new THREE.Vector3().setComponent(request.axis, 1);

    await new Promise<void>((resolve) => {
      const animate = (time: number) => {
        const progress = Math.min((time - start) / TURN_DURATION, 1);
        const eased = progress < 0.5 ? 2 * progress * progress : 1 - ((-2 * progress + 2) ** 2) / 2;
        pivot.quaternion.setFromAxisAngle(axisVector, angle * eased);
        if (progress < 1) requestAnimationFrame(animate);
        else resolve();
      };
      requestAnimationFrame(animate);
    });

    affected.forEach((cubie) => {
      const node = cubieRefs.current.get(cubie.id);
      if (!node) return;
      cube.attach(node);
      snapCubie(node);
      cubie.position = rotatePosition(cubie.position, request.axis, request.direction);
    });
    cube.remove(pivot);
    animating.current = false;
  };

  const enqueueTurn = (request: TurnRequest) => {
    shuffleQueue.current = shuffleQueue.current.then(() => finishTurn(request));
  };

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (animating.current || interaction.current || !cubeRef.current) return;
      event.preventDefault();
      updatePointer(event.clientX, event.clientY);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects([cubeRef.current], true)[0];
      if (hit?.object.userData.isCubeSticker && hit.face) {
        const { cubieId } = hit.object.userData as { cubieId: number };
        const cubie = cubies.find((item) => item.id === cubieId);
        if (!cubie) return;
        const worldNormal = hit.face.normal.clone().transformDirection(hit.object.matrixWorld).normalize();
        const normalLocal = worldNormal
          .clone()
          .applyQuaternion(cubeRef.current.getWorldQuaternion(new THREE.Quaternion()).invert());
        normalLocal.set(Math.round(normalLocal.x), Math.round(normalLocal.y), Math.round(normalLocal.z));
        interaction.current = {
          cubie,
          normal: normalLocal,
          start: hit.point.clone(),
          plane: new THREE.Plane().setFromNormalAndCoplanarPoint(worldNormal, hit.point),
          pointerId: event.pointerId,
        };
        gl.domElement.setPointerCapture(event.pointerId);
        return;
      }
      orbitInteraction.current = {
        pointerId: event.pointerId,
        lastX: event.clientX,
        lastY: event.clientY,
      };
      gl.domElement.setPointerCapture(event.pointerId);
    };
    const handlePointerMove = (event: PointerEvent) => {
      if (hoveredTechRef.current !== null) {
        onHoverChangeRef.current({ x: event.clientX, y: event.clientY, techIndex: hoveredTechRef.current });
      }
      const orbit = orbitInteraction.current;
      const cube = cubeRef.current;
      if (!orbit || orbit.pointerId !== event.pointerId || !cube || interaction.current) return;
      const deltaX = event.clientX - orbit.lastX;
      const deltaY = event.clientY - orbit.lastY;
      orbit.lastX = event.clientX;
      orbit.lastY = event.clientY;
      if (deltaX === 0 && deltaY === 0) return;

      // Use independent world-horizontal and local-vertical orbit components.
      // This keeps diagonal drags smooth instead of switching between gesture axes.
      const horizontalOrbit = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        deltaX * 0.008,
      );
      const verticalOrbit = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(1, 0, 0),
        deltaY * 0.008,
      );
      cube.quaternion.premultiply(horizontalOrbit);
      cube.quaternion.multiply(verticalOrbit);
    };
    const handlePointerUp = (event: PointerEvent) => {
      if (orbitInteraction.current?.pointerId === event.pointerId) {
        orbitInteraction.current = null;
        gl.domElement.releasePointerCapture(event.pointerId);
      }
      const current = interaction.current;
      if (!current || current.pointerId !== event.pointerId || !cubeRef.current) return;
      interaction.current = null;
      gl.domElement.releasePointerCapture(event.pointerId);
      updatePointer(event.clientX, event.clientY);
      raycaster.setFromCamera(pointer, camera);
      const end = new THREE.Vector3();
      if (!raycaster.ray.intersectPlane(current.plane, end)) {
        return;
      }
      localDrag
        .copy(end)
        .sub(current.start)
        .applyQuaternion(cubeRef.current.getWorldQuaternion(new THREE.Quaternion()).invert());
      localNormal.copy(current.normal);
      const rawAxis = localNormal.cross(localDrag);
      const values = [Math.abs(rawAxis.x), Math.abs(rawAxis.y), Math.abs(rawAxis.z)];
      const axis = values[0] > values[1] && values[0] > values[2] ? 0 : values[1] > values[2] ? 1 : 2;
      if (values[axis] < 0.08) {
        return;
      }
      const direction = (rawAxis.getComponent(axis) >= 0 ? 1 : -1) as 1 | -1;
      enqueueTurn({ axis: axis as Axis, layer: current.cubie.position[axis as Axis], direction });
    };
    gl.domElement.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      gl.domElement.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
    // Event listeners intentionally capture the stable scene refs and imperative turn queue.
    // hoveredTech is read via hoveredTechRef so it's deliberately excluded here — including it
    // would tear down and rebind these listeners on every hover change, which can drop an
    // in-progress drag.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera, cubies, gl, localDrag, localNormal, pointer, raycaster]);

  useEffect(() => {
    if (shuffleRequest === 0) return;
    for (let index = 0; index < 16; index += 1) {
      enqueueTurn({
        axis: Math.floor(Math.random() * 3) as Axis,
        layer: [-1, 0, 1][Math.floor(Math.random() * 3)],
        direction: Math.random() > 0.5 ? 1 : -1,
      });
    }
    // Shuffle requests are consumed imperatively so queued turns are not recreated mid-animation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffleRequest]);

  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[5, 6, 7]} intensity={2.2} color="#ffffff" />
      <group ref={cubeRef} rotation={[0, 0, 0]}>
        {cubies.map((cubie) => (
          <Cubie
            key={cubie.id}
            cubie={cubie}
            cubieRef={(node) => {
              if (node) cubieRefs.current.set(cubie.id, node);
              else cubieRefs.current.delete(cubie.id);
            }}
            theme={theme}
            onHover={(techIndex, clientX, clientY) => {
              hoveredTechRef.current = techIndex;
              if (techIndex === null) {
                onHoverChangeRef.current(null);
              } else if (clientX !== undefined && clientY !== undefined) {
                onHoverChangeRef.current({ x: clientX, y: clientY, techIndex });
              }
            }}
          />
        ))}
      </group>
    </>
  );
}

export function TechCube() {
  const { theme } = useTheme();
  const [resetKey, setResetKey] = useState(0);
  const [shuffleRequest, setShuffleRequest] = useState(0);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; techIndex: number } | null>(null);
  const controls = useMemo(() => `CURRENT TECHSTACKS`, []);

  return (
    <div className="relative h-full w-full max-w-[30rem] sm:h-[30rem] lg:h-full lg:min-h-0 lg:max-w-none">
      <Canvas camera={{ position: [4.48, 4.48, 5.1], fov: 33.5 }} dpr={[1, 2]} style={{ touchAction: "none" }}>
        <CubeScene key={resetKey} shuffleRequest={shuffleRequest} theme={theme} onHoverChange={setTooltip} />
      </Canvas>
      {/* Rendered as a plain DOM sibling of <Canvas>, never inside it — a Drei <Html> overlay
          positioned on top of the canvas can intercept the very next pointerdown and silently
          block layer turns, since almost every turn starts by hovering the sticker first. */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 -translate-y-full rounded-lg border border-foreground/20 bg-background/80 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-foreground backdrop-blur-md"
          style={{ left: tooltip.x + 12, top: tooltip.y - 12 }}
        >
          <span
            className="mr-1 inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: TECHS[tooltip.techIndex].color }}
          />
          {TECHS[tooltip.techIndex].name}
        </div>
      )}
      <div className="absolute -bottom-4 left-2 right-2 flex flex-wrap items-end justify-between gap-2">
        <span className="max-w-[calc(100%-6rem)] truncate font-mono text-[clamp(8px,2.2vw,14px)] uppercase tracking-[0.1em] text-foreground sm:tracking-[0.16em]">{controls}</span>
        <div className="ml-auto flex shrink-0 gap-2">
          <IconButton label="Shuffle cube" onClick={() => setShuffleRequest((value) => value + 1)} className="h-10 w-10 text-xs">
            ↝
          </IconButton>
          <IconButton label="Reset cube" onClick={() => setResetKey((value) => value + 1)} className="h-10 w-10 text-xs">
            ↺
          </IconButton>
        </div>
      </div>
    </div>
  );
}