const MarkersList = ({ markers }: { markers: any }) => {
  return (
    <ol>
      {markers?.length > 0 &&
        markers.map((marker: ICoordinate, index: number) => (
          <li key={index}>
            Lat: {marker.lat}, Lng: {marker.lng}
          </li>
        ))}
    </ol>
  );
};

export default MarkersList;
