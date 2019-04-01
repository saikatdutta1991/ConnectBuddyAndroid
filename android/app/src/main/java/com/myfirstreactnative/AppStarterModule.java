package com.myfirstreactnative;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.myfirstreactnative.MainActivity;
import com.facebook.react.bridge.ReactMethod;
import android.content.Intent;

class AppStarterModule extends ReactContextBaseJavaModule {

    AppStarterModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "AppStarter";
    }

    @ReactMethod
    void start() {
        ReactApplicationContext context = getReactApplicationContext();
        Intent intent = new Intent(context, MainActivity.class);
        context.startActivity(intent);
    }
}