import { useContext, useEffect, useRef } from "react";
import { UserContext } from "../context/UserContext";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Draw, Modify, Snap } from "ol/interaction";

export default function MapPage() {
  const { user } = useContext(UserContext);
  const mapElement = useRef();
  const vectorSource = useRef(new VectorSource());

  useEffect(() => {
    const vectorLayer = new VectorLayer({
      source: vectorSource.current,
    });

    const map = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        vectorLayer,
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    const draw = new Draw({ source: vectorSource.current, type: "Polygon" });
    const modify = new Modify({ source: vectorSource.current });
    const snap = new Snap({ source: vectorSource.current });

    map.addInteraction(draw);
    map.addInteraction(modify);
    map.addInteraction(snap);

    return () => map.setTarget(null);
  }, []);

  const clearPolygons = () => {
    vectorSource.current.clear();
  };

  return (
    <div className="relative h-screen w-full">
      <header className="absolute top-0 left-0 w-full bg-blue-600 text-white text-center py-4 z-10">
        <h1 className="text-xl font-bold">{user.name}</h1>
      </header>
      <button
        onClick={clearPolygons}
        className="absolute top-20 right-4 z-10 bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
      >
        Clear Polygons
      </button>
      <div ref={mapElement} className="h-full w-full" />
    </div>
  );
}
