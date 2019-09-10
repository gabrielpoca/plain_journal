import _ from "lodash";
import React from "react";
import Quill from "quill";
import { withStyles } from "@material-ui/core/styles";

import "quill/dist/quill.core.css";
import "react-quill/dist/quill.snow.css";

import MarkdownShortcuts from "./markdown-shortcuts";

Quill.register("modules/markdownShortcuts", MarkdownShortcuts);

const styles = theme => ({
  root: {
    paddingTop: theme.spacing(1),
    flex: 1,
    backgroundColor: theme.palette.background.default,
    width: "100%",
    overflow: "scroll"
  }
});

class EditorElement extends React.Component {
  componentDidMount() {
    this.quill = new Quill(this.el, {
      placeholder: "Today I ...",
      modules: {
        markdownShortcuts: {}
      }
    });
    this.quill.on("text-change", this.onTextChange);
    this.quill.on("selection-change", range =>
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
    const { classes } = this.props;

    return (
      <div
        className={classes.root}
        ref={this.el}
        offset={_.get(this.el.current, "offsetTop", 0)}
      >
        <EditorElement {...this.props} />
      </div>
    );
  }
}

export default withStyles(styles)(Editor);
