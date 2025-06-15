import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";
import { FriendRequest } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const FriendsPage = () => {
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");
  const [searchQuery, setSearchQuery] = useState("");

  const { ...state } = useAuth();
  const { profile } = useProfile();

  const [showFriendModal, setShowFriendModal] = useState(false);
  const [friendEmail, setFriendEmail] = useState("");

  const [receivedRequests, setRecieveRequests] = useState<FriendRequest[]>([]);

  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    const getRequests = async () => {
      const responseone = await fetch(
        `http://localhost:7001/api/v1/user/incomingfriends/${state.user?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const dataOne = await responseone.json();

      const responsetwo = await fetch(
        `http://localhost:7001/api/v1/user/outgoingfriends/${state.user?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const dataTwo = await responsetwo.json();

      setRecieveRequests(dataOne.requests);
      setSentRequests(dataTwo.requests);
    };
  }, []);

  const getAvatarColor = (username: string) => {
    const colors = [
      "#4FFFB0",
      "#FFD700",
      "#FF6B6B",
      "#8A2BE2",
      "#00D4AA",
      "#FF8E8E",
    ];
    const index = username.length % colors.length;
    return colors[index];
  };

  const FriendRequestCard: React.FC<{
    request: FriendRequest;
    type: "received" | "sent";
  }> = ({ request, type }) => (
    <View style={styles.requestCard}>
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]}
        style={styles.requestGradient}
      >
        <View style={styles.requestHeader}>
          <View style={styles.userInfo}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: getAvatarColor(request.username) },
              ]}
            >
              <Text style={styles.avatarText}>{request.avatar}</Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.username}>{request.username}</Text>
              <Text style={styles.mutualFriends}>
                {request.mutualFriends} mutual friends
              </Text>
              <Text style={styles.dateRequested}>{request.dateRequested}</Text>
            </View>
          </View>
        </View>

        <View style={styles.userStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{request.completedDares}</Text>
            <Text style={styles.statLabel}>Dares</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{request.points}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          {type === "received" ? (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.acceptButton]}
              >
                <LinearGradient
                  colors={["#4FFFB0", "#00D4AA"]}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.acceptText}>Accept</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.declineButton]}
              >
                <Text style={styles.declineText}>Decline</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
            >
              <Text style={styles.cancelText}>Cancel Request</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </View>
  );

  // const filteredRequests = (type: "received" | "sent") => {
  //   const requests = type === "received" ? receivedRequests : sentRequests;
  //   return requests.filter((request) =>
  //     request.username.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  // };

  // Add before the FriendRequestModal component
  const handleSendRequest = async () => {
    try {
      const response = await fetch(
        `http://localhost:7001/api/v1/user/friend-request/${state.user?.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${state.token}`,
          },
          body: JSON.stringify({
            senderId: state.user?.id,
            receiverEmail: friendEmail,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSentRequests([...sentRequests, data.request]);
        setFriendEmail("");
        setShowFriendModal(false);
        setActiveTab("sent");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Failed to send friend request");
    }
  };

  // Add before the return statement
  const FriendRequestModal = () => (
    <Modal
      visible={showFriendModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowFriendModal(false)}
    >
      <View style={styles.modalContainer}>
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]}
          style={styles.modalContent}
        >
          <Text style={styles.modalTitle}>Add Friend</Text>
          <TextInput
            style={styles.emailInput}
            placeholder="Enter friend's email"
            placeholderTextColor="#B0B0B0"
            value={friendEmail}
            onChangeText={setFriendEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowFriendModal(false);
                setFriendEmail("");
              }}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.sendButton]}
              onPress={handleSendRequest}
            >
              <LinearGradient
                colors={["#4FFFB0", "#00D4AA"]}
                style={styles.sendButtonGradient}
              >
                <Text style={styles.sendButtonText}>Send Request</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />

      <LinearGradient
        colors={["#0A0A0A", "#1A1A2E", "#16213E"]}
        style={styles.background}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/")}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Friend Requests</Text>
          // Replace the existing addButton TouchableOpacity
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowFriendModal(true)}
          >
            <LinearGradient
              colors={["#4FFFB0", "#00D4AA"]}
              style={styles.addButtonGradient}
            >
              <Text style={styles.addButtonText}>+</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <LinearGradient
            colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]}
            style={styles.searchGradient}
          >
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search friend requests..."
              placeholderTextColor="#B0B0B0"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </LinearGradient>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "received" && styles.activeTab]}
            onPress={() => setActiveTab("received")}
          >
            {activeTab === "received" && (
              <LinearGradient
                colors={["#4FFFB0", "#00D4AA"]}
                style={styles.activeTabGradient}
              />
            )}
            <Text
              style={[
                styles.tabText,
                activeTab === "received" && styles.activeTabText,
              ]}
            >
              Received ({receivedRequests.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "sent" && styles.activeTab]}
            onPress={() => setActiveTab("sent")}
          >
            {activeTab === "sent" && (
              <LinearGradient
                colors={["#4FFFB0", "#00D4AA"]}
                style={styles.activeTabGradient}
              />
            )}
            <Text
              style={[
                styles.tabText,
                activeTab === "sent" && styles.activeTabText,
              ]}
            >
              Sent ({sentRequests.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Friend Requests List
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {filteredRequests(activeTab).length > 0 ? (
            filteredRequests(activeTab).map((request) => (
              <FriendRequestCard
                key={request.id}
                request={request}
                type={activeTab}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <LinearGradient
                colors={[
                  "rgba(255, 255, 255, 0.1)",
                  "rgba(255, 255, 255, 0.05)",
                ]}
                style={styles.emptyStateGradient}
              >
                <Text style={styles.emptyIcon}>
                  {activeTab === "received" ? "📥" : "📤"}
                </Text>
                <Text style={styles.emptyTitle}>
                  {activeTab === "received"
                    ? "No Received Requests"
                    : "No Sent Requests"}
                </Text>
                <Text style={styles.emptyDescription}>
                  {activeTab === "received"
                    ? "When someone sends you a friend request, it will appear here."
                    : "Friend requests you send will appear here."}
                </Text>
              </LinearGradient>
            </View>
          )}
        </ScrollView> */}

        <FriendRequestModal />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  addButton: {
    width: 40,
    height: 40,
  },
  addButtonGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0A0A0A",
  },
  // Add to the existing StyleSheet
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  emailInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 15,
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  sendButton: {
    overflow: "hidden",
    borderRadius: 25,
  },
  sendButtonGradient: {
    paddingVertical: 12,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#0A0A0A",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalButtonText: {
    color: "#B0B0B0",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    padding: 12,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchGradient: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
    position: "relative",
  },
  activeTab: {
    // Active tab styling handled by gradient
  },
  activeTabGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#B0B0B0",
  },
  activeTabText: {
    color: "#0A0A0A",
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  requestCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
  },
  requestGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
  },
  requestHeader: {
    marginBottom: 15,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0A0A0A",
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  mutualFriends: {
    fontSize: 14,
    color: "#4FFFB0",
    marginBottom: 2,
  },
  dateRequested: {
    fontSize: 12,
    color: "#B0B0B0",
  },
  userStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    paddingVertical: 15,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 10,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#B0B0B0",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    borderRadius: 25,
    overflow: "hidden",
  },
  acceptButton: {
    marginRight: 10,
  },
  buttonGradient: {
    paddingVertical: 12,
    alignItems: "center",
  },
  acceptText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0A0A0A",
  },
  declineButton: {
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  declineText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  cancelButton: {
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  emptyState: {
    marginTop: 50,
    alignItems: "center",
  },
  emptyStateGradient: {
    padding: 40,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  emptyDescription: {
    fontSize: 14,
    color: "#B0B0B0",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default FriendsPage;
