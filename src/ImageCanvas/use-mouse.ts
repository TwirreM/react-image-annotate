// @flow weak

import { MouseEvent, MutableRefObject, useRef, WheelEvent } from "react";
import { IMatrix, Matrix } from "transformation-matrix-js";

const getDefaultMat = () => Matrix.from(1, 0, 0, 1, -10, -10);

// Zoom clamps
const MIN_SCALE = 0.05
const MAX_SCALE = 2

// Sensitivity: pixel delta -> log-scale delta (tune to taste)
// Negative so positive deltaY (scroll down) zooms OUT.
const LOG_SENSITIVITY = -0.0015

// Easing toward target per frame (0..1). Smaller = smoother/slower.
const EASE = 0.18

type UseMouseProps = {
  canvasEl: MutableRefObject<HTMLCanvasElement | null>;
  changeMat: (mat: IMatrix) => void;
  changeDragging: (dragging: boolean) => void;
  zoomStart: { x: number; y: number } | null;
  zoomEnd: { x: number; y: number } | null;
  changeZoomStart: (point: { x: number; y: number } | null) => void;
  changeZoomEnd: (point: { x: number; y: number } | null) => void;
  layoutParams: MutableRefObject<{ iw: number; ih: number } | null>;
  zoomWithPrimary: boolean;
  dragWithPrimary: boolean;
  mat: IMatrix;
  onMouseMove: (point: { x: number; y: number }) => void;
  onMouseUp: (point: { x: number; y: number }) => void;
  onMouseDown: (point: { x: number; y: number }) => void;
  dragging: boolean;
};

export type MouseEvents = {
  onMouseMove: (e: MouseEvent) => void;
  onMouseDown: (e: MouseEvent, specialEvent?: { type?: string }) => void;
  onMouseUp: (e: MouseEvent) => void;
  onWheel: (e: WheelEvent) => void;
  onContextMenu: (e: MouseEvent) => void;
};

export type MenuPosition = { x: number; y: number };

export type UseMouseReturn = {
  mouseEvents: MouseEvents;
  mousePosition: MutableRefObject<MenuPosition>;
};

export default ({
  canvasEl,
  changeMat,
  changeDragging,
  zoomStart,
  changeZoomStart,
  changeZoomEnd,
  layoutParams,
  zoomWithPrimary,
  dragWithPrimary,
  mat,
  onMouseMove,
  onMouseUp,
  onMouseDown,
  dragging,
}: UseMouseProps): UseMouseReturn => {
  const mousePosition = useRef({ x: 0, y: 0 });
  const prevMousePosition = useRef({ x: 0, y: 0 });

  // --- Smooth zoom state ---
  const targetLogScale = useRef(Math.log(mat.a || 1))
  const animRaf = useRef(0)
  const anchorRef = useRef({ x: 0, y: 0 })

  const setTargetScale = (nextScale: number) => {
    // Clamp target, then store in log-space
    const clamped = Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextScale))
    targetLogScale.current = Math.log(clamped)
    startZoomAnimation()
  }

  const startZoomAnimation = () => {
    if (animRaf.current) return
    const step = () => {
      animRaf.current = 0
      const currentLog = Math.log(mat.a || 1)
      const target = targetLogScale.current
      const diff = target - currentLog

      if (Math.abs(diff) < 0.0001) {
        // Close enough; snap to target once and stop
        const desired = Math.exp(target)
        const scale = desired / (mat.a || 1)
        if (scale !== 1) zoomBy(scale, anchorRef.current)
        return
      }

      // Move a fraction toward target
      const nextLog = currentLog + diff * EASE
      const desired = Math.exp(nextLog)
      const scale = desired / (mat.a || 1)

      zoomBy(scale, anchorRef.current)
      animRaf.current = requestAnimationFrame(step)
    }
    animRaf.current = requestAnimationFrame(step)
  }

  // Normalize wheel to pixels
  const normalizeWheelDelta = (e: WheelEvent) => {
    const LINE_HEIGHT = 16
    const PAGE_HEIGHT = window.innerHeight || 800
    let d = e.deltaY
    if (e.deltaMode === 1) d *= LINE_HEIGHT
    else if (e.deltaMode === 2) d *= PAGE_HEIGHT
    return -d
  }

  // Smooth, multiplicative zoom by a scale factor around a point
  const zoomBy = (scale: number, point: { x: number, y: number }) => {
    const { x: mx, y: my } = point

    // Mutate mat (as before)
    mat.translate(mx, my).scaleU(scale)
    if (mat.a > MAX_SCALE) mat.scaleU(MAX_SCALE / mat.a)
    if (mat.a < MIN_SCALE) mat.scaleU(MIN_SCALE / mat.a)
    mat.translate(-mx, -my)

    changeMat(mat.clone())
  }

  // Backward-compatible: support `{to: number}` and legacy +/- direction
  const zoomIn = (direction: { to: number } | number, point: { x: number, y: number }) => {
    const { x: mx, y: my } = point
    anchorRef.current = { x: mx, y: my }

    if (typeof direction === "object" && direction && typeof direction.to === "number") {
      // Jump target to specific absolute scale
      setTargetScale(direction.to)
      return
    }

    if (direction === 1 || direction === -1) {
      // Legacy mouse “ticks”: nudge target ~10% per notch, then animate smoothly
      const desired = (mat.a || 1) * (direction === 1 ? 1.1 : 1 / 1.1)
      setTargetScale(desired)
      return
    }

    if (typeof direction === "number") {
      // Treat as pixel delta (from wheel); accumulate on target smoothly
      const currentTarget = Math.exp(targetLogScale.current)
      const desired = currentTarget * Math.exp(direction * LOG_SENSITIVITY)
      setTargetScale(desired)
    }
  }

  const mouseEvents = {
    onMouseMove: (e: MouseEvent) => {
      const rect = canvasEl.current?.getBoundingClientRect();
      if (!rect) return;
      prevMousePosition.current.x = mousePosition.current.x;
      prevMousePosition.current.y = mousePosition.current.y;
      mousePosition.current.x = e.clientX - rect.left;
      mousePosition.current.y = e.clientY - rect.top;

      const projMouse = mat.applyToPoint(
        mousePosition.current.x,
        mousePosition.current.y
      );

      if (zoomWithPrimary && zoomStart) {
        changeZoomEnd(projMouse);
      }
      if (layoutParams.current) {
        const { iw, ih } = layoutParams.current;
        onMouseMove({ x: projMouse.x / iw, y: projMouse.y / ih });
      }

      if (dragging) {
        mat.translate(
          prevMousePosition.current.x - mousePosition.current.x,
          prevMousePosition.current.y - mousePosition.current.y
        );

        changeMat(mat.clone());
      }
      e.preventDefault();
    },
    onMouseDown: (e: MouseEvent, specialEvent: { type?: string } = {}) => {
      e.preventDefault();

      if (
        e.button === 1 ||
        e.button === 2 ||
        (e.button === 0 && dragWithPrimary)
      )
        return changeDragging(true);

      const projMouse = mat.applyToPoint(
        mousePosition.current.x,
        mousePosition.current.y
      );
      if (zoomWithPrimary && e.button === 0) {
        changeZoomStart(projMouse);
        changeZoomEnd(projMouse);
        return;
      }
      if (e.button === 0) {
        if (specialEvent.type === "resize-box") {
          // onResizeBox()
        }
        if (specialEvent.type === "move-region") {
          // onResizeBox()
        }
        if (layoutParams.current) {
          const { iw, ih } = layoutParams.current;
          onMouseDown({ x: projMouse.x / iw, y: projMouse.y / ih });
        }
      }
    },
    onMouseUp: (e: MouseEvent) => {
      e.preventDefault();
      const projMouse = mat.applyToPoint(
        mousePosition.current.x,
        mousePosition.current.y
      );
      if (zoomStart) {
        const zoomEnd = projMouse;
        if (
          Math.abs(zoomStart.x - zoomEnd.x) < 10 &&
          Math.abs(zoomStart.y - zoomEnd.y) < 10
        ) {
          if (mat.a < 1) {
            zoomIn({ to: 1 }, mousePosition.current);
          } else {
            zoomIn({ to: 0.25 }, mousePosition.current);
          }
        } else {
          if (zoomStart.x > zoomEnd.x) {
            [zoomStart.x, zoomEnd.x] = [zoomEnd.x, zoomStart.x];
          }
          if (zoomStart.y > zoomEnd.y) {
            [zoomStart.y, zoomEnd.y] = [zoomEnd.y, zoomStart.y];
          }

          if (!layoutParams.current) return;
          const { iw, ih } = layoutParams.current;

          // The region defined by zoomStart and zoomEnd should be the new transform
          let scale = Math.min(
            (zoomEnd.x - zoomStart.x) / iw,
            (zoomEnd.y - zoomStart.y) / ih
          );
          if (scale < 0.05) scale = 0.05;
          if (scale > 10) scale = 10;

          const newMat = getDefaultMat()
            .translate(zoomStart.x, zoomStart.y)
            .scaleU(scale);

          changeMat(newMat.clone());
        }

        changeZoomStart(null);
        changeZoomEnd(null);
      }
      if (
        e.button === 1 ||
        e.button === 2 ||
        (e.button === 0 && dragWithPrimary)
      )
        return changeDragging(false);
      if (e.button === 0 && layoutParams.current) {
        const { iw, ih } = layoutParams.current;
        onMouseUp({ x: projMouse.x / iw, y: projMouse.y / ih });
      }
    },
    onWheel: (e: WheelEvent) => {
      // Smooth zoom: update target, animation handles the rest
      e.preventDefault()

      // Use current mouse as anchor
      anchorRef.current = { x: mousePosition.current.x, y: mousePosition.current.y }

      const deltaPixels = normalizeWheelDelta(e)

      // Special-case: macOS pinch-zoom sends ctrlKey=true; make it a bit gentler
      const sensitivity = e.ctrlKey ? LOG_SENSITIVITY * 0.7 : LOG_SENSITIVITY

      const currentTarget = Math.exp(targetLogScale.current)
      const desired = currentTarget * Math.exp(deltaPixels * sensitivity)
      setTargetScale(desired)
    },
    onContextMenu: (e: MouseEvent) => {
      e.preventDefault();
    },
  };
  return { mouseEvents, mousePosition };
};
