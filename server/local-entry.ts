import {env as localEnv} from './local-env';
export function setLocalEnv(value:any){Object.assign(localEnv,value)}
export {default} from './worker';

