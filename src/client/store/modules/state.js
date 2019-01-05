import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { applyPenders } from '../../lib/common';

const SET_USER = 'state/SET_USER';
const SET_ROOMS = 'state/SET_ROOMS';
const CREATE_ROOM = 'state/CREATE_ROOM';
const SET_ACTIVE_ROOM_ID = 'state/SET_ACTIVE_ROOM_ID';
const UPDATE_ACTIVE_ROOM = 'state/UPDATE_ACTIVE_ROOM';

export const set_user = createAction(SET_USER);
export const set_rooms = createAction(SET_ROOMS);
export const create_room = createAction(CREATE_ROOM);
export const set_active_room_id = createAction(SET_ACTIVE_ROOM_ID);
export const update_active_room = createAction(UPDATE_ACTIVE_ROOM);

const initialState = {
  user: {},
  rooms: [],
  activeRoomId: '',
  activeRoom: {},
  roomFixed: false
};

const reducer = handleActions(
  {
    [SET_USER]: (state, { payload }) => {
      return produce(state, draft => {
        draft.user = payload;
      });
    },
    [SET_ROOMS]: (state, { payload }) => {
      return produce(state, draft => {
        draft.rooms = payload;
      });
    },
    [CREATE_ROOM]: (state, { payload }) => {
      return produce(state, draft => {
        draft.rooms = [...draft.rooms, payload];
        draft.activeRoomId = payload.id;
        draft.activeRoom = payload;
      });
    },
    [SET_ACTIVE_ROOM_ID]: (state, { payload }) => {
      return produce(state, draft => {
        draft.activeRoomId = payload;
        if (payload !== null)
          draft.activeRoom = draft.rooms.find(item => item.id === payload);
        else draft.activeRoom = {};
      });
    },
    [UPDATE_ACTIVE_ROOM]: (state, { payload }) => {
      return produce(state, draft => {
        if (draft.activeRoomId) {
          const result = draft.rooms.findIndex(
            item => item.id === draft.activeRoomId
          );
          if (result !== -1) {
            const { title, users, message, messages } = payload;
            if (title) draft.rooms[result].title = title;
            if (users) draft.rooms[result].users = users;

            if (message) {
              message.at = new Date(message.at * 1000);
              draft.rooms[result].messages = [
                ...draft.rooms[result].messages,
                message
              ];
            }
            // if (messages) {
            //   const currentLastMessage = draft.rooms[result].messages[
            //     draft.rooms[result].messages.length - 1
            //   ] || { id: -1 };
            //   draft.rooms[result].messages = [
            //     ...draft.rooms[result].messages,
            //     messages.filter(message => message.id > currentLastMessage.id)
            //   ];
            // }
          }
          draft.activeRoom = draft.rooms.find(
            item => item.id === draft.activeRoomId
          );
        }
      });
    }
  },
  initialState
);

export default applyPenders(reducer, [{}]);
