import { Google } from "arctic";
// import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "$env/static/private";
// import * as utils from "$lib/utils";
// const envFile = nodeExecArg('env-file') || "$lib/server/.env";
// const env : Map<string,string> = envFileMap(envfile);
// const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID');
// const GOOGLE_CLIENT_SECRET = env.get('GOOGLE_CLIENT_SECRET');
import { env, loadEnvFile } from "node:process";
import { projectlib } from "$lib/constants";

loadEnvFile(`${projectlib}/server/.env`);

export const google = new Google(env.GOOGLE_CLIENT_ID ?? '', env.GOOGLE_CLIENT_SECRET ?? '', "https://www1.pcpllc.us/auth/login/google/callback");