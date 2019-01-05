import React, { Component } from 'react';
import { connect } from 'react-redux';
import Prompt from './Prompt';
import Lobby from './Lobby';
import Room from './Room';

class App extends Component {
  render() {
    const { state, socket } = this.props;

    if (!state.user.nickname) {
      return <Prompt login={socket.login} />;
    } else if (!state.activeRoomId) {
      return (
        <Lobby
          user={state.user}
          rooms={state.rooms}
          enterLobby={socket.enterLobby}
          leaveLobby={socket.leaveLobby}
          createRoom={socket.createRoom}
          enterRoomById={id => socket.enterRoom({ id })}
        />
      );
    } else {
      return (
        <Room
          user={state.user}
          roomId={state.activeRoomId}
          room={state.activeRoom}
          leave={socket.leaveRoom}
          message={socket.messageToRoom}
        />
      );
    }
  }
}

export default connect(({ state }) => {
  return {
    state
  };
})(App);
