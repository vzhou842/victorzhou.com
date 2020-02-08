// @flow
import * as React from 'react';
import { Link } from 'gatsby';
import styles from './SubscribeForm.module.scss';
import RecaptchaContext from '../RecaptchaContext';
import { logEvent, logError } from '../../utils/log';

import type { RecaptchaContextType } from '../RecaptchaContext';

type Props = {
  +signupSource: string,
  +isML?: boolean,
  +isWeb?: boolean,
  +showAllOptions?: boolean,
  +large?: boolean,
  +noDescription?: boolean,
  +noSpacing?: boolean,
  +onKeyDown?: Function,
};

type InnerProps = {
  +context: RecaptchaContextType,
} & Props;

type State = {|
  +checked: {|
    +none: boolean,
    +ml: boolean,
    +web: boolean,
  |},
  +loading: boolean,
|};

let hasLoadedRecaptcha = false;
let hasPlacedStyle = false;

class SubscribeForm extends React.PureComponent<InnerProps, State> {
  state = { checked: { none: true, ml: false, web: false }, loading: false };

  _formRef = new React.createRef<HTMLFormElement>();

  _pendingSubmit: boolean = false;

  _script: ?HTMLScriptElement = null;

  componentDidMount() {
    const { body, head } = document;
    if (!hasPlacedStyle) {
      hasPlacedStyle = true;
      if (head) {
        const style = document.createElement('style');
        style.innerHTML = '.grecaptcha-badge { visibility: hidden; }';
        head.appendChild(style);
      } else {
        logError('SubscribeForm <head> doesn\'t exist');
      }
    }
    if (!hasLoadedRecaptcha) {
      hasLoadedRecaptcha = true;
      if (body) {
        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js';
        script.async = true;
        body.appendChild(script);
        this._script = script;
      } else {
        logError('SubscribeForm <body> doesn\'t exist');
      }
    }
  }

  componentDidUpdate(prevProps: InnerProps) {
    if (
      this._pendingSubmit && prevProps.context.recaptchaToken !== this.props.context.recaptchaToken
    ) {
      this.submit();
      logEvent('SubscribeForm', 'submitted-with-token');
    }
  }

  componentWillUnmount() {
    // This component will only unmount on a local page navigation, in which case
    // we need to reload reCAPTCHA.
    hasLoadedRecaptcha = false;
    if (this._script) {
      this._script.remove();
      this._script = null;
    }
  }

  onCheckboxClick(id: 'ml' | 'web' | 'none') {
    this.setState({
      checked: { ...{ none: false, ml: false, web: false }, [id]: !this.state.checked[id] },
    });
  }

  onSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.state.loading) {
      return;
    }

    logEvent('SubscribeForm', 'submit');
    const { context } = this.props;
    if (context.recaptchaToken != null) {
      this.submit();
    } else {
      this.setState({ loading: true });
      window.onSubscribeFormSubmit = (token: string) => {
        logEvent('SubscribeForm', 'token-generated');
        this._pendingSubmit = true;
        context.setRecaptchaToken(token);
      };
      window.grecaptcha.execute();
    }
  };

  submit = () => {
    this._pendingSubmit = false;
    const form = this._formRef.current;
    if (form) {
      form.submit();
      this.setState({ loading: false });
    } else {
      logError('SubscribeForm <form> doesn\'t exist');
    }
  }

  render() {
    const {
      context: { recaptchaToken },
      signupSource,
      isML,
      isWeb,
      showAllOptions,
      large,
      noDescription,
      noSpacing,
      onKeyDown,
    } = this.props;
    const { checked, loading } = this.state;

    const inputType = showAllOptions ? 'radio' : 'checkbox';

    return (
      <div
        className={`${styles['container']} ${large ? styles['large'] : ''} ${
          noSpacing ? styles['no-spacing'] : ''
        }`}
      >
        {!noDescription && (
          <p className={styles['description']}>
            I write about <Link to="/tag/machine-learning/">ML</Link>, <Link to="/tag/web-development/">Web Dev</Link>, and <Link to="/tags/">more topics</Link>.{' '}
            <b>Subscribe to get new posts by email!</b>
          </p>
        )}
        <form
          action="https://sendy.victorzhou.com/subscribe"
          method="post"
          acceptCharset="utf-8"
          target="_self"
          onSubmit={this.onSubmit}
          ref={this._formRef}
        >
          <input type="hidden" name="Source" value={signupSource} />
          <input type="hidden" name="list" value="CWC7638hEb6mfk1RqUbJ763snA" />
          <input type="hidden" name="subform" value="yes" />
          {recaptchaToken && <input type="hidden" name="g-recaptcha-response" value={recaptchaToken} />}
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
          {showAllOptions && (
            <label>
              <input
                type={inputType}
                name="Restrictions"
                value=""
                checked={checked.none}
                onChange={this.onCheckboxClick.bind(this, 'none')}
              />
              Send me <i>all</i> posts
            </label>
          )}
          {showAllOptions && <br />}
          {(isML || showAllOptions) && (
            <label>
              <input
                type={inputType}
                name="Restrictions"
                value={checked.ml ? 'ML' : ''}
                checked={checked.ml}
                onChange={this.onCheckboxClick.bind(this, 'ml')}
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
              />
              Send me <i>only</i> Web Dev posts
            </label>
          )}
          {(isML || isWeb || showAllOptions) && <br />}
          <input className={loading ? styles['loading'] : ''} type="submit" value="SUBMIT" />
        </form>
        <div className="g-recaptcha"
          data-sitekey="6Le4B78UAAAAAFAdZM2PCW_N0fewzkoQSkv9odSY"
          data-callback="onSubscribeFormSubmit"
          data-size="invisible">
        </div>
        <p className={styles['recaptcha-message']}>
          This site is protected by reCAPTCHA and the Google{' '}
          <a href="https://policies.google.com/privacy">Privacy Policy</a> and{' '}
          <a href="https://policies.google.com/terms">Terms of Service</a> apply.
        </p>
      </div>
    );
  }
}

const SubscribeFormWrapper = (props: Props) => (
  <RecaptchaContext.Consumer>
    {context => <SubscribeForm {...props} context={context} />}
  </RecaptchaContext.Consumer>
);

export default SubscribeFormWrapper;
