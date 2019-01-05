import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { applyPenders } from '../../lib/common';

const initialState = {
  avatarUrls: [
    'http://icons.iconarchive.com/icons/hopstarter/superhero-avatar/128/Avengers-Thor-icon.png',
    'http://icons.iconarchive.com/icons/hopstarter/superhero-avatar/128/Avengers-Hulk-icon.png',
    'http://icons.iconarchive.com/icons/hopstarter/superhero-avatar/128/Avengers-Iron-Man-icon.png',
    'http://icons.iconarchive.com/icons/hopstarter/superhero-avatar/128/Avengers-Black-Widow-icon.png',
    'http://icons.iconarchive.com/icons/hopstarter/superhero-avatar/128/Avengers-Captain-America-icon.png',
    'http://icons.iconarchive.com/icons/hopstarter/superhero-avatar/128/Avengers-Nick-Fury-icon.png'
  ]
};

const reducer = handleActions({}, initialState);

export default applyPenders(reducer, [{}]);
