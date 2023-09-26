import { Button } from "primereact/button";
import "../index.css";

import { useState, useEffect } from "react";
import { useObserver } from "mobx-react";
import vehicleStore from "../common/VehicleStore";
import AdModel from "./AdModel";
import { Paginator } from "primereact/paginator";
import AddVehicle from "./AddVehicle";
import { auth } from "./FirebaseConfig";
import makeModelStore from "../common/MakeModelStore";
const Profile = () => {
  const [first, setFirst] = useState(0);
  const [isShown, setIsShown] = useState(false);
  const [rows, setRows] = useState(3);
  const user = auth.currentUser;
  useEffect(() => {
    makeModelStore.getMakes();
    makeModelStore.getModels();
    vehicleStore.getFromDatabase();
  }, []);

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const toggleIsShown = () => {
    setIsShown(!isShown);
  };
  return useObserver(() => (
    <>
      <div>
        <div className="adContainer">
          {user ? (
            <>
              {vehicleStore.vehicles
                .filter((vehicle) => vehicle.uid === user.uid)
                .slice(first, first + rows)
                .map((vehicle) => (
                  <AdModel key={vehicle.id} vehicle={vehicle} />
                ))}
            </>
          ) : (
            <h5>Loading...</h5>
          )}
        </div>

        {vehicleStore.vehicles.filter((vehicle) => vehicle.uid === user.uid)
          .length > 0 ? (
          <Paginator
            className="paginator"
            first={first}
            rows={rows}
            totalRecords={
              vehicleStore.vehicles.filter(
                (vehicle) => vehicle.uid === user.uid
              ).length
            }
            rowsPerPageOptions={[3, 6, 9]}
            onPageChange={onPageChange}
          />
        ) : (
          <h5>You don't have any ads</h5>
        )}

        <Button
          onClick={() => setIsShown(!isShown)}
          label={isShown ? "Cancel" : "Add new vehicle"}
          icon={isShown ? "pi pi-times" : "pi pi-check"}
          iconPos="right"
          style={{ backgroundColor: isShown ? "#691009" : "#1a3459" }}
        />
      </div>
      <div>
        {isShown && (
          <AddVehicle
            models={makeModelStore.models}
            makes={makeModelStore.makes}
            toggleIsShown={toggleIsShown}
          />
        )}
      </div>
    </>
  ));
};
export default Profile;
