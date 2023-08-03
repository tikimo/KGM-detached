import { useManualCameraPosition } from './../../../services/useCameraPosition';
import { useSpring } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import { useEffect, useRef } from 'react';

const MAX_SCALE = 6;
const MIN_SCALE = 1;

export function useMapGestures() {
  const [style, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    rotateZ: 0,
  }));
  const ref = useRef<HTMLDivElement>(null);
  const cameraPosition = useManualCameraPosition((s) => s.position);

  const scrollTo = (xPercentage: number, yPercentage: number) => {
    if (!ref.current) return;
    console.log('Scrolling to', xPercentage, yPercentage);
    const h = ref.current.offsetHeight;
    const w = ref.current.offsetWidth;

    // percentages from -100 to 100
    const xMult = (xPercentage * 2 - 100) / 100;
    const yMult = (yPercentage * 2 - 100) / 100;

    const x = xMult * w * -1;
    const y = yMult * h * -1;

    api.start({ x: x * 1.5, y: y * 1.5 });
  };

  useEffect(() => {
    console.log('GOT NEW CAMERA POSITIONS', cameraPosition);
    scrollTo(cameraPosition.x, cameraPosition.y);
  }, [cameraPosition]);

  useGesture(
    {
      onDrag: ({ pinching, cancel, offset: [x, y] }) => {
        if (pinching) return cancel();
        api.start({ x, y });
      },
      onPinch: ({
        origin: [originX, originY],
        first,
        movement: [ms],
        offset: [scale, rotateZ],
        memo,
      }) => {
        if (!ref.current) return;
        if (first) {
          const { width, height, x, y } = ref.current.getBoundingClientRect();
          const tx = originX - (x + width / 2);
          const ty = originY - (y + height / 2);
          memo = [style.x.get(), style.y.get(), tx, ty];
        }

        const x = memo[0] - (ms - 1) * memo[2];
        const y = memo[1] - (ms - 1) * memo[3];
        api.start({ scale, rotateZ, x, y });
        return memo;
      },
      onWheel: ({ first, memo, direction: [, direction] }) => {
        if (!ref.current) return;

        if (first) {
          return {
            scale: style.scale.get(),
          };
        }

        const newScale = memo.scale * (1 - 0.1 * direction);
        if (newScale < MIN_SCALE || newScale > MAX_SCALE) return;
        api.start({ scale: newScale });
        return {
          scale: newScale,
        };
      },
    },
    {
      scroll: {
        enabled: false,
        preventDefault: true,
      },
      target: ref,
      drag: {
        pointer: {
          touch: true,
          // This seems to fix the mouse issue for now. Before it was stoping the draging with mouse
          // lock: true,
        },
        // bounds: {
        //   left: -3000,
        //   right: 3000,
        //   top: -3000,
        //   bottom: 3000,
        // },
        from: () => [style.x.get(), style.y.get()],
      },
      pinch: {
        pinchOnWheel: true,
        pointer: {
          touch: true,
        },
        preventDefault: true,
        angleBounds: { min: 0, max: 0 },
        scaleBounds: { min: MIN_SCALE, max: MAX_SCALE },
        rubberband: true,
      },
    }
  );

  useEffect(() => {
    api.start({ scale: 4 });
  }, []);

  useEffect(() => {
    // TODO: this breaks help modal scrolling
    const handler = (e: Event) => e.preventDefault();
    document.addEventListener('gesturestart', handler);
    document.addEventListener('gesturechange', handler);
    document.addEventListener('gestureend', handler);
    return () => {
      document.removeEventListener('gesturestart', handler);
      document.removeEventListener('gesturechange', handler);
      document.removeEventListener('gestureend', handler);
    };
  }, []);

  return [style, ref, scrollTo] as const;
}
