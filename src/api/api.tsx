/* eslint-disable no-trailing-spaces */
/* eslint-disable eol-last */
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';



const baseURL = 'http://192.168.1.32:8080/api';


const backendApi = axios.create({baseURL});


//Middleware of AXIOS

backendApi.interceptors.request.use(
    
   async (config) =>{

    const token = await AsyncStorage.getItem('token');

    if (token){
        config.headers['x-token'] = token;
        }
        return config;
    }
);



export default backendApi;