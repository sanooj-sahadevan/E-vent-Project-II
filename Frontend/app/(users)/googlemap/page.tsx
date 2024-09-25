// "use client"
// import {useState} from 'react'

// import {APIProvider,
//     Map,
//     AdvancedMarker,
//     Pin,
//     InfoWindow
// } from '@vis.gl/react-google-maps'



// export default function Intro(){
//     const position= {lat:53.54,lng:10}
//     const [open,setOpen] = useState(false)
//     return(
//         <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_API}>
//             <div style={{height:"100vh",width:"100%"}}>
//                <Map zoom={9} center={position} mapId={process.env.NEXT_PUBLIC_Map_ID}>
//                     <AdvancedMarker position={position} onClick={()=>setOpen(true)}>
//                         <Pin background={'grey'} borderColor={'green'} glyphColor={"purple"}/>
//                     </AdvancedMarker>
//                     {
//                         open && <InfoWindow position={position} onCloseClick={()=>setOpen(false)}><h2>Your location</h2></InfoWindow>
//                     }
//                </Map>
//             </div>
//         </APIProvider>
//     )
// }


"use client"
import {useState} from 'react'

import {APIProvider,
    Map,
    AdvancedMarker,
    Pin,
    InfoWindow
} from '@vis.gl/react-google-maps'

export default function Intro(){
    const position= {lat:11.0168,lng:76.95}
    const [open,setOpen] = useState(false)
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API || 'YOUR_DEFAULT_API_KEY'
    return(
        <APIProvider apiKey={apiKey}>
            <div style={{height:"100vh",width:"100%"}}>
               <Map zoom={9} center={position} mapId={process.env.NEXT_PUBLIC_Map_ID}>
                    <AdvancedMarker position={position} onClick={()=>setOpen(true)}>
                        <Pin background={'grey'} borderColor={'green'} glyphColor={"purple"}/>
                    </AdvancedMarker>
                    {
                        open && <InfoWindow position={position} onCloseClick={()=>setOpen(false)}><h2>Your location</h2></InfoWindow>
                    }
               </Map>
            </div>
        </APIProvider>
    )
}
