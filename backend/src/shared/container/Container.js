/**
 * Dependency Injection Container for Clean Architecture
 * Manages all dependencies and their lifecycle
 */
export class Container {
  constructor() {
    this.dependencies = new Map()
    this.singletons = new Map()
  }

  /**
   * Register a dependency
   */
  register(name, factory, options = {}) {
    this.dependencies.set(name, {
      factory,
      singleton: options.singleton || false,
      dependencies: options.dependencies || []
    })
  }

  /**
   * Register a singleton dependency
   */
  registerSingleton(name, factory, dependencies = []) {
    this.register(name, factory, { singleton: true, dependencies })
  }

  /**
   * Resolve a dependency
   */
  resolve(name) {
    const dependency = this.dependencies.get(name)
    
    if (!dependency) {
      throw new Error(`Dependency '${name}' not found`)
    }

    // Return singleton instance if exists
    if (dependency.singleton && this.singletons.has(name)) {
      return this.singletons.get(name)
    }

    // Resolve dependencies
    const resolvedDependencies = dependency.dependencies.map(dep => this.resolve(dep))
    
    // Create instance
    const instance = dependency.factory(...resolvedDependencies)

    // Store singleton
    if (dependency.singleton) {
      this.singletons.set(name, instance)
    }

    return instance
  }

  /**
   * Check if dependency exists
   */
  has(name) {
    return this.dependencies.has(name)
  }

  /**
   * Clear all dependencies (useful for testing)
   */
  clear() {
    this.dependencies.clear()
    this.singletons.clear()
  }
}