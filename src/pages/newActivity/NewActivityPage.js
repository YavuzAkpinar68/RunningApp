import React, { useEffect, useState } from "react";
import { ScrollView, SafeAreaView, Text, View, Dimensions, Alert } from "react-native";
import MapView, { Marker, Polyline } from 'react-native-maps'
import styles from "./NewActivityPageStyles";
import Geolocation from "@react-native-community/geolocation";
import Button from "../../components/button/Button";
import database from '@react-native-firebase/database'
import { BarChart, } from "react-native-chart-kit";



const NewActivityPage = () => {
  const [location, setLocation] = useState()
  const [watchLocation, setWatchLocation] = useState([])
  const [finish, setFinish] = useState()
  const [distanceBetween, setDistanceBetween] = useState([])
  const [seconds, setSeconds] = useState(0)
  const [dt, setDt] = useState([])

  const sum = (a, b) => a + b
  const totalDistance = distanceBetween.length >= 2 ? distanceBetween.reduce(sum) : 0

  const avarageSpeed = dt ? totalDistance / dt[length - 1] : 0 

  const barData = {
    labels: dt,
    datasets: [
      {
        data: distanceBetween
      }
    ]
  }

  const initialRegion = {
    latitude: 41.0391683,
    longitude: 28.9982707,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  const handleStart = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('get.position', position);
        setLocation(position.coords);
      },
      (error) => {
        console.log(error);
      },
      {
      }
    )
    console.log(watchLocation)
    let interval = setInterval(function (counter) {
      return function () {
        setDt([counter++, ...dt]);
        console.log(counter)
        setWatchLocation([])
      };
    }(0), 30000);
  }

  useEffect(() => { handleDistance() }, [dt])

  const handleFinish = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('finish.position', position);
        setFinish(position.coords);
      },
      (error) => {
        console.log(error);
      },
      {
      }
    )
    handlerunTime(),
      handleDistance()
  }

  const handleClear = () => {
    setLocation()
    setFinish()
    setWatchLocation([])
    setDistanceBetween([])
    setSeconds()
  }

  const handleDistance = () => {
    if (watchLocation.length >= 2) {
      const R = 6371e3; // metres
      const φ1 = watchLocation[0].latitude * Math.PI / 180 // φ, λ in radians
      const φ2 = watchLocation[watchLocation.length - 1].latitude * Math.PI / 180
      const Δφ = (watchLocation[watchLocation.length - 1].latitude - watchLocation[0].latitude) * Math.PI / 180
      const Δλ = (watchLocation[watchLocation.length - 1].longitude - watchLocation[0].longitude) * Math.PI / 180
      const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const d = R * c // in metres
      setDistanceBetween([d, ...distanceBetween])
      console.log('bbbb', distanceBetween)


    } else {
      console.log("yeterli data yk ")
    }


  }

  /*Geolocation.watchPosition(
    (position) => {
      setWatchLocation([{latitude:position.coords.latitude, longitude:position.coords.longitude}, ...watchLocation])
      console.log('position',watchLocation)
    },
    (error) => {
      console.log(error);
    },
    {enableHighAccuracy:true,
    distanceFilter:10
    }
  );*/
  const handleUserTracking = (e) => {
    console.log("aaaa", e.nativeEvent)
    console.log(distanceBetween)
    setWatchLocation([{
      time: e.nativeEvent.coordinate.timestamp,
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude
    },
    ...watchLocation])
    handlerunTime()
  }
  const handlerunTime = () => {
    watchLocation.length >= 2 ?
      setSeconds((watchLocation[0].time - watchLocation[watchLocation.length - 1].time) / (1000 + 10) / 60) : setSeconds(0)
    return seconds
  }

  return (
    <SafeAreaView style={styles.outerContainer}>
      <MapView
        style={styles.mapView}
        initialRegion={initialRegion}
        showsUserLocation={true}
        userLocationPriority="balanced"
        onUserLocationChange={finish === undefined && location && handleUserTracking}>
        {location !== undefined && <Marker coordinate={location}></Marker>}
        {finish !== undefined && <Marker coordinate={finish}></Marker>}
        {watchLocation !== undefined && location && <Polyline
          miterLimit={10}
          lineCap="square" strokeWidth={4} strokeColor="blue" coordinates={watchLocation}></Polyline>}
      </MapView>
      <ScrollView
        style={styles.container}>
        <Button title="Start" onPress={handleStart} ></Button>
        <Button title="Finish" onPress={handleFinish}></Button>
        <Button title="Clear" onPress={handleClear}></Button>
        <Text>Total distance: {totalDistance}</Text>
        <Text>Total Time : {seconds}</Text>
        <Text>Average Speed: {avarageSpeed} </Text>
        <ScrollView horizontal={true}
          contentOffset={{ x: 10000, y: 0 }}>
          <BarChart
            data={barData}
            width={barData.labels.length >= 6 ? barData.labels.length * Dimensions.get("screen").width / 7 : Dimensions.get("screen").width} // from react-native
            height={220}
            yAxisSuffix=" m"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "black",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "silver"
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  )
}

export default NewActivityPage