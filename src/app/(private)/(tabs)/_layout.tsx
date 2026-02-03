import React, { useCallback, useState } from 'react';
import { BottomTab } from '../../../components';
import { Dimensions, StyleSheet } from 'react-native';
import { HomeScreen, MapScreen, ProfileScreen } from '../../../screens';
import { NavigationState, SceneMap, SceneRendererProps, TabView } from 'react-native-tab-view';

const { width } = Dimensions.get('window');

const routes = [
  { key: 'home', title: 'Home' },
  { key: 'map', title: 'Map' },
  { key: 'profile', title: 'Profile' },
];

const renderScene = SceneMap({
  home: HomeScreen,
  map: MapScreen,
  profile: ProfileScreen,
});

const PrivateLayout = () => {
  // #region states
  const [index, setIndex] = useState<number>(0);
  // #endregion
  // #region call backs
  const handleOnRoute = useCallback((index: number) => {
    setIndex(index);
  }, []);
  // #endregion
  // #region renders
  const tabBar = (
    props: SceneRendererProps & {
      navigationState: NavigationState<{
        key: string;
        title: string;
      }>;
    }
  ) => {
    return <BottomTab onItemClick={handleOnRoute} {...props} />;
  };
  // #endregion
  return (
    <TabView
      lazy={true}
      swipeEnabled={true}
      renderTabBar={tabBar}
      style={styles.tabView}
      animationEnabled={true}
      tabBarPosition="bottom"
      onIndexChange={setIndex}
      renderScene={renderScene}
      initialLayout={{ width }}
      navigationState={{ index, routes }}
    />
  );
};

export default PrivateLayout;

const styles = StyleSheet.create({
  tabView: {
    backgroundColor: '#1a1a1a',
  },
});
