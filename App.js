import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert,TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ListaClientesScreen from './src/Componentes/Pantallas/Clientes';
import ListaProductosScreen from './src/Componentes/Pantallas/Productos';
import bcrypt from 'react-native-bcrypt';
import { enableScreens } from 'react-native-screens';
import { set } from 'firebase/database';
import ComprasScreen from './src/Componentes/Pantallas/Compra';
import EncabezadoScreen from './src/Componentes/Pantallas/Reportes';
import { getAnalytics } from "firebase/analytics";

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDoc, setDoc, deleteDoc,doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCD0P2QMMWOBqhDMMd5kp72jPMsjxvIJqs",
  authDomain: "proyectoproducto-db88b.firebaseapp.com",
  projectId: "proyectoproducto-db88b",
  storageBucket: "proyectoproducto-db88b.appspot.com",
  messagingSenderId: "554325404068",
  appId: "1:554325404068:web:b107fe26a940b242727931"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Stack = createNativeStackNavigator();

const LoginScreen = ({navigation}) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    console.log(hashedPassword);
    return hashedPassword;
  }

  const handleRegisterPress = async () => {

    async function checkIfDocumentExists(db, collectionName, docId) {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
    
      if (docSnap.exists()) {
        return true;
      } else {
        return false;
      }
    }
    
    const doesExist = await checkIfDocumentExists(db, 'usuarios', username);

    if(!username){
      Alert.alert('El campo usuario es obligatorio');
      return;
    }else if(!password){
      Alert.alert('El campo contraseña es obligatorio');
      return;
    }
    if (doesExist) {
      Alert.alert('Este usuario ya existe');
      return;
    }

    const hash = hashPassword(password);

    const docUsuarios = {
      stringPassword: hash,
    };
  
    await setDoc(doc(db, "usuarios", username), docUsuarios);
    Alert.alert('Registro exitoso');
  };

  const handleLoginPress = async () => {

    async function checkIfDocumentExists(db, collectionName, docId) {

      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
    
      if (docSnap.exists()) {
        return docSnap;
      } else {
        return false;
      }
    }
    
    const docSnap = await checkIfDocumentExists(db, 'usuarios', username);

    if(!username){
      Alert.alert('El campo usuario es obligatorio');
      return;
    }else if(!password){
      Alert.alert('El campo contraseña es obligatorio');
      return;
    }
    if (docSnap) {

      if (bcrypt.compareSync(password, docSnap.data().stringPassword)) {
        navigation.navigate('Clientes');
      }else{
        Alert.alert('Contraseña incorrecta');
        setPassword('');
        return;
      }
    }else{
      Alert.alert('Usuario o contraseña incorrectos');
      setPassword('');
      setUsername('');
      return;
    }
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={text => setUsername(text)}
        placeholder="Username"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={text => setPassword(text)}
        placeholder="Password"
        secureTextEntry={true}
      />
    <TouchableOpacity 
  style={[styles.buttonContainer, { backgroundColor: '#341f97' }]} 
  onPress={handleRegisterPress}
>
  <Text style={styles.buttonText}>Register</Text>
</TouchableOpacity>

<TouchableOpacity 
  style={[styles.buttonContainer, { backgroundColor: '#341f97' }]} 
  onPress={handleLoginPress}
>
  <Text style={styles.buttonText}>Login</Text>
</TouchableOpacity>
    </View>
  );
};


const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen 
        name="Login" component={LoginScreen} 
        />

        <Stack.Screen 
        name="Clientes"
        children={(props) => <ListaClientesScreen {...props} styles={styles} />}
        />

        <Stack.Screen 
        name="Productos"
        children={(props) => <ListaProductosScreen {...props} styles={styles} />}
        />

        <Stack.Screen 
        name="Compras"
        children={(props) => <ComprasScreen {...props} styles={styles} />}
        />

        <Stack.Screen 
        name="Reportes"
        children={(props) => <EncabezadoScreen {...props} styles={styles} />}
        />

      </Stack.Navigator>
    </NavigationContainer>
    </GestureHandlerRootView>
  );
};

// Estilos comunes para todas las pantallas
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFF', // Color de fondo del container
    padding: 20, // Espaciado interior

  },
  title: {
    fontSize: 27,
    fontWeight: '900',
    // marginVertical:50,
    color: '#341F97', // Color del título
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#341f97',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    width: '37%',
    height: 34,
    backgroundColor: '#341F97',
    justifyContent: 'center',
    alignItems: 'center',
   
    marginBottom:7,
    padding:1,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;