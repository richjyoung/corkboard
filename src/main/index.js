import { logwrap, setlevel } from './logwrap';
const logger = logwrap('index');
setlevel('debug');

let app = new App();
logger.info('Started');

import { App } from './app';
export { app as App };