import * as React from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet } from 'react-native';
import { BASE_URL, SCHEMA } from '../constants/Api';
import Item from './CategoriesItem';

export default function Categories() {
  const [categories, setCategories] = React.useState([]);
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  React.useEffect(() => {
    // Get raw categories
    (async function getCategories() {
      try {
        let response = await fetch(`${BASE_URL}?${SCHEMA}`);
        let responseJson = await response.json();
        transformCategories(responseJson);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingComplete(true);
      }
    })();
  }, []);

  // Transform raw categories into formatted categories
  const transformCategories = categories => {
    let transformedCategories = [];
    let id = 1;
    for (const prop in categories) {
      const item = {
        id: `${id}`,
        title: prop,
        imgPath: require(`../assets/images/${prop}.svg`),
        url: categories[prop],
      };
      id++;
      transformedCategories.push(item);
    }
    // Set categories state with transformed categories
    setCategories(transformedCategories);
  };

  // Get categories by title
  async function getCategoriesByTitle(title) {
    try {
      let response = await fetch(`${BASE_URL}${title}/?${SCHEMA}`);
      let responseJson = await response.json();
      console.log(responseJson);
    } catch (error) {
      console.error(error);
    }
  }

  // Total number of columns for categories
  const numColumns = 2;

  return (
    <SafeAreaView style={styles.container}>
      {!isLoadingComplete ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={categories} // Get data from categories state
          renderItem={({ item }) => (
            <Item title={item.title} imgPath={item.imgPath} onPressItem={getCategoriesByTitle} />
          )}
          keyExtractor={item => item.id}
          numColumns={numColumns}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#130f40',
  },
});
