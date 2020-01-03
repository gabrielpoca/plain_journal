import React, { useContext } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import Box from "@material-ui/core/Box";

import { DBContext } from "../core/Database";

export function Geolocation() {
  const { db } = useContext(DBContext);
  const geolocation = db.settings.useSetting("journalGeolocation");

  const toggleGeolocation = async () => {
    if (!geolocation)
      return await db.settings.insert({
        id: "journalGeolocation",
        value: "enabled"
      });

    if (geolocation.value === "enabled")
      return geolocation.update({
        $set: {
          value: "disabled"
        }
      });

    try {
      new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      return geolocation.update({
        $set: {
          value: "enabled"
        }
      });
    } catch (e) {
      console.error(e);
      return geolocation.update({
        $set: {
          value: "disabled"
        }
      });
    }
  };

  if (geolocation === undefined || !navigator.geolocation) return null;

  return (
    <Grid container justify="space-between" spacing={1}>
      <Grid item xs={8}>
        <Typography>Capture GPS location for entries</Typography>
      </Grid>
      <Grid item xs={3} sm={2}>
        <Box display="flex" justifyContent="flex-end">
          <Switch
            onChange={toggleGeolocation}
            checked={geolocation && geolocation.value === "enabled"}
          />
        </Box>
      </Grid>
    </Grid>
  );
}
