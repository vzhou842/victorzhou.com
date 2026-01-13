declare module 'rehype-react' {
  import { ReactNode, ComponentType, createElement, Fragment } from 'react';

  interface RehypeReactOptions {
    createElement: typeof createElement;
    Fragment?: typeof Fragment;
    components?: Record<string, ComponentType<any>>;
  }

  class RehypeReact {
    constructor(options: RehypeReactOptions);
    Compiler: (ast: unknown) => ReactNode;
  }

  export default RehypeReact;
}
