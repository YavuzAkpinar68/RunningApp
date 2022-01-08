import React from "react";
import { FlatList, SafeAreaView, Text } from "react-native";
import useFetchFirestoreData from "../../hooks/useFetchFirestoreData";
import { useNavigation } from "@react-navigation/native";

import ActivityHistoryCard from "../../components/cards/ActivityHistoryCard"
import styles from "./LeaderboardPageStyles";


const LeaderboardPage = () => {
  const {firestoreData} = useFetchFirestoreData()

  const navigation = useNavigation()

  const handleRenderItem = ({item, index}) => (
    <ActivityHistoryCard item={item} index={index + 1} onPress={() =>  navigation.navigate('Detail', {item:item}) }/>
  )

  return(
    <SafeAreaView style={styles.container}>
      <FlatList 
        data={firestoreData.sort((a, b) => b.TotalDistance - a.TotalDistance)} 
        renderItem={handleRenderItem} 
      />
    </SafeAreaView>
  )
}

export default LeaderboardPage