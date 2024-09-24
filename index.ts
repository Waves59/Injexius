const INJECTABLE_KEY = Symbol('injectable')
const INJECT_KEY = Symbol('inject')

// Container for dependency injection
class Container {
  private instances: Map<string,any>
  private singletons: Map<string,any>

  constructor() {
      this.instances = new Map()
      this.singletons = new Map()
  }

  registerSingleton<T>(name: string, resolver: () => T): void {
      // If singleton already created, do nothing
      if (!this.instances.has(name)) {
          // Register resolver if it's the first time
          this.instances.set(name, () => {
              console.log(`Creating singleton for ${name}`);
              const instance = this.singletons.get(name) ?? resolver();
              this.singletons.set(name, instance);
              return instance;
          });
      } else {
          console.log(`${name} is already registered as a singleton.`);
      }
  }

  register<T>(name: string | symbol, resolver: () => T): void {
      this.instances.set(name as string, resolver)
  }

  resolve<T>(name: string | symbol) {
      const resolver = this.instances.get(name as string)
      if(!resolver){
          throw new Error("Cannot found instance")
      }

      return resolver()
  }

  injectDependencies(target: any): void {
    const injections = target.constructor.__injections || [];
    injections.forEach((injection: any) => {
      target[injection.propertyKey] = this.resolve(injection.name);
    });
  }
}

// Decorator for class
function Injectable(): ClassDecorator {
  return (target: any) => {
    target[INJECTABLE_KEY] = true;
  };
}

// Decorator for property
function Inject(name: symbol): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    const constructor = target.constructor as any;
    if (!constructor[INJECT_KEY]) {
      constructor[INJECT_KEY] = [];
    }
    constructor[INJECT_KEY].push({ propertyKey, name });
  };
}

export { Container, Inject, Injectable }



