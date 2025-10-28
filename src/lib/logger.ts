
export const logger = (s = '') => {
    const err = new Error();
    const stack = err.stack?.split("\n")[2] || "";
    let match = stack.match(/at (.+):(\d+):\d+/);
    let [ lhs, rhs ] = match ? match[1].split(' ') : [ '', ''];
    let ln = match ? parseInt(match[2], 10).toString() : '';
    rhs = rhs && rhs?.indexOf('(') === 0 ? rhs.substring(1) : rhs;
    const out = {
        time: Date.now(),
        location: match ? `${rhs}(${lhs}):${ln}` : `unknown file`,
        message: s,
    };
    console.log(out);
    return out;
};