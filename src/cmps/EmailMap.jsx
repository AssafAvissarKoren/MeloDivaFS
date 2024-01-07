import GoogleMapReact from 'google-map-react';

export const EmailMap = ({ location }) => {

    const API_KEY = 'AIzaSyCXi98FjW3zCGnMQhBY1CasQjzAwLGo3Mg';
    const Marker = () => <div style={{ color: 'red', fontSize: '24px' }}>📍</div>;
    const defaultMapProps = {
        center: {
            lat: 59.95,
            lng: 30.33
        },
        zoom: 11
    };

    if (!location || !location.latitude || !location.longitude) {
        return <div>Loading map...</div>;
    }

    return(
        <div>
            <br/>
            <h3>Sender's Location:</h3>
            <div style={{ height: '300px', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: API_KEY }}
                    defaultCenter={defaultMapProps.center}
                    defaultZoom={defaultMapProps.zoom}
                    center={{ lat: location.latitude, lng: location.longitude }}
                    zoom={defaultMapProps.zoom}
                >
                    <Marker 
                        lat={location.latitude} 
                        lng={location.longitude} 
                    />
                </GoogleMapReact>
            </div>
        </div>
    )
}
