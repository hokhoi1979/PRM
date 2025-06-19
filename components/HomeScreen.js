import {
  View,
  Text,
  ScrollView,
  Pressable,
  FlatList,
  Image,
  Dimensions,
  TextInput,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { fetchApi } from "../api/api";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const [text, setText] = useState("All");
  const [likedItems, setLikedItems] = useState([]);
  const [player, setPlayer] = useState([]);
  const [filter, setFilter] = useState([]);
  const [search, setSearch] = useState("");
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [select, setSelect] = useState(null);

  const screenWidth = Dimensions.get("window").width;
  const itemWidth = (screenWidth - 3 * 10) / 2;

  useEffect(() => {
    const loadFavourites = async () => {
      try {
        const stored = await AsyncStorage.getItem("lovedPlayer");
        const loved = stored ? JSON.parse(stored) : [];
        const ids = loved.map((player) => player.id);
        setLikedItems(ids);
      } catch (err) {
        console.log("Error loading favourites:", err);
      }
    };

    const unsubscribe = navigation.addListener("focus", loadFavourites);
    return unsubscribe;
  }, [navigation]);

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

  // const toggleLike = (id) => {
  //   setLikedItems((prev) =>
  //     prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
  //   );
  // };

  const handleLike = async (item) => {
    const listKey = "lovedPlayer";
    const stored = await AsyncStorage.getItem(listKey);
    let list = stored ? JSON.parse(stored) : [];

    const isLiked = list.some((p) => p.id === item.id);
    let newList;

    try {
      if (isLiked) {
        newList = list.filter((p) => p.id !== item.id);
        alert("Remove player successful!");
      } else {
        newList = [...list, item];
        alert("Save player successful!");
      }

      await AsyncStorage.setItem(listKey, JSON.stringify(newList));
      setLikedItems(newList.map((p) => p.id));
    } catch (error) {
      console.log("AsyncStorage error:", error);
    }
  };

  const getButtonStyle = (item) => ({
    padding: 5,
    borderRadius: 10,
    fontWeight: "600",
    backgroundColor: text === item ? "#333232" : "white",
    color: text === item ? "white" : "#333232",
  });

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

  const getData = async () => {
    try {
      const response = await fetchApi();
      if (response) {
        setPlayer(response);
        setFilter(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (text.toLowerCase() === "all") {
      setFilter(player);
    } else {
      const loc = player.filter((item) => item.team === text);
      setFilter(loc);
    }

    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  }, [text]);

  const handleSearch = () => {
    const searchPlayer = player.filter((item) =>
      item.playerName.toLowerCase().includes(search.toLowerCase())
    );
    setFilter(searchPlayer);
    setSearch("");
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  return (
    <FlatList
      ref={flatListRef}
      data={filter}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      ListHeaderComponent={
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ maxHeight: 60 }}
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 15,
                padding: 15,
                maxHeight: 60,
              }}
            >
              <Pressable onPress={() => setText("All")}>
                <Text style={getButtonStyle("All")}>All</Text>
              </Pressable>
              {[...new Set(player.map((item) => item.team))].map((team) => (
                <Pressable key={team} onPress={() => setText(team)}>
                  <Text style={getButtonStyle(team)}>{team}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <View
            style={{
              paddingHorizontal: 10,
              marginBottom: 10,
              marginTop: 10,
              flexDirection: "row",
              gap: 4,
            }}
          >
            <TextInput
              placeholder="Search player..."
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 10,
                backgroundColor: "#fff",
                width: "80%",
              }}
              onChangeText={(text) => setSearch(text)}
              value={search}
            />
            <Pressable
              style={{ justifyContent: "center" }}
              onPress={handleSearch}
            >
              <Text
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  backgroundColor: "black",
                  color: "white",
                  borderRadius: 7,
                  fontWeight: "600",
                }}
              >
                Search
              </Text>
            </Pressable>
          </View>
        </>
      }
      columnWrapperStyle={{
        justifyContent: "space-between",
        paddingHorizontal: 10,
        paddingTop: 20,
      }}
      renderItem={({ item }) => (
        <Pressable>
          <View
            style={{
              width: itemWidth,
              height: 290,
              flex: 1,
              backgroundColor: "white",
              borderRadius: 15,
              padding: 10,
              marginBottom: 10,
              justifyContent: "space-between",
            }}
          >
            <View style={{ position: "relative" }}>
              <Pressable onPress={() => setSelect(item)}>
                <Image
                  source={{ uri: item.image }}
                  style={{
                    width: "100%",
                    height: 150,
                    borderRadius: 5,
                    resizeMode: "cover",
                  }}
                />
              </Pressable>
              <Pressable
                onPress={async () => await handleLike(item)}
                style={{ position: "absolute", right: 5, top: 5 }}
              >
                <HeartIcon isLiked={likedItems.includes(item.id)} />
              </Pressable>
            </View>
            {select && (
              <Modal visible={true} transparent animationType="fade">
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.7)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Pressable
                    onPress={() => setSelect(null)}
                    style={{ flex: 1, width: "100%", height: "100%" }}
                  >
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        style={{
                          width: 320,
                          height: 320,
                          padding: 2,
                          backgroundColor: "white",
                          borderRadius: 20,
                        }}
                        source={{ uri: select.image }}
                      />
                    </View>
                  </Pressable>
                </View>
              </Modal>
            )}

            <View style={{ marginTop: 5 }}>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <Entypo name="users" size={12} color="black" />
                  <Text style={{ fontWeight: "600" }}>Player: </Text>
                </View>

                <Text>{item.playerName}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flexDirection: "row", gap: 4 }}>
                  <Entypo
                    name="back-in-time"
                    size={16}
                    color="black"
                    style={{ position: "relative", right: 2 }}
                  />
                  <Text style={{ fontWeight: "600" }}>Time: </Text>
                </View>
                <Text>
                  {Math.floor(item.MinutesPlayed / 60)}h{" "}
                  {item.MinutesPlayed % 60}m
                </Text>
              </View>
              <View style={{ flexDirection: "row", gap: 2 }}>
                <View>
                  {item?.isCaptain && (
                    <>
                      {" "}
                      <View
                        style={{ flexDirection: "row", gap: 5, marginTop: 2 }}
                      >
                        <FontAwesome5
                          name="copyright"
                          size={15}
                          color="black"
                        />
                        <Text style={{ fontWeight: "600" }}>Captain</Text>{" "}
                      </View>
                    </>
                  )}
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 3,
                }}
              >
                <View style={{ flexDirection: "row", gap: 5 }}>
                  <AntDesign name="staro" size={15} color="black" />
                  <Text style={{ fontWeight: "600", marginRight: 4 }}>
                    Rating:
                  </Text>
                </View>
                {item.feedbacks?.[0]?.rating ? (
                  <StarRating rating={item.feedbacks[0].rating} />
                ) : (
                  <Text>No rating</Text>
                )}
              </View>

              <Pressable
                onPress={() =>
                  navigation.navigate("Detail", {
                    playerName: item.playerName,
                    id: item.id,
                    image: item.image,
                    MinutesPlayed: item.MinutesPlayed,
                    YoB: item.YoB,
                    position: item.position,
                    team: item.team,
                    PassingAccuracy: item.PassingAccuracy,
                    age: item.age,
                    comment: item.feedbacks?.[0]?.comment ?? "",
                    date: item.feedbacks?.[0]?.date ?? "",
                    rating: item.feedbacks?.[0]?.rating ?? "",
                    feedbacks: item.feedbacks,
                    // onToggleLike: () => toggleLike(item.id),
                    // updateLikeState: (liked) => {
                    //   setLikedItems((prev) =>
                    //     liked
                    //       ? [...prev, item.id]
                    //       : prev.filter((id) => id !== item.id)
                    //   );
                    // },
                  })
                }
              >
                {({ pressed }) => (
                  <View
                    style={{
                      margin: "auto",
                      backgroundColor: pressed ? "#555" : "gray",
                      width: "100%",
                      marginTop: 10,
                      borderRadius: 5,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        padding: 2,
                        paddingTop: 8,
                        paddingBottom: 8,
                        textAlign: "center",
                      }}
                    >
                      View Detail
                    </Text>
                    <AntDesign name="rightcircleo" size={16} color="white" />
                  </View>
                )}
              </Pressable>
            </View>
          </View>
        </Pressable>
      )}
    />
  );
}
