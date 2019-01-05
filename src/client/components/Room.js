import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Card,
  Header,
  Form,
  Button,
  Input,
  Image,
  Dimmer,
  Loader,
  Feed,
  List
} from 'semantic-ui-react';

class Room extends Component {
  state = { messageContent: '', loading: false, messaging: false };
  lastMessagesCount = 0;

  componentDidMount() {
    this.inputMessageInputRef.focus();
    this.scrollMessagesContainerToBottom();
  }

  componentDidUpdate() {
    const messagesCount = this.props.room ? this.props.room.messages.length : 0;
    if (this.lastMessagesCount < messagesCount) {
      this.lastMessagesCount = messagesCount;
      this.scrollMessagesContainerToBottom();
    }
  }

  scrollMessagesContainerToBottom = () => {
    // smooth scroll
    if (this.messagesContainerRef.scrollIntoView) {
      const lastMessageRef = this.messagesContainerRef.lastElementChild
        .lastElementChild;
      if (lastMessageRef && lastMessageRef.scrollIntoView) {
        lastMessageRef.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // fallback
    this.messagesContainerRef.scrollTo(
      0,
      this.messagesContainerRef.scrollHeight
    );
  };

  setMessageContent = messageContent => {
    this.setState(state => ({ ...state, messageContent }));
  };

  submit = e => {
    e.preventDefault();
    // TODO: send message to server
    if (this.state.messaging) return;

    const content =
      this.state.messageContent && this.state.messageContent.trim();
    if (!content) return;

    this.setState(state => ({ ...state, messaging: true }));

    const { activeRoomId } = this.props;

    this.props.message({ activeRoomId, content }).then(() => {
      this.setState(state => ({ ...state, messageContent: '' }));
      this.inputMessageInputRef.focus();

      // forbide too much talker
      setTimeout(() => {
        this.setState(state => ({ ...state, messaging: false }));
      }, 250);
    });
  };

  render() {
    const { room } = this.props;
    return (
      <Card fluid raised>
        <Card.Content
          header={
            <Header
              icon="comments"
              style={{ position: 'relative' }}
              content={
                !room ? (
                  '...'
                ) : (
                  <div>
                    <Button
                      style={{ position: 'absolute', right: '0' }}
                      compact
                      size="middle"
                      onClick={this.props.leave}
                    >
                      Leave
                    </Button>
                    <span>{room.title}</span>
                  </div>
                )
              }
            />
          }
          description={
            <Dimmer.Dimmable className="flex-vert">
              <Dimmer active={this.state.loading} inverted>
                <Loader size="large" />
              </Dimmer>

              <div className="flex-top flex-hori">
                <div
                  className="flex-left"
                  ref={ref => (this.messagesContainerRef = ref)}
                >
                  <Feed size="small">
                    {room &&
                      room.messages.map(message => (
                        <Feed.Event key={message.id}>
                          {message.user && (
                            <Feed.Label image={message.user.avatarUrl} />
                          )}
                          <Feed.Content>
                            <Feed.Summary>
                              {message.user ? message.user.nickname : 'System'}
                              {message.at && (
                                <Feed.Date>
                                  {message.at.toLocaleString()}
                                </Feed.Date>
                              )}
                            </Feed.Summary>
                            <Feed.Extra text>{message.content}</Feed.Extra>
                          </Feed.Content>
                        </Feed.Event>
                      ))}
                  </Feed>
                </div>

                <div className="flex-right">
                  <Header size="small">
                    <span>
                      {room ? room.users.length.toLocaleString() : 0} Members
                    </span>
                  </Header>
                  <List>
                    {room &&
                      room.users.map(user => (
                        <List.Item key={user.id}>
                          <div className="elipsis">
                            <Image avatar src={user.avatarUrl} width={20} />
                            <span>{user.nickname}</span>
                          </div>
                        </List.Item>
                      ))}
                  </List>
                </div>
              </div>

              <form onSubmit={this.submit} className="flex-bottom">
                <Input
                  fluid
                  iconPosition="left"
                  icon="comments"
                  action={{ content: 'Send', color: 'black', icon: 'send' }}
                  size="large"
                  ref={ref => (this.inputMessageInputRef = ref)}
                  placeholder="Your message."
                  value={this.state.messageContent}
                  onChange={e => this.setMessageContent(e.target.value)}
                  disabled={this.state.loading}
                />
              </form>
            </Dimmer.Dimmable>
          }
        />
      </Card>
    );
  }
}

export default connect(({ state, pender }) => {
  const loading = pender.pending['user/FETCH_USER'];
  const success = pender.success['user/FETCH_USER'];
  const activeRoomId = state.activeRoomId;

  return { activeRoomId };
})(Room);
