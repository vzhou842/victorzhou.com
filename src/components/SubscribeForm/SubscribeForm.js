// @flow
import React from 'react';
import styles from './SubscribeForm.module.scss';

type Props = {|
  +signupSource: string,
  +isML: bool,
  +isWeb: bool,
  +large: bool,
  +noDescription: bool,
  +noSpacing: bool,
  +onKeyDown: Function,
|};

type State = {|
  +checked: {|
    +ml: bool,
    +web: bool,
  |},
|};

export default class SubscribeForm extends React.PureComponent<Props, State> {
  state = { checked: { ml: false, web: false } };

  onCheckboxChange(id: 'ml' | 'web') {
    this.setState({ checked: { [id]: !this.state.checked[id] } });
  }

  render() {
    const { signupSource, isML, isWeb, large, noDescription, noSpacing, onKeyDown } = this.props;
    const { checked } = this.state;

    return (
      <div
        className={`${styles['container']} ${large ? styles['large'] : ''} ${
          noSpacing ? styles['no-spacing'] : ''
        }`}
      >
        {!noDescription && (
          <p className={styles['description']}>
            I write about ML, Web Dev, and more. <b>Subscribe to get new posts by email!</b>
          </p>
        )}
        <form
          action="https://sendy.victorzhou.com/subscribe"
          method="post"
          acceptCharset="utf-8"
          target="_blank"
        >
          <input type="hidden" name="Source" value={signupSource} />
          <input type="hidden" name="list" value="CWC7638hEb6mfk1RqUbJ763snA" />
          <input
            type="text"
            name="hp"
            style={{ display: 'none' }}
            tabIndex="-1"
            autoCapitalize="off"
            autoCorrect="off"
          />
          <input
            type="email"
            autoCapitalize="off"
            autoCorrect="off"
            name="email"
            size="25"
            placeholder="example@domain.com"
            aria-label="Email Address"
            onKeyDown={onKeyDown}
          />
          <br />
          {isML && (
            <label>
              <input
                type="checkbox"
                name="Restrictions"
                value="ML"
                checked={checked.ml}
                onChange={this.onCheckboxChange.bind(this, 'ml')}
              />
              Send me <i>only</i> ML posts
            </label>
          )}
          {isWeb && (
            <label>
              <input
                type="checkbox"
                name="Restrictions"
                value="Web"
                checked={checked.web}
                onChange={this.onCheckboxChange.bind(this, 'web')}
              />
              Send me <i>only</i> Web Dev posts
            </label>
          )}
          {(isML || isWeb) && <br />}
          <input type="submit" value="SUBMIT" />
        </form>
      </div>
    );
  }
}
