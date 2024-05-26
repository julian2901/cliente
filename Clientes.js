import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert,StyleSheet,TouchableOpacity } from 'react-native';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { doc, getDocs } from 'firebase/firestore';




const firebaseConfig = {
  apiKey: "AIzaSyB_X0GhlTiN3XWesW8IW0sWoNQ9mgvqNtA",
  authDomain: "clientes-9fd65.firebaseapp.com",
  projectId: "clientes-9fd65",
  storageBucket: "clientes-9fd65.appspot.com",
  messagingSenderId: "230166482912",
  appId: "1:230166482912:web:14e501e67d71ad4b036585"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



const ListaClientesScreen = ({ navigation, styles }) => {

  const [cliente, setClientes] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const clientesCollection = collection(db, 'clientes');
      const clientesSnapshot = await getDocs(clientesCollection);
      const clientesList = clientesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setClientes(clientesList);
    };

    fetchData();
  }, [refresh]);

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');


  const handleCreatePress = async () => {

    async function checkIfDocumentExists(db, collectionName, docId) {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return true;
      } else {
        return false;
      }
    }

    const doesExist = await checkIfDocumentExists(db, 'clientes', id);

    if (!id) {
      Alert.alert('El id es obligatorio');
      return;
    }
    if (doesExist) {
      Alert.alert('Este cliente ya existe');
      return;
    }

    const docClientes = {
      stringId: id,
      stringNombre: name,
      stringApellido: surname,
      stringEmail: email,
      stringFecha: new Date().toISOString().slice(0, 10),
    };

    await setDoc(doc(db, "clientes", id), docClientes);
    
    setId('');
    setName('');
    setSurname('');
    setEmail('');

    setRefresh(!refresh);
  };

  const handleUpdatePress = async () => {
    async function checkIfDocumentExists(db, collectionName, docId) {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return true;
      } else {
        return false;
      }
    }

    const doesExist = await checkIfDocumentExists(db, 'clientes', id);

    if (!id) {
      Alert.alert('El id es obligatorio');
      return;
    }
    if (doesExist) {
      const docClientes = {
        stringId: id,
        stringNombre: name,
        stringApellido: surname,
        stringEmail: email,
        stringFecha: new Date().toISOString().slice(0, 10),
      };

      await setDoc(doc(db, "clientes", id), docClientes);

      setId('');
      setName('');
      setSurname('');
      setEmail('');

      setRefresh(!refresh);
    }
  };

  const handleDeletePress = async () => {

    async function checkIfDocumentExists(db, collectionName, docId) {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return true;
      } else {
        return false;
      }
    }

    const doesExist = await checkIfDocumentExists(db, 'clientes', id);

    if (!id) {
      Alert.alert('El id es obligatorio');
      return;
    }
    if (doesExist) {

      await deleteDoc(doc(db, "clientes", id));

      setId('');
      setName('');
      setSurname('');
      setEmail('');


      setRefresh(!refresh);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFF', padding: 20 }}>
  <Text style={{ fontSize: 27, fontWeight: 'bold', marginBottom: 20, color: '#1e272e' }}>Lista Clientes</Text>
  <TextInput style={{ width: '80%', height: 37, borderColor: '#485460', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, borderRadius: 10 }} value={id} onChangeText={text => setId(text)} placeholder="ID" />
  <TextInput style={{ width: '80%', height: 37, borderColor: '#485460', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, borderRadius: 10 }} value={name} onChangeText={text => setName(text)} placeholder="Nombre" />
  <TextInput style={{ width: '80%', height: 37, borderColor: '#485460', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, borderRadius: 10 }} value={surname} onChangeText={text => setSurname(text)} placeholder="Apellido" />
  <TextInput style={{ width: '80%', height: 37, borderColor: '#485460', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, borderRadius: 10 }} value={email} onChangeText={text => setEmail(text)} placeholder="Email" />

  <TouchableOpacity style={{ width: '40%', height: 27, backgroundColor: '#1289A7', justifyContent: 'center', alignItems: 'center', marginTop: 7, marginBottom: 10, borderRadius: 5 }} onPress={handleCreatePress}>
    <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>Crear</Text>
  </TouchableOpacity>

  <TouchableOpacity style={{ width: '40%', height: 27, backgroundColor: '#1289A7', justifyContent: 'center', alignItems: 'center', marginTop: 7, marginBottom: 10, borderRadius: 5 }} onPress={handleUpdatePress}>
    <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>Modificar</Text>
  </TouchableOpacity>

  <TouchableOpacity style={{ width: '40%', height: 27, backgroundColor: '#1289A7', justifyContent: 'center', alignItems: 'center', marginTop: 7, marginBottom: 10, borderRadius: 5 }} onPress={handleDeletePress}>
    <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>Eliminar</Text>
  </TouchableOpacity>

  <FlatList
    data={cliente}
    keyExtractor={item => item.id.toString()}
    renderItem={({ item }) => (
      <View style={clienteInfoStyle}>
      <Text>ID: {item.stringId}</Text>
      <Text>Nombre: {item.stringNombre}</Text>
      <Text>Apellido: {item.stringApellido}</Text>
      <Text>Email: {item.stringEmail}</Text>
      <Text>Fecha: {item.stringFecha}</Text>
    </View>
    )}
  />
 <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
  <View style={buttonContainerStyle}>
    <Button
      title="Clientes"
      onPress={() => navigation.navigate('Clientes')}
      style={buttonStyle}
      titleStyle={buttonTitleStyle}
    />
  </View>
  <View style={buttonContainerStyle}>
    <Button
      title="Productos"
      onPress={() => navigation.navigate('Productos')}
      style={buttonStyle}
      titleStyle={buttonTitleStyle}
    />
  </View>
  <View style={buttonContainerStyle}>
    <Button
      title="Compras"
      onPress={() => navigation.navigate('Compras')}
      style={buttonStyle}
      titleStyle={buttonTitleStyle}
    />
  </View>
  <View style={buttonContainerStyle}>
    <Button
      title="Recibos"
      onPress={() => navigation.navigate('Reportes')}
      style={buttonStyle}
      titleStyle={buttonTitleStyle}
    />
  </View>
</View>

</View>
  );
};


  
   
const clienteInfoStyle = {
  marginBottom: 10,
  padding: 10,
  backgroundColor: '#ffffff', // Color de fondo de la vista
  borderRadius: 5, // Bordes redondeados
  borderWidth: 1, // Borde
  borderColor: '#cccccc', // Color del borde
};

const buttonContainerStyle = {
  
  flexDirection: 'row', // Establece la disposición horizontal
  justifyContent: 'space-between', // Distribuye los elementos de manera uniforme
  flexWrap: 'wrap', //
  margin:1
  
};

const buttonStyle = {
  backgroundColor: '#222f3e', // Color de fondo del botón
  borderRadius: 5, // Bordes redondeados
};

const buttonTitleStyle = {
  color: '#341f97', // Color del texto del botón
};
export default ListaClientesScreen;