import { argv } from 'node:process';
import { rmSync } from 'node:fs';
import { spawn } from 'node:child_process';


type MethodMap = {
  [key: string]: (...args: any[]) => void | Promise<void>;
};

// Define your predefined methods
class CommandHandler {
  
    clean(pathArr: string[]): void {
        pathArr.forEach( p => rmSync(p, { force: true, recursive: true }));
    }

    node_exec(cmdstr: string[]): void {
        let [ cmd, ...args ] = cmdstr;
        spawn(cmd, args, { stdio: 'inherit' });
    }

    node_exec_detached(cmdstr: string[]): void {
        let [ cmd, ...args ] = cmdstr;
        spawn(cmd, args, { stdio: 'inherit', detached: true });
    }
}

// Create the method pointer registry
class MethodPointer {
  private methods: MethodMap = {};
  private handler: CommandHandler;

  constructor(handler: CommandHandler) {
    this.handler = handler;
    // Register all methods from the handler
    this.registerMethod('clean', handler.clean.bind(handler));
    this.registerMethod('node_exec', handler.node_exec.bind(handler));
    this.registerMethod('node_exec_detached', handler.node_exec_detached.bind(handler));
  }

  // Register a method with a name
  registerMethod(name: string, method: (...args: any[]) => void | Promise<void>): void {
    this.methods[name] = method;
  }

  // Call a method by name with arguments
  async call(methodName: string, ...args: any[]): Promise<void> {
    const method = this.methods[methodName];
    if (!method) {
      throw new Error(`Method '${methodName}' not found`);
    }
    await method(...args);
  }

  // Check if a method exists
  hasMethod(methodName: string): boolean {
    return methodName in this.methods;
  }

  // List all available methods
  listMethods(): string[] {
    return Object.keys(this.methods);
  }
}

// Parse command line arguments and execute
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node script.js <methodName> [args...]');
    console.log('\nAvailable methods:');
    const pointer = new MethodPointer(new CommandHandler());
    pointer.listMethods().forEach(method => console.log(`  - ${method}`));
    process.exit(1);
  }

  const methodName = args[0];
  const methodArgs = args.slice(1);

  const handler = new CommandHandler();
  const pointer = new MethodPointer(handler);

  try {
    if (!pointer.hasMethod(methodName)) {
      throw new Error(`Unknown method: ${methodName}`);
    }

    // Special handling for methods that expect specific types
    // if (methodName === 'processItems') {
    //   // Pass all remaining args as an array
    //   await pointer.call(methodName, methodArgs);
    // } else if (methodName === 'add') {
    //   // Convert strings to numbers
    //   const nums = methodArgs.map(arg => parseFloat(arg));
    //   await pointer.call(methodName, ...nums);
    // } else {
      // Pass args as-is
      await pointer.call(methodName, methodArgs);
    // }
  } catch (error) {
    console.error('Error:', (error as Error).message);
    process.exit(1);
  }
}

// Run if executed directly
// if (require.main === module) {
  main();
// }

// Export for use in other modules
export { CommandHandler, MethodPointer };