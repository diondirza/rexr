import React, { PureComponent } from 'react';
import { bool, func, node } from 'prop-types';

import { canUseDOM } from '@helpers/env';
import ErrorView from '@components/ErrorView';

class ErrorBoundary extends PureComponent {
  static propTypes = {
    children: node,
    debug: bool,
    fallback: func,
  };

  static defaultProps = {
    children: null,
    debug: false,
    fallback: ErrorView,
  };

  state = {
    hasError: false,
  };

  componentDidCatch(error, info) {
    const { debug } = this.props;

    if (debug) {
      console.groupCollapsed(`Error occured!`);
      console.log('Error:', error);
      console.log('Info:', info);
      console.groupEnd();
    }

    if (canUseDOM && window.Raven) {
      window.Raven.captureException(error, { extra: info });
    }

    this.setState({ hasError: true });
  }

  render() {
    const { children, fallback: FallbackComponent } = this.props;
    const { hasError } = this.state;

    return hasError ? <FallbackComponent /> : children;
  }
}

export default ErrorBoundary;
