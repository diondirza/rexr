import { Component, ReactNode } from 'react';

type SkipServerProps = typeof SkipServer.defaultProps & {
  children: ReactNode;
  placeholder?: ReactNode;
};

type SkipServerState = {
  visible: boolean;
};

class SkipServer extends Component<SkipServerProps, SkipServerState> {
  static defaultProps = {
    enable: false,
  };

  constructor(props: SkipServerProps) {
    super(props);

    this.state = { visible: !props.enable };
    this.triggerAnimFrame1 = 0;
    this.triggerAnimFrame2 = 0;
  }

  componentDidMount() {
    const { enable } = this.props;

    if (enable) {
      this.triggerAnimFrame1 = requestAnimationFrame(() => {
        this.triggerAnimFrame2 = requestAnimationFrame(() => this.setState({ visible: true }));
      });
    }
  }

  componentWillUnmount() {
    if (this.triggerAnimFrame1) {
      cancelAnimationFrame(this.triggerAnimFrame1);

      if (this.triggerAnimFrame2) {
        cancelAnimationFrame(this.triggerAnimFrame2);
      }
    }
  }

  private triggerAnimFrame1: number;

  private triggerAnimFrame2: number;

  render() {
    const { children, placeholder } = this.props;
    const { visible } = this.state;

    return visible ? children : placeholder;
  }
}

export default SkipServer;
