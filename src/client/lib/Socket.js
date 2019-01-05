import io from 'socket.io-client';
import { StateActions } from '../store/actionCreators';

class Socket {
  constructor() {
    this.io = null;
  }

  login = ({ nickname, avatarUrl }) => {
    return new Promise((resolve, reject) => {
      this.io = io(window.location.origin, {
        query: { nickname, avatarUrl }
      });

      // wait logined event
      this.io.once('logined', userData => {
        StateActions.set_user(userData);
        resolve(userData);
      });
    });
  };

  enterLobby = () => {
    return new Promise((resolve, reject) => {
      this.io.emit('enterLobby');

      this.io.on('rooms', roomsData => {
        StateActions.set_rooms(roomsData);
        resolve(roomsData);
      });
    });
  };

  leaveLobby = () => {
    return new Promise((resolve, reject) => {
      this.io.emit('leaveLobby');
      this.io.off('rooms');
      resolve();
    });
  };

  createRoom = ({ title }) => {
    return new Promise((resolve, reject) => {
      this.io.emit('createRoom', { title });

      this.io.once('room', roomData => {
        StateActions.create_room(roomData);
        resolve(roomData);
        this.io.on('room', roomData => {
          StateActions.update_active_room(roomData);
        });
      });
    });
  };

  enterRoom = ({ id }) => {
    return new Promise((resolve, reject) => {
      this.io.emit('enterRoom', { id });

      this.io.once('room', roomData => {
        StateActions.set_active_room_id(id);
        StateActions.update_active_room(roomData);

        resolve(roomData);

        this.io.on('room', roomData => {
          StateActions.update_active_room(roomData);
        });
      });
    });
  };

  leaveRoom = () => {
    return new Promise((resolve, reject) => {
      this.io.emit('leaveRoom');
      this.io.off('room');
      StateActions.set_active_room_id(null);
      resolve();
    });
  };

  messageToRoom = ({ activeRoomId, content }) => {
    return new Promise((resolve, reject) => {
      this.io.emit('message', { id: activeRoomId, content });
      resolve();
    });
  };
}

export default Socket;
