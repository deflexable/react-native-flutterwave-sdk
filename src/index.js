import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-flutterwave-sdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const FlutterwaveSdk = NativeModules.FlutterwaveSdk ||
  new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );

let hasInitialize = false;

export const initializeRaveSdk = async (config) => {
  if (hasInitialize) throw 'cannot initialize multiple rave sdk simultaneously, a call to initializeRaveSdk() must resolve before calling another one';
  hasInitialize = true;

  try {
    const {
      ref,
      publicKey,
      encryptionKey,
      currency,
      email,
      amount,
      fName,
      lName,
      narration,
      phone,
      country,
      barterCountry,

      francMobileMoneyPayments,
      bankTransferPayments,
      subAccounts,

      acceptCardPayments,
      acceptAccountPayments,
      acceptMpesaPayments,
      acceptUssdPayments,
      acceptBarterPayments,
      acceptAchPayments,
      acceptGHMobileMoneyPayments,
      acceptUgMobileMoneyPayments,
      acceptZmMobileMoneyPayments,
      acceptRwfMobileMoneyPayments,
      acceptSaBankPayments,
      acceptUkPayments,
      isStagingEnv,
      allowSaveCardFeature,
      shouldDisplayFee,
      showStagingLabel,
      ...restConfig
    } = { ...config };

    Object.entries({
      ref,
      publicKey,
      encryptionKey,
      currency,
      email,
      fName,
      lName
    }).forEach(([k, v]) => {
      if (typeof v !== 'string') {
        if (!['fName', 'lName', 'country', 'barterCountry', 'narration', 'phone'].includes(k) || v !== undefined)
          throw `"${k}" must be a string but got "${typeof v}"`;
      }
      if (!v.trim()) throw `"${k}" requires a non empty string`;
    });

    if (
      typeof amount !== 'number' ||
      isNaN(amount) &&
      !Number.isFinite(amount) ||
      amount <= 0
    ) throw `"amount" must be a positive number`;

    if (francMobileMoneyPayments !== undefined) {
      if (typeof francMobileMoneyPayments?.enabled !== 'boolean')
        throw '"francMobileMoneyPayments.enabled" must have a boolean value';
      if (typeof francMobileMoneyPayments?.country !== 'string')
        throw '"francMobileMoneyPayments.country" must have a string value';
    }

    if (bankTransferPayments !== undefined) {
      const { enabled, static: _static, duration, frequency } = { ...bankTransferPayments };
      if (typeof enabled !== 'boolean')
        throw '"bankTransferPayments.enabled" must have a boolean value';
      if (_static !== undefined && typeof _static !== 'boolean')
        throw '"bankTransferPayments.static" must have a boolean value';

      if (
        duration !== undefined ||
        frequency !== undefined
      ) {
        if (!Number.isInteger(duration) || duration < 0)
          throw '"bankTransferPayments.duration" must have an positive integer';
        if (!Number.isInteger(frequency) || frequency < 0)
          throw '"bankTransferPayments.frequency" must have an positive integer';
      }
    }

    if (subAccounts !== undefined) {
      if (!Array.isArray(subAccounts))
        throw `"subAccounts" must be an array but got ${subAccounts}`;

      subAccounts.forEach((b, i) => {
        if (typeof b?.id !== 'string') throw `"subAccounts.${i}.id" must be a string but got ${b.id}`;
        if (typeof b.txnRatio !== 'string') throw `"subAccounts.${i}.txnRatio" must be a string but got ${b.txnRatio}`;
        if (b.txnChargeType || b.txnCharge) {
          if (typeof b.txnChargeType !== 'string') throw `"subAccounts.${i}.txnChargeType" should have a string value but got ${b.txnChargeType}`;
          if (typeof b.txnCharge !== 'string') throw `"subAccounts.${i}.txnCharge" should have a string value but got ${b.txnCharge}`;
        }
      });
    }

    Object.entries({
      acceptCardPayments,
      acceptAccountPayments,
      acceptMpesaPayments,
      acceptUssdPayments,
      acceptBarterPayments,
      acceptAchPayments,
      acceptGHMobileMoneyPayments,
      acceptUgMobileMoneyPayments,
      acceptZmMobileMoneyPayments,
      acceptRwfMobileMoneyPayments,
      acceptSaBankPayments,
      acceptUkPayments,
      isStagingEnv,
      allowSaveCardFeature,
      shouldDisplayFee,
      showStagingLabel
    }).forEach(([k, v]) => {
      if (v !== undefined && typeof v !== 'boolean')
        throw `"${k}" must have a boolean value but got "${v}"`;
    });

    Object.keys(restConfig).forEach(k => {
      throw `unknown field "${k}"`;
    });

    const response = await FlutterwaveSdk.initializeRave(
      deleteUndefinedEntity({
        ref,
        publicKey,
        encryptionKey,
        currency,
        email,
        amount,
        fName,
        lName,
        phone,
        narration,
        country,
        barterCountry,

        francMobileMoneyPayments,
        bankTransferPayments,
        subAccounts,

        acceptCardPayments,
        acceptAccountPayments,
        acceptMpesaPayments,
        acceptUssdPayments,
        acceptBarterPayments,
        acceptAchPayments,
        acceptGHMobileMoneyPayments,
        acceptUgMobileMoneyPayments,
        acceptZmMobileMoneyPayments,
        acceptRwfMobileMoneyPayments,
        acceptSaBankPayments,
        acceptUkPayments,
        isStagingEnv,
        allowSaveCardFeature,
        shouldDisplayFee,
        showStagingLabel
      })
    );

    hasInitialize = false;
    return JSON.parse(response);
  } catch (error) {
    hasInitialize = false;
    throw error;
  }
};

const deleteUndefinedEntity = (o) => {
  if (Array.isArray(o)) return o.map(deleteUndefinedEntity);
  if (Object.prototype.toString.call(o) === '[object Object]')
    return Object.fromEntries(
      Object.entries(o).map(([k, v]) =>
        v !== undefined && [k, deleteUndefinedEntity(v)]
      ).filter(v => v)
    );
  return o;
};

export const toggleDarkMode = (darkMode) => {
  FlutterwaveSdk.toggleNightMode(!!darkMode);
};