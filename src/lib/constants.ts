type NavRoute = {
    readonly name: string;
    readonly path: string;
};


export const origin = "https://www1.pcpllc.us";
export const base_url = "https://www1.pcpllc.us";

export const projecthome = "/home/pcs/sw/webauthn";

export const projectroot = '';
export const projectsrc = `${projectroot}/src`;

export const projectlib = `${projectsrc}/lib`;
export const projectroutes = `${projectsrc}/routes`;

export const projectauth = `${projectroot}/auth`;


const navRoutes : readonly NavRoute[] = [
    { name: 'Home', path: `${projectroot}/`},
    { name: 'Todo', path: `${projectroot}/todo` },
    { name: 'Lists', path: `${projectroot}/lists` },
    { name: 'Notes', path: `${projectroot}/notes` },
    { name: 'Settings', path: `${projectroot}/settings` },
    { name: 'Login', path: `${projectauth}/login` },
    { name: 'Logout', path: `${projectauth}/logout` }
] as const;

export const navMap: ReadonlyMap<string, NavRoute> = new Map( navRoutes.map( r => [ r.name.toLocaleLowerCase(), r ] ) );

