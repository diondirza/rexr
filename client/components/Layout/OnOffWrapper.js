import { PureComponent } from 'react';
import { node, func } from 'prop-types';
import { noop } from 'lodash';

class OnOffWrapper extends PureComponent {
  componentDidMount() {
    const { onOffline, onOnline } = this.props;

    if (typeof onOffline === 'function') {
      window.addEventListener('offline', onOffline);
    }

    if (typeof onOnline === 'function') {
      window.addEventListener('online', onOnline);
    }
  }

  componentWillUnmount() {
    const { onOffline, onOnline } = this.props;

    if (typeof onOffline === 'function') {
      window.removeEventListener('offline', onOffline);
    }

    if (typeof onOnline === 'function') {
      window.removeEventListener('online', onOnline);
    }
  }

  render() {
    const { children } = this.props;

    return children;
  }
}

OnOffWrapper.propTypes = {
  children: node.isRequired,
  onOffline: func,
  onOnline: func,
};

OnOffWrapper.defaultProps = {
  onOffline: noop,
  onOnline: noop,
};

export default OnOffWrapper;
