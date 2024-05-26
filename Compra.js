import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDoc, setDoc, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { query, orderBy, limitToLast } from "firebase/firestore";

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

const ComprasScreen = ({ navigation, styles }) => {

  const [productos, setProductos] = useState([]);
  const [contador, setContador] = useState({});
  const [descuento, setDescuento] = useState('');
  const total = subtotal - (subtotal * (Number(descuento) / 100));

  const incrementarContador = (id, stock) => {
    setContador(prevState => {
      const currentCount = prevState[id] || 0;
      return {
        ...prevState,
        [id]: currentCount < stock ? currentCount + 1 : stock,
      };
    });
  };

  const decrementarContador = (id) => {
    setContador(prevState => ({
      ...prevState,
      [id]: prevState[id] > 0 ? prevState[id] - 1 : 0,
    }));
  };

  const subtotal = Object.keys(contador).reduce((total, id) => {
    const item = productos.find(producto => producto.stringId === id);
    const count = contador[id];
    const valorUnitario = item ? Number(item.stringValorUnitario) : 0;
    return total + (count * valorUnitario);
  }, 0);

  useEffect(() => {
    const fetchData = async () => {
      const productosCollection = collection(db, 'productos');
      const productosSnapshot = await getDocs(productosCollection);
      const productosList = productosSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

      setProductos(productosList);
    };

    fetchData();
  }, [contador]);

  const [id, setId] = useState('');

  const handleCreatePress = async () => {
    const docRef = doc(db, 'clientes', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      Alert.alert('El id de cliente no existe en el sistema');
      return;
    } else if (!id) {
      Alert.alert('El campo id cliente es obligatorio')
      return;
    }

    const date = new Date();
    const fecha = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    const q = query(collection(db, 'encabezado'), orderBy('idEncabezado'), limitToLast(1));
    const querySnapshot = await getDocs(q);
    let lastId = 1000;
    querySnapshot.forEach((doc) => {
      lastId = Number(doc.data().idEncabezado);
    });

    const nextId = lastId + 1;

    const encabezadoRef = collection(db, 'encabezado');
    const encabezadoDocRef = doc(encabezadoRef, nextId.toString());

    const total = subtotal - (subtotal * (Number(descuento) / 100));

    await setDoc(encabezadoDocRef, {
      idEncabezado: nextId.toString(),
      idCliente: id,
      fecha,
      subtotal: subtotal.toString(),
      total: total.toString(),
      descuentoTotal: descuento.toString(),
    });

    for (const producto of productos) {
      if (contador[producto.stringId] > 0) {
        const q = query(collection(db, 'detalles'), orderBy('idDescripcion'), limitToLast(1));
        const querySnapshot = await getDocs(q);
        let lastId = 500000;
        querySnapshot.forEach((doc) => {
          lastId = Number(doc.data().idDescripcion);
        });

        const nextId = lastId + 1;

        const detallesRef = collection(db, 'detalles');
        const detallesDocRef = doc(detallesRef, nextId.toString());

        await setDoc(detallesDocRef, {
          idDescripcion: nextId.toString(),
          idEncabezado: encabezadoDocRef.id,
          idProducto: producto.stringId,
          cantidad: contador[producto.stringId].toString(),
          valorTotal: (contador[producto.stringId] * producto.stringValorUnitario).toString(),
        });

        const productoRef = doc(db, 'productos', producto.stringId);
        await updateDoc(productoRef, {
          stringStock: (producto.stringStock - contador[producto.stringId]).toString(),
        });
      }
    }

    setContador({});
    setDescuento('0');
    setId('');
  };

  return (
    <View style={styles.container}>
        <Text style={{ fontSize: 27, fontWeight: 'bold', marginBottom: 20, color: '#1e272e' }}>Compras</Text>

      <TextInput style={{ width: '50%', height: 37, borderColor: '#485460', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, borderRadius: 10 }} value={id} onChangeText={text => setId(text)} placeholder="ID Cliente" />

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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Button title="+" onPress={() => incrementarContador(item.stringId, item.stringStock)} />
              <Text style={{ marginHorizontal: 20 }}>{contador[item.stringId] || 0}</Text>
              <Button title="-" onPress={() => decrementarContador(item.stringId)} />
              <Text style={{ marginHorizontal: 20 }}>Total: {(contador[item.stringId] || 0) * item.stringValorUnitario}</Text>
            </View>
          </View>
        )}
      />

      <View style={totalContainerStyle}>
        <Text>SubTotal: {subtotal} </Text>
        <Text>Total: {subtotal - (subtotal * (Number(descuento) / 100))} </Text>
        <TextInput value={descuento} onChangeText={text => setDescuento(text)} placeholder="Descuento Total (%)" keyboardType="numeric" />
        <TouchableOpacity style={{ width: '100%', height: 40, backgroundColor: '#1289A7', justifyContent: 'center', alignItems: 'center', marginTop: 7, marginBottom: 10, borderRadius: 5 }} onPress={handleCreatePress}>
    <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>Confirmar Compra</Text>
  </TouchableOpacity>
      </View>

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

const productoContainerStyle = {
  marginBottom: 10,
  padding: 10,
  backgroundColor: '#ffffff',
  borderRadius: 5,
  borderWidth: 1,
  borderColor: '#485460',
};

const totalContainerStyle = {
  position: 'absolute',
  bottom: 70,
  left: 100,
  right: 100,
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

export default ComprasScreen;
