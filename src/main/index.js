import { logwrap, setlevel } from './logwrap';
const logger = logwrap('index');
setlevel('debug');
logger.info('Starting application at %s', new Date().toLocaleString());

import { App } from './app';
import register_ipc from './ipc';
import { RPC } from '../common/rpc_server';
import methods from './rpc_methods';

let app = new App();
register_ipc();
let rpc = new RPC(methods); //eslint-disable-line no-unused-vars

export { app as App };

logger.info('Started');