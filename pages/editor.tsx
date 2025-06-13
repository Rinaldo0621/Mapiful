import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; // ✅ ensures proper Mapbox styling

mapboxgl.accessToken =
  "pk.eyJ1IjoicmluYWxkbzA2MjEiLCJhIjoiY21iaHllNHFsMDJtaTJtb2lheHQ1MnVpeiJ9.f2J5pyDhqnkfrcFU7DEmLg";

const mapStyles: { [key: string]: string } = {
  Light: "mapbox://styles/mapbox/light-v10",
  Dark: "mapbox://styles/mapbox/dark-v10",
  Streets: "mapbox://styles/mapbox/streets-v11",
  Satellite: "mapbox://styles/mapbox/satellite-v9",
  Outdoors: "mapbox://styles/mapbox/outdoors-v11",
};

export default function Editor() {
  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  const [lng, setLng] = useState(77.209);
  const [lat, setLat] = useState(28.6139);
  const [zoom, setZoom] = useState(9);
  const [title, setTitle] = useState("Joanna");
  const [subtitle, setSubtitle] = useState("Mumbai, Maharashtra, India");
  const [style, setStyle] = useState("Light");
  const [posterSize, setPosterSize] = useState("A2");
  const [orientation, setOrientation] = useState("Portrait");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const posterDimensions: { [key: string]: { width: number; height: number } } =
    {
      A3: { width: 350, height: 500 },
      A2: { width: 500, height: 700 },
      A1: { width: 700, height: 1000 },
    };

  const size = posterDimensions[posterSize];
  const mapWidth = orientation === "Portrait" ? size.width : size.height;
  const mapHeight = orientation === "Portrait" ? size.height : size.width;

  // Initialize map once
  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: mapStyles[style],
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("load", () => {
      dropRedPin(lng, lat);
    });
  }, []);

  // Change style dynamically
  useEffect(() => {
    if (map.current) {
      map.current.setStyle(mapStyles[style]);

      map.current.on("style.load", () => {
        dropRedPin(lng, lat);
      });
    }
  }, [style]);

  // Drop or update red pin
  const dropRedPin = (lng: number, lat: number) => {
    if (!map.current) return;

    if (markerRef.current) {
      markerRef.current.remove();
    }

    const el = document.createElement("div");
    el.style.backgroundImage =
      "url('https://maps.google.com/mapfiles/ms/icons/red-dot.png')";
    el.style.width = "32px";
    el.style.height = "32px";
    el.style.backgroundSize = "contain";
    el.style.backgroundRepeat = "no-repeat";
    el.style.backgroundPosition = "center";
    el.style.transform = "translate(-50%, -100%)";

    markerRef.current = new mapboxgl.Marker(el)
      .setLngLat([lng, lat])
      .addTo(map.current);
  };

  const searchLocation = async (text: string) => {
    setQuery(text);
    if (!text) return setSuggestions([]);

    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?access_token=${mapboxgl.accessToken}`,
    );
    const data = await res.json();
    setSuggestions(data.features);
  };

  const selectLocation = (place: any) => {
    const [selectedLng, selectedLat] = place.center;
    if (map.current) {
      map.current.flyTo({ center: [selectedLng, selectedLat], zoom: 10 });
    }
    setLng(selectedLng);
    setLat(selectedLat);
    setSubtitle(place.place_name);
    setQuery("");
    setSuggestions([]);
    dropRedPin(selectedLng, selectedLat);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col md:flex-row">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-2xl font-bold mb-4">Customize</h2>

          <label className="block mb-2">Title:</label>
          <input
            className="w-full border mb-4 p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="block mb-2">Subtitle:</label>
          <input
            className="w-full border mb-4 p-2"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />

          <label className="block mb-2">Poster Size:</label>
          <select
            className="w-full border p-2 mb-4"
            value={posterSize}
            onChange={(e) => setPosterSize(e.target.value)}
          >
            <option value="A3">A3 (11.7 x 16.5 in)</option>
            <option value="A2">A2 (16.5 x 23.4 in)</option>
            <option value="A1">A1 (23.4 x 33.1 in)</option>
          </select>

          <label className="block mb-2">Orientation:</label>
          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="Portrait"
                checked={orientation === "Portrait"}
                onChange={() => setOrientation("Portrait")}
              />
              <span>Portrait</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="Landscape"
                checked={orientation === "Landscape"}
                onChange={() => setOrientation("Landscape")}
              />
              <span>Landscape</span>
            </label>
          </div>

          <label className="block mb-2">Map Style:</label>
          <select
            className="w-full border p-2 mb-4"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          >
            {Object.keys(mapStyles).map((styleOption) => (
              <option key={styleOption} value={styleOption}>
                {styleOption}
              </option>
            ))}
          </select>

          <label className="block mb-2">Search Location:</label>
          <input
            type="text"
            className="w-full border p-2 mb-2"
            value={query}
            placeholder="Enter a city or place..."
            onChange={(e) => searchLocation(e.target.value)}
          />
          {suggestions.length > 0 && (
            <ul className="border bg-white shadow max-h-48 overflow-y-auto mb-4">
              {suggestions.map((place) => (
                <li
                  key={place.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => selectLocation(place)}
                >
                  {place.place_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 p-6">
          <div
            ref={mapContainer}
            className="border rounded mx-auto"
            style={{
              width: `${mapWidth}px`,
              height: `${mapHeight}px`,
              position: "relative",
              minHeight: "300px",
              overflow: "hidden",
            }}
          />
          <div className="mt-4 text-center">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-gray-500">{subtitle}</p>
            <p className="text-sm text-gray-400 mt-1">
              Poster Size: {posterSize} · Orientation: {orientation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
