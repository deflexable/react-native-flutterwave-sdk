import Foundation
import React
import FlutterwaveSDK

@objc(FlutterwaveSdk)
class FlutterwaveSdk: NSObject, FlutterwavePayProtocol {
    
    public override init() {
        super.init()
    }
    
    var raveResolve: RCTPromiseResolveBlock? = nil
    var raveReject: RCTPromiseRejectBlock? = nil
    
    func tranasctionSuccessful(flwRef: String?, responseData: FlutterwaveSDK.FlutterwaveDataResponse?) {
        raveResolve!("\(String(describing: responseData))")
        raveResolve = nil
    }
    
    func tranasctionFailed(flwRef: String?, responseData: FlutterwaveSDK.FlutterwaveDataResponse?) {
        raveReject!("PAYMENT_ERROR", "\(String(describing: responseData))", NSError(domain: "react-native-flutterwave-sdk", code: 500, userInfo: nil))
        raveReject = nil
    }
    
    func onDismiss() {
        raveReject!("PAYMENT_CANCELLED", "PAYMENT_CANCELLED", NSError(domain: "react-native-flutterwave-sdk", code: 500, userInfo: nil))
        raveReject = nil
    }
    
    @objc(initializeRave:withResolver:withRejecter:)
    func initializeRave(_ config: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let raveConfig = FlutterwaveConfig.sharedConfig()
        raveConfig.publicKey = config["publicKey"] as? String
        raveConfig.encryptionKey = config["encryptionKey"] as? String
        raveConfig.currencyCode = (config["currency"] as? String)!
        raveConfig.email = config["email"] as? String
        raveConfig.transcationRef = config["ref"] as? String
        
        if config["country"] != nil {
            raveConfig.country = config["country"] as! String
        }
        
        if config["fName"] != nil {
            raveConfig.firstName = config["fName"] as? String
        }
        
        if config["lName"] != nil {
            raveConfig.lastName = config["lName"] as? String
        }
        
        if config["narration"] != nil {
            raveConfig.narration = config["narration"] as? String
        }
        
        if config["phone"] != nil {
            raveConfig.phoneNumber = config["phone"] as? String
        }
        
        if config["meta"] != nil {
            raveConfig.meta = config["meta"] as? [[String : String]]
        }
        
        if let subAccounts = config["subAccounts"] as? [[String: Any]] {
            var subAccountArray: [SubAccount] = []
            for subAccount in subAccounts {
                let subAccountInstance = SubAccount(
                    id: subAccount["id"] as! String,
                    ratio: subAccount["txnRatio"] as? Double,
                    charge_type: SubAccountChargeType(rawValue: subAccount["txnChargeType"] as! String),
                    charge: subAccount["txnCharge"] as? Double
                )
                subAccountArray.append(subAccountInstance)
            }
            raveConfig.subAccounts = subAccountArray
        }
        
        if config["isStaging"] != nil {
            raveConfig.isStaging = (config["isStagingEnv"] as? Bool)!
        }
        
        if config["isPreAuth"] != nil {
            raveConfig.isPreAuth = (config["isPreAuth"] as? Bool)!
        }
        
        var paymentExclusion: [PaymentOption] = []
        
        if config["acceptCardPayments"] != nil {
            if config["acceptCardPayments"] as? Bool == false {
                paymentExclusion.append(PaymentOption.debitCard)
            }
        }
        
        if config["acceptAccountPayments"] != nil {
            if config["acceptAccountPayments"] as? Bool == false {
                paymentExclusion.append(PaymentOption.bankAccount)
            }
        }
        
        if config["acceptUssdPayments"] != nil {
            if config["acceptUssdPayments"] as? Bool == false {
                paymentExclusion.append(PaymentOption.ussd)
            }
        }
        
        if config["acceptBarterPayments"] != nil {
            if config["acceptBarterPayments"] as? Bool == false {
                paymentExclusion.append(PaymentOption.barter)
            }
        }
        
        if config["acceptMobileMoney"] != nil {
            if config["acceptMobileMoney"] as? Bool == false {
                paymentExclusion.append(PaymentOption.mobileMoney)
            }
        }
        
        if config["acceptVoucherPayment"] != nil {
            if config["acceptVoucherPayment"] as? Bool == false {
                paymentExclusion.append(PaymentOption.voucherPayment)
            }
        }
        
        if config["bankTransferPayments"] != nil {
            let bankConfig = config["bankTransferPayments"] as! [String: Any]
            
            if bankConfig["enabled"] as? Bool == true {
                if bankConfig["static"] != nil {
                    raveConfig.isPermanent = bankConfig["static"] as! Bool
                } else if bankConfig["duration"] != nil {
                    raveConfig.duration = bankConfig["duration"] as! Double
                    raveConfig.frequency = bankConfig["frequency"] as! Double
                }
            } else {
                paymentExclusion.append(PaymentOption.bankTransfer)
            }
        }
        if !paymentExclusion.isEmpty {
            raveConfig.paymentOptionsToExclude = paymentExclusion
        }
        raveResolve = resolve;
        raveReject = reject;
        
        DispatchQueue.main.async {
            //            let controller = FlutterwavePayViewController()
            //            let nav = UINavigationController(rootViewController: controller)
            //            controller.amount = config["amount"] as? String
            //            controller.delegate = self
            //            nav.present(controller, animated: true)
            
            if let rootViewController = UIApplication.shared.keyWindow?.rootViewController {
                let controller = FlutterwavePayViewController()
                controller.amount = String((config["amount"] as? Double)!)
                controller.delegate = self
                let nav = UINavigationController(rootViewController: controller)
                rootViewController.present(nav, animated: true, completion: nil)
            }
        }
    }
    
    @objc
    func toggleNightMode(_ enableDarkMode: Bool) {
        DispatchQueue.main.async {
            if #available(iOS 13.0, *) {
                let style: UIUserInterfaceStyle = enableDarkMode ? .dark : .light
                UIApplication.shared.keyWindow?.overrideUserInterfaceStyle = style
            } else {
                print("Dark mode is not supported on this iOS version.")
            }
        }
    }
}