import { makeObservable, observable, action } from "mobx";
import axios from "axios";

class VehicleStore {
  vehicles = [];

  constructor(value) {
    makeObservable(this, {
      vehicles: observable,
      addVehicle: action,
      getFromDatabase: action,
      removeAll: action,
    });
  }

  addVehicle(veh) {
    this.vehicles.push(veh);
  }

  removeVehicle(index) {
    this.vehicles.splice(index, 1);
  }

  async getFromDatabase() {
    this.removeAll();
    const url =
      "https://api.baasic.com/beta/webprojekt/resources/Vehicle/?rpp=500";
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    response.data.item.map((item) => this.addVehicle(item));
  }

  removeAll() {
    this.vehicles = [];
  }
}

const vehicleStore = new VehicleStore();
export default vehicleStore;
