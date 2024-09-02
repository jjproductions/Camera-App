import React, { useState, useEffect, useRef } from "react";
import { Text, View, Pressable } from "react-native";
import { Camera } from "expo-camera";

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      let photo = await cameraRef.current.takePictureAsync();
      console.log(photo);
    }
  };

  const toggleCameraType = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={type} ref={cameraRef}>
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Pressable onPress={takePicture}>
            <Text style={{ fontSize: 18, marginBottom: 10, color: "white" }}>
              Take Picture
            </Text>
          </Pressable>
          <Pressable onPress={toggleCameraType}>
            <Text style={{ fontSize: 18, marginBottom: 10, color: "white" }}>
              Flip Camera
            </Text>
          </Pressable>
        </View>
      </Camera>
    </View>
  );
};

export default CameraScreen;
