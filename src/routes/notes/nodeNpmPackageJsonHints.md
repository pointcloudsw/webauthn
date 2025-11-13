
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