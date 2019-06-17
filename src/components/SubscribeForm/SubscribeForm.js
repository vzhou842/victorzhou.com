// @flow
import React from 'react';
import styles from './SubscribeForm.module.scss';

type Props = {|
  +signupSource: string,
  +large: bool,
  +noDescription: bool,
  +noSpacing: bool,
  +onKeyDown: Function,
|};

const SubscribeForm = ({ signupSource, large, noDescription, noSpacing, onKeyDown }: Props) => (
  <div
    className={`${styles['container']} ${large ? styles['large'] : ''} ${
      noSpacing ? styles['no-spacing'] : ''
    }`}
  >
    {!noDescription && (
      <p className={styles['description']}>
        <b>Subscribe</b> to know whenever I post new content. I don't spam!
      </p>
    )}
    <form
      action='/subscribe'
      method="post"
      target="_blank"
    >
      <input type="hidden" name="lists" value="ml,web,misc" />
      <input type="hidden" name="Source" value={signupSource} />
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
      <input type="submit" value="SUBMIT" />
    </form>
  </div>
);

export default SubscribeForm;
