import React, { useContext } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { toast } from "react-toastify";

import { DBContext } from "../core/Database";

export function Data({ history }) {
  const { db } = useContext(DBContext);

  const onExport = async () => {
    const entriesJSON = await db.entries.dump(true);
    const dataStr = JSON.stringify(entriesJSON);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "journal.bkp.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const onImport = async event => {
    try {
      const file = event.target.files[0];

      if (!file) return;

      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");

      const entriesJSON = await new Promise((resolve, reject) => {
        reader.onload = evt => resolve(JSON.parse(evt.target.result));
        reader.onerror = _evt => reject();
      });

      await db.entries.bulkInsert(entriesJSON.docs);
      history.push("/");
      toast.success("Successfully imported", {});
    } catch (e) {
      console.error(e);
      toast.success("Failed to import", {});
    }
  };

  return (
    <div>
      <Typography>Data Management</Typography>
      <Box display="flex" justifyContent="space-around">
        <Button
          onClick={onExport}
          size="large"
          variant="contained"
          type="submit"
          color="primary"
        >
          Export data
        </Button>
        <Button
          component="label"
          size="large"
          variant="contained"
          type="submit"
          color="primary"
        >
          Imoprt data
          <input onChange={onImport} type="file" style={{ display: "none" }} />
        </Button>
      </Box>
    </div>
  );
}
