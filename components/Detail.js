import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/vi";
import Vi from "dayjs/locale/vi";
import AsyncStorage from "@react-native-async-storage/async-storage";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("vi");

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

const StarRating = ({ rating }) => {
  const maxStars = 5;

  return (
    <View style={{ flexDirection: "row" }}>
      {[...Array(maxStars)].map((_, i) => (
        <FontAwesome
          key={i}
          name={i + 1 <= rating ? "star" : "star-o"}
          size={12}
          color="#ffd700"
          style={{ marginRight: 2 }}
        />
      ))}
    </View>
  );
};

export default function Detail({ route }) {
  const {
    playerName,
    image,
    MinutesPlayed,
    YoB,
    comment,
    position,
    rating,
    PassingAccuracy,
    id,
    age,
    date,
    feedbacks,
    // updateLikeState,    // onToggleLike,// isLiked,
  } = route.params;
  const [filterRange, setFilterRange] = useState(null);
  const [liked, setLiked] = useState(false); // Khởi tạo mặc định

  const navigation = useNavigation();
  const totalComments = feedbacks.length;

  const handleLike = async () => {
    const newLike = !liked;
    setLiked(newLike);

    const listKey = "lovedPlayer";
    try {
      const stored = await AsyncStorage.getItem(listKey);
      let list = stored ? JSON.parse(stored) : [];

      if (newLike) {
        if (!list.some((p) => p.id === id)) {
          list.push({
            id,
            playerName,
            image,
            MinutesPlayed,
            YoB,
            comment,
            position,
            rating,
            PassingAccuracy,
            age,
            date,
            feedbacks,
          });
        }
        alert("Player added to favorites!");
      } else {
        list = list.filter((p) => p.id !== id);
        alert("Player removed from favorites!");
      }

      await AsyncStorage.setItem(listKey, JSON.stringify(list));
    } catch (error) {
      console.log("AsyncStorage error:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const checkLikedStatus = async () => {
        try {
          const stored = await AsyncStorage.getItem("lovedPlayer");
          const list = stored ? JSON.parse(stored) : [];
          const isLiked = list.some((p) => p.id === id);
          setLiked(isLiked);
        } catch (e) {
          console.log("Failed to fetch liked status:", e);
          setLiked(false);
        }
      };

      checkLikedStatus();
    }, [id])
  );

  const totalRating = feedbacks.reduce((sum, fb) => sum + fb.rating, 0);
  const avgRating = feedbacks.length > 0 ? totalRating / feedbacks.length : 0;
  const filteredFeedbacks = filterRange
    ? feedbacks.filter(
        (fb) => fb.rating >= filterRange[0] && fb.rating <= filterRange[1]
      )
    : feedbacks;

  return (
    <ScrollView>
      <View style={{ backgroundColor: "white", flex: 1, padding: 10 }}>
        <View style={{ flexDirection: "row", gap: 4, margin: "auto" }}>
          <FontAwesome6 name="baseball" size={16} color="black" />
          <Text style={{ fontWeight: 600 }}>{playerName}</Text>
        </View>
        <View>
          <Image
            source={{ uri: image }}
            style={{
              width: "100%",
              padding: 2,
              backgroundColor: "black",
              height: 300,
              marginTop: 5,
              borderRadius: 15,
              position: "relative",
            }}
          />{" "}
          <Pressable
            style={{ position: "absolute", left: 10, top: 30 }}
            onPress={() => navigation.goBack()}
          >
            {({ pressed }) => (
              <View
                style={{
                  width: 35,
                  height: 35,
                  backgroundColor: pressed
                    ? "rgba(0,0,0,0.6)"
                    : "rgba(0,0,0,0.3)",
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AntDesign name="back" size={24} color="white" />
              </View>
            )}
          </Pressable>
          <Pressable
            style={{ position: "absolute", right: 10, top: 10 }}
            onPress={handleLike}
          >
            <HeartIcon isLiked={liked} />
          </Pressable>
        </View>
      </View>{" "}
      <View style={{ padding: 10 }}>
        <View style={{ flexDirection: "row", gap: 4 }}>
          <FontAwesome5 name="trophy" size={18} color="#c5b123" />{" "}
          <Text style={{ fontWeight: 600, marginBottom: 10 }}>
            Information of Perfume
          </Text>
        </View>

        <View style={{ flexDirection: "row", width: "100%" }}>
          <View
            style={{
              padding: 10,
              backgroundColor: "white",
              borderColor: "gray",
              borderRadius: 15,
              width: "49%",
              height: 70,
              marginRight: "2%",
              // Shadow cho iOS
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 3,
              // Shadow cho Android
              elevation: 5,
            }}
          >
            <View
              style={{ flexDirection: "row", gap: 2, justifyContent: "center" }}
            >
              <MaterialIcons name="multiline-chart" size={24} color="#7c83e5" />
              <Text style={{ fontSize: 13, marginTop: 3 }}>
                PassingAccuracy
              </Text>
            </View>
            <Text style={{ margin: "auto", fontSize: 20, fontWeight: 600 }}>
              {PassingAccuracy * 100}%
            </Text>
          </View>

          <View
            style={{
              padding: 10,
              backgroundColor: "white",
              borderColor: "gray",
              borderRadius: 15,
              width: "49%",
              height: 70,
              marginRight: "2%",
              // Shadow cho iOS
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 3,
              // Shadow cho Android
              elevation: 5,
            }}
          >
            <View
              style={{ flexDirection: "row", gap: 2, justifyContent: "center" }}
            >
              <MaterialCommunityIcons
                name="clock-time-eleven-outline"
                size={22}
                color="#d2a521"
              />
              <Text style={{ fontSize: 13, marginTop: 3 }}>Age</Text>
            </View>
            <Text style={{ margin: "auto", fontSize: 20, fontWeight: 600 }}>
              {age}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", width: "100%", marginTop: 10 }}>
          <View
            style={{
              padding: 10,
              backgroundColor: "white",
              borderColor: "gray",
              borderRadius: 15,
              width: "49%",
              height: 70,
              marginRight: "2%",
              // Shadow cho iOS
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 3,
              // Shadow cho Android
              elevation: 5,
            }}
          >
            <View
              style={{ flexDirection: "row", gap: 2, justifyContent: "center" }}
            >
              <AntDesign name="dingding-o" size={22} color="#18dcd2" />
              <Text style={{ fontSize: 13, marginTop: 3 }}>Since</Text>
            </View>
            <Text style={{ margin: "auto", fontSize: 20, fontWeight: 600 }}>
              {YoB}
            </Text>
          </View>

          <View
            style={{
              padding: 10,
              backgroundColor: "white",
              borderColor: "gray",
              borderRadius: 15,
              width: "49%",
              height: 70,
              marginRight: "2%",
              // Shadow cho iOS
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 3,
              // Shadow cho Android
              elevation: 5,
            }}
          >
            <View
              style={{ flexDirection: "row", gap: 2, justifyContent: "center" }}
            >
              <Ionicons name="timer" size={24} color="#29b3fc" />
              <Text style={{ fontSize: 13, marginTop: 3 }}>MinutesPlayed</Text>
            </View>
            <Text style={{ margin: "auto", fontSize: 20, fontWeight: 600 }}>
              {Math.floor(MinutesPlayed / 60)}h {MinutesPlayed % 60}m
            </Text>
          </View>
        </View>

        <View style={{ padding: 10 }}>
          <Text style={{ color: "#0596b6", fontWeight: 600, marginBottom: 5 }}>
            Reviews
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { label: "Tất cả", range: null },
              { label: "1–2 ★", range: [1, 2] },
              { label: "2–3 ★", range: [2, 3] },
              { label: "3–4 ★", range: [3, 4] },
              { label: "5 ★", range: [5, 5] },
            ].map((item, index) => (
              <Pressable
                key={index}
                onPress={() => setFilterRange(item.range)}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  backgroundColor:
                    filterRange === item.range ||
                    (filterRange &&
                      item.range &&
                      filterRange[0] === item.range[0] &&
                      filterRange[1] === item.range[1])
                      ? "#007BFF"
                      : "#e0e0e0",
                  borderRadius: 20,
                  marginRight: 8,
                }}
              >
                <Text
                  style={{
                    color:
                      filterRange === item.range ||
                      (filterRange &&
                        item.range &&
                        filterRange[0] === item.range[0] &&
                        filterRange[1] === item.range[1])
                        ? "white"
                        : "black",
                  }}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View
          style={{
            backgroundColor: "white",
            width: "full",
            borderRadius: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 2,
              padding: 10,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
            >
              <Text style={{ fontSize: 20 }}>{avgRating.toFixed(2)}</Text>
              <AntDesign style={{}} name="star" size={15} color="#fecf02" />
              <View style={{ flexDirection: "row" }}>
                <Text>Rating for player </Text>
                <Text>({totalComments})</Text>
              </View>
            </View>
          </View>

          <View
            style={{ width: "full", height: 1, backgroundColor: "#a9a9a8" }}
          ></View>

          {/* <ScrollView> */}
          {filteredFeedbacks?.map((fb) => (
            <View>
              {" "}
              <View
                style={{
                  padding: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <View style={{ flexDirection: "row" }}>
                    {" "}
                    <AntDesign name="user" size={15} color="black" />
                    <Text>{fb.author}</Text>
                  </View>
                  <StarRating rating={fb.rating} />
                </View>
                <View>
                  {fb.date && dayjs(fb.date).isValid() ? (
                    <Text>{dayjs(fb.date).format("DD/MM/YYYY")}</Text>
                  ) : null}
                </View>
              </View>
              <View style={{ paddingLeft: 10 }}>
                <Text style={{ fontStyle: "italic", fontWeight: 600 }}>
                  {fb.comment}
                </Text>
              </View>
              <View
                style={{
                  width: "full",
                  height: 1,
                  backgroundColor: "#e9e9e9",
                  marginTop: 5,
                }}
              ></View>
            </View>
          ))}
          {/* </ScrollView> */}
        </View>
      </View>
    </ScrollView>
  );
}
