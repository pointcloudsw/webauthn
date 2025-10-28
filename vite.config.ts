import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import fs from 'fs';

const opts = {
	cert: '/etc/letsencrypt/live/www1.pcpllc.us/fullchain.pem',
	key: '/etc/letsencrypt/live/www1.pcpllc.us/privkey.pem'
};

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		allowedHosts: [
			'www1.pcpllc.us'
		],
		https: {
			cert: fs.readFileSync(opts.cert),
			key: fs.readFileSync(opts.key)
		},
		cors: true,
		origin: 'https://www1.pcpllc.us',
	},
	mode: 'production',
});
