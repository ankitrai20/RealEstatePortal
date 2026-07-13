import { useEffect, useState } from "react";
import axios from "axios";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ================= CHANGE MAP VIEW =================

function ChangeMapView({ center }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);

  return null;
}

// ================= PROPERTY MAP =================

function PropertyMap({
  title = "Property",
  location = "",
  price = "",
}) {
  const [position, setPosition] = useState([
    26.8467,
    80.9462,
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!location) {
      setLoading(false);
      return;
    }

    const fetchLocation = async () => {
      try {
        const response = await axios.get(
          "https://nominatim.openstreetmap.org/search",
          {
            params: {
              q: location,
              format: "json",
              limit: 1,
            },
          }
        );

        if (response.data.length > 0) {
          setPosition([
            parseFloat(response.data[0].lat),
            parseFloat(response.data[0].lon),
          ]);
        }
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    };

    fetchLocation();
  }, [location]);

  if (loading) {
    return (
      <div className="h-[450px] flex items-center justify-center bg-gray-100 rounded-xl">
        <h2 className="text-xl font-bold">Loading Map...</h2>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden shadow-xl">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        style={{
          height: "450px",
          width: "100%",
        }}
      >
        <ChangeMapView center={position} />

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position}>
          <Popup>
            <div className="space-y-2">
              <h2 className="font-bold text-lg">{title}</h2>

              <p>📍 {location}</p>

              <h3 className="text-blue-600 font-bold">
                ₹ {Number(price).toLocaleString("en-IN")}
              </h3>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default PropertyMap;