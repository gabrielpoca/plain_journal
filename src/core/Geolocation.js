import React, { useState, useEffect, useContext } from "react";

import { DBContext } from "./Database";

export const GeolocationContext = React.createContext({});

export function GeolocationProvider(props) {
  const [position, setPosition] = useState({});
  const { db } = useContext(DBContext);
  const geolocation = db.settings.useSetting("journalGeolocation");
  const value = geolocation && geolocation.value;

  useEffect(() => {
    if (!geolocation || geolocation.value !== "enabled") return setPosition({});
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(position => {
      setPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, [geolocation, value]);

  return (
    <GeolocationContext.Provider value={position}>
      {props.children}
    </GeolocationContext.Provider>
  );
}
