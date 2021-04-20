import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:html/parser.dart' show parse;
import 'dart:html' as html;
import 'dart:convert' as convert;
import 'package:url_launcher/url_launcher.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'IOS安装包下载',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(title: 'IOS安装包下载'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);
  final String title;
  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  List<Map> _configList = [];

  //获取文件列表
  Future<List<String>> _getFileList(String url) async {
    List<String> results = [];
    try {
      var response = await Dio().get(url);
      // print(response);
      var document = parse(response.toString());
      var list = document.body.getElementsByClassName('display-name');
      for (var item in list) {
        int index = item.innerHtml.indexOf('href="');
        int count = item.innerHtml.indexOf('.json');
        if (index > 0 && count > 0) {
          int start = index + 6;
          int end = count + 5;
          String file = item.innerHtml.substring(start, end);
          results.add(file);
        }
      }
    } catch (e) {
      html.window.alert(e);
    }
    return results;
  }

  Future _getConfig(String url) async {
    print(url);
    try {
      var response = await Dio().get(url);
      print(response);
      Map map = convert.jsonDecode(response.toString());
      _configList.add(map);
    } catch (e) {
      html.window.alert('get config error');
    }
  }

  void _dataInit() async {
    String url = html.window.location.href;
    url = url.replaceAll('/#/', '');
    // String url = 'https://ios.xiaoenai.net:9000';
    var list = await _getFileList('$url/config/');

    for (var item in list) {
      await _getConfig('$url$item');
    }

    setState(() {});
  }

  @override
  void initState() {
    super.initState();
    _dataInit();
  }

  List<Widget> getColumn() {
    List<Widget> list = [];
    list.add(Space());
    // Rows(),
    // Rows(),
    return list;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Container(
        child: ListView.builder(
          itemCount: _configList.length + 1,
          itemBuilder: (context, index) {
            if (index == 0) {
              return Space();
            }

            return Rows(_configList[index - 1]);
          },
        ),
      ),
      // floatingActionButton: FloatingActionButton(
      //   onPressed: _incrementCounter,
      //   tooltip: 'Increment',
      //   child: Icon(Icons.add),
      // ), // This trailing comma makes auto-formatting nicer for build methods.
    );
  }
}

class Space extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 50.0,
    );
  }
}

class Rows extends StatelessWidget {
  final map;
  Rows(this.map);
  @override
  Widget build(BuildContext context) {
    String title = this.map['name'];
    return Container(
      height: 50.0,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          ElevatedButton(
            child: Container(
              width: 150.0,
              child: Text(
                title != null ? title : '',
                textAlign: TextAlign.center,
              ),
            ),
            onPressed: () {
              String shell = this.map['shell'];
              String url = getUrlInShell(shell) +
                  '/' +
                  getProjInShell(shell) +
                  '/' +
                  getBuildPathInShell(shell) +
                  '/manifest.plist';
              html.window.open(
                  'itms-services://?action=download-manifest&url=$url', 'ipa');
              // _launchURL('itms-services://?action=download-manifest&url=$url');
            },
          ),
          IconButton(
              icon: Icon(Icons.info),
              onPressed: () {
                String shell = this.map['shell'];
                String url = getUrlInShell(shell) +
                    '/' +
                    getProjInShell(shell) +
                    '/' +
                    getBuildPathInShell(shell) +
                    '/description.html';

                _launchURL(url);
              }),
        ],
      ),
    );
  }

//定义方法
  _launchURL(url) async {
    if (await canLaunch(url)) {
      await launch(url);
    } else {
      throw 'Could not launch $url';
    }
  }

  String getUrlInShell(String shell) {
    String result = '';
    try {
      int index = shell.indexOf('ipa_url:');
      String temp = shell.substring(index + 8, shell.length);
      index = temp.indexOf(' ');
      result = temp.substring(0, index);
    } catch (e) {
      html.window.alert('getUrlInShell error');
    }
    return result;
  }

  String getProjInShell(String shell) {
    String result = '';
    try {
      int index = shell.indexOf('ci_proj:');
      String temp = shell.substring(index + 8, shell.length);
      index = temp.indexOf(' ');
      result = temp.substring(0, index);
    } catch (e) {
      html.window.alert('getProjInShell error');
    }
    return result;
  }

  String getBuildPathInShell(String shell) {
    String result = '';
    try {
      int index = shell.indexOf('build_path:');
      String temp = shell.substring(index + 11, shell.length);
      index = temp.indexOf(' ');
      if (index < 0) {
        result = temp;
      } else {
        result = temp.substring(0, index);
      }
    } catch (e) {
      html.window.alert('getBuildPathInShell error');
    }
    return result;
  }
}
