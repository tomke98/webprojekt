const Ad = (props) => {
  return (
    <div className="ad">
      <h5>{props.vehicle.make}</h5>
      <h6>{props.vehicle.model}</h6>
      <img src={props.vehicle.img} />
      <h6>{props.vehicle.kilometers} km</h6>
      <h6>{props.vehicle.price} €</h6>
      <h6>
        <a href={`mailto:${props.vehicle.email}`}>{props.vehicle.email}</a>
      </h6>
    </div>
  );
};
export default Ad;
