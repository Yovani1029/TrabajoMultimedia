package io.ionic.starter;

import android.appwidget.AppWidgetProvider;
import android.appwidget.AppWidgetManager;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Handler;
import android.widget.RemoteViews;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.target.AppWidgetTarget;

public class MultimediaWidget extends AppWidgetProvider {
  private Handler handler = new Handler();
  private Runnable updateRunnable;

  @Override
  public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
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
        handler.postDelayed(this, 5000);
      }
    };
    handler.post(updateRunnable);
  }

  private void updateWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
    SharedPreferences prefs = context.getSharedPreferences("capacitorStorage", Context.MODE_PRIVATE);
    String imageUrl = prefs.getString("imageUrl", "");
    String description = prefs.getString("description", "Sin descripción");

    RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_multimedia);
    views.setTextViewText(R.id.widget_description, description);

    AppWidgetTarget target = new AppWidgetTarget(context, R.id.widget_image, views, appWidgetId);
    Glide.with(context.getApplicationContext())
      .asBitmap()
      .load(imageUrl)
      .into(target);

    appWidgetManager.updateAppWidget(appWidgetId, views);
  }
}
