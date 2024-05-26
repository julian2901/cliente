import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from 'react-native';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDoc, setDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB_X0GhlTiN3XWesW8IW0sWoNQ9mgvqNtA",
  authDomain: "clientes-9fd65.firebaseapp.com",
  projectId: "clientes-9fd65",
  storageBucket: "clientes-9fd65.appspot.com",
  messagingSenderId: "230166482912",
  appId: "1:230166482912:web:14e501e67d71ad4b036585"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ListaProductosScreen = ({ navigation, styles }) => {

  const [productos, setProductos] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const productosCollection = collection(db, 'productos');
      const productosSnapshot = await getDocs(productosCollection);
      const productosList = productosSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setProductos(productosList);
    };

    fetchData();
  }, [refresh]);

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [descr, setDesc] = useState('');
  const [Vunit, setVunit] = useState('');
  const [stock, setStock] = useState('');

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
    
    const doesExist = await checkIfDocumentExists(db, 'productos', id);
    
    if (!id) {
      Alert.alert('El id es obligatorio');
      return;
    }
    if (doesExist) {
      Alert.alert('Este producto ya existe');
      return;
    }
  
    const docProductos = {
      stringId: id,
      stringNombre: name,
      stringDescripcion: descr,
      stringValorUnitario: Vunit,
      stringStock: stock,
    };
  
    await setDoc(doc(db, "productos", id), docProductos);
  
    setId('');
    setName('');
    setDesc('');
    setVunit('');
    setStock('');

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
    
    const doesExist = await checkIfDocumentExists(db, 'productos', id);
    
    if (!id) {
      Alert.alert('El id es obligatorio');
      return;
    }
    if (doesExist) {
      const docProductos = {
        stringId: id,
        stringNombre: name,
        stringDescripcion: descr,
        stringValorUnitario: Vunit,
        stringStock: stock,
      };
    
      await setDoc(doc(db, "productos", id), docProductos);
    
      setId('');
      setName('');
      setDesc('');
      setVunit('');
      setStock('');
  
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
    
    const doesExist = await checkIfDocumentExists(db, 'productos', id);
    
    if (!id) {
      Alert.alert('El id es obligatorio');
      return;
    }
    if (doesExist) {
    
      await deleteDoc(doc(db, "productos", id));
    
      setId('');
      setName('');
      setDesc('');
      setVunit('');
      setStock('');
  
      setRefresh(!refresh);
    }
  };

  return (
    <View style={styles.container}><Text style={{ fontSize: 27, fontWeight: 'bold', marginBottom: 20, color: '#1e272e' }}>Productos</Text>
      <TextInput value={id} onChangeText={text => setId(text)} placeholder="ID" style={inputStyle} />
      <TextInput value={name} onChangeText={text => setName(text)} placeholder="Nombre" style={inputStyle} />
      <TextInput value={descr} onChangeText={text => setDesc(text)} placeholder="Descripción" style={inputStyle} />
      <TextInput value={Vunit} onChangeText={text => setVunit(text)} placeholder="Valor Unitario" style={inputStyle} />
      <TextInput value={stock} onChangeText={text => setStock(text)} placeholder="Stock" style={inputStyle} />
      
      <View style={buttonContainerStyle}>
        <Button title="Crear" onPress={handleCreatePress} />
        <Button title="Modificar" onPress={handleUpdatePress} />
        <Button title="Eliminar" onPress={handleDeletePress} />
      </View>

      <FlatList
        data={productos}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={productoContainerStyle}>
            <Text>ID: {item.stringId}</Text>
            <Text>Nombre: {item.stringNombre}</Text>
            <Text>Descripción: {item.stringDescripcion}</Text>
            <Text>Valor Unitario: {item.stringValorUnitario}</Text>
            <Text>Stock: {item.stringStock}</Text>
          </View>
        )}
      />

      <View style={navigationButtonContainerStyle}>
        <View style={navigationButtonStyle}>
          <Button title="Clientes" onPress={() => navigation.navigate('Clientes')} />
        </View>
        <View style={navigationButtonStyle}>
          <Button title="Productos" onPress={() => navigation.navigate('Productos')} />
        </View>
        <View style={navigationButtonStyle}>
          <Button title="Compras" onPress={() => navigation.navigate('Compras')} />
        </View>
        <View style={navigationButtonStyle}>
          <Button title="Recibos" onPress={() => navigation.navigate('Reportes')} />
        </View>
      </View>
    </View>
  );
};

const inputStyle = {
  width: '80%',
  height: 37,
  marginBottom: 10,
  padding: 10,
  backgroundColor: '#ffffff',
  borderRadius: 5,
  borderWidth: 1,
  borderColor: '#cccccc',
};

const buttonContainerStyle = {
  flexDirection: 'row',
  marginBottom: 10,
  
  justifyContent: 'space-around',
};

const productoContainerStyle = {
  marginBottom: 10,
  padding: 10,
  backgroundColor: '#ffffff',
  borderRadius: 5,
  borderWidth: 1,
  borderColor: '#cccccc',
};

const navigationButtonContainerStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
};

const navigationButtonStyle = {
  flexDirection: 'row', // Establece la disposición horizontal
  justifyContent: 'space-between', // Distribuye los elementos de manera uniforme
  flexWrap: 'wrap', //
  margin:1
};

export default ListaProductosScreen;
