import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, Paragraph } from 'react-native-paper';

const AyudaScreen = () => (
  <View style={styles.container}>
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>Contacto de Ayuda</Text>
        <Paragraph style={styles.description}>
          Si necesitas ayuda, no dudes en comunicarte con nosotros a través de cualquiera de las siguientes opciones:
        </Paragraph>
      </Card.Content>
    </Card>

    <View style={styles.buttonContainer}>
      <Button
        mode="contained"
        icon="email"
        onPress={() => console.log('Contacto por correo')}
        style={styles.button}
      >
        Correo Electrónico
      </Button>
      <Button
        mode="contained"
        icon="whatsapp"
        onPress={() => console.log('Contacto por WhatsApp')}
        style={styles.button}
      >
        WhatsApp
      </Button>
      <Button
        mode="contained"
        icon="facebook"
        onPress={() => console.log('Contacto por Facebook')}
        style={styles.button}
      >
        Facebook
      </Button>
    </View>

    <View style={styles.infoContainer}>
      <Text style={styles.infoText}>Teléfono: +52 800 123 4567</Text>
      <Text style={styles.infoText}>Horario de atención: 9:00 AM - 6:00 PM</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  card: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    marginVertical: 20,
  },
  button: {
    marginBottom: 10,
    backgroundColor: '#272C73',
    borderRadius: 8,
  },
  infoContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
});

export default AyudaScreen;