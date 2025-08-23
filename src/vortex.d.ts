declare module 'vortexjs' {
  interface AnimationOptions {
    targets: HTMLElement | HTMLElement[] | string;
    properties: Record<string, any>;
    duration?: number;
    easing?: string;
    chain?: AnimationOptions[];
  }

  export class VortexEngine {
    constructor(options: AnimationOptions);
    play(): void;
    pause(): void;
    chain(nextOptions: AnimationOptions): VortexEngine;
  }

  export const physics: PhysicsEngine;
  export const particles: ParticleSystem;
  export const scrollCarousel: ScrollCarousel;

  export default {
    animate(options: AnimationOptions): VortexEngine,
    physics,
    particles,
    scrollCarousel
  };
}