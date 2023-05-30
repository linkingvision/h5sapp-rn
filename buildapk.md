一：搭建react-native环境
  1.JAVA环境安装
    需求jdk1.8.0

    https://www.oracle.com/java/technologies/javase/javase8u211-later-archive-downloads.html
    下载jdk-8u301-windows-x64.exe
    
    下载好以后按照提示安装
    
    设置好环境变量。
      在系统变量里新建"JAVA_HOME"变量，变量值为：C:\Program Files\Java\jdk1.8.0_60（根据自己的jdk的安装路径填写）
      在系统变量中找到Path将%Java_Home%\bin;%Java_Home%\jre\bin;到“变量值”栏的最前面，“确定”
      在“系统变量”栏，“新建”，“变量名”为“CLASSPATH”，“变量值”为“.;%JAVA_HOME%\lib;%JAVA_HOME%\lib\tools.jar”（注意最前面有一点）
    打开终端输入
    
    java -version 
    javac 
    没有报错即成功。
  2、安装Android sdk

    https://developer.android.google.cn/下载安装
    
    启动Andoid studio找到sdkmanager的SDK Tools选择android SDK Build-Tools下载即可。 如果需要测试空的APP版本号不能高于29.0.0
    
    在SDKplatform里 下载Android版本API level不能高于29（具体看cordova requirements里的提示）
    
    安装好设置环境变量即可。
    
    变量名ANDROID_HOME 变量值C:\Users\94146\AppData\Local\Android\Sdk （根据自己的Android Sdk的安装路径填写）
    
    Path里面变量值最后添加%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools\bin;
    
    注意用分号隔开
    
    adb version查看版本信息


  3、Gradle环境安装

    1.下载地址：https://gradle.org/releases/
    2.配置环境变量
    	新建环境变量   变量名GRADLE_HOME  变量值 D:\apk\gradle-7.0\bin （根据自己的Gradle的安装路径填写）
    	双击Path 在最后添加 D:\apk\gradle-7.0\bin;
    3.gradle -v 查看版本信息，验证环境变量配置是否完成
4、在根目录执行npm i下载依赖

二：打包项目命令

 ```
  生成密钥 :在 JDK 的 bin 目录中（比如C:\Program Files\Java\jdkx.x.x_x\bin）使用管理员打开cmd,执行  keytool -genkeypair -v -storetype       PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000  
  会在当前目录生成一个my-release-key.keystore的密钥库文件
  把my-release-key.keystore文件放到你工程中的android/app文件夹下
  如果没有gradle.properties文件你就自己创建一个 
  注意把其中的****替换为相应密码
  修改\h5sapp-rn\android\gradle.properties  
    MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
    MYAPP_RELEASE_KEY_ALIAS=my-key-alias
    MYAPP_RELEASE_STORE_PASSWORD=*****
    MYAPP_RELEASE_KEY_PASSWORD=*****

  将src\assets\fonts\iconfont.js放入node_modules\react-native-vector-icons里面
  将src\assets\fonts\iconfont.json放入node_modules\react-native-vector-icons\glyphmaps里面
  将src\assets\fonts\iconfont.ttf放入node_modules\react-native-vector-icons\Fonts里面
  
  1.打包android命令 
    $ cd android
    $ gradlew assembleRelease
  2.参考官网：https://www.react-native.cn/docs/signed-apk-android
  3.修改app名称：h5sapp-rn\android\app\src\main\res\values\string.xml
 ```



问题:
1.打包android报错: Task :react-native-orientation:verifyReleaseResources FAILED

  解决:修改h5sapp-rn\node_modules\react-native-orientation\android\build.gradle配置项

    android {
        compileSdkVersion 30
        buildToolsVersion "30.0.2"
        defaultConfig {
            minSdkVersion 21
            targetSdkVersion 30
            versionCode 1
            versionName "1.0"
            ndk {
            abiFilters "armeabi-v7a", "x86"
            }
        }
    }

三：编译项目命令

```
将src\assets\fonts\iconfont.js放入node_modules\react-native-vector-icons里面
将src\assets\fonts\iconfont.json放入node_modules\react-native-vector-icons\glyphmaps里面
将src\assets\fonts\iconfont.ttf放入node_modules\react-native-vector-icons\Fonts里面
npm run android
如果出现端口占用问题需要杀掉进程具体方法
查看进程 netstat -aon|findstr "8081"
杀掉进程taskkill /f /pid 17976
```

四：修改H5SAPP版本号和打包的apk名称

```
修改项目中h5sapp-rn\src\compoents\confver.json的Version的值即可
```

