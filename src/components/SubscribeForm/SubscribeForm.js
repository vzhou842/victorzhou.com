// @flow
import React from 'react';
import styles from './SubscribeForm.module.scss';

type Props = {|
  +signupSource: string,
  +isML: boolean,
  +isWeb: boolean,
  +showAllOptions: boolean,
  +large: boolean,
  +noDescription: boolean,
  +noSpacing: boolean,
  +onKeyDown: Function,
|};

type State = {|
  +checked: {|
    +ml: boolean,
    +web: boolean,
  |},
|};

export default class SubscribeForm extends React.PureComponent<Props, State> {
  state = { checked: { ml: false, web: false } };

  onCheckboxClick(id: 'ml' | 'web') {
    this.setState({ checked: { ...{ ml: false, web: false }, [id]: !this.state.checked[id] } });
  }

  render() {
    const {
      signupSource,
      isML,
      isWeb,
      showAllOptions,
      large,
      noDescription,
      noSpacing,
      onKeyDown,
    } = this.props;
    const { checked } = this.state;

    const inputType = showAllOptions ? 'radio' : 'checkbox';

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
            style={noDescription ? { marginTop: 0 } : undefined}
          />
          <br />
          {(isML || showAllOptions) && (
            <label>
              <input
                type={inputType}
                name="Restrictions"
                value={checked.ml ? 'ML' : ''}
                checked={checked.ml}
                onChange={this.onCheckboxClick.bind(this, 'ml')}
                onClick={this.onCheckboxClick.bind(this, 'ml')}
              />
              Send me <i>only</i> ML posts
            </label>
          )}
          {showAllOptions && <br />}
          {(isWeb || showAllOptions) && (
            <label>
              <input
                type={inputType}
                name="Restrictions"
                value={checked.web ? 'Web' : ''}
                checked={checked.web}
                onChange={this.onCheckboxClick.bind(this, 'web')}
                onClick={this.onCheckboxClick.bind(this, 'web')}
              />
              Send me <i>only</i> Web Dev posts
            </label>
          )}
          {(isML || isWeb || showAllOptions) && <br />}
          <input type="submit" value="SUBMIT" />
        </form>
      </div>
    );
  }
}
