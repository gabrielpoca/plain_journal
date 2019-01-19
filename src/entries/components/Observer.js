import React from 'react';

class Observer extends React.Component {
  constructor() {
    super();

    this.state = {
      inView: true
    };

    this.ref = React.createRef();
  }

  componentDidMount() {
    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.intersectionRatio < 0.3) this.setState({ inView: false });
          else this.setState({ inView: true });
        });
      },
      {
        root: this.props.root,
        rootMargin: '0px',
        threshold: 0.3
      }
    );

    this.observer.observe(this.ref.current);
  }

  componentWillUnmount() {
    this.observer.disconnect();
  }

  render() {
    return this.props.children({ ...this.state, ref: this.ref });
  }
}

export default Observer;
