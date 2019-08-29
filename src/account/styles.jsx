import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
  appBar: {
    position: "relative"
  },
  flex: {
    flex: 1
  },
  link: {
    color: theme.palette.text.primary,
    display: "block",
    margin: theme.spacing(),
    marginTop: theme.spacing()
  },
  view: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(2)
  },
  button: {}
}));
