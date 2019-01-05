import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Icon, Input, Dimmer, Loader, List } from 'semantic-ui-react';

class Lobby extends Component {
  state = { loading: true, creatingRoom: false, roomTitle: '' };

  componentDidMount() {
    this.props.enterLobby().then(rooms => {
      this.setState(state => ({ ...state, loading: false }));
      if (this.props.rooms.length == 0) {
        this.roomTitleInputRef.focus();
      }
    });
  }

  componentWillUnmount() {
    this.props.leaveLobby();
  }

  enterRoom = room => {
    this.props.enterRoomById(room.id);
  };

  createRoom = e => {
    e.preventDefault();

    const title = this.state.roomTitle && this.state.roomTitle.trim();

    if (this.state.creatingRoom || !title)
      return this.roomTitleInputRef.focus();

    this.setState(state => ({ ...state, creatingRoom: true }));
    this.props.createRoom({ title });
  };

  setRoomTitle = roomTitle => {
    this.setState(state => ({ ...state, roomTitle }));
  };

  render() {
    const { rooms } = this.props;
    console.log(rooms);
    return (
      <Card fluid raised>
        <Card.Content>
          <Card.Header textAlign="center">
            <h2>
              <Icon name="comments" />
              Select a room
            </h2>
          </Card.Header>
          <Card.Description>
            <Dimmer.Dimmable className="flex-vert">
              <Dimmer active={this.state.loading && rooms.length == 0} inverted>
                <Loader size="large" />
              </Dimmer>

              <List selection relaxed="very" className="flex-top">
                {rooms.length > 0 ? (
                  rooms.map(room => (
                    <List.Item
                      key={room.id}
                      onClick={() => this.enterRoom(room)}
                    >
                      <List.Icon
                        name="users"
                        size="large"
                        verticalAlign="middle"
                      />
                      <List.Content>
                        <List.Header as="h3" className="elipsis">
                          {room.title}
                        </List.Header>
                        <List.Description>
                          {room.users.length.toLocaleString()} people are
                          chatting
                        </List.Description>
                      </List.Content>
                    </List.Item>
                  ))
                ) : (
                  <List.Item style={{ cursor: 'default', background: 'none' }}>
                    <List.Content>
                      <List.Description>
                        There is no chat room.
                      </List.Description>
                    </List.Content>
                  </List.Item>
                )}
              </List>

              <List.Item className="flex-bottom">
                <form onSubmit={this.createRoom}>
                  <Input
                    fluid
                    ref={ref => (this.roomTitleInputRef = ref)}
                    size="large"
                    action={{
                      content: 'Create',
                      color:
                        !this.state.loading && rooms.length == 0
                          ? 'black'
                          : null
                    }}
                    placeholder="or enter title of chat room to create."
                    value={this.state.roomTitle}
                    onChange={e => this.setRoomTitle(e.target.value)}
                  />
                  <input type="submit" style={{ display: 'none' }} />
                </form>
              </List.Item>
            </Dimmer.Dimmable>
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}

export default connect(({ data, state, pender }) => {
  const loading = pender.pending['user/FETCH_USER'];
  const success = pender.success['user/FETCH_USER'];
  const { dummyRooms } = data;
  const { rooms } = state;

  return {
    dummyRooms,
    rooms
  };
})(Lobby);
