package io.ionic.starter;

import android.appwidget.AppWidgetProvider;
import android.appwidget.AppWidgetManager;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Handler;
import android.util.Log;
import android.widget.RemoteViews;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import org.json.JSONArray;
import org.json.JSONObject;

public class MultimediaWidget extends AppWidgetProvider {
  private Handler handler = new Handler();
  private Runnable updateRunnable;
  private int currentIndex = 0;

  @Override
  public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
    Log.d("SharedPreferencesPlugin", "Updating widget...");
    for (int appWidgetId : appWidgetIds) {
      updateWidget(context, appWidgetManager, appWidgetId);
    }

    handler.removeCallbacksAndMessages(null);
    updateRunnable = new Runnable() {
      @Override
      public void run() {
        for (int appWidgetId : appWidgetIds) {
          updateWidget(context, appWidgetManager, appWidgetId);
        }
        handler.postDelayed(this, 5000); // Actualiza cada 5 segundos
      }
    };
    handler.post(updateRunnable);
  }

  private void updateWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
    SharedPreferences prefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
    String json = prefs.getString("images", "[]");
    Log.d("SharedPreferencesPlugin", "JSON recuperado: " + json);

    try {
      JSONArray array = new JSONArray(json);
      Log.d("SharedPreferencesPlugin", "Cantidad de imágenes en JSON: " + array.length());

      if (array.length() == 0) {
        Log.d("SharedPreferencesPlugin", "No hay imágenes disponibles");
        return;
      }

      JSONObject item = array.getJSONObject(currentIndex);
      String imageUrl = item.optString("imageUrl", "");
      String description = item.optString("description", "Sin descripción");

      Log.d("SharedPreferencesPlugin", "Índice actual: " + currentIndex);
      Log.d("SharedPreferencesPlugin", "Imagen URL: " + imageUrl);
      Log.d("SharedPreferencesPlugin", "Descripción: " + description);

      RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_multimedia);
      views.setTextViewText(R.id.widget_description, description);

      downloadAndSetImage(context, imageUrl, appWidgetId, appWidgetManager);
      appWidgetManager.updateAppWidget(appWidgetId, views);

      currentIndex = (currentIndex + 1) % array.length();
    } catch (Exception e) {
      Log.e("SharedPreferencesPlugin", "Error procesando JSON", e);
    }
  }

  private Bitmap resizeBitmap(Bitmap original, int width, int height) {
    Log.d("SharedPreferencesPlugin", "Redimensionando imagen...");
    return Bitmap.createScaledBitmap(original, width, height, true);
  }

  public void downloadAndSetImage(Context context, String imageUrl, int appWidgetId, AppWidgetManager appWidgetManager) {
    new Thread(() -> {
      try {
        Log.d("WidgetImageDownload", "Descargando imagen desde URL: " + imageUrl);
        URL url = new URL(imageUrl);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setDoInput(true);
        connection.connect();
        InputStream input = connection.getInputStream();
        Bitmap bitmap = BitmapFactory.decodeStream(input);
        input.close();

        Log.d("WidgetImageDownload", "Imagen descargada correctamente");

        Bitmap resizedBitmap = resizeBitmap(bitmap, 200, 200);
        updateWidgetWithBitmap(context, resizedBitmap, appWidgetId, appWidgetManager);
      } catch (Exception e) {
        Log.e("WidgetImageDownload", "Error descargando la imagen", e);
      }
    }).start();
  }

  private void updateWidgetWithBitmap(Context context, Bitmap bitmap, int appWidgetId, AppWidgetManager appWidgetManager) {
    Log.d("SharedPreferencesPlugin", "Actualizando widget con nueva imagen...");
    RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_multimedia);
    views.setImageViewBitmap(R.id.widget_image, bitmap);
    appWidgetManager.updateAppWidget(appWidgetId, views);
  }
}
