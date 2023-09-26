import { Dropdown } from "primereact/dropdown";
import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import axios from "axios";
import { Paginator } from "primereact/paginator";
import Ad from "./Ad";
import makeModelStore from "../common/MakeModelStore";
import vehicleStore from "../common/VehicleStore";
import { auth } from "./FirebaseConfig";

import { InputNumber } from "primereact/inputnumber";

const Marketplace = () => {
  const user = auth.currentUser;
  const toast = useRef(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [isFilterPressed, setIsFilterPressed] = useState(false);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(3);
  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("0");
  const [minKilometers, setMinKilometers] = useState("0");
  const [maxKilometers, setMaxKilometers] = useState("0");
  const options = makeModelStore.makes.map((make) => ({
    name: make.name,
    id: make.id,
  }));
  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  useEffect(() => {
    Promise.all([makeModelStore.getMakes(), vehicleStore.getFromDatabase()])
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  const checkCondition = () => {
    return (
      (isFilterPressed && filteredVehicles.length === 0) ||
      (!isFilterPressed &&
        vehicleStore.vehicles.filter((vehicle) => vehicle.uid !== user.uid)
          .length) === 0
    );
  };
  const showInfo = (message) => {
    toast.current.show({
      severity: "info",
      summary: "Info",
      detail: message,
      life: 3000,
    });
  };

  const filterVehicles = async (isFilterPressed) => {
    let sortURL = "";

    if (!isFilterPressed) {
      if (
        selectedOption !== "" &&
        maxPrice > minPrice &&
        maxKilometers > minKilometers
      ) {
        sortURL = `https://api.baasic.com/beta/webprojekt/resources/Vehicle/?searchQuery=WHERE kilometers>${minKilometers} AND kilometers<${maxKilometers} AND price>${minPrice} AND price<${maxPrice} AND make='${selectedOption.name}' AND uid!='${user.uid}'`;
      } else if (
        selectedOption !== "" &&
        maxPrice > minPrice &&
        maxKilometers === minKilometers
      ) {
        sortURL = `https://api.baasic.com/beta/webprojekt/resources/Vehicle/?searchQuery=WHERE price>${minPrice} AND price<${maxPrice} AND make='${selectedOption.name}' AND uid!='${user.uid}'`;
      } else if (
        selectedOption !== "" &&
        maxPrice === minPrice &&
        maxKilometers > minKilometers
      ) {
        sortURL = `https://api.baasic.com/beta/webprojekt/resources/Vehicle/?searchQuery=WHERE kilometers>${minKilometers} AND kilometers<${maxKilometers} AND make='${selectedOption.name}' AND uid!='${user.uid}'`;
      } else if (maxPrice > minPrice && maxKilometers > minKilometers) {
        sortURL = `https://api.baasic.com/beta/webprojekt/resources/Vehicle/?searchQuery=WHERE kilometers>${minKilometers} AND kilometers<${maxKilometers} AND price>${minPrice} AND price<${maxPrice}  AND uid!='${user.uid}'`;
      } else if (maxKilometers > minKilometers && maxPrice === minPrice) {
        sortURL = `https://api.baasic.com/beta/webprojekt/resources/Vehicle/?searchQuery=WHERE kilometers>${minKilometers} AND kilometers<${maxKilometers} AND uid!='${user.uid}'`;
      } else if (
        selectedOption !== "" &&
        maxPrice === minPrice &&
        maxKilometers === minKilometers
      ) {
        sortURL = `https://api.baasic.com/beta/webprojekt/resources/Vehicle/?searchQuery=WHERE make='${selectedOption.name}' AND uid!='${user.uid}'`;
      } else if (maxPrice > minPrice && maxKilometers === minKilometers) {
        sortURL = `https://api.baasic.com/beta/webprojekt/resources/Vehicle/?searchQuery=WHERE price>${minPrice} AND price<${maxPrice} AND uid!='${user.uid}'`;
      } else {
        showInfo("Invalid filter values!");
      }
      if (sortURL) {
        try {
          const response = await axios.get(sortURL, {
            headers: {
              "Content-Type": "application/json",
            },
          });

          setFilteredVehicles(response.data.item);

          setIsFilterPressed(!isFilterPressed);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    } else {
      setSelectedOption("");
      setMinPrice(0);
      setMaxPrice(0);
      setMinKilometers(0);
      setMaxKilometers(0);
      setIsFilterPressed(!isFilterPressed);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="selection">
        <div>
          <div className="minMax">
            <div className="minMaxPrice">
              <span className="p-float-label">
                <InputNumber
                  min="0"
                  id="number-input"
                  value={minPrice}
                  onValueChange={(e) => setMinPrice(e.value)}
                />
                <label htmlFor="number-input">Min price</label>
              </span>
              <span className="p-float-label">
                <InputNumber
                  min="0"
                  id="number-input"
                  value={maxPrice}
                  onValueChange={(e) => setMaxPrice(e.value)}
                />
                <label htmlFor="number-input">Max price</label>
              </span>
            </div>
            <div className="minMaxKilometers">
              <span className="p-float-label">
                <InputNumber
                  min="0"
                  id="number-input"
                  value={minKilometers}
                  onValueChange={(e) => setMinKilometers(e.value)}
                />
                <label htmlFor="number-input">Min kilometers</label>
              </span>
              <span className="p-float-label">
                <InputNumber
                  min="0"
                  id="number-input"
                  value={maxKilometers}
                  onValueChange={(e) => setMaxKilometers(e.value)}
                />
                <label htmlFor="number-input">Max kilometers</label>
              </span>
            </div>
          </div>
        </div>
        <div>
          <Dropdown
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.value)}
            options={options}
            optionLabel="name"
            placeholder="Filter: "
            className="w-full md:w-14rem"
          />

          <Button
            onClick={() => filterVehicles(isFilterPressed)}
            label={isFilterPressed ? "Show All" : "Filter"}
          />
        </div>
      </div>
      <div className="adsContainer">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            {filteredVehicles.length === 0 && isFilterPressed && (
              <h5>No vehicles matched the filter</h5>
            )}

            {isFilterPressed
              ? filteredVehicles
                  .slice(first, first + rows)
                  .map((vehicle) => <Ad key={vehicle.id} vehicle={vehicle} />)
              : vehicleStore.vehicles
                  .filter((vehicle) => vehicle.uid !== user.uid)
                  .slice(first, first + rows)
                  .map((vehicle) => <Ad key={vehicle.id} vehicle={vehicle} />)}
          </>
        )}
      </div>
      {checkCondition() ? (
        <></>
      ) : (
        <Paginator
          className="paginator"
          first={first}
          rows={rows}
          totalRecords={
            isFilterPressed
              ? filteredVehicles.length
              : vehicleStore.vehicles.filter(
                  (vehicle) => vehicle.uid !== user.uid
                ).length
          }
          rowsPerPageOptions={[3, 6, 9]}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

export default Marketplace;
