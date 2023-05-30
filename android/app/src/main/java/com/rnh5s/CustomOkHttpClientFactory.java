package com.rnh5s;

import com.facebook.react.modules.network.OkHttpClientFactory;
import com.facebook.react.modules.network.OkHttpClientProvider;
import com.facebook.react.modules.network.ReactCookieJarContainer;

import okhttp3.CertificatePinner;
import okhttp3.OkHttpClient;


import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.security.cert.CertificateException;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.util.concurrent.TimeUnit;
import javax.net.ssl.KeyManager;







public class CustomOkHttpClientFactory implements OkHttpClientFactory {

    static SSLSocketFactory sslSocketFactory;

    static {
        TrustManager[] trustAllCerts = new TrustManager[]{new X509TrustManager() {
            public void checkClientTrusted(X509Certificate[] chain, String uthType) throws
                    CertificateException {
            }

            public void checkServerTrusted(X509Certificate[] chain, String authType) throws CertificateException {
            }

            public X509Certificate[] getAcceptedIssuers() {
                return new X509Certificate[0];
            }
        }};

        try {
            SSLContext sslContext = SSLContext.getInstance("TLS");
            sslContext.init((KeyManager[]) null, trustAllCerts, new SecureRandom());
            sslSocketFactory = sslContext.getSocketFactory();
            // X509TrustManager trustManager = (X509TrustManager) trustManagers[0];
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public OkHttpClient createNewNetworkModuleClient() {
        OkHttpClient.Builder clientBuilder = new OkHttpClient.Builder()
                .connectTimeout(0, TimeUnit.MILLISECONDS)
                .readTimeout(0, TimeUnit.MILLISECONDS)
                .writeTimeout(0, TimeUnit.MILLISECONDS)
                .cookieJar(new ReactCookieJarContainer());


        clientBuilder.sslSocketFactory(sslSocketFactory,new X509TrustManager()
        { 
         @Override public void checkClientTrusted(X509Certificate[] chain, String authType)
          throws CertificateException { } @Override public void checkServerTrusted(X509Certificate[] chain, String authType) 
          throws CertificateException { } @Override public X509Certificate[] getAcceptedIssuers()
           { return new X509Certificate[0]; } })
        .hostnameVerifier(new HostnameVerifier() {
            @Override
            public boolean verify(String s, SSLSession sslSession) {
                return true;
            }
        });
        return clientBuilder.build();


        // OkHttpClient.Builder builder = new OkHttpClient().newBuilder()
        // .connectTimeout(0, TimeUnit.MILLISECONDS)
        // .readTimeout(0, TimeUnit.MILLISECONDS)
        // .writeTimeout(0, TimeUnit.MILLISECONDS)
        // .cookieJar(new ReactCookieJarContainer())
        // .sslSocketFactory(sslContext.getSocketFactory(),trustManager)
        // .hostnameVerifier(new HostnameVerifier() {

        //     @Override
        //     public boolean verify(String s, SSLSession sslSession) {

        //         return true;
        //     }
        // });
        // return clientBuilder.build();

    }

}


// OkHttpClient.Builder builder =
//  new OkHttpClient.Builder();
//   builder.sslSocketFactory(sslSocketFactory, new X509TrustManager()
//    { 
//     @Override public void checkClientTrusted(X509Certificate[] chain, String authType)
//      throws CertificateException { } @Override public void checkServerTrusted(X509Certificate[] chain, String authType) 
//      throws CertificateException { } @Override public X509Certificate[] getAcceptedIssuers()
//       { return new X509Certificate[0]; } }
//       )