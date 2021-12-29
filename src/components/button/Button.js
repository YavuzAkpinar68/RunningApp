import React from "react"
import {TouchableOpacity, Text} from "react-native"
import styles from "./Buttonstyle"

const Button = ({title, onPress, theme="default"}) => {
  return(
    <TouchableOpacity 
      style={styles[theme].container}
      onPress={onPress}>
      <Text style={styles[theme].title}>{title}</Text>
    </TouchableOpacity>
  )
}

export default Button