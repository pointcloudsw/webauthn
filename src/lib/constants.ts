export const origin = "https://www1.pcpllc.us";
export const base_url = "https://www1.pcpllc.us";
export const home = "/";
export const auth = "auth";
export const projectroot = "/home/pcs/sw/tdapp/webauthn";
export const projectsrc = `${projectroot}/src`;
export const navRoutes = [
    { name: 'Home', path: `/`},
    { name: 'Todo', path: `/todo` },
    { name: 'Lists', path: `/lists` },
    { name: 'Notes', path: `/notes` },
    { name: 'Settings', path: `/settings` },
    { name: 'Login', path: `/${auth}/login` },
    { name: 'Logout', path: `/${auth}/logout` },
]

