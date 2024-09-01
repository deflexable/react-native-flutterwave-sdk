package com.flutterwavesdk;

import android.app.Activity;
import android.content.Intent;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;

import com.flutterwave.raveandroid.RavePayActivity;
import com.flutterwave.raveandroid.RaveUiManager;
import com.flutterwave.raveandroid.rave_java_commons.Meta;
import com.flutterwave.raveandroid.rave_java_commons.RaveConstants;
import com.flutterwave.raveandroid.rave_java_commons.SubAccount;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatDelegate;

public class FlutterwaveSdkModule extends ReactContextBaseJavaModule {

  public static final String NAME = "FlutterwaveSdk";
  private Promise paymentPromise;
  private boolean isListening = false;

  public FlutterwaveSdkModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @NonNull
  @Override
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void toggleNightMode(boolean enableDarkMode) {
    if (enableDarkMode) {
      AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
    } else {
      AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
    }
  }

  @ReactMethod
  public void initializeRave(ReadableMap config, Promise promise) {
    @Nullable
    Activity activity = getCurrentActivity();

    if (activity == null) {
      promise.reject("NO_ACTIVITY", "No current activity available.");
      return;
    }

    RaveUiManager raveUiManager = new RaveUiManager(activity)
      .setTxRef(config.getString("ref"))
      .setPublicKey(config.getString("publicKey"))
      .setEncryptionKey(config.getString("encryptionKey"))
      .setAmount(config.getDouble("amount"))
      .setCurrency(config.getString("currency"))
      .setEmail(config.getString("email"));

    if (config.hasKey("fName")) {
      raveUiManager = raveUiManager.setfName(config.getString("fName"));
    }

    if (config.hasKey("lName")) {
      raveUiManager = raveUiManager.setlName(config.getString("lName"));
    }

    if (config.hasKey("narration")) {
      raveUiManager = raveUiManager.setNarration(config.getString("narration"));
    }

    if (config.hasKey("phone")) {
      raveUiManager = raveUiManager.setPhoneNumber(config.getString("phone"));
    }

    if (config.hasKey("country")) {
      raveUiManager = raveUiManager.setCountry(config.getString("country"));
    }

    if (config.hasKey("acceptAccountPayments")) {
      raveUiManager = raveUiManager.acceptAccountPayments(config.getBoolean("acceptAccountPayments"));
    }

    if (config.hasKey("acceptCardPayments")) {
      raveUiManager = raveUiManager.acceptCardPayments(config.getBoolean("acceptCardPayments"));
    }

    if (config.hasKey("acceptUkPayments")) {
      raveUiManager = raveUiManager.acceptUkPayments(config.getBoolean("acceptUkPayments"));
    }

    if (config.hasKey("bankTransferPayments")) {
      ReadableMap transfer = config.getMap("bankTransferPayments");
      assert transfer != null;
      boolean enabled = transfer.getBoolean("enabled");

      if (transfer.hasKey("static")) {
        raveUiManager = raveUiManager.acceptBankTransferPayments(enabled, transfer.getBoolean("static"));
      } else if (transfer.hasKey("duration")) {
        raveUiManager = raveUiManager.acceptBankTransferPayments(enabled, transfer.getInt("duration"), transfer.getInt("frequency"));
      } else {
        raveUiManager = raveUiManager.acceptBankTransferPayments(enabled);
      }
    }

    if (config.hasKey("francMobileMoneyPayments")) {
      ReadableMap transfer = config.getMap("francMobileMoneyPayments");
      assert transfer != null;

      raveUiManager = raveUiManager.acceptFrancMobileMoneyPayments(
        transfer.getBoolean("enabled"),
        transfer.getString("country")
      );
    }

    if (config.hasKey("barterCountry")) {
      raveUiManager = raveUiManager.setBarterCountry(config.getString("barterCountry"));
    }

    if (config.hasKey("acceptUssdPayments")) {
      raveUiManager = raveUiManager.acceptUssdPayments(config.getBoolean("acceptUssdPayments"));
    }

    if (config.hasKey("acceptMpesaPayments")) {
      raveUiManager = raveUiManager.acceptMpesaPayments(config.getBoolean("acceptMpesaPayments"));
    }

    if (config.hasKey("acceptAchPayments")) {
      raveUiManager = raveUiManager.acceptAchPayments(config.getBoolean("acceptAchPayments"));
    }

    if (config.hasKey("acceptGHMobileMoneyPayments")) {
      raveUiManager = raveUiManager.acceptGHMobileMoneyPayments(config.getBoolean("acceptGHMobileMoneyPayments"));
    }

    if (config.hasKey("acceptUgMobileMoneyPayments")) {
      raveUiManager = raveUiManager.acceptUgMobileMoneyPayments(config.getBoolean("acceptUgMobileMoneyPayments"));
    }

    if (config.hasKey("acceptZmMobileMoneyPayments")) {
      raveUiManager = raveUiManager.acceptZmMobileMoneyPayments(config.getBoolean("acceptZmMobileMoneyPayments"));
    }

    if (config.hasKey("acceptRwfMobileMoneyPayments")) {
      raveUiManager = raveUiManager
        .acceptRwfMobileMoneyPayments(config.getBoolean("acceptRwfMobileMoneyPayments"));
    }

    if (config.hasKey("acceptSaBankPayments")) {
      raveUiManager = raveUiManager.acceptSaBankPayments(config.getBoolean("acceptSaBankPayments"));
    }

    if (config.hasKey("acceptBarterPayments")) {
      raveUiManager = raveUiManager.acceptBarterPayments(config.getBoolean("acceptBarterPayments"));
    }

    if (config.hasKey("allowSaveCardFeature")) {
      raveUiManager = raveUiManager.allowSaveCardFeature(config.getBoolean("allowSaveCardFeature"));
    }

    if (config.hasKey("isStagingEnv")) {
      raveUiManager = raveUiManager.onStagingEnv(config.getBoolean("isStagingEnv"));
    }

    if (config.hasKey("isPreAuth")) {
      raveUiManager = raveUiManager.isPreAuth(config.getBoolean("isPreAuth"));
    }

    if (config.hasKey("shouldDisplayFee")) {
      raveUiManager = raveUiManager.shouldDisplayFee(config.getBoolean("shouldDisplayFee"));
    }

    if (config.hasKey("showStagingLabel")) {
      raveUiManager = raveUiManager.showStagingLabel(config.getBoolean("showStagingLabel"));
    }

    if (config.hasKey("meta")) {
      ReadableMap meta = config.getMap("meta");
      assert meta != null;
      ReadableMapKeySetIterator iterator = meta.keySetIterator();
      List<Meta> info = new ArrayList<>();

      while (iterator.hasNextKey()) {
        String key = iterator.nextKey();
        info.add(new Meta(key, meta.getString(key)));
      }
      raveUiManager = raveUiManager.setMeta(info);
    }

    if (config.hasKey("subAccounts")) {
      List<SubAccount> subAccounts = new ArrayList<>();
      ReadableArray subList = config.getArray("subAccounts");

      for (int i = 0; i < Objects.requireNonNull(subList).size(); i++) {
        ReadableMap object = subList.getMap(i);
        SubAccount account = new SubAccount();
        account.setId(object.getString("id"));
        account.setTransactionSplitRatio(object.getString("txnRatio"));
        if (object.hasKey("txnChargeType")) {
          account.setTransactionChargeType(object.getString("txnChargeType"));
        }
        if (object.hasKey("txnCharge")) {
          account.setTransactionCharge(object.getString("txnCharge"));
        }
        subAccounts.add(account);
      }
      raveUiManager = raveUiManager.setSubAccounts(subAccounts);
    }

    if (config.hasKey("theme")) {
      String themeName = config.getString("theme");

      int themeResId = getReactApplicationContext().getResources()
        .getIdentifier(themeName, "style", getReactApplicationContext().getPackageName());
      if (themeResId == 0) {
        promise.reject("INVALID_THEME", "The specified theme '" + themeName + "' does not exist.");
        return;
      }

      raveUiManager = raveUiManager.withTheme(config.getInt("theme"));
    }

    this.paymentPromise = promise;
    addRaveListener();
    raveUiManager.initialize();
  }

  private void addRaveListener() {
    if (!isListening) {
      getReactApplicationContext().addActivityEventListener(mActivityEventListener);
    }
    isListening = true;
  }

  private void removeRaveListener() {
    if (isListening) {
      getReactApplicationContext().removeActivityEventListener(mActivityEventListener);
    }
    isListening = false;
  }

  // Listen for activity results
  private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

      if (requestCode == RaveConstants.RAVE_REQUEST_CODE) {
        String message = data == null ? null : data.getStringExtra("response");

        if (paymentPromise != null) {
          if (resultCode == RavePayActivity.RESULT_SUCCESS) {
            paymentPromise.resolve(message);
          } else if (resultCode == RavePayActivity.RESULT_ERROR) {
            paymentPromise.reject("PAYMENT_ERROR", "Error: "+message);
          } else if (resultCode == RavePayActivity.RESULT_CANCELLED) {
            paymentPromise.reject("PAYMENT_CANCELLED", "PAYMENT_CANCELLED");
          } else {
            paymentPromise.reject("UNKNOWN_ERROR", message);
          }
        }
        paymentPromise = null;
        removeRaveListener();
      } else {
        super.onActivityResult(requestCode, resultCode, data);
      }
    }
  };

  @Override
  public void invalidate() {
    removeRaveListener();
    super.invalidate();  // Call the superclass method to handle any additional cleanup
  }
}
