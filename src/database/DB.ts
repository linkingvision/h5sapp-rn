import AsyncStorage from '@react-native-community/async-storage';

	//数据存储
	const storeData = async (key:string,value) => {
		try {
		  await AsyncStorage.setItem(key, value)
		} catch (e) {
		  // saving error
		}
	  }
	//数据读取
	const getData = async (key:string) => {
	try {
	  const value = await AsyncStorage.getItem(key)
	  if(value !== null) {
		// value previously stored
	  }
	} catch(e) {
	  // error reading value
	}
	}	

