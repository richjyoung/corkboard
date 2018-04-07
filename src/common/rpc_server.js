import { ipcMain } from 'electron';
import { logwrap } from './logwrap';
const logger = logwrap('RPC');

export class RPC {

    constructor(clazz) {
        Reflect.ownKeys(clazz).forEach((method) => {
            if(['length', 'prototype'].indexOf(method) >= 0) {
                return;
            }
            logger.debug('Attaching RPC endpoint for method %s', method);

            var rpc_signature = `rpc_${method}`;
            var rpc_callback = `rpc_${method}_r`;
            var rpc_error = `rpc_${method}_e`;

            ipcMain.on(rpc_signature, (evt, args) => {
                logger.debug('Transaction: method=%s,id=%d', method, args.id);

                var ret = clazz[method](evt, ...(args.args || []), (err, ...results) => {
                    logger.debug('%s returned via callback');
                    if(err) {
                        evt.sender.send(rpc_error, {
                            id: args.id,
                            err: err
                        });
                    } else {
                        evt.sender.send(rpc_callback, {
                            id: args.id,
                            args: results
                        });
                    }
                });
                if(ret instanceof Promise) {
                    logger.debug('%s returned via Promise', method);
                    ret.then(() => {
                        evt.sender.send(rpc_callback, {
                            id: args.id,
                            args: arguments
                        });
                    }).catch(() => {
                        evt.sender.send(rpc_error, {
                            id: args.id,
                            err: arguments
                        });
                    });
                } else if(ret !== undefined) {
                    logger.debug('%s returned directly', method);
                    evt.sender.send(rpc_callback, {
                        id: args.id,
                        args: ret
                    });
                }
            });
        });
    }

}