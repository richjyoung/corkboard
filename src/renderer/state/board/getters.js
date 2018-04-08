export default {

    boards: function(state) {
        var boards = state.items.map((item) => {
            return item.board || 'default';
        }).filter((el, i, a) => {
            return i === a.indexOf(el);
        });
        if(boards.indexOf('default') < 0) {
            boards.push('default');
        }
        return boards;
    },

    board_items: function(state) {
        return function(board) {
            return state.items.filter((item) => {
                if(!item.board) {
                    return 'default' === board;
                } else {
                    return item.board === board;
                }
            });
        };
    },

    board_item_by_index: function(state) {
        return function(index) {
            return state.items[index];
        };
    },

    item_index_from_id: function(state) {
        return function(id) {
            return state.items.findIndex((item) => {
                return item.id === id;
            });
        };
    },

    item_max_field: function(state) {
        return function(field) {
            var arr =state.items.map((item) => {
                return item[field];
            });
            if(arr.length == 0) {
                return null;
            } else {
                return Math.max(...arr);
            }
        };
    },

    board_action_group: function(state) {
        return state.action_group;
    },

    board_move_delta: function(state) {
        return {
            dx: state.items[state.move_action.id].x - state.move_action.x,
            dy: state.items[state.move_action.id].y - state.move_action.y
        };
    }
};