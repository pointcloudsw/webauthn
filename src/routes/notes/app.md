## Building and running

# Validate types with SvelteKit
```bash
npx sv check
```

### Enable listening on low ports (i.e., 80 and 443) by non-root users
#### Initial (default baseline iptables cfg):
```bash
pcs@est:~/sw/tdapp/webauthn$ sudo iptables -S
-P INPUT ACCEPT
-P FORWARD ACCEPT
-P OUTPUT ACCEPT
```

#### Append port forwarding rule config to nat table:
```bash
pcs@est:~/sw/tdapp/webauthn$ sudo iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-ports 8443
```
#### Append port forwarding rule config to nat table:
```bash
pcs@est:~/sw/tdapp/webauthn$ sudo iptables -t nat -D PREROUTING -p tcp --dport 443 -j REDIRECT --to-ports 8443
pcs@est:~/sw/tdapp/webauthn$ sudo iptables -S  -t nat
```

### wst db
```bash
mysqlsh -u dbuser -D dbschema -h fqdn.net -p
```
### webauthn
```bash
pcs@est:~/sw/tdapp/webauthn$ sudo rm -rf node_modules/ .svelte-kit/output
pcs@est:~/sw/tdapp/webauthn$ npm ci
pcs@est:~/sw/tdapp/webauthn$ npx vite dev
pcs@est:~/sw/tdapp/webauthn$ npx vite build -m production
pcs@est:~/sw/tdapp/webauthn$ sudo node /home/pcs/sw/tdapp/webauthn/node_modules/.bin/vite -m production --cors --host www1.pcpllc.us --port 443 -l info -d
```

### app
#### Build
```bash
pcs@est:~/sw/tdapp/app$ rm -rf dist; npx tsc --build --clean
pcs@est:~/sw/tdapp/app$ npx tsc --build
```
#### Run
```bash
pcs@est:~/sw/tdapp/app/dist/app/examples$ npx tsx --env-file=../../../.env ./app.js
```

### backend
#### Build
```bash
pcs@est:~/sw/tdapp/backend$ go build -v -x -a -o hanko main.go
```
#### Run
```bash
pcs@est:~/sw/tdapp/backend$ ./hanko serve all --config=config/config.yaml --env=.env.yaml
```

### frontend
#### Build
```bash
pcs@est:~/sw/tdapp/frontend$ npx vite build
```

#### Run
```bash
pcs@est:~/sw/tdapp/frontend$ sudo node --env-file=.env ./server.js
```


# Public Key Credential Options in Typescript (for /src/routes/auth/2fa/passkey/+page.svelte)
Typescript types and interfaces for the publicKey methods can be found in: ~/.vscode-server/cli/servers/Stable-7d842fb85a0275a4a8e4d7e040d2625abbf7f084/server/extensions/node_modules/typescript/lib/lib.dom.d.ts

Relevant declarations include:
```ts [node_modules/typescript/lib/lib.dom.d.ts]

type BufferSource = ArrayBufferView<ArrayBuffer> | ArrayBuffer;
type PublicKeyCredentialType = "public-key";
type UserVerificationRequirement = "discouraged" | "preferred" | "required";

interface PublicKeyCredentialDescriptor {
    id: BufferSource;
    transports?: AuthenticatorTransport[];
    type: PublicKeyCredentialType;
}

interface PublicKeyCredentialRequestOptions {
    allowCredentials?: PublicKeyCredentialDescriptor[];
    challenge: BufferSource;
    extensions?: AuthenticationExtensionsClientInputs;
    rpId?: string;
    timeout?: number;
    userVerification?: UserVerificationRequirement;
}

interface CredentialRequestOptions {
    mediation?: CredentialMediationRequirement;
    publicKey?: PublicKeyCredentialRequestOptions;
    signal?: AbortSignal;
}
```