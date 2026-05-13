import { Link, createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { teamMembers, type TeamMember } from "@/data/team";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

/**
 * Tunable thresholds for the swipe-down close gesture on the team modal.
 * Tweak these values to refine the feel based on user feedback.
 */
const SWIPE_TUNING = {
  /** Movement (px) required before locking the gesture axis. Avoids tap jitter. */
  axisLockDeadZonePx: 10,
  /** Minimum horizontal travel (px) to consider the gesture as "horizontal-dominant". */
  horizontalCancelMinPx: 24,
  /** Horizontal must exceed vertical by this factor to cancel the swipe. */
  horizontalDominanceRatio: 1.5,
  /** Vertical must exceed max horizontal by this factor at release to confirm close. */
  verticalConfirmRatio: 1.2,
  /** Rubber-banding starts after this many px of downward drag. */
  rubberBandStartPx: 200,
  /** Resistance applied beyond rubberBandStartPx (0 = locked, 1 = no resistance). */
  rubberBandResistance: 0.35,
  /** Distance threshold (px) is clamped between min and max, scaled to viewport. */
  closeDistanceMinPx: 80,
  closeDistanceMaxPx: 180,
  closeDistanceVhRatio: 0.18,
  /** Flick velocity (px/ms) and minimum drag (px) to close via fast swipe. */
  flickVelocityPxPerMs: 0.6,
  flickMinDragPx: 24,
  /** Hysteresis (px) below the live threshold needed to re-arm the haptic cue. */
  hapticRearmHysteresisPx: 16,
  /** Haptic vibration patterns (ms). */
  hapticThresholdMs: 12,
  hapticConfirmMs: 18,
} as const;

export const Route = createFileRoute("/equipo/")({
  component: TeamPage,
  head: () => ({
    meta: [
      { title: "Equipo — AKM Kassem & Molinero Arquitectura" },
      {
        name: "description",
        content:
          "Conoce al equipo de socios de AKM Arquitectura: arquitectos con más de cuatro décadas de experiencia en rehabilitación, hoteles, residencial y patrimonio en Barcelona.",
      },
      { property: "og:title", content: "Equipo — AKM Arquitectura" },
      {
        property: "og:description",
        content:
          "Socios y arquitectos del estudio AKM Kassem & Molinero, Barcelona.",
      },
    ],
  }),
});

function TeamPage() {
  const [active, setActive] = useState<TeamMember | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const dragStartY = useRef<number | null>(null);
  const dragStartX = useRef<number>(0);
  const maxAbsDeltaX = useRef<number>(0);
  const dragDeltaY = useRef<number>(0);
  const dragStartTime = useRef<number>(0);
  const lastMoveY = useRef<number>(0);
  const lastMoveTime = useRef<number>(0);
  const dragVelocity = useRef<number>(0); // px/ms, positive = downward
  const hasCrossedThreshold = useRef<boolean>(false);
  const dragCancelled = useRef<boolean>(false);
  const dragAxisLocked = useRef<"vertical" | "horizontal" | null>(null);
  const rafId = useRef<number | null>(null);
  const pendingDragY = useRef<number | null>(null);
  const closeTimeoutId = useRef<number | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  // isDragging / isClosing kept in refs to avoid re-renders during the gesture.
  // Visuals are applied imperatively to the DOM via applyDragVisuals().
  const isDraggingRef = useRef(false);
  const isClosingRef = useRef(false);

  // dragY tracked as ref + applied imperatively to avoid re-renders mid-drag.
  const dragYRef = useRef(0);
  const setDragY = (v: number) => {
    dragYRef.current = v;
  };

  const applyDragVisuals = useCallback((y: number) => {
    const modal = modalRef.current;
    const backdrop = backdropRef.current;
    const dragging = isDraggingRef.current;
    const closing = isClosingRef.current;
    if (modal) {
      modal.style.transform = closing
        ? "translateY(100vh)"
        : y > 0
          ? `translateY(${y}px)`
          : "";
      modal.style.transition = dragging
        ? "none"
        : "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)";
      if (closing) modal.dataset.closing = "true";
      else delete modal.dataset.closing;
    }
    if (backdrop) {
      backdrop.style.opacity = closing
        ? "0"
        : String(Math.max(0, 1 - y / 400));
      backdrop.style.transition = dragging ? "none" : "opacity 220ms ease";
      if (closing) backdrop.dataset.closing = "true";
      else delete backdrop.dataset.closing;
    }
  }, []);

  const scheduleDragY = useCallback((value: number) => {
    pendingDragY.current = value;
    if (rafId.current != null) return;
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      if (pendingDragY.current != null) {
        const v = pendingDragY.current;
        setDragY(v);
        applyDragVisuals(v);
        pendingDragY.current = null;
      }
    });
  }, [applyDragVisuals]);

  const cancelScheduledDragY = useCallback(() => {
    if (rafId.current != null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    pendingDragY.current = null;
  }, []);

  /**
   * Reset all gesture-related refs to a clean slate. Used on cancel, on modal
   * close, and on unmount to prevent leaking pending raf/timeout work or
   * stale gesture state into the next interaction.
   */
  const resetGestureRefs = useCallback(() => {
    cancelScheduledDragY();
    if (closeTimeoutId.current != null) {
      window.clearTimeout(closeTimeoutId.current);
      closeTimeoutId.current = null;
    }
    dragStartY.current = null;
    dragStartX.current = 0;
    maxAbsDeltaX.current = 0;
    dragDeltaY.current = 0;
    dragStartTime.current = 0;
    lastMoveY.current = 0;
    lastMoveTime.current = 0;
    dragVelocity.current = 0;
    hasCrossedThreshold.current = false;
    dragCancelled.current = false;
    dragAxisLocked.current = null;
    isDraggingRef.current = false;
    isClosingRef.current = false;
    dragYRef.current = 0;
  }, [cancelScheduledDragY]);

  const triggerHaptic = useCallback((pattern: number | number[] = 12) => {
    if (typeof navigator === "undefined") return;
    const vibrate = navigator.vibrate?.bind(navigator);
    if (typeof vibrate === "function") {
      try {
        vibrate(pattern);
      } catch {
        // no-op: some browsers throw if called without a user gesture
      }
    }
  }, []);

  const closeWithAnimation = useCallback(() => {
    cancelScheduledDragY();
    if (closeTimeoutId.current != null) {
      window.clearTimeout(closeTimeoutId.current);
      closeTimeoutId.current = null;
    }
    isClosingRef.current = true;
    isDraggingRef.current = false;
    applyDragVisuals(0);
    // Let the CSS transition play before unmounting
    closeTimeoutId.current = window.setTimeout(() => {
      closeTimeoutId.current = null;
      isClosingRef.current = false;
      setDragY(0);
      setActive(null);
    }, 220);
  }, [cancelScheduledDragY, applyDragVisuals]);

  const isTouchDevice = useCallback(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(hover: none), (pointer: coarse)").matches,
    [],
  );

  const onTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    const y = e.touches[0].clientY;
    const x = e.touches[0].clientX;
    const t = performance.now();
    dragStartY.current = y;
    dragStartX.current = x;
    maxAbsDeltaX.current = 0;
    dragDeltaY.current = 0;
    dragStartTime.current = t;
    lastMoveY.current = y;
    lastMoveTime.current = t;
    dragVelocity.current = 0;
    hasCrossedThreshold.current = false;
    dragCancelled.current = false;
    dragAxisLocked.current = null;
    cancelScheduledDragY();
    isDraggingRef.current = true;
    applyDragVisuals(0);
  }, [cancelScheduledDragY, applyDragVisuals]);
  const onTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (dragStartY.current == null) return;
    if (dragCancelled.current) return;
    const y = e.touches[0].clientY;
    const x = e.touches[0].clientX;
    const t = performance.now();
    const dy = y - dragStartY.current;
    const dx = x - dragStartX.current;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    if (absDx > maxAbsDeltaX.current) maxAbsDeltaX.current = absDx;

    // Lock the gesture axis once the finger has moved a meaningful amount.
    // Use a small dead-zone (10px) so taps/jitter don't lock the axis.
    if (
      dragAxisLocked.current === null &&
      (absDx > SWIPE_TUNING.axisLockDeadZonePx ||
        absDy > SWIPE_TUNING.axisLockDeadZonePx)
    ) {
      dragAxisLocked.current = absDy >= absDx ? "vertical" : "horizontal";
    }

    // Cancel the drag if the gesture is mostly horizontal: either it locked
    // horizontal, or horizontal travel clearly outpaces vertical mid-drag.
    const horizontalDominates =
      absDx > SWIPE_TUNING.horizontalCancelMinPx &&
      absDx > absDy * SWIPE_TUNING.horizontalDominanceRatio;
    if (dragAxisLocked.current === "horizontal" || horizontalDominates) {
      dragCancelled.current = true;
      // Snap back any visual offset; route through rAF so we still emit at most
      // one render per frame even on the cancellation path.
      scheduleDragY(0);
      hasCrossedThreshold.current = false;
      return;
    }

    dragDeltaY.current = dy;
    const dt = t - lastMoveTime.current;
    if (dt > 0) {
      // Smooth velocity with a simple low-pass filter
      const instant = (y - lastMoveY.current) / dt;
      dragVelocity.current = dragVelocity.current * 0.6 + instant * 0.4;
    }
    lastMoveY.current = y;
    lastMoveTime.current = t;
    // Only react to downward drag; apply mild rubber-banding
    if (dy > 0) {
      const eased =
        dy < SWIPE_TUNING.rubberBandStartPx
          ? dy
          : SWIPE_TUNING.rubberBandStartPx +
            (dy - SWIPE_TUNING.rubberBandStartPx) *
              SWIPE_TUNING.rubberBandResistance;
      scheduleDragY(eased);
    } else {
      scheduleDragY(0);
    }
    // Haptic cue when we cross the close threshold during the drag
    const vh =
      typeof window !== "undefined" ? window.innerHeight || 800 : 800;
    const liveThreshold = Math.max(
      SWIPE_TUNING.closeDistanceMinPx,
      Math.min(
        SWIPE_TUNING.closeDistanceMaxPx,
        vh * SWIPE_TUNING.closeDistanceVhRatio,
      ),
    );
    if (!hasCrossedThreshold.current && dy > liveThreshold) {
      hasCrossedThreshold.current = true;
      triggerHaptic(SWIPE_TUNING.hapticThresholdMs);
    } else if (
      hasCrossedThreshold.current &&
      dy < liveThreshold - SWIPE_TUNING.hapticRearmHysteresisPx
    ) {
      // Allow re-triggering if the user pulls back up past the threshold
      hasCrossedThreshold.current = false;
    }
  }, [cancelScheduledDragY, scheduleDragY, triggerHaptic]);
  const onTouchEnd = useCallback(() => {
    const dy = dragDeltaY.current;
    const v = dragVelocity.current; // px/ms
    const cancelled = dragCancelled.current;
    dragStartY.current = null;
    dragDeltaY.current = 0;
    isDraggingRef.current = false;
    if (cancelled) {
      // Hard reset: cancel pending raf, clear timers, and zero gesture refs
      // so the next gesture starts from a known-clean state.
      resetGestureRefs();
      applyDragVisuals(0);
      return;
    }
    // Thresholds relative to viewport so it feels consistent on phones/tablets/desktop.
    const vh =
      typeof window !== "undefined"
        ? window.innerHeight || 800
        : 800;
    const distanceThreshold = Math.max(
      SWIPE_TUNING.closeDistanceMinPx,
      Math.min(
        SWIPE_TUNING.closeDistanceMaxPx,
        vh * SWIPE_TUNING.closeDistanceVhRatio,
      ),
    );
    // A flick: fast downward motion (>0.6 px/ms ≈ 600 px/s) with at least a small drag.
    const isFlick =
      v > SWIPE_TUNING.flickVelocityPxPerMs &&
      dy > SWIPE_TUNING.flickMinDragPx;
    // Require the gesture to be mostly vertical overall (final ratio check),
    // not just at the moment we cross the threshold.
    const isMostlyVertical =
      dy > 0 && dy >= maxAbsDeltaX.current * SWIPE_TUNING.verticalConfirmRatio;
    if (isMostlyVertical && (dy > distanceThreshold || isFlick)) {
      // Confirm close with a slightly stronger pulse if we hadn't crossed
      // the live threshold yet (e.g. closing via flick with small drag).
      if (!hasCrossedThreshold.current)
        triggerHaptic(SWIPE_TUNING.hapticConfirmMs);
      closeWithAnimation();
    } else {
      // Snap back smoothly
      cancelScheduledDragY();
      setDragY(0);
      applyDragVisuals(0);
    }
    dragVelocity.current = 0;
    hasCrossedThreshold.current = false;
    dragAxisLocked.current = null;
  }, [resetGestureRefs, cancelScheduledDragY, closeWithAnimation, triggerHaptic, applyDragVisuals]);

  const onMediaClick = useCallback(() => {
    if (isTouchDevice()) closeWithAnimation();
  }, [isTouchDevice, closeWithAnimation]);

  useEffect(() => {
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On unmount, fully tear down any pending raf, close timeout, and gesture
  // state so we never leave callbacks scheduled against a dead component.
  useEffect(() => {
    return () => {
      resetGestureRefs();
    };
  }, [resetGestureRefs]);

  // When the modal closes (active becomes null), also reset gesture state so
  // a stale dragY/closing flag can't bleed into the next opened member.
  useEffect(() => {
    if (active) return;
    resetGestureRefs();
  }, [active, resetGestureRefs]);

  useEffect(() => {
    if (!active) return;
    // Shallow URL sync so the modal state is shareable / back-button friendly
    const prevUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const targetUrl = `/equipo/${active.slug}`;
    if (prevUrl !== targetUrl) {
      window.history.pushState({ tmModal: active.slug }, "", targetUrl);
    }
    const onPop = () => setActive(null);
    window.addEventListener("popstate", onPop);
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const getFocusable = (): HTMLElement[] => {
      const root = modalRef.current;
      if (!root) return [];
      const selector =
        'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';
      return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
        (el) => !el.hasAttribute("disabled") && el.offsetParent !== null,
      );
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const idx = teamMembers.findIndex((x) => x.name === active.name);
        if (idx === -1) return;
        const delta = e.key === "ArrowRight" ? 1 : -1;
        const next = teamMembers[(idx + delta + teamMembers.length) % teamMembers.length];
        e.preventDefault();
        setActive(next);
        requestAnimationFrame(() => closeBtnRef.current?.focus());
        return;
      }
      if (e.key === "Tab") {
        const focusable = getFocusable();
        if (focusable.length === 0) {
          e.preventDefault();
          closeBtnRef.current?.focus();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const activeEl = document.activeElement as HTMLElement | null;
        const inModal = modalRef.current?.contains(activeEl ?? null);
        if (!inModal) {
          e.preventDefault();
          first.focus();
          return;
        }
        if (e.shiftKey && activeEl === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && activeEl === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // focus close button for keyboard users
    requestAnimationFrame(() => closeBtnRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
      window.removeEventListener("popstate", onPop);
      // Restore URL if we still own the pushed entry
      if (window.history.state?.tmModal) {
        window.history.back();
      }
    };
  }, [active]);

  return (
    <>
      <Nav />

      <main className="team-page">
        <section className="team-hero">
          <span className="eyebrow">Un solo estudio</span>
          <h1 className="hotels-title">
            Trabajamos <em>juntos</em>
            <br />
            en cada proyecto
          </h1>
          <p className="hotels-intro">
            Somos un equipo. Cada encargo se piensa, se discute y se construye de forma colectiva, sumando la experiencia y la mirada de todos los socios. Lo que firma el estudio nunca es obra de una sola persona, sino el resultado de una manera compartida de entender la arquitectura desde 1980.
          </p>
        </section>

        <section className="team-grid-section">
          <div className="tgrid">
            {teamMembers.map((m) => (
              <button
                type="button"
                className="tm tm-button"
                key={m.name}
                onClick={() => setActive(m)}
                aria-label={`Ver biografía de ${m.name}`}
              >
                <img
                  src={m.img}
                  srcSet={m.srcSet}
                  sizes="(max-width: 720px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  alt={m.name}
                  width={640}
                  height={960}
                  loading="lazy"
                  decoding="async"
                />
                <div className="tm-label">
                  <span className="tm-label-name">{m.name}</span>
                  <span className="tm-label-role">{m.role}</span>
                </div>
                <div className="tm-over">
                  <div className="tm-over-bar"></div>
                  <h3 className="tm-name">{m.name}</h3>
                  <p className="tm-role">{m.role}</p>
                  <p className="tm-spec" style={{ whiteSpace: "pre-line" }}>
                    {m.spec}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {active && (
        <div
          className="tm-modal-backdrop"
          ref={backdropRef}
          onClick={() => closeWithAnimation()}
        >
          <div
            className="tm-modal"
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tm-modal-name"
            aria-describedby={active.bio ? "tm-modal-bio" : "tm-modal-spec"}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchEnd}
          >
            <button
              ref={closeBtnRef}
              type="button"
              className="tm-modal-close"
              onClick={() => setActive(null)}
              aria-label="Cerrar"
            >
              <span aria-hidden="true">×</span>
            </button>
            <div
              className="tm-modal-media"
              onClick={onMediaClick}
              role={isTouchDevice() ? "button" : undefined}
              aria-label={isTouchDevice() ? "Cerrar" : undefined}
            >
              <img
                src={active.img}
                srcSet={active.srcSet}
                sizes="(max-width: 720px) 100vw, 480px"
                alt={active.name}
                width={640}
                height={960}
                decoding="async"
                loading="eager"
                fetchPriority="high"
              />
            </div>
            <div className="tm-modal-body">
              <span className="eyebrow">{active.role}</span>
              <h2 id="tm-modal-name" className="tm-modal-name">{active.name}</h2>
              <p id="tm-modal-spec" className="tm-modal-spec" style={{ whiteSpace: "pre-line" }}>
                {active.spec}
              </p>
              {active.bio && (
                <p id="tm-modal-bio" className="tm-modal-bio">{active.bio}</p>
              )}
              <div className="tm-modal-actions">
                <Link
                  to="/equipo/$slug"
                  params={{ slug: active.slug }}
                  className="tm-modal-cta"
                >
                  Ver página completa
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}