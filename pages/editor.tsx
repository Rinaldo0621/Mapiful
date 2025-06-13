import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'

export default function Editor() {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [lng, setLng] = useState(77.209)
  const [lat, setLat] = useState(28.6139)
  const [zoom, setZoom] = useState(9)
  const [title, setTitle] = useState('My Map Poster')
  const [subtitle, setSubtitle] = useState('Custom Location')

  useEffect(() => {
    if (map.current) return
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [lng, lat],
      zoom: zoom
    })
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-2xl font-bold mb-4">Customize</h2>
          <label className="block mb-2">Title:</label>
          <input className="w-full border mb-4 p-2" value={title} onChange={(e) => setTitle(e.target.value)} />
          <label className="block mb-2">Subtitle:</label>
          <input className="w-full border mb-4 p-2" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </div>
        <div className="w-full md:w-1/2 p-6">
          <div ref={mapContainer} className="h-96 w-full border rounded" />
          <div className="mt-4 text-center">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-gray-500">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
