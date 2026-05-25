import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState, useEffect } from "react";

export default function Map() {

  const [position, setPosition] = useState(null);

  const [error, setError] = useState(false);

  useEffect(() => {

    navigator.geolocation.getCurrentPosition(

      (location) => {

        setPosition([
          location.coords.latitude,
          location.coords.longitude
        ]);

      },

      (err) => {
        console.log(err);
        setError(true);
      }

    );

  }, []);

  if(error){
    return (
      <div className="h-[500px] flex items-center justify-center text-gray-500">
        Location permission denied.
      </div>
    );
  }

  if(!position){
    return (
      <div className="h-[500px] flex items-center justify-center">
        Loading location...
      </div>
    );
  }

  return (

    <MapContainer
      center={position}
      zoom={13}
      className="h-[500px] w-full rounded-2xl"
    >

      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={position}>
        <Popup>
          Your Location
        </Popup>
      </Marker>

    </MapContainer>

  );
}