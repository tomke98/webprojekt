import { makeObservable, observable, action } from "mobx";
import axios from "axios";

class MakeModelStore {
  makes = [];
  models = [];

  constructor(value) {
    makeObservable(this, {
      makes: observable,
      models: observable,
      getModels: action,
      getMakes: action,
    });
  }

  async getModels() {
    const url =
      "https://api.baasic.com/beta/webprojekt/resources/VehicleModel?rpp=500";
    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      this.models = [...response.data.item];
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async getMakes() {
    const url =
      "https://api.baasic.com/beta/webprojekt/resources/VehicleMake?rpp=500";
    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      this.makes = [...response.data.item];
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
}

const makeModelStore = new MakeModelStore();
export default makeModelStore;
