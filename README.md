# react-native-flutterwave-sdk

This library uses the official flutterwave's native [android sdk](https://github.com/Flutterwave/AndroidSDK) and [ios sdk](https://github.com/Flutterwave/iOS-v3)

## Demo

<img src="https://github.com/deflexable/react-native-flutterwave-sdk/blob/main/screenshots/android.gif" width="360">

<img src="https://github.com/deflexable/react-native-flutterwave-sdk/blob/main/screenshots/ios.gif" width="360">

<!-- provide screenshots here -->

## Installation

```sh
npm install react-native-flutterwave-sdk
```

or using yarn

```sh
yarn add react-native-flutterwave-sdk
```

## Usage

### initialize flutterwave sdk

```js
import { initializeRaveSdk } from 'react-native-flutterwave-sdk';

return (
  <View style={{ flex: 1 }}>
    <Button
      title={'Make Payment'}
      onPress={async () => {
        try {
          // this will display flutterwave payment page
          const response = await initializeRaveSdk({
            ref: 'unique_txn_ref...', // this is your transaction reference
            publicKey: 'FLWPUBK_TEST-XXXXXXXXXXXXXXX-X',
            encryptionKey: 'FLWSECK_TESTxxxxxxxxx',
            amount: 3500,
            currency: 'NGN',
            email: 'string',
            fName: 'Richard',
            lName: 'Hendricks',
            bankTransferPayments: { enabled: true },
            acceptCardPayments: true,
            acceptAccountPayments: true,
            acceptMpesaPayments: true,
            acceptUssdPayments: true,
            acceptBarterPayments: true,
            isStagingEnv: true,
            allowSaveCardFeature: true,
            shouldDisplayFee: true,
            showStagingLabel: true,
          });
          if (response.status === 'success') {
            // handle payment completion
          }
        } catch (e) {
          // handle error here
          console.error(e);
        }
      }}
    />
  </View>
);
```

### Toggle dark and light mode

Please Note: calling `toggleDarkMode(boolean)` method will change color scheme of your entire app

```js
import { toggleDarkMode } from 'react-native-flutterwave-sdk';
const [isDarkMode, setDarkMode] = useState();

useEffect(() => {
  toggleDarkMode(!!isDarkMode);
}, [isDarkMode]);

return (
  <View style={{ flex: 1 }}>
    <Button
      title={'Toggle theme'}
      onPress={() => {
        setDarkMode(!isDarkMode);
      }}
    />
  </View>
);
```

### Apply custom styling to your android app

You can apply custom styling to Flutterwave's Drop Ui.
To do this, you need to provide styling in your `styles.xml` in the android folder of your react native app.
You can edit the following styling example to your own taste

```xml
    <style name="MyCustomRaveTheme" parent="RaveAppTheme.NoActionBar">
        <item name="colorPrimary">@color/colorPrimary</item>
        <item name="colorPrimaryDark">@color/colorPrimaryDark</item>
        <item name="colorAccent">@color/colorAccent</item>
        <item name="OTPButtonStyle">@style/myOtpBtnStyle</item>
        <item name="PayButtonStyle">@style/myBtnStyle</item>
	    <item name="PinButtonStyle">@style/myPinButtonStyle</item>
        <item name="OTPHeaderStyle">@style/myOtpHeaderStyle</item>
        <item name="TabLayoutStyle">@style/myTabLayoutStyle</item>
        <item name="PinHeaderStyle">@style/myPinHeaderStyle</item>
        <item name="PaymentTileStyle">@style/myPaymentTileStyle</item>
        <item name="PaymentTileTextStyle">@style/myPaymentTileTextStyle</item>
        <item name="PaymentTileDividerStyle">@style/myPaymentTileDividerStyle</item>
    </style>
```

then you can provide the name of your styling to the argument of `initializeRaveSdk()`

```js
initializeRaveSdk({
  ...props,
  theme: 'MyCustomRaveTheme',
});
```

## Known Issues
The [ios sdk](https://github.com/Flutterwave/iOS-v3) library contains alot of bugs and should not be use in production. 

## Example Demo
run the `/example` directory

## License

MIT