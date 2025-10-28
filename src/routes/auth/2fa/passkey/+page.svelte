<script lang="ts">
	import { goto } from "$app/navigation";
	import { encodeBase64 } from "@oslojs/encoding";
	import { createChallenge } from "$lib/client/webauthn";
	

	import type { PageData } from "./$types";

	export let data: PageData;
	let message = "";

	interface PubKeyOptions {
		challenge: BufferSource;
		userVerification: UserVerificationRequirement;
		allowCredentials: PublicKeyCredentialDescriptor[];
	}
	export let pubKeyOpt: PubKeyOptions;
</script>

<h1>Authenticate with passkeys</h1>
<div>
	<button
		on:click={async () => {
			pubKeyOpt.challenge = await createChallenge() as BufferSource;
			pubKeyOpt.userVerification = 'discouraged';
			pubKeyOpt.allowCredentials = data.credentials.map((credential) => { return { id: credential.id, type: 'public-key' }}) as PublicKeyCredentialDescriptor[];
			const credentialOptions : CredentialRequestOptions = {
				publicKey: {
					challenge: pubKeyOpt.challenge,
					userVerification: pubKeyOpt.userVerification,
					allowCredentials: pubKeyOpt.allowCredentials
				}
			};
			const credential = await navigator.credentials.get(credentialOptions);

			if (!(credential instanceof PublicKeyCredential)) {
				throw new Error("Failed to create public key");
			}
			if (!(credential.response instanceof AuthenticatorAssertionResponse)) {
				throw new Error("Unexpected error");
			}

			const response = await fetch("/auth/2fa/passkey", {
				method: "POST",
				body: JSON.stringify({
					credential_id: encodeBase64(new Uint8Array(credential.rawId)),
					signature: encodeBase64(new Uint8Array(credential.response.signature)),
					authenticator_data: encodeBase64(new Uint8Array(credential.response.authenticatorData)),
					client_data_json: encodeBase64(new Uint8Array(credential.response.clientDataJSON))
				})
			});

			if (response.ok) {
				goto("/");
			} else {
				message = await response.text();
			}
		}}>Authenticate</button
	>
	<p>{message}</p>
</div>
<a href="/auth/2fa/reset">Use recovery code</a>

{#if data.user.registeredTOTP}
	<a href="/auth/2fa/totp">Use authenticator apps</a>
{/if}
{#if data.user.registeredSecurityKey}
	<a href="/auth/2fa/security-key">Use security keys</a>
{/if}
