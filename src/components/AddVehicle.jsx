import makeModelStore from "../common/MakeModelStore";
import { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import { auth } from "./FirebaseConfig";
import { Button } from "primereact/button";
import { useRef } from "react";
import { Toast } from "primereact/toast";

import vehicleStore from "../common/VehicleStore";
import qs from "qs";
import { InputNumber } from "primereact/inputnumber";

const AddVehicle = (props) => {
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [vehicleValue, setVehicleValue] = useState("");
  const [kilometersPassed, setKilometersPassed] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [bearer, setBearer] = useState(null);
  const toast = useRef(null);
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

  const showInfo = (message) => {
    toast.current.show({
      severity: "info",
      summary: "Info",
      detail: message,
      life: 3000,
    });
  };

  const makeNames = props.makes.map((make) => ({
    name: make.name,
    id: make.id,
  }
  ));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      selectedMake === "" ||
      selectedModel === "" ||
      vehicleValue === null ||
      kilometersPassed === null ||
      imgUrl.toString().trim() === ""
    ) {
      showInfo("You didn't enter all information!");
    } else {
      const urlVehicle =
        "https://api.baasic.com/beta/webprojekt/resources/Vehicle/";
      const user = auth.currentUser;

      const data = {
        make: selectedMake.name,
        model: selectedModel.name,
        uid: user.uid,
        kilometers: kilometersPassed,
        price: vehicleValue,
        img: imgUrl,
        email: user.email,
      };

      const response = await axios.post(urlVehicle, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${bearer}`,
        },
      });

      vehicleStore.getFromDatabase();
      props.toggleIsShown();
    }
  };

  const modelNames = props.models.map((model) => ({
    name: model.name,
    id: model.id,
    makeId: model.makeId,
  }));

  const handleMakeChange = (e) => {
    setSelectedMake(e.value);

    const filteredModels = props.models.filter(
      (model) => model.makeId === e.value.id
    );

    const filteredModelNames = filteredModels.map((model) => ({
      name: model.name,
      id: model.id,
    }));

    setModelOptions(filteredModelNames);
  };

  const [modelOptions, setModelOptions] = useState([]);

  return (
    <>
      <Toast ref={toast} />
      <div className="addVehiclePrompt">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="make">Vehicle make:</label>

            <Dropdown
              value={selectedMake}
              onChange={handleMakeChange}
              options={makeNames}
              optionLabel="name"
              placeholder="Select a make"
              className="w-full md:w-14rem"
              style={{ color: "black" }}
            />
          </div>

          <div>
            <label htmlFor="model">Vehicle model:</label>

            <Dropdown
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.value)}
              options={modelOptions}
              optionLabel="name"
              placeholder="Select a model"
              className="w-full md:w-14rem"
              style={{ color: "black" }}
            />
          </div>
          <div className="flex-auto">
            <label htmlFor="currency-germany" className="labelPrice">
              Price:
            </label>
            <InputNumber
              inputId="currency-germany"
              value={vehicleValue}
              onValueChange={(e) => setVehicleValue(e.value)}
              mode="currency"
              currency="EUR"
              locale="de-DE"
            />
          </div>
          <div className="flex-auto">
            <label htmlFor="kilometers" className="kilometersPassed">
              Kilometers:
            </label>
            <InputNumber
              inputId="kilometers"
              value={kilometersPassed}
              onValueChange={(e) => setKilometersPassed(e.value)}
            />
          </div>
          <div className="card flex justify-content-center">
            <InputText
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
              placeholder="Image URL"
            />
          </div>
          <button className="buttonAdd" type="sumbit">
            Add new vehicle
          </button>
        </form>
      </div>
    </>
  );
};

export default AddVehicle;
