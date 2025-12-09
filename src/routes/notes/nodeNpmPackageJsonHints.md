
## Achieving observability in npm cli-based CI/CD pipelines
### Introduction
 To simplify package build scripts defined in package.json, take a Makefile type of approach that combines, consolidates and rolls-up discrete scripts and functions into higher-level scripts that will call and manage execution of the subfunctions.

### Baseline
```sh
pcs@est:~/$ rm -rf node_modules/ .svelte-kit/output && npm ci && npx sv check && npx vite build -m production && npx vite -m production --cors --host www1.pcpllc.us --port 8443 -l info; 
```

### Simplifying `npm` / `package.json` based builds
 It may sometimes be helpful to abort a build when fatal errors are encountered within an executing subscript.  This requires observability into the outcome of each subscript in the end-to-end chain of execution.  The managing script needs to be able to determine the outcome of each individual subscript in the pipeline of scripts that its executing so it can decide to proceed to the next stage or abort the build in progress.

 MacOS, Powershell, Linux, and Unix provide the needed observability through a shell variable, namely `$?`.  On these platforms, `$?` holds the value of the result code returned by the program that executed immediately prior to accessing `$?`.
 
 # TODO:  Windows Powershell examples!

 ### Linux Examples:
 ```sh
~/$ /bin/ls
# listing of files in cwd
~/$ echo $?
# 0
~/$ /bin/ls nosuchfile
# /bin/ls: cannot access 'nosuchfile': No such file or directory
~/$ echo $?
# 2     ### varies by OS, but always non-zero
~/$ npm exec -c "node -e 'throw 1'"
~/$ echo $?
# 1     ### uncaught execption, code 1, returns 1
~/$ npm exec -c "node -e 'throw 0'"
~/$ echo $?
# 1     ### uncaught execption, code 0, returns 1
~/$ npm exec -c "node -e '1'"
~/$ echo $?
# 0     ### '1' is a string constant, no issues
~/$ npm exec -c "node -e '0'"
~/$ echo $?
# 0     ### '0' is a string constant, no issues
```

Using `$?` at select points within our `npm` / `package.json` run pipelines will prevent us from spending valuable time and resources on build stages whose predecessors failed.

### Stay tuned
Next time we look at how to implement this approach from witin our npm cli-based CI/CD pipelines.  Until then, happy coding!

### Targeted dependency management with NPM 11/24/25
#### Question
> How can I use package.json with npm to fulfill a file inside of a package with a local instance of that same file while allowing all the other files of the package to be fulfilled from the standard npm registry?

You can achieve this using npm's **package resolutions** or **file overrides**. Here are the main approaches:

## 1. Using `npm link` (Development/Local Testing)

This is the most common approach for local development:

```bash
# In your local package directory
npm link

# In your project directory
npm link package-name
```

However, this replaces the entire package, not just one file.

## 2. Using `overrides` in package.json (npm 8.3.0+)

The `overrides` field doesn't support file-level granularity - it works at the package level. But you can combine it with other strategies.

## 3. Using Patch Packages (Recommended Solution)

The **`patch-package`** tool is the best solution for your use case. It allows you to modify specific files within a dependency:

```bash
npm install patch-package --save-dev
```

**Steps:**
1. Install your package normally: `npm install package-name`
2. Modify the specific file you want in `node_modules/package-name/path/to/file.js`
3. Run: `npx patch-package package-name`
4. This creates a `patches/` directory with your changes
5. Add to package.json:

```json
{
  "scripts": {
    "postinstall": "patch-package"
  }
}
```

Now every time someone runs `npm install`, your file override is automatically applied.

## 4. Module Aliasing with Bundlers

If you're using webpack, you can alias specific files:

```js
// webpack.config.js
module.exports = {
  resolve: {
    alias: {
      'package-name/path/to/file': path.resolve(__dirname, 'local/override/file.js')
    }
  }
};
```

**patch-package** is generally the cleanest solution because it preserves your override across installs and works with the standard npm workflow.
