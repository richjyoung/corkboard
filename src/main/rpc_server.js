import { ipcMain } from 'electron';
import { logwrap } from './logwrap';
const logger = logwrap('RPC');

export class RPC {

    constructor(clazz) {
        this._methods = {};
        this.reflect_target_class(clazz);
        logger.verbose('Server setup complete');
    }

    reflect_target_class(clazz) {
        Reflect.ownKeys(clazz).forEach((method) => {
            if(['length', 'prototype'].indexOf(method) < 0) {
                this._methods[method] = clazz[method];
                this.attach_rpc_endpoint(method);
            }
        });
    }

    ipc_result(method, evt, id, args) {
        logger.debug('Result: method=%s,id=%d,args=%j', method, id, args);
        evt.sender.send(`rpc_${method}_r`, { id, args });
    }

    ipc_error(method, evt, id, err) {
        logger.debug('Error: method=%s,id=%d,args=%j', method, id, err);
        evt.sender.send(`rpc_${method}_e`, { id, err });
    }

    ipc_handler(method, evt, args) {
        logger.debug('Transaction: method=%s,id=%d,args=%j', method, args.id, args.args);
        
        var handler = this._methods[method];

        // Invoke target method, capturing callback as necessary
        var ret = handler(evt, ...(args.args || []), (err, ...results) => {
            logger.debug('%s returned via callback', method);

            if(err) {
                this.ipc_error(method, evt, args.id, err);
            } else {
                this.ipc_result(method, evt, args.id, results);
            }
        });

        // Handle return value
        if(ret instanceof Promise) {
            logger.debug('%s returned via Promise', method);

            ret.then(() => {
                this.ipc_result(method, evt, args.id, arguments);
            }).catch(() => {
                this.ipc_error(method, evt, args.id, arguments);
            });
        } else if(ret !== undefined) {
            logger.debug('%s returned directly', method);

            this.ipc_result(method, evt, args.id, ret);
        }
    }

    attach_rpc_endpoint(method) {
        logger.debug('Attaching RPC endpoint for method %s', method);

        ipcMain.on(`rpc_${method}`, (evt, args) => {
            this.ipc_handler(method, evt, args);
        });
    }

}