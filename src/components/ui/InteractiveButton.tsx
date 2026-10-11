import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Loader2, Check, AlertCircle } from 'lucide-react';

export type ButtonStatus = 'idle' | 'loading' | 'success' | 'error';

interface RippleItem {
  id: number;
  x: number;
  y: number;
  size: number;
}

export interface InteractiveButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  as?: 'button' | 'a';
  href?: string;
  target?: string;
  rel?: string;
  magnetic?: boolean;
  magneticStrength?: number;
  status?: ButtonStatus;
  loadingText?: React.ReactNode;
  successText?: React.ReactNode;
  errorText?: React.ReactNode;
  ripple?: boolean;
  rippleVariant?: 'light' | 'dark' | 'amber';
  glowEffect?: boolean;
  children: React.ReactNode;
}

export const InteractiveButton = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  InteractiveButtonProps
>(
  (
    {
      as = 'button',
      href,
      target,
      rel,
      magnetic = false,
      magneticStrength = 0.2,
      status = 'idle',
      loadingText,
      successText,
      errorText,
      ripple = true,
      rippleVariant = 'light',
      glowEffect = false,
      className = '',
      children,
      onClick,
      disabled,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLElement | null>(null);
    const [ripples, setRipples] = useState<RippleItem[]>([]);
    const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const prefersReducedMotion = useRef(false);

    useEffect(() => {
      if (typeof window !== 'undefined') {
        prefersReducedMotion.current = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches;
      }
    }, []);

    // Combine forwarded ref with internal ref
    const setRef = useCallback(
      (node: HTMLElement | null) => {
        internalRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node as any);
        } else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<any>).current = node;
        }
      },
      [forwardedRef]
    );

    // Magnetic effect handler (pointer: fine and hover: hover only)
    const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLElement>) => {
        if (!magnetic || prefersReducedMotion.current) return;
        if (typeof window === 'undefined') return;
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches)
          return;

        const node = internalRef.current;
        if (!node) return;

        const rect = node.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * magneticStrength;
        const deltaY = (e.clientY - centerY) * magneticStrength;

        // Clamp to maximum 12px translation to keep it subtle & refined
        const clampedX = Math.max(-12, Math.min(12, deltaX));
        const clampedY = Math.max(-10, Math.min(10, deltaY));

        setMagneticOffset({ x: clampedX, y: clampedY });
      },
      [magnetic, magneticStrength]
    );

    const handleMouseLeave = useCallback(() => {
      setIsHovered(false);
      setMagneticOffset({ x: 0, y: 0 });
    }, []);

    const handleMouseEnter = useCallback(() => {
      setIsHovered(true);
    }, []);

    // Ripple click handler
    const handleClick = useCallback(
      (e: React.MouseEvent<any>) => {
        if (ripple && !prefersReducedMotion.current && internalRef.current) {
          const rect = internalRef.current.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const size = Math.max(rect.width, rect.height) * 2;

          const newRipple: RippleItem = {
            id: Date.now() + Math.random(),
            x,
            y,
            size,
          };

          setRipples((prev) => [...prev.slice(-3), newRipple]);

          setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
          }, 600);
        }

        if (onClick) {
          onClick(e);
        }
      },
      [onClick, ripple]
    );

    const isInteractiveDisabled = disabled || status === 'loading';

    // Status styling morphs
    let statusClasses = '';
    if (status === 'loading') {
      statusClasses = 'opacity-95 cursor-wait pointer-events-none scale-[0.99] transition-all duration-300';
    } else if (status === 'success') {
      statusClasses =
        '!bg-emerald-500 !text-zinc-950 !border-emerald-400 !shadow-emerald-500/30 scale-[1.01] transition-all duration-300';
    } else if (status === 'error') {
      statusClasses =
        '!bg-rose-600 !text-white !border-rose-500 !shadow-rose-600/30 shake transition-all duration-300';
    }

    const magneticStyle: React.CSSProperties = {
      transform:
        magneticOffset.x !== 0 || magneticOffset.y !== 0
          ? `translate3d(${magneticOffset.x}px, ${magneticOffset.y}px, 0)`
          : undefined,
      transition: isHovered
        ? 'transform 0.15s ease-out'
        : 'transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1), background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease',
    };

    const rippleColorClass =
      rippleVariant === 'amber'
        ? 'bg-amber-400/30'
        : rippleVariant === 'dark'
        ? 'bg-zinc-950/20'
        : 'bg-white/25';

    // Render inner content with smooth morphing transitions
    const renderContent = () => {
      if (status === 'loading') {
        return (
          <span className="inline-flex items-center justify-center gap-2 transition-all duration-300">
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>{loadingText || children}</span>
          </span>
        );
      }

      if (status === 'success') {
        return (
          <span className="inline-flex items-center justify-center gap-2 transition-all duration-300 animate-in zoom-in-95 duration-200">
            <Check className="w-4 h-4 shrink-0 stroke-[2.5]" />
            <span>{successText || 'Completed ✓'}</span>
          </span>
        );
      }

      if (status === 'error') {
        return (
          <span className="inline-flex items-center justify-center gap-2 transition-all duration-300 animate-in shake duration-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorText || 'Error Occurred'}</span>
          </span>
        );
      }

      return children;
    };

    const combinedClassName = `relative overflow-hidden transition-all duration-200 active:scale-[0.98] select-none ${statusClasses} ${className}`;

    if (as === 'a' && href) {
      return (
        <a
          ref={setRef as React.RefCallback<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel}
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={magneticStyle}
          className={combinedClassName}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {renderContent()}

          {/* Ripple elements */}
          {ripples.map((rip) => (
            <span
              key={rip.id}
              className={`absolute rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2 animate-ripple ${rippleColorClass}`}
              style={{
                left: rip.x,
                top: rip.y,
                width: rip.size,
                height: rip.size,
              }}
            />
          ))}

          {/* Glow aura */}
          {glowEffect && isHovered && (
            <span className="absolute inset-0 rounded-[inherit] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none opacity-50 blur-[2px]" />
          )}
        </a>
      );
    }

    return (
      <button
        ref={setRef as React.RefCallback<HTMLButtonElement>}
        type={props.type || 'button'}
        disabled={isInteractiveDisabled}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={magneticStyle}
        className={combinedClassName}
        {...props}
      >
        {renderContent()}

        {/* Ripple elements */}
        {ripples.map((rip) => (
          <span
            key={rip.id}
            className={`absolute rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2 animate-ripple ${rippleColorClass}`}
            style={{
              left: rip.x,
              top: rip.y,
              width: rip.size,
              height: rip.size,
            }}
          />
        ))}

        {/* Glow aura */}
        {glowEffect && isHovered && (
          <span className="absolute inset-0 rounded-[inherit] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none opacity-50 blur-[2px]" />
        )}
      </button>
    );
  }
);

InteractiveButton.displayName = 'InteractiveButton';
