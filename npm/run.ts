import { argv } from 'node:process';
import { rmSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';


type MethodMap = {
  [key: string]: (...args: any[]) => void | Promise<void> | {} | Promise<{}>;
};

// Define your predefined methods
class CommandHandler {

    clean(pathArr: string[]): 0 {
        pathArr.forEach( p => rmSync(p, { force: true, recursive: true }));
        return 0;
        
    }

    node_exec(cmdstr: string[]): {} {
        let [ cmd, ...args ] = cmdstr;
        const result = spawnSync(cmd, args, { stdio: ['ignore', 'inherit', 'inherit' ] });
        // console.log(result);
        // return result.status ?? '-1';
        // result.on('error', code => { console.error(code); console.error(result); return code });
        return result;
    }

    node_exec_detach(cmdstr: string[]): number {
        let [ cmd, ...args ] = cmdstr;
        const controller = new AbortController();
        const { signal } = controller;
        const result = spawn(cmd, args, { stdio: ['ignore', 1, 2 ], detached: true, signal });
        // result.on('close', code => { return code });
        return result ?? -1;
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
    this.registerMethod('node_exec_detach', handler.node_exec_detach.bind(handler));
  }

  // Register a method with a name
  registerMethod(name: string, method: (...args: any[]) => void | Promise<void> | {} | Promise<{}>): void {
    this.methods[name] = method;
  }

  // Call a method by name with arguments
  // async call(methodName: string, ...args: any[]): Promise<void> {
  async call(methodName: string, ...args: any[]): Promise<{}> {
    const method = this.methods[methodName];
    if (!method) {
      throw new Error(`Method '${methodName}' not found`);
    }
    const result = await method(...args);

    return result;
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
  let result;

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
      result = await pointer.call(methodName, methodArgs);

    // }
  } catch (error) {
    throw new Error(error);
    console.error(error);
  }
  // console.log(result);
  // process.exitCode = result?.status ?? -1;
  // return process.exitCode;
}

// direct command line backup option in case of emergency:
// ~$ rm -rf node_modules/ .svelte-kit/output && npm ci && npx sv check && npx vite build -m production && npx vite -m production --cors --host www1.pcpllc.us --port 8443 -l info; 


// Run if executed directly
// if (require.main === module) {
  main();
// }

// Export for use in other modules
export { CommandHandler, MethodPointer };