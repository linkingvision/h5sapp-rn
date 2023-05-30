import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    Text,
    Image,
} from 'react-native';

import CheckButton from 'react-native-check-box';
import Icon from 'react-native-vector-icons/iconfont';
// const ICON_CHECKED = require('./../../image/icon_checkedbox.png');
// const ICON_UNCHECKED = require('./../../image/icon_uncheckedbox.png');
export default class CheckBox extends Component {
  constructor(props) {
      super(props);
  }

  onClick(data) {
      data.checked = !data.checked;
      this.props.onClick(data);
  }

  renderRightText(data) {
      return (<Text style={styles.rightText}>{data.text}</Text>);
  }

  render() {
      let data = this.props.data;
      return (
          <CheckButton
              style={{ padding: 8 }}
              onClick={() => this.onClick(data)}
              isChecked={data.checked}
              rightTextView={this.renderRightText(data)}
              checkedImage={ <Icon name={'收藏夹'} size={12}/>}
              unCheckedImage={<Icon name={'星'}  size={12}/>}
          />);
  }
}