package io.ionic.starter;

import android.content.Context;
import android.content.SharedPreferences;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.PluginMethod;

@CapacitorPlugin(name = "SharedPreferencesPlugin")
public class SharedPreferencesPlugin extends Plugin {

  @PluginMethod
  public void save(PluginCall call) {
    String key = call.getString("key");
    String value = call.getString("value");

    if (key == null || value == null) {
      call.reject("Missing key or value");
      return;
    }

    Context context = getContext();
    SharedPreferences prefs = context.getSharedPreferences("capacitorStorage", Context.MODE_PRIVATE);
    prefs.edit().putString(key, value).apply();

    call.resolve();
  }
}
