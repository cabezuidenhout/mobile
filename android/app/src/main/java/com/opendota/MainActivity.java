package com.opendota;

import android.webkit.WebView;
import com.facebook.react.ReactActivity;
import com.oblador.vectoricons.VectorIconsPackage;
import com.react.rnspinkit.RNSpinkitPackage;

public class MainActivity extends ReactActivity {

    public void onCreate() {
        WebView.setWebContentsDebuggingEnabled(true);
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "OpenDota";
    }
}
