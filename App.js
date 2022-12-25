import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, ScrollView, PermissionsAndroid, AppState } from 'react-native';
import CallDetectorManager from 'react-native-call-detection'
import ReactNativeForegroundService from "@supersami/rn-foreground-service";



export default function App() {
  useEffect(() => {
    askPermission();
  });

  askPermission = async () => {
    try {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      ]);
    } catch (err) {
      console.warn(err);
    }
  };
  useEffect(() => {
    const callDetector = new CallDetectorManager((event, phoneNumber) => {
      if (event === 'Disconnected') {
      }
      else if (event === 'Connected') {
      }
      else if (event === 'Incoming') {
        console.log('Incoming', phoneNumber);
      }
      else if (event === 'Dialing') {
      }
      else if (event === 'Offhook') {
      }
      else if (event === 'Missed') {
      }
    },
      true
    )
    const subscription = AppState.addEventListener("change", nextAppState => {
      if(nextAppState === 'active'){
        onStop()
      }else onStart()
    })
    return () => {
      // callDetector.dispose()
      subscription.remove()
    }
  }, [])

  const onStart = () => {
    if (ReactNativeForegroundService.is_task_running('callLogTask')) return;
    ReactNativeForegroundService.add_task(
      () => {       
        console.log('start task');
      },
      {
        delay: 5000,
        onLoop: true,
        taskId: 'callLogTask',
        onError: (e) => console.log(`Error logging:`, e),
      },
    );
    return ReactNativeForegroundService.start({
      id: 144,
      visibility:'secret',
      importance:'low'
    });
  };

  const onStop = () => {
    if (ReactNativeForegroundService.is_task_running('callLogTask')) {
      ReactNativeForegroundService.remove_task('callLogTask');
    }
    return ReactNativeForegroundService.stop();
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: 'yellows' }}>hello world</Text>
    </View>
  );
}