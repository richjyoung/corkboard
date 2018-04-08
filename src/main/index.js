import { logwrap, setlevel } from './logwrap';
const logger = logwrap('index');
setlevel('debug');
logger.info('Starting application at %s', new Date().toLocaleString());

import { App } from './app';
import { RPC } from './rpc_server';
import methods from './rpc_methods';

let app = new App();
let rpc = new RPC(methods);

export { app as App, rpc as RPC };

logger.info('Started');