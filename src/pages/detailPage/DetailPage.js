import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { Alert, SafeAreaView, ScrollView, Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import Button from "../../components/button/Button";
import firestore from '@react-native-firebase/firestore';
import styles from "./DetailPageStyles";

const DetailPage = () => {
  const route = useRoute()
  const item = route.params.item
  const navigation = useNavigation()

  const initialRegion = {
    latitude: item.StartLocation.Latitude,
    longitude: item.StartLocation.longitude,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  const handleRemoveActivity = () => {
    firestore()
      .collection('RunningData')
      .doc(item.id)
      .delete()
      .then(() => {
        Alert.alert("Activity Removed !");
      });
    navigation.goBack()
  }

  return (
    <SafeAreaView style={styles.outerContainer}>
      <MapView
        initialRegion={initialRegion}
        style={styles.mapView}>
        {item.StartLocation && <Marker coordinate={{
          latitude: item.StartLocation.Latitude,
          longitude: item.StartLocation.longitude
        }}></Marker>}
        {item.watchLocation && <Polyline coordinates={item.watchLocation}></Polyline>}
      </MapView>
      <View style={styles.container}>
        <ScrollView>
        <View style={styles.infoView}>
          <Text style={styles.text}>Activity Date</Text>
          <Text style={styles.text}>{item.date}</Text>
        </View>
        <View style={styles.infoView}> 
          <Text style={styles.text}>Activity Location</Text>
          <Text style={styles.text}>{item.location}</Text>
        </View>
        <View style={styles.infoView}>
          <Text style={styles.text}>Activity Time</Text>
          <Text style={styles.text}>{item.TotalTime}</Text>
        </View>
        <View style={styles.infoView}>
          <Text style={styles.text}>Activity Distance</Text>
          <Text style={styles.text}>{item.TotalDistance.toFixed(2)}</Text>
        </View>
        <View style={styles.infoView}>
          <Text style={styles.text}>Avarage Speed</Text>
          <Text style={styles.text}>{item.AvarageSpeed.toFixed(2)}</Text>
        </View>
        </ScrollView>
      </View>
      <Button title="Remove Activity" onPress={handleRemoveActivity} />
    </SafeAreaView>
  )
}

export default DetailPage