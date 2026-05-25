import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MemberAvatar = ({ members }) => {
  if (!members || members.length === 0) return null;

  return (
    <View style={styles.container}>
      {members.map((member, index) => (
        <View key={index} style={[styles.avatar, { marginLeft: index > 0 ? -10 : 0 }]}>
          <Text style={styles.avatarText}>{member.charAt(0).toUpperCase()}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  avatarText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default MemberAvatar;
