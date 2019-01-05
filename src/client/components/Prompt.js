import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Form, Button, Input, Image, Icon } from 'semantic-ui-react';

class Prompt extends Component {
  state = {
    loading: false,
    avatarUrl: '',
    nickname: ''
  };

  setAvatarUrl = avatarUrl => {
    if (this.state.loading) return;
    this.setState(state => ({ ...state, avatarUrl }));
    this.nicknameInputRef.focus();
  };

  setNickname = nickname => {
    if (this.state.loading) return;
    this.setState(state => ({ ...state, nickname }));
  };

  submit = e => {
    e.preventDefault();

    const { avatarUrl, nickname, loading } = this.state;
    if (loading || !nickname.trim() || !avatarUrl.trim()) return;

    this.setState(state => ({ ...state, loading: true }));

    this.props.login({ nickname, avatarUrl });
  };

  componentDidMount() {
    this.setState(state => ({
      ...state,
      nickname:
        'Guest' +
        parseInt(new Date().getTime())
          .toString()
          .substr(-4)
    }));
    this.setState({ avatarUrl: this.props.avatarUrls[0] });
    this.nicknameInputRef.focus();
  }

  render() {
    const { avatarUrls } = this.props;

    return (
      <Card fluid raised>
        <Card.Content>
          <Card.Header textAlign="center">
            <h2>
              <Icon name="comments" />
              Welcome!!
            </h2>
          </Card.Header>
          <Card.Description>
            <div className="flex-vert">
              <Form loading={this.state.loading} className="flex-top">
                <Form.Field>
                  <ul className="avatar-selector">
                    {avatarUrls.map((avatarUrl, key) => (
                      <li
                        key={key}
                        className={
                          this.state.avatarUrl == avatarUrl ? 'active' : null
                        }
                      >
                        <Image
                          src={avatarUrl}
                          onClick={() => this.setAvatarUrl(avatarUrl)}
                        />
                      </li>
                    ))}
                  </ul>
                </Form.Field>
                <Form.Field>
                  <Input
                    ref={ref => (this.nicknameInputRef = ref)}
                    type="text"
                    placeholder="Enter your nickname."
                    value={this.state.nickname}
                    onChange={e => this.setNickname(e.target.value)}
                  />
                </Form.Field>
                <Button fluid color="black" size="large" onClick={this.submit}>
                  Enter
                </Button>
              </Form>
            </div>
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}

export default connect(({ data }) => {
  const { avatarUrls } = data;

  return {
    avatarUrls
  };
})(Prompt);
