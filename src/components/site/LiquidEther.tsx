/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './LiquidEther.css';

interface LiquidEtherProps {
  mouseForce?: number;
  cursorSize?: number;
  isViscous?: boolean;
  viscous?: number;
  iterationsViscous?: number;
  iterationsPoisson?: number;
  dt?: number;
  BFECC?: boolean;
  resolution?: number;
  isBounce?: boolean;
  colors?: string[];
  style?: React.CSSProperties;
  className?: string;
  autoDemo?: boolean;
  autoSpeed?: number;
  autoIntensity?: number;
  takeoverDuration?: number;
  autoResumeDelay?: number;
  autoRampDuration?: number;
}

export default function LiquidEther(props: LiquidEtherProps) {
  const {
    mouseForce = 20,
    cursorSize = 100,
    isViscous = false,
    viscous = 30,
    iterationsViscous = 32,
    iterationsPoisson = 32,
    dt = 0.014,
    BFECC = true,
    resolution = 0.5,
    isBounce = false,
    colors = ['#5227FF', '#FF9FFC', '#B497CF'],
    style = {},
    className = '',
    autoDemo = true,
    autoSpeed = 0.5,
    autoIntensity = 2.2,
    takeoverDuration = 0.25,
    autoResumeDelay = 1000,
    autoRampDuration = 0.6,
  } = props;

  const mountRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);
  const resizeRafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // ─── Palette texture helper ───────────────────────────────────────────────
    function makePaletteTexture(stops: string[]) {
      const arr = Array.isArray(stops) && stops.length > 0
        ? (stops.length === 1 ? [stops[0], stops[0]] : stops)
        : ['#ffffff', '#ffffff'];
      const w = arr.length;
      const data = new Uint8Array(w * 4);
      for (let i = 0; i < w; i++) {
        const c = new THREE.Color(arr[i]);
        data[i * 4 + 0] = Math.round(c.r * 255);
        data[i * 4 + 1] = Math.round(c.g * 255);
        data[i * 4 + 2] = Math.round(c.b * 255);
        data[i * 4 + 3] = 255;
      }
      const tex = new THREE.DataTexture(data, w, 1, THREE.RGBAFormat);
      tex.magFilter = THREE.LinearFilter;
      tex.minFilter = THREE.LinearFilter;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.generateMipmaps = false;
      tex.needsUpdate = true;
      return tex;
    }

    const paletteTex = makePaletteTexture(colors);
    const bgVec4 = new THREE.Vector4(0, 0, 0, 0);

    // ─── Common ────────────────────────────────────────────────────────────────
    class Common {
      width = 0;
      height = 0;
      aspect = 1;
      pixelRatio = 1;
      container: HTMLElement | null = null;
      renderer: THREE.WebGLRenderer | null = null;
      clock: THREE.Clock | null = null;

      init(container: HTMLElement) {
        this.container = container;
        this.pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
        this.resize();
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.autoClear = false;
        this.renderer.setClearColor(new THREE.Color(0x000000), 0);
        this.renderer.setPixelRatio(this.pixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.domElement.style.width = '100%';
        this.renderer.domElement.style.height = '100%';
        this.renderer.domElement.style.display = 'block';
        this.clock = new THREE.Clock();
        this.clock.start();
      }

      resize() {
        if (!this.container) return;
        const rect = this.container.getBoundingClientRect();
        this.width = Math.max(1, Math.floor(rect.width));
        this.height = Math.max(1, Math.floor(rect.height));
        this.aspect = this.width / this.height;
        if (this.renderer) this.renderer.setSize(this.width, this.height, false);
      }

      update() {
        if (this.clock) this.clock.getDelta();
      }
    }
    const Common$ = new Common();

    // ─── Mouse ────────────────────────────────────────────────────────────────
    class Mouse {
      mouseMoved = false;
      coords = new THREE.Vector2();
      coords_old = new THREE.Vector2();
      diff = new THREE.Vector2();
      timer: ReturnType<typeof setTimeout> | null = null;
      container: HTMLElement | null = null;
      docTarget: Document | null = null;
      listenerTarget: Window | null = null;
      isHoverInside = false;
      hasUserControl = false;
      isAutoActive = false;
      autoIntensity = 2.0;
      takeoverActive = false;
      takeoverStartTime = 0;
      takeoverDuration = 0.25;
      takeoverFrom = new THREE.Vector2();
      takeoverTo = new THREE.Vector2();
      onInteract: (() => void) | null = null;

      init(container: HTMLElement) {
        this.container = container;
        this.docTarget = container.ownerDocument || null;
        this.listenerTarget =
          (this.docTarget?.defaultView as Window) ||
          (typeof window !== 'undefined' ? window : null);
        if (!this.listenerTarget) return;
        this.listenerTarget.addEventListener('mousemove', this._onMouseMove);
        this.listenerTarget.addEventListener('touchstart', this._onTouchStart as EventListener, { passive: true });
        this.listenerTarget.addEventListener('touchmove', this._onTouchMove as EventListener, { passive: true });
        this.listenerTarget.addEventListener('touchend', this._onTouchEnd as EventListener);
        this.docTarget?.addEventListener('mouseleave', this._onDocumentLeave as EventListener);
      }

      dispose() {
        if (this.listenerTarget) {
          this.listenerTarget.removeEventListener('mousemove', this._onMouseMove);
          this.listenerTarget.removeEventListener('touchstart', this._onTouchStart as EventListener);
          this.listenerTarget.removeEventListener('touchmove', this._onTouchMove as EventListener);
          this.listenerTarget.removeEventListener('touchend', this._onTouchEnd as EventListener);
        }
        this.docTarget?.removeEventListener('mouseleave', this._onDocumentLeave as EventListener);
        this.listenerTarget = null;
        this.docTarget = null;
        this.container = null;
      }

      isPointInside(clientX: number, clientY: number) {
        if (!this.container) return false;
        const rect = this.container.getBoundingClientRect();
        return !(rect.width === 0 || rect.height === 0) &&
          clientX >= rect.left && clientX <= rect.right &&
          clientY >= rect.top && clientY <= rect.bottom;
      }

      updateHoverState(clientX: number, clientY: number) {
        this.isHoverInside = this.isPointInside(clientX, clientY);
        return this.isHoverInside;
      }

      setCoords(x: number, y: number) {
        if (!this.container) return;
        if (this.timer) clearTimeout(this.timer);
        const rect = this.container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        this.coords.set((x - rect.left) / rect.width * 2 - 1, -((y - rect.top) / rect.height * 2 - 1));
        this.mouseMoved = true;
        this.timer = setTimeout(() => { this.mouseMoved = false; }, 100);
      }

      setNormalized(nx: number, ny: number) {
        this.coords.set(nx, ny);
        this.mouseMoved = true;
      }

      _onMouseMove = (event: MouseEvent) => {
        if (!this.updateHoverState(event.clientX, event.clientY)) return;
        this.onInteract?.();
        if (this.isAutoActive && !this.hasUserControl && !this.takeoverActive) {
          if (!this.container) return;
          const rect = this.container.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return;
          const nx = (event.clientX - rect.left) / rect.width;
          const ny = (event.clientY - rect.top) / rect.height;
          this.takeoverFrom.copy(this.coords);
          this.takeoverTo.set(nx * 2 - 1, -(ny * 2 - 1));
          this.takeoverStartTime = performance.now();
          this.takeoverActive = true;
          this.hasUserControl = true;
          this.isAutoActive = false;
          return;
        }
        this.setCoords(event.clientX, event.clientY);
        this.hasUserControl = true;
      };

      _onTouchStart = (event: TouchEvent) => {
        if (event.touches.length !== 1) return;
        const t = event.touches[0];
        if (!this.updateHoverState(t.clientX, t.clientY)) return;
        this.onInteract?.();
        this.setCoords(t.clientX, t.clientY);
        this.hasUserControl = true;
      };

      _onTouchMove = (event: TouchEvent) => {
        if (event.touches.length !== 1) return;
        const t = event.touches[0];
        if (!this.updateHoverState(t.clientX, t.clientY)) return;
        this.onInteract?.();
        this.setCoords(t.clientX, t.clientY);
      };

      _onTouchEnd = () => { this.isHoverInside = false; };
      _onDocumentLeave = () => { this.isHoverInside = false; };

      update() {
        if (this.takeoverActive) {
          const t = (performance.now() - this.takeoverStartTime) / (this.takeoverDuration * 1000);
          if (t >= 1) {
            this.takeoverActive = false;
            this.coords.copy(this.takeoverTo);
            this.coords_old.copy(this.coords);
            this.diff.set(0, 0);
          } else {
            const k = t * t * (3 - 2 * t);
            this.coords.copy(this.takeoverFrom).lerp(this.takeoverTo, k);
          }
        }
        this.diff.subVectors(this.coords, this.coords_old);
        this.coords_old.copy(this.coords);
        if (this.coords_old.x === 0 && this.coords_old.y === 0) this.diff.set(0, 0);
        if (this.isAutoActive && !this.takeoverActive) this.diff.multiplyScalar(this.autoIntensity);
      }
    }
    const Mouse$ = new Mouse();

    // ─── Auto Driver ─────────────────────────────────────────────────────────
    class AutoDriver {
      enabled: boolean;
      speed: number;
      resumeDelay: number;
      rampDurationMs: number;
      active = false;
      current = new THREE.Vector2(0, 0);
      target = new THREE.Vector2();
      lastTime = performance.now();
      margin = 0.2;
      _tmpDir = new THREE.Vector2();
      private mouse: Mouse;
      private manager: { lastUserInteraction: number };

      constructor(
        mouse: Mouse,
        manager: { lastUserInteraction: number },
        opts: { enabled: boolean; speed: number; resumeDelay?: number; rampDuration?: number }
      ) {
        this.mouse = mouse;
        this.manager = manager;
        this.enabled = opts.enabled;
        this.speed = opts.speed;
        this.resumeDelay = opts.resumeDelay || 3000;
        this.rampDurationMs = (opts.rampDuration || 0) * 1000;
        this.pickNewTarget();
      }

      pickNewTarget() {
        const r = Math.random;
        this.target.set((r() * 2 - 1) * (1 - this.margin), (r() * 2 - 1) * (1 - this.margin));
      }

      forceStop() {
        this.active = false;
        this.mouse.isAutoActive = false;
      }

      update() {
        if (!this.enabled) return;
        const now = performance.now();
        const idle = now - this.manager.lastUserInteraction;
        if (idle < this.resumeDelay) { if (this.active) this.forceStop(); return; }
        if (this.mouse.isHoverInside) { if (this.active) this.forceStop(); return; }
        if (!this.active) { this.active = true; this.current.copy(this.mouse.coords); this.lastTime = now; }
        if (!this.active) return;
        this.mouse.isAutoActive = true;
        let dtSec = (now - this.lastTime) / 1000;
        this.lastTime = now;
        if (dtSec > 0.2) dtSec = 0.016;
        const dir = this._tmpDir.subVectors(this.target, this.current);
        const dist = dir.length();
        if (dist < 0.01) { this.pickNewTarget(); return; }
        dir.normalize();
        const ramp = this.rampDurationMs > 0 ? Math.min(1, (now - this.lastTime) / this.rampDurationMs) ** 2 * (3 - 2 * Math.min(1, (now - this.lastTime) / this.rampDurationMs)) : 1;
        const step = this.speed * dtSec * ramp;
        this.current.addScaledVector(dir, Math.min(step, dist));
        this.mouse.setNormalized(this.current.x, this.current.y);
      }
    }

    // ─── Shader source ────────────────────────────────────────────────────────
    const face_vert = `
  attribute vec3 position; uniform vec2 px; uniform vec2 boundarySpace; varying vec2 uv; precision highp float;
  void main(){ vec3 pos = position; vec2 scale = 1.0 - boundarySpace * 2.0; pos.xy = pos.xy * scale; uv = vec2(0.5)+(pos.xy)*0.5; gl_Position = vec4(pos, 1.0); }`;
    const line_vert = `
  attribute vec3 position; uniform vec2 px; precision highp float; varying vec2 uv;
  void main(){ vec3 pos = position; uv = 0.5 + pos.xy * 0.5; vec2 n = sign(pos.xy); pos.xy = abs(pos.xy) - px * 1.0; pos.xy *= n; gl_Position = vec4(pos, 1.0); }`;
    const mouse_vert = `
  precision highp float; attribute vec3 position; attribute vec2 uv; uniform vec2 center; uniform vec2 scale; uniform vec2 px; varying vec2 vUv;
  void main(){ vec2 pos = position.xy * scale * 2.0 * px + center; vUv = uv; gl_Position = vec4(pos, 0.0, 1.0); }`;
    const advection_frag = `
  precision highp float; uniform sampler2D velocity; uniform float dt; uniform bool isBFECC; uniform vec2 fboSize; uniform vec2 px; varying vec2 uv;
  void main(){ vec2 ratio = max(fboSize.x, fboSize.y) / fboSize;
    if(isBFECC == false){ vec2 vel = texture2D(velocity, uv).xy; vec2 uv2 = uv - vel * dt * ratio; vec2 newVel = texture2D(velocity, uv2).xy; gl_FragColor = vec4(newVel, 0.0, 0.0); }
    else { vec2 spot_new = uv; vec2 vel_old = texture2D(velocity, uv).xy; vec2 spot_old = spot_new - vel_old * dt * ratio; vec2 vel_new1 = texture2D(velocity, spot_old).xy; vec2 spot_new2 = spot_old + vel_new1 * dt * ratio; vec2 error = spot_new2 - spot_new; vec2 spot_new3 = spot_new - error / 2.0; vec2 vel_2 = texture2D(velocity, spot_new3).xy; vec2 spot_old2 = spot_new3 - vel_2 * dt * ratio; vec2 newVel2 = texture2D(velocity, spot_old2).xy; gl_FragColor = vec4(newVel2, 0.0, 0.0); }
  }`;
    const color_frag = `
  precision highp float; uniform sampler2D velocity; uniform sampler2D palette; uniform vec4 bgColor; varying vec2 uv;
  void main(){ vec2 vel = texture2D(velocity, uv).xy; float lenv = clamp(length(vel), 0.0, 1.0); vec3 c = texture2D(palette, vec2(lenv, 0.5)).rgb; gl_FragColor = vec4(mix(bgColor.rgb, c, lenv), mix(bgColor.a, 1.0, lenv)); }`;
    const divergence_frag = `
  precision highp float; uniform sampler2D velocity; uniform float dt; uniform vec2 px; varying vec2 uv;
  void main(){ float x0 = texture2D(velocity, uv-vec2(px.x, 0.0)).x; float x1 = texture2D(velocity, uv+vec2(px.x, 0.0)).x; float y0 = texture2D(velocity, uv-vec2(0.0, px.y)).y; float y1 = texture2D(velocity, uv+vec2(0.0, px.y)).y; gl_FragColor = vec4(((x1-x0+y1-y0)/2.0)/dt); }`;
    const externalForce_frag = `
  precision highp float; uniform vec2 force; uniform vec2 center; uniform vec2 scale; uniform vec2 px; varying vec2 vUv;
  void main(){ vec2 circle = (vUv-0.5)*2.0; float d = 1.0-min(length(circle),1.0); d*=d; gl_FragColor = vec4(force*d, 0.0, 1.0); }`;
    const poisson_frag = `
  precision highp float; uniform sampler2D pressure; uniform sampler2D divergence; uniform vec2 px; varying vec2 uv;
  void main(){ float p0=texture2D(pressure,uv+vec2(px.x*2.0,0.0)).r; float p1=texture2D(pressure,uv-vec2(px.x*2.0,0.0)).r; float p2=texture2D(pressure,uv+vec2(0.0,px.y*2.0)).r; float p3=texture2D(pressure,uv-vec2(0.0,px.y*2.0)).r; float div=texture2D(divergence,uv).r; gl_FragColor = vec4((p0+p1+p2+p3)/4.0-div); }`;
    const pressure_frag = `
  precision highp float; uniform sampler2D pressure; uniform sampler2D velocity; uniform vec2 px; uniform float dt; varying vec2 uv;
  void main(){ float p0=texture2D(pressure,uv+vec2(px.x,0.0)).r; float p1=texture2D(pressure,uv-vec2(px.x,0.0)).r; float p2=texture2D(pressure,uv+vec2(0.0,px.y)).r; float p3=texture2D(pressure,uv-vec2(0.0,px.y)).r; vec2 v=texture2D(velocity,uv).xy; vec2 gradP=vec2(p0-p1,p2-p3)*0.5; gl_FragColor = vec4(v-gradP*dt,0.0,1.0); }`;
    const viscous_frag = `
  precision highp float; uniform sampler2D velocity; uniform sampler2D velocity_new; uniform float v; uniform vec2 px; uniform float dt; varying vec2 uv;
  void main(){ vec2 old=texture2D(velocity,uv).xy; vec2 new0=texture2D(velocity_new,uv+vec2(px.x*2.0,0.0)).xy; vec2 new1=texture2D(velocity_new,uv-vec2(px.x*2.0,0.0)).xy; vec2 new2=texture2D(velocity_new,uv+vec2(0.0,px.y*2.0)).xy; vec2 new3=texture2D(velocity_new,uv-vec2(0.0,px.y*2.0)).xy; vec2 newv=(4.0*old+v*dt*(new0+new1+new2+new3))/(4.0*(1.0+v*dt)); gl_FragColor = vec4(newv,0.0,0.0); }`;

    // ─── Shader Pass base ─────────────────────────────────────────────────────
    interface SimProps {
      cellScale?: THREE.Vector2;
      boundarySpace?: THREE.Vector2;
      fboSize?: THREE.Vector2;
      dt?: number;
      src?: THREE.WebGLRenderTarget;
      dst?: THREE.WebGLRenderTarget;
      dst_?: THREE.WebGLRenderTarget;
      src_p?: THREE.WebGLRenderTarget;
      src_v?: THREE.WebGLRenderTarget;
      cursor_size?: number;
      viscous?: number;
    }
    // ─── Advection ────────────────────────────────────────────────────────────
    class Advection {
      scene!: THREE.Scene;
      camera!: THREE.Camera;
      uniforms: Record<string, any> = {};
      output: THREE.WebGLRenderTarget | null = null;
      line!: THREE.LineSegments;

      init(opts: SimProps & { isBFECC?: boolean }) {
        const mat = new THREE.RawShaderMaterial({
          vertexShader: face_vert, fragmentShader: advection_frag,
          uniforms: {
            boundarySpace: { value: opts.cellScale },
            px: { value: opts.cellScale },
            fboSize: { value: opts.fboSize },
            velocity: { value: opts.src?.texture },
            dt: { value: opts.dt },
            isBFECC: { value: opts.isBFECC ?? true },
          },
        });
        const geom = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geom, mat);
        const scene = new THREE.Scene();
        scene.add(mesh);
        const lineScene = new THREE.Scene();
        const boundaryG = new THREE.BufferGeometry();
        boundaryG.setAttribute('position', new THREE.BufferAttribute(
          new Float32Array([-1,-1,0,-1,1,0,-1,1,0,1,1,0,1,1,0,1,-1,0,1,-1,0,-1,-1,0]), 3));
        const lineM = new THREE.RawShaderMaterial({ vertexShader: line_vert, fragmentShader: advection_frag, uniforms: mat.uniforms });
        this.line = new THREE.LineSegments(boundaryG, lineM);
        lineScene.add(this.line);
        this.scene = scene;
        this.camera = new THREE.Camera();
        this.uniforms = mat.uniforms;
        this.output = opts.dst || null;
      }

      update(cfg: { dt: number; isBounce: boolean; BFECC: boolean }) {
        this.uniforms.dt.value = cfg.dt;
        this.line.visible = cfg.isBounce;
        this.uniforms.isBFECC.value = cfg.BFECC;
        if (!Common$.renderer) return;
        Common$.renderer.setRenderTarget(this.output);
        Common$.renderer.render(this.scene, this.camera);
        Common$.renderer.setRenderTarget(null);
      }
    }

    // ─── External Force ───────────────────────────────────────────────────────
    class ExternalForce {
      scene!: THREE.Scene;
      camera!: THREE.Camera;
      uniforms: Record<string, any> = {};
      output: THREE.WebGLRenderTarget | null = null;
      mesh!: THREE.Mesh<THREE.PlaneGeometry, THREE.RawShaderMaterial>;

      init(opts: SimProps) {
        const geom = new THREE.PlaneGeometry(1, 1);
        const mat = new THREE.RawShaderMaterial({
          vertexShader: mouse_vert, fragmentShader: externalForce_frag,
          blending: THREE.AdditiveBlending, depthWrite: false,
          uniforms: {
            px: { value: opts.cellScale },
            force: { value: new THREE.Vector2(0, 0) },
            center: { value: new THREE.Vector2(0, 0) },
            scale: { value: new THREE.Vector2(opts.cursor_size ?? 100, opts.cursor_size ?? 100) },
          },
        });
        this.mesh = new THREE.Mesh(geom, mat);
        const scene = new THREE.Scene();
        scene.add(this.mesh);
        this.scene = scene;
        this.camera = new THREE.Camera();
        this.uniforms = mat.uniforms;
        this.output = opts.dst || null;
      }

      update(cfg: { cursor_size: number; mouse_force: number; cellScale: THREE.Vector2 }) {
        const u = this.uniforms;
        u.force.value.set((Mouse$.diff.x / 2) * cfg.mouse_force, (Mouse$.diff.y / 2) * cfg.mouse_force);
        const csX = cfg.cursor_size * cfg.cellScale.x;
        const csY = cfg.cursor_size * cfg.cellScale.y;
        u.center.value.set(
          Math.min(Math.max(Mouse$.coords.x, -1 + csX + cfg.cellScale.x * 2), 1 - csX - cfg.cellScale.x * 2),
          Math.min(Math.max(Mouse$.coords.y, -1 + csY + cfg.cellScale.y * 2), 1 - csY - cfg.cellScale.y * 2),
        );
        u.scale.value.set(cfg.cursor_size, cfg.cursor_size);
        if (!Common$.renderer) return;
        Common$.renderer.setRenderTarget(this.output);
        Common$.renderer.render(this.scene, this.camera);
        Common$.renderer.setRenderTarget(null);
      }
    }

    // ─── Viscous ─────────────────────────────────────────────────────────────
    class Viscous {
      scene!: THREE.Scene;
      camera!: THREE.Camera;
      uniforms: Record<string, any> = {};
      output: THREE.WebGLRenderTarget | null = null;
      init(opts: SimProps) {
        const mat = new THREE.RawShaderMaterial({
          vertexShader: face_vert, fragmentShader: viscous_frag,
          uniforms: {
            boundarySpace: { value: opts.boundarySpace },
            velocity: { value: opts.src?.texture },
            velocity_new: { value: opts.dst_?.texture },
            v: { value: opts.viscous ?? 30 },
            px: { value: opts.cellScale },
            dt: { value: opts.dt },
          },
        });
        const scene = new THREE.Scene();
        scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
        this.scene = scene;
        this.camera = new THREE.Camera();
        this.uniforms = mat.uniforms;
        this.output = opts.dst || null;
      }

      update(cfg: { viscous: number; iterations: number; dt: number }, fbos: { v0: THREE.WebGLRenderTarget; v1: THREE.WebGLRenderTarget }) {
        this.uniforms.v.value = cfg.viscous;
        let fbo_in = fbos.v0, fbo_out = fbos.v1;
        for (let i = 0; i < cfg.iterations; i++) {
          if (i % 2 === 0) { fbo_in = fbos.v0; fbo_out = fbos.v1; } else { fbo_in = fbos.v1; fbo_out = fbos.v0; }
          this.uniforms.velocity_new.value = fbo_in.texture;
          this.output = fbo_out;
          this.uniforms.dt.value = cfg.dt;
          if (!Common$.renderer) continue;
          Common$.renderer.setRenderTarget(this.output);
          Common$.renderer.render(this.scene, this.camera);
          Common$.renderer.setRenderTarget(null);
        }
        return fbo_out;
      }
    }

    // ─── Divergence ───────────────────────────────────────────────────────────
    class Divergence {
      scene!: THREE.Scene;
      camera!: THREE.Camera;
      uniforms: Record<string, any> = {};
      output: THREE.WebGLRenderTarget | null = null;

      init(opts: SimProps) {
        const mat = new THREE.RawShaderMaterial({
          vertexShader: face_vert, fragmentShader: divergence_frag,
          uniforms: { boundarySpace: { value: opts.boundarySpace }, velocity: { value: opts.src?.texture }, px: { value: opts.cellScale }, dt: { value: opts.dt } },
        });
        const scene = new THREE.Scene();
        scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
        this.scene = scene; this.camera = new THREE.Camera();
        this.uniforms = mat.uniforms;
        this.output = opts.dst || null;
      }

      update(vel: THREE.WebGLRenderTarget) {
        this.uniforms.velocity.value = vel.texture;
        if (!Common$.renderer) return;
        Common$.renderer.setRenderTarget(this.output);
        Common$.renderer.render(this.scene, this.camera);
        Common$.renderer.setRenderTarget(null);
      }
    }

    // ─── Poisson ──────────────────────────────────────────────────────────────
    class Poisson {
      scene!: THREE.Scene;
      camera!: THREE.Camera;
      uniforms: Record<string, any> = {};
      output: THREE.WebGLRenderTarget | null = null;

      init(opts: SimProps) {
        const mat = new THREE.RawShaderMaterial({
          vertexShader: face_vert, fragmentShader: poisson_frag,
          uniforms: { boundarySpace: { value: opts.boundarySpace }, pressure: { value: opts.dst_?.texture }, divergence: { value: opts.src?.texture }, px: { value: opts.cellScale } },
        });
        const scene = new THREE.Scene();
        scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
        this.scene = scene; this.camera = new THREE.Camera();
        this.uniforms = mat.uniforms;
        this.output = opts.dst || null;
      }

      update(iterations: number, fbos: { p0: THREE.WebGLRenderTarget; p1: THREE.WebGLRenderTarget }) {
        let p_in = fbos.p0, p_out = fbos.p1;
        for (let i = 0; i < iterations; i++) {
          if (i % 2 === 0) { p_in = fbos.p0; p_out = fbos.p1; } else { p_in = fbos.p1; p_out = fbos.p0; }
          this.uniforms.pressure.value = p_in.texture;
          this.output = p_out;
          if (!Common$.renderer) continue;
          Common$.renderer.setRenderTarget(this.output);
          Common$.renderer.render(this.scene, this.camera);
          Common$.renderer.setRenderTarget(null);
        }
        return p_out;
      }
    }

    // ─── Pressure ────────────────────────────────────────────────────────────
    class Pressure {
      scene!: THREE.Scene;
      camera!: THREE.Camera;
      uniforms: Record<string, any> = {};
      output: THREE.WebGLRenderTarget | null = null;

      init(opts: SimProps) {
        const mat = new THREE.RawShaderMaterial({
          vertexShader: face_vert, fragmentShader: pressure_frag,
          uniforms: { boundarySpace: { value: opts.boundarySpace }, pressure: { value: opts.src_p?.texture }, velocity: { value: opts.src_v?.texture }, px: { value: opts.cellScale }, dt: { value: opts.dt } },
        });
        const scene = new THREE.Scene();
        scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
        this.scene = scene; this.camera = new THREE.Camera();
        this.uniforms = mat.uniforms;
        this.output = opts.dst || null;
      }

      update(vel: THREE.WebGLRenderTarget, pressure: THREE.WebGLRenderTarget) {
        this.uniforms.velocity.value = vel.texture;
        this.uniforms.pressure.value = pressure.texture;
        if (!Common$.renderer) return;
        Common$.renderer.setRenderTarget(this.output);
        Common$.renderer.render(this.scene, this.camera);
        Common$.renderer.setRenderTarget(null);
      }
    }

    // ─── Simulation ──────────────────────────────────────────────────────────
    class Simulation {
      options: {
        iterations_poisson: number; iterations_viscous: number; mouse_force: number;
        resolution: number; cursor_size: number; viscous: number; isBounce: boolean; dt: number; isViscous: boolean; BFECC: boolean;
      };
      fbos: Record<string, THREE.WebGLRenderTarget> = {};
      fboSize = new THREE.Vector2();
      cellScale = new THREE.Vector2();
      boundarySpace = new THREE.Vector2();
      advection!: Advection;
      externalForce!: ExternalForce;
      viscous!: Viscous;
      divergence!: Divergence;
      poisson!: Poisson;
      pressure!: Pressure;

      constructor(opts: Simulation['options']) {
        this.options = opts;
        this.init();
      }

      init() {
        this.calcSize();
        this.createAllFBO();
        this.createShaderPass();
      }

      getFloatType() {
        return /(iPad|iPhone|iPod)/i.test(navigator.userAgent) ? THREE.HalfFloatType : THREE.FloatType;
      }

      createAllFBO() {
        const type = this.getFloatType();
        const opts = { type, depthBuffer: false, stencilBuffer: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, wrapS: THREE.ClampToEdgeWrapping, wrapT: THREE.ClampToEdgeWrapping };
        for (const key of ['vel_0','vel_1','vel_viscous0','vel_viscous1','div','pressure_0','pressure_1']) {
          this.fbos[key] = new THREE.WebGLRenderTarget(this.fboSize.x, this.fboSize.y, opts);
        }
      }

      createShaderPass() {
        this.advection = new Advection();
        this.advection.init({ cellScale: this.cellScale, fboSize: this.fboSize, dt: this.options.dt, src: this.fbos.vel_0, dst: this.fbos.vel_1, isBFECC: this.options.BFECC });
        this.externalForce = new ExternalForce();
        this.externalForce.init({ cellScale: this.cellScale, cursor_size: this.options.cursor_size, dst: this.fbos.vel_1 });
        this.viscous = new Viscous();
        this.viscous.init({ cellScale: this.cellScale, boundarySpace: this.boundarySpace, viscous: this.options.viscous, src: this.fbos.vel_1, dst: this.fbos.vel_viscous1, dst_: this.fbos.vel_viscous0, dt: this.options.dt });
        this.divergence = new Divergence();
        this.divergence.init({ cellScale: this.cellScale, boundarySpace: this.boundarySpace, src: this.fbos.vel_viscous0, dst: this.fbos.div, dt: this.options.dt });
        this.poisson = new Poisson();
        this.poisson.init({ cellScale: this.cellScale, boundarySpace: this.boundarySpace, src: this.fbos.div, dst: this.fbos.pressure_1, dst_: this.fbos.pressure_0 });
        this.pressure = new Pressure();
        this.pressure.init({ cellScale: this.cellScale, boundarySpace: this.boundarySpace, src_p: this.fbos.pressure_0, src_v: this.fbos.vel_viscous0, dst: this.fbos.vel_0, dt: this.options.dt });
      }

      calcSize() {
        this.cellScale.set(1 / Math.max(1, Math.round(this.options.resolution * Common$.width)), 1 / Math.max(1, Math.round(this.options.resolution * Common$.height)));
        this.fboSize.set(Math.max(1, Math.round(this.options.resolution * Common$.width)), Math.max(1, Math.round(this.options.resolution * Common$.height)));
      }

      resize() { this.calcSize(); for (const k in this.fbos) this.fbos[k].setSize(this.fboSize.x, this.fboSize.y); }

      update() {
        this.boundarySpace.copy(this.options.isBounce ? new THREE.Vector2(0, 0) : this.cellScale);
        this.advection.update({ dt: this.options.dt, isBounce: this.options.isBounce, BFECC: this.options.BFECC });
        this.externalForce.update({ cursor_size: this.options.cursor_size, mouse_force: this.options.mouse_force, cellScale: this.cellScale });
        let vel = this.fbos.vel_1;
        if (this.options.isViscous) vel = this.viscous.update({ viscous: this.options.viscous, iterations: this.options.iterations_viscous, dt: this.options.dt }, { v0: this.fbos.vel_viscous0, v1: this.fbos.vel_viscous1 });
        this.divergence.update(vel);
        const pressure = this.poisson.update(this.options.iterations_poisson, { p0: this.fbos.pressure_0, p1: this.fbos.pressure_1 });
        this.pressure.update(vel, pressure);
      }
    }

    // ─── Output ───────────────────────────────────────────────────────────────
    class Output {
      simulation!: Simulation;
      scene!: THREE.Scene;
      camera!: THREE.Camera;
      output!: THREE.Mesh;

      init() {
        this.simulation = new Simulation({
          iterations_poisson: iterationsPoisson, iterations_viscous: iterationsViscous,
          mouse_force: mouseForce, resolution, cursor_size: cursorSize, viscous, isBounce, dt, isViscous, BFECC,
        });
        this.scene = new THREE.Scene();
        this.camera = new THREE.Camera();
        this.output = new THREE.Mesh(
          new THREE.PlaneGeometry(2, 2),
          new THREE.RawShaderMaterial({
            vertexShader: face_vert, fragmentShader: color_frag, transparent: true, depthWrite: false,
            uniforms: { velocity: { value: this.simulation.fbos.vel_0.texture }, boundarySpace: { value: new THREE.Vector2() }, palette: { value: paletteTex }, bgColor: { value: bgVec4 } },
          })
        );
        this.scene.add(this.output);
      }

      resize() { this.simulation.resize(); }
      update() { this.simulation.update(); this.render(); }
      render() {
        if (!Common$.renderer) return;
        Common$.renderer.setRenderTarget(null);
        Common$.renderer.render(this.scene, this.camera);
      }
    }

    // ─── WebGL Manager ───────────────────────────────────────────────────────
    interface WMProps { $wrapper: HTMLElement; autoDemo: boolean; autoSpeed: number; autoIntensity: number; takeoverDuration: number; autoResumeDelay: number; autoRampDuration: number; }

    class WebGLManager {
      running = false;
      lastUserInteraction = performance.now();
      autoDriver!: AutoDriver;
      output!: Output;
      private _loop = this.loop.bind(this);
      private _resize = this.resize.bind(this);
      private _onVisibility = () => {
        if (document.hidden) this.pause();
        else if (isVisibleRef.current) this.start();
      };

      constructor(private props: WMProps) {
        Common$.init(props.$wrapper);
        Mouse$.init(props.$wrapper);
        Mouse$.autoIntensity = props.autoIntensity;
        Mouse$.takeoverDuration = props.takeoverDuration;
        Mouse$.onInteract = () => { this.lastUserInteraction = performance.now(); this.autoDriver.forceStop(); };
        this.autoDriver = new AutoDriver(Mouse$, this, { enabled: props.autoDemo, speed: props.autoSpeed, resumeDelay: props.autoResumeDelay, rampDuration: props.autoRampDuration });
        this.init();
        window.addEventListener('resize', this._resize);
        document.addEventListener('visibilitychange', this._onVisibility);
      }

      init() {
        if (!Common$.renderer) return;
        Common$.renderer.domElement.style.position = 'absolute';
        Common$.renderer.domElement.style.inset = '0';
        this.props.$wrapper.prepend(Common$.renderer.domElement);
        this.output = new Output();
        this.output.init();
      }

      resize() { Common$.resize(); this.output.resize(); }

      render() { this.autoDriver.update(); Mouse$.update(); Common$.update(); this.output.update(); }

      loop() { if (!this.running) return; this.render(); rafRef.current = requestAnimationFrame(this._loop); }

      start() { if (this.running) return; this.running = true; this._loop(); }

      pause() { this.running = false; if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; } }

      dispose() {
        try {
          window.removeEventListener('resize', this._resize);
          document.removeEventListener('visibilitychange', this._onVisibility);
          Mouse$.dispose();
          if (Common$.renderer) {
            const canvas = Common$.renderer.domElement;
            if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
            Common$.renderer.dispose();
            Common$.renderer.forceContextLoss();
          }
        } catch (_) { /* dispose */ }
      }
    }

    // ─── Mount ───────────────────────────────────────────────────────────────
    const container = mountRef.current;
    if (!container) return;
    container.style.position = 'relative';
    container.style.overflow = 'hidden';

    const webgl = new WebGLManager({ $wrapper: container, autoDemo, autoSpeed, autoIntensity, takeoverDuration, autoResumeDelay, autoRampDuration });
    webgl.start();

    const io = new IntersectionObserver(entries => {
      const visible = entries[0].isIntersecting && entries[0].intersectionRatio > 0;
      isVisibleRef.current = visible;
      if (visible && !document.hidden) webgl.start();
      else webgl.pause();
    }, { threshold: [0, 0.01, 0.1] });
    io.observe(container);

    const ro = new ResizeObserver(() => {
      if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
      resizeRafRef.current = requestAnimationFrame(() => webgl.resize());
    });
    ro.observe(container);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      try { ro.disconnect(); io.disconnect(); } catch (_) { /* */ }
      webgl.dispose();
    };
  }, []);

  return <div ref={mountRef} className={`liquid-ether-container ${className || ''}`} style={style} />;
}
