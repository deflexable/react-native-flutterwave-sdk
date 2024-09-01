import { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { initializeRaveSdk, toggleDarkMode } from 'react-native-flutterwave-sdk';

export default function App() {
  const [loading, setLoading] = useState();
  const [isDarkMode, setDarkMode] = useState(false);
  const [hidePublicKey, setHidePublicKey] = useState(true);
  const [hideEncryptionKey, setHideEncryptionKey] = useState(true);

  const [publicKey, setPublicKey] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [email, setEmail] = useState('');
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');

  useEffect(() => {
    toggleDarkMode(!!isDarkMode);
  }, [isDarkMode]);

  const renderInput = (value, onChangeText, placeholder, type, secureHint) =>
    <View style={{
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 7,
      marginTop: 10,
      width: '90%',
      flexDirection: 'row',
      alignItems: 'center'
    }}>
      <TextInput
        style={{
          color: isDarkMode ? 'white' : 'black',
          paddingVertical: 10,
          paddingHorizontal: 10,
          fontSize: 15,
          // marginHorizontal: 15,
          flex: 1
        }}
        value={value}
        keyboardAppearance={isDarkMode ? 'dark' : 'light'}
        placeholderTextColor={'gray'}
        importantForAutofill='yes'
        placeholder={placeholder}
        onChangeText={onChangeText}
        textContentType={type}
        secureTextEntry={secureHint?.hidden}
      />
      {secureHint ?
        <TouchableOpacity
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5
          }}
          onPress={() => {
            secureHint.toggle();
          }}>
          <Text style={{
            color: 'rgb(244, 181, 72)',
            fontSize: 13
          }}>
            {secureHint.hidden ? 'Show' : 'Hide'}
          </Text>
        </TouchableOpacity> : null}
    </View>

  return (
    <View style={{
      flex: 1,
      backgroundColor: isDarkMode ? 'black' : 'white'
    }}>
      <View
        style={{
          paddingVertical: 15,
          marginBottom: 15,
          flexDirection: 'row',
          alignItems: 'center'
        }}>
        <Text style={{
          color: isDarkMode ? 'white' : 'black',
          fontWeight: 'bold',
          fontSize: 16,
          textAlign: 'center',
          flex: 1
        }}>
          Rave SDK
        </Text>
        <View style={{
          position: 'absolute',
          right: 10
        }}>
          <Button
            title={isDarkMode ? 'Light' : 'Dark'}
            color={'#1279b9'}
            onPress={() => {
              setDarkMode(!isDarkMode);
            }} />
        </View>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 30
        }}>
          {renderInput(publicKey, t => {
            setPublicKey(t);
          }, 'Public Key', undefined, {
            toggle: () => { setHidePublicKey(!hidePublicKey) },
            hidden: hidePublicKey
          })}

          {renderInput(encryptionKey, t => {
            setEncryptionKey(t);
          }, 'Encryption Key', undefined, {
            toggle: () => { setHideEncryptionKey(!hideEncryptionKey) },
            hidden: hideEncryptionKey
          })}

          {renderInput(amount, t => {
            setAmount(t);
          }, 'Amount')}

          {renderInput(currency, t => {
            setCurrency(t);
          }, 'Currency')}

          {renderInput(email, t => {
            setEmail(t);
          }, 'Email Address', 'emailAddress')}

          {renderInput(fName, t => {
            setFName(t);
          }, 'First Name', 'givenName')}

          {renderInput(lName, t => {
            setLName(t);
          }, 'Last Name', 'familyName')}
          <View style={{ height: 20 }} />

          <Button
            title={loading ? 'Loading...' : 'Make Payment'}
            disabled={loading}
            color={'#1279b9'}
            onPress={async () => {
              setLoading(true);
              try {
                const response = await initializeRaveSdk({
                  ref: randomString(11),
                  publicKey: publicKey,
                  encryptionKey: encryptionKey,
                  amount: amount * 1,
                  currency: currency,
                  email: email,
                  fName: fName,
                  lName: lName,
                  bankTransferPayments: { enabled: true },
                  acceptCardPayments: true,
                  acceptAccountPayments: true,
                  acceptMpesaPayments: true,
                  acceptUssdPayments: true,
                  acceptBarterPayments: true,
                  // isStagingEnv: true,
                  allowSaveCardFeature: true,
                  shouldDisplayFee: true,
                  showStagingLabel: true
                });
                Alert.alert("Response", JSON.stringify(response),
                  [
                    {
                      text: "Dismiss",
                      style: 'cancel'
                    },
                  ],
                  {
                    userInterfaceStyle: isDarkMode ? 'dark' : 'light',
                    cancelable: false
                  }
                );
                console.log('response: ', response);
              } catch (error) {
                Alert.alert("Error", `${error}`,
                  [
                    {
                      text: "Dismiss",
                      style: 'cancel'
                    },
                  ],
                  {
                    userInterfaceStyle: isDarkMode ? 'dark' : 'light',
                    cancelable: false
                  }
                );
                console.log('error: ', error);
              }
              setLoading(false);
            }} />
        </View>
      </ScrollView>
    </View>
  );
}

const randomString = (length = 20, number = true, capLetter = true, smallLetter = true) => {
  const randomChars = `${capLetter ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : ''}${number ? '0123456789' : ''}${smallLetter ? 'abcdefghijklmnopqrstuvwxyz' : ''}`;

  return Array(length).fill(0).map(() => randomChars.charAt(Math.round(Math.random() * randomChars.length))).join('');
}