import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" },
      }}
    >
      <Tabs.Screen name="home-tab" />
      <Tabs.Screen name="search-tab" />
      <Tabs.Screen name="cart-tab" />
      <Tabs.Screen name="profile-tab" />
    </Tabs>
  );
}
