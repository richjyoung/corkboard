export default {

    boardActionGroup(state) {
        return state.actionGroup;
    },

    boardItemByIndex(state) {
        return (index) => {
            return state.items[index];
        };
    },

    boardItems(state) {
        return (board) => {
            return state.items.filter((item) => {
                if(!item.board) {
                    return board === 'default';
                }
                return item.board === board;
            });
        };
    },

    boardMoveDelta(state) {
        return {
            dx: state.items[state.moveAction.id].x - state.moveAction.x,
            dy: state.items[state.moveAction.id].y - state.moveAction.y
        };
    },

    boards(state) {
        const boards = state.items.map((item) => {
            return item.board || 'default';
        }).filter((val, index, arr) => {
            return index === arr.indexOf(val);
        });
        if(boards.indexOf('default') < 0) {
            boards.push('default');
        }
        return boards;
    },


    itemIndexFromId(state) {
        return (id) => {
            return state.items.findIndex((item) => {
                return item.id === id;
            });
        };
    },

    itemMaxField(state) {
        return (field) => {
            const arr = state.items.map((item) => {
                return item[field];
            });
            if(arr.length === 0) {
                return null;
            }
            return Math.max(...arr);
        };
    }
};
