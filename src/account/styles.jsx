import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
  appBar: {
    position: "relative"
  },
  flex: {
    flex: 1
  },
  link: {
    display: "block",
    margin: theme.spacing(),
    marginTop: theme.spacing()
  },
  view: {
    margin: theme.spacing()
  },
  button: {}
}));
