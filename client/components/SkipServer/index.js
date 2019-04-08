import { Component } from 'react';
import { arrayOf, bool, oneOfType, node } from 'prop-types';

class SkipServer extends Component {
  static propTypes = {
    children: oneOfType([arrayOf(node), node]).isRequired,
    enable: bool,
    placeholder: node,
  };

  static defaultProps = {
    enable: false,
    placeholder: null,
  };

  constructor(props) {
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

  render() {
    const { children, placeholder } = this.props;
    const { visible } = this.state;

    return visible ? children : placeholder;
  }
}

export default SkipServer;
