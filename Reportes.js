import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Alert } from 'react-native';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const EncabezadoScreen = ({styles, navigation}) => {
  const [encabezados, setEncabezados] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const encabezadoCollection = collection(db, 'encabezado');
      const encabezadoSnapshot = await getDocs(encabezadoCollection);
      const encabezadoList = encabezadoSnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
      setEncabezados(encabezadoList);
    };

    fetchData();
  }, []);

  const handleDetailsPress = async (idEncabezado) => {
    const db = getFirestore();
    const detallesCollection = collection(db, 'detalles');
    const q = query(detallesCollection, where('idEncabezado', '==', idEncabezado));
    const detallesSnapshot = await getDocs(q);
    const detallesList = detallesSnapshot.docs.map(doc => doc.data());

    let message = '';
    detallesList.forEach((detalle, index) => {
      message += `Detalle ${index + 1}:\n`;
      message += `ID Descripción: ${detalle.idDescripcion}\n`;
      message += `ID Producto: ${detalle.idProducto}\n`;
      message += `Cantidad: ${detalle.cantidad}\n`;
      message += `Valor Total: ${detalle.valorTotal}\n\n`;
    });

    Alert.alert('Detalles', message);
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 27, fontWeight: 'bold', marginBottom: 20, color: '#1e272e' }}>Detalle Factura 📃</Text>
      <FlatList
        data={encabezados}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ margin: 10 }}>
            <Text>ID Encabezado: {item.idEncabezado}</Text>
            <Text>ID Cliente: {item.idCliente}</Text>
            <Text>Fecha: {item.fecha}</Text>
            <Text>Subtotal: {item.subtotal}</Text>
            <Text>Total: {item.total}</Text>
            <Text>Descuento Total: {item.descuentoTotal}</Text>
            <Button title="Ver detalles" onPress={() => handleDetailsPress(item.idEncabezado)} />
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


export default EncabezadoScreen;
