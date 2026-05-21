import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

export default function DestinationCard({
  item,
  onFavorite,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
      />

      <TouchableOpacity
        style={styles.favorite}
        onPress={onFavorite}>
        <Icon
          name={item.favorite ? 'heart' : 'heart-outline'}
          size={24}
          color="red"
        />
      </TouchableOpacity>

      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 250,
    marginRight: 15,
  },

  image: {
    width: '100%',
    height: 180,
    borderRadius: 15,
  },

  title: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },

  favorite: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 20,
  },
});