import "../index.css";
import { useState } from "react";
import { Button } from "primereact/button";
import axios from "axios";
import { useEffect } from "react";
import qs from "qs";
import vehicleStore from "../common/VehicleStore";
import { auth } from "./FirebaseConfig";

const AdModel = (props) => {
  const [isEdited, setIsEdited] = useState(false);
  const [img, setImg] = useState(props.vehicle.img);
  const [kilometers, setKilometers] = useState(props.vehicle.kilometers);
  const [price, setPrice] = useState(props.vehicle.price);
  const [bearer, setBearer] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchToken = async () => {
      const dataToken = {
        username: "tomimadjarevic@gmail.com",
        password: "tomke123.",
        grant_type: "password",
      };

      const formData = qs.stringify(dataToken);
      const tokenUrl = "https://api.baasic.com/beta/webprojekt/login";
      try {
        const response = await axios.post(tokenUrl, formData, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        const token = response.data.access_token;
        setBearer(token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, []);

  const handleSave = async () => {
    const updateData = {
      id: props.vehicle.id,
      make: props.vehicle.make,
      model: props.vehicle.model,
      uid: props.vehicle.uid,
      kilometers: kilometers,
      price: price,
      img: img,
      email: user.email,
    };
    const urlUpdate = `https://api.baasic.com/beta/webprojekt/resources/Vehicle/${props.vehicle.id}/`;
    try {
      const response = await axios.put(urlUpdate, updateData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${bearer}`,
        },
      });
    } catch (error) {
      console.error("Error updating:", error);
    }
    vehicleStore.getFromDatabase();

    setIsEdited(!isEdited);
  };

  const deleteVehicle = async () => {
    const deleteURL = `https://api.baasic.com/beta/webprojekt/resources/Vehicle/${props.vehicle.id}/`;
    try {
      const response = await axios.delete(deleteURL, {
        headers: {
          Authorization: `bearer ${bearer}`,
        },
      });
    } catch (error) {
      console.error("Error deleting:", error);
    }
    vehicleStore.getFromDatabase();
  };
  return isEdited ? (
    <div className="ad">
      <div>
        <label>ImageURL:</label>
        <input
          type="text"
          value={img}
          onChange={(e) => setImg(e.target.value)}
        />
      </div>
      <div>
        <label>Kilometers:</label>
        <input
          type="text"
          value={kilometers}
          onChange={(e) => setKilometers(e.target.value)}
        />
      </div>

      <div>
        <label>Price:</label>
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <div className="editDeleteButtons">
        <Button
          onClick={() => setIsEdited(!isEdited)}
          className="editButton"
          label="Discard"
          icon="pi pi-times"
          iconPos="right"
        />
        <Button
          onClick={handleSave}
          className="saveButton"
          label="Save"
          icon="pi pi-check"
          iconPos="right"
        />
      </div>
    </div>
  ) : (
    <div className="ad">
      <h5>{props.vehicle.make}</h5>
      <h6>{props.vehicle.model}</h6>
      <img src={props.vehicle.img} />
      <h6>{props.vehicle.kilometers} km</h6>
      <h6>{props.vehicle.price} €</h6>

      <div className="editDeleteButtons">
        <Button
          onClick={() => setIsEdited(!isEdited)}
          className="editButton"
          label="Edit"
          icon="pi pi-pencil"
          iconPos="right"
        />
        <Button
          onClick={deleteVehicle}
          className="deleteButton"
          label="Delete"
          icon="pi pi-trash"
          iconPos="right"
        />
      </div>
    </div>
  );
};
export default AdModel;
