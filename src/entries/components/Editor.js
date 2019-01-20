import _ from 'lodash';
import React from 'react';
import Quill from 'quill';
import styled from 'styled-components/macro';

import 'quill/dist/quill.core.css';
import 'react-quill/dist/quill.snow.css';

import MarkdownShortcuts from './markdown-shortcuts';

Quill.register('modules/markdownShortcuts', MarkdownShortcuts);

const Root = styled.div`
  height: ${({ expanded }) =>
    expanded ? 'calc(100% - 56px)' : 'calc(100% - 432px)'};
  position: fixed;
  top: 56px;
  background: white;
  width: 100%;
  max-width: var(--max-width);
  transform: translateY(${({ expanded }) => (expanded ? 0 : '376px')});
  overflow: scroll;

  .quill-container {
    height: 100%;
  }
`;

class EditorElement extends React.Component {
  componentDidMount() {
    this.quill = new Quill(this.el, {
      placeholder: 'Today I ...',
      modules: {
        markdownShortcuts: {},
      },
    });
    this.quill.on('text-change', this.onTextChange);
    this.quill.on('selection-change', range =>
      range !== null ? this.props.onFocus() : this.props.onBlur()
    );

    this.quill.setContents(this.quill.clipboard.convert(this.props.value));
  }

  shouldComponentUpdate(props) {
    if (props.disabled) {
      this.quill.enable(false);
    } else {
      this.quill.enable(true);
    }

    return false;
  }

  onTextChange = (delta, oldDelta, source) => {
    this.props.onChange(this.quill.root.innerHTML);
  };

  render() {
    return (
      <React.Fragment>
        <div ref={toolbar => (this.toolbar = toolbar)} />
        <div ref={el => (this.el = el)} />
      </React.Fragment>
    );
  }
}

class Editor extends React.Component {
  constructor() {
    super();
    this.el = React.createRef();
  }

  render() {
    return (
      <Root
        ref={this.el}
        offset={_.get(this.el.current, 'offsetTop', 0)}
        expanded={this.props.expanded}
      >
        <EditorElement {...this.props} />
      </Root>
    );
  }
}

export default Editor;
