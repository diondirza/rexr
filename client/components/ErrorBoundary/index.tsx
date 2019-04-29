import React, { ErrorInfo, PureComponent, ReactNode } from 'react';

import { canUseDOM } from '@helpers/env';
import ErrorView from '@components/ErrorView';

type ErrorBoundaryProps = typeof ErrorBoundary.defaultProps & {
  children: ReactNode;
};

type ErrorBoundarySate = {
  hasError: boolean;
};

class ErrorBoundary extends PureComponent<ErrorBoundaryProps, ErrorBoundarySate> {
  static defaultProps = {
    debug: false,
    fallback: ErrorView,
  };

  public readonly state = {
    hasError: false,
  };

  componentDidCatch(error: Error, info: ErrorInfo) {
    const { debug } = this.props;
    const w = window as any;

    if (debug) {
      console.groupCollapsed(`Error occured!`);
      console.log('Error:', error);
      console.log('Info:', info);
      console.groupEnd();
    }

    if (canUseDOM && w.Raven) {
      w.Raven.captureException(error, { extra: info });
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
