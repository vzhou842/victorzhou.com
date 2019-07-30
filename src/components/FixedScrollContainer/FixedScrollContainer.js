// @flow
import * as React from 'react';
import styles from './FixedScrollContainer.module.scss';

type Props = {|
  +children: React.Node,
|};

const FixedScrollContainer = ({ children }: Props) => {
  const [hidden, setHidden] = React.useState(false);

  React.useEffect(() => {
    function handleScroll() {
      setHidden(window.scrollY > 2000);
    }

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`${styles['container']} ${hidden ? styles['hidden'] : ''}`}>
      {children}
    </div>
  );
};

export default FixedScrollContainer;
