import { App } from './index';

export default class {

    static db_all(evt, query) {
        var params, callback;
        switch(arguments.length) {
        case 3:
            callback = arguments[2];
            break;
        case 4:
            params = arguments[2];
            callback = arguments[3];
            break;
        }

        if(params) {
            App.database.connection.all(query, params, callback);
        } else {
            App.database.connection.all(query, callback);
        }
    }

    static toggle_fullscreen(evt) {
        App.web_contents_window(evt.sender).toggle_fullscreen();
    }

    static toggle_devtools(evt) {
        App.web_contents_window(evt.sender).toggle_dev_tools();
    }

}