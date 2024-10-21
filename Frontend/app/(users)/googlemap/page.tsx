"use client";
import { useState } from "react";
import {
    APIProvider,
    Map,
    AdvancedMarker,
    Pin,
    InfoWindow,
} from "@vis.gl/react-google-maps";

export default function Intro() {
    const position = { lat: 11.0168, lng: 76.95 }
    const [open, setOpen] = useState(false);

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API;
    const mapId = process.env.NEXT_PUBLIC_Map_ID;

    if (!apiKey || !mapId) {
        console.error("API key or Map ID is missing!");
        return <div>Error: Google Maps API key or Map ID is not provided.</div>;
    }

    return (
        <APIProvider apiKey={apiKey}>
            <div style={{ height: "100vh", width: "100%" }}>
                <Map zoom={9} center={position} mapId={mapId}>
                    <AdvancedMarker position={position} onClick={() => setOpen(true)}>
                        <Pin background={"grey"} borderColor={"green"} glyphColor={"purple"} />
                    </AdvancedMarker>
                    {open && (
                        <InfoWindow
                            position={position}
                            onCloseClick={() => setOpen(false)}
                        >
                            <h2>Your location</h2>
                        </InfoWindow>
                    )}
                </Map>
            </div>
        </APIProvider>
    );
}
