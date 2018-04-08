import { logwrap, setlevel } from './logwrap';
const logger = logwrap('index');
setlevel('debug');
logger.info('Starting application at %s', new Date().toLocaleString());

import { App } from './app';
import methods from './rpc_methods';
import { RPC } from './rpc_server';

const app = new App();
const rpc = new RPC(methods);

export { app as App, rpc as RPC };

logger.info('Started');
