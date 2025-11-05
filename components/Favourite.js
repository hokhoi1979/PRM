import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  Alert,
  PanResponder,
} from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const StarRating = ({ rating }) => {
  const maxStars = 5;
  return (
    <View style={{ flexDirection: "row" }}>
      {[...Array(maxStars)].map((_, i) => (
        <FontAwesome
          key={i}
          name={i + 1 <= rating ? "star" : "star-o"}
          size={16}
          color="#ffd700"
          style={{ marginRight: 2 }}
        />
      ))}
    </View>
  );
};

const HeartIcon = ({ isLiked }) => (
  <View style={{ position: "relative", width: 28, height: 28 }}>
    <FontAwesome
      name="heart"
      size={20}
      color="black"
      style={{ position: "absolute", top: 0, left: 0 }}
    />
    <FontAwesome
      name="heart"
      size={18}
      color={isLiked ? "#ec4d4d" : "white"}
      style={{ position: "absolute", top: 1, left: 1 }}
    />
  </View>
);

export default function Favourite() {
  const [player, setPlayer] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const navigation = useNavigation();
  const itemRefs = useRef([]);

  useFocusEffect(
    useCallback(() => {
      const loadLovedPlayers = async () => {
        const stored = await AsyncStorage.getItem("lovedPlayer");
        if (stored) {
          const list = JSON.parse(stored);
          setPlayer(list);
        }
      };

      loadLovedPlayers();
    }, [])
  );

  const handleLike = async (item) => {
    const key = "lovedPlayer";
    const store = await AsyncStorage.getItem(key);
    let list = store ? JSON.parse(store) : [];

    const isLiked = list.some((p) => p.id === item.id);
    let newList;
    try {
      if (isLiked) {
        newList = list.filter((p) => p.id != item.id);
        alert("Remove successful!");
      } else {
        newList = [...list, item];
        alert("Add successful!");
      }

      await AsyncStorage.setItem(key, JSON.stringify(newList));
      setPlayer(newList);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAll = () => {
    Alert.alert("Confirm", "Do you want to delete all?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          await AsyncStorage.removeItem("lovedPlayer");
          setPlayer([]);
          setSelectedIds([]);
          alert("Delete all successful!");
        },
      },
    ]);
  };

  const deleteSelected = () => {
    Alert.alert("Confirm", "Delete selected players?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          const updated = player.filter((p) => !selectedIds.includes(p.id));
          await AsyncStorage.setItem("lovedPlayer", JSON.stringify(updated));
          setPlayer(updated);
          setSelectedIds([]);
          setIsSelecting(false);
        },
      },
    ]);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isSelecting,
      onPanResponderMove: (_, gesture) => {
        itemRefs.current.forEach((ref, index) => {
          if (!ref) return;
          ref.measure((fx, fy, width, height, px, py) => {
            const y = gesture.moveY;
            if (
              y >= py &&
              y <= py + height &&
              !selectedIds.includes(player[index].id)
            ) {
              setSelectedIds((prev) => [...prev, player[index].id]);
            }
          });
        });
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderRelease: () => {
        setIsSelecting(false);
      },
    })
  ).current;

  return (
    <View {...(isSelecting ? panResponder.panHandlers : {})}>
      <ScrollView scrollEnabled={!isSelecting}>
        {player.length > 0 ? (
          <>
            <Pressable onPress={deleteAll}>
              {({ pressed }) => (
                <View
                  style={{
                    flexDirection: "row",
                    padding: 5,
                    width: 180,
                    height: 30,
                    marginTop: 10,
                    marginLeft: 10,
                    borderRadius: 10,
                    backgroundColor: pressed ? "#e38d8f" : "#ef4549",
                    gap: 2,
                    justifyContent: "center",
                  }}
                >
                  <AntDesign name="delete" size={20} color="white" />
                  <Text style={{ fontSize: 18, color: "white" }}>
                    Delete All Player
                  </Text>
                </View>
              )}
            </Pressable>

            {isSelecting && (
              <Pressable
                onPress={() => {
                  setIsSelecting(false);
                  setSelectedIds([]);
                }}
              >
                <View
                  style={{
                    marginLeft: 10,
                    marginTop: 10,
                    backgroundColor: "#888",
                    padding: 10,
                    borderRadius: 8,
                    width: 180,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AntDesign name="closecircleo" size={20} color="white" />
                  <Text style={{ color: "white", marginLeft: 6 }}>
                    Cancel Selection
                  </Text>
                </View>
              </Pressable>
            )}

            {selectedIds.length > 0 && (
              <Pressable onPress={deleteSelected}>
                <View
                  style={{
                    marginLeft: 10,
                    marginTop: 10,
                    backgroundColor: "#333",
                    padding: 10,
                    borderRadius: 8,
                    width: 180,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AntDesign name="delete" size={20} color="white" />
                  <Text style={{ color: "white", marginLeft: 6 }}>
                    Delete Selected ({selectedIds.length})
                  </Text>
                </View>
              </Pressable>
            )}

            <View>
              {player.map((p, index) => (
                <Pressable
                  key={p.id}
                  onLongPress={() => {
                    if (player.length > 1) {
                      setIsSelecting(true);
                      setSelectedIds([p.id]);
                    }
                  }}
                  delayLongPress={300}
                  onPress={() => {
                    if (isSelecting) {
                      if (selectedIds.includes(p.id)) {
                        setSelectedIds((prev) =>
                          prev.filter((id) => id !== p.id)
                        );
                      } else {
                        setSelectedIds((prev) => [...prev, p.id]);
                      }
                    } else {
                      navigation.navigate("Detail", { ...p });
                    }
                  }}
                >
                  {({ pressed }) => (
                    <View
                      ref={(ref) => (itemRefs.current[index] = ref)}
                      style={{
                        width: "90%",
                        height: 80,
                        backgroundColor: selectedIds.includes(p.id)
                          ? "#d4edda"
                          : pressed
                            ? "#edeaea"
                            : "white",
                        margin: "auto",
                        borderRadius: 10,
                        marginTop: 10,
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        <View
                          style={{
                            width: 70,
                            height: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Image
                            source={{ uri: p?.image }}
                            style={{
                              width: 60,
                              height: 60,
                              borderRadius: 10,
                              shadowColor: "gray",
                            }}
                          />
                        </View>
                        <View style={{ justifyContent: "center" }}>
                          <View style={{ flexDirection: "row", gap: 5 }}>
                            <FontAwesome
                              name="soccer-ball-o"
                              size={14}
                              color="black"
                            />
                            <Text>{p.playerName}</Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              gap: 5,
                              marginTop: 5,
                            }}
                          >
                            <AntDesign name="team" size={14} color="gray" />
                            <Text style={{ color: "gray" }}>{p.team}</Text>
                          </View>
                          <StarRating rating={p.feedbacks[0]?.rating} />
                        </View>
                      </View>

                      <Pressable
                        style={{ padding: 10 }}
                        onPress={() => handleLike(p)}
                      >
                        <HeartIcon
                          isLiked={player.some((item) => item.id === p.id)}
                        />
                      </Pressable>
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          </>
        ) : (
          <View
            style={{
              flexDirection: "row",
              margin: "auto",
              marginTop: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialCommunityIcons
              name="delete-empty-outline"
              size={24}
              color="#d63236"
            />
            <Text style={{ fontSize: 20, fontWeight: 600, color: "#d63236" }}>
              No data Player
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
