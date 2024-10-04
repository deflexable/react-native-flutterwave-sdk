#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(FlutterwaveSdk, NSObject)

RCT_EXTERN_METHOD(toggleNightMode:(BOOL)options)

RCT_EXTERN_METHOD(initializeRave:(NSDictionary *)config
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}
@end