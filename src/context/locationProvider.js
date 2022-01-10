import React, { createContext, useEffect, useState } from "react";
import Geolocation from "@react-native-community/geolocation";
import { Alert } from "react-native";
import axios from "axios";


export const LocationContext = createContext()
const APIkey = 'd80c8ff3ae6c973'

const LocationProvider = ({children}) => {
  const [startLocation, setStartLocation] = useState()
  const [weatherData, setWeatherData] = useState()

  
useEffect(() => {
  const getLocationData = async () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        setStartLocation(position.coords);
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude
            }&lon=${position.coords.longitude
            }&appid=${APIkey}`)
            setWeatherData(response.data)
        } catch (error) {
          Alert.alert(error.message)
        }
      },
      (error) => {
        console.log(error);
      },
      {
        enableHighAccuracy:false
      }
    )
  }
  getLocationData().catch(console.error)
}, [children])

  return(
    <LocationContext.Provider value={{startLocation, setStartLocation, weatherData, setWeatherData}}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationProvider