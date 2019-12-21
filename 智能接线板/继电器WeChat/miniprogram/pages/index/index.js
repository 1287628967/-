//index.js
const app = getApp()
const devicesId = "562758194" // 填写在OneNet上获得的devicesId 形式就是一串数字 例子:9939133
const api_key = "mCfv=tI1p9KAr1g6tFfWXRYf=Kk=" 
Page({
  data: {
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    state: 1,
    state2: 1,
    shu1: 1,
    shu2: 2,
    shu3: 3,
    shu4: 4,
    /*s1:1,
    s2:2,
    s3:3,
    s4:5,
    c:0,*/
  },
  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.glojidianqilData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.glojidianqilData.fileID = res.fileID
            app.glojidianqilData.cloudPath = cloudPath
            app.glojidianqilData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
 getDatapoints: function () {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://api.heclouds.com/devices/562758194`,
        /**
         * 添加HTTP报文的请求头, 
         * 其中api-key为OneNet的api文档要求我们添加的鉴权秘钥
         * Content-Type的作用是标识请求体的格式, 从api文档中我们读到请求体是json格式的
         * 故content-type属性应设置为application/json
         */
        header: {
          'content-type': 'application/json',
          'api-key': api_key
        },
        success: (res) => {
          const status = res.statusCode
          const response = res.data
          if (status !== 200) { // 返回状态码不为200时将Promise置为reject状态
            reject(res.data)
            return;
          }
          if (response.errno !== 0) { //errno不为零说明可能参数有误, 将Promise置为reject
            reject(response.error)
            return;
          }

          if (response.data.datastreams.length === 0) {
            reject("当前设备无数据, 请先运行硬件实验")
          }

          //程序可以运行到这里说明请求成功, 将Promise置为resolve状态
          resolve({
            temperature: response.data.datastreams[0].datapoints.reverse(),
            light: response.data.datastreams[1].datapoints.reverse(),
            humidity: response.data.datastreams[2].datapoints.reverse()
          })
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },
  dakai: function () {
    /*var a = 2, b = 5;
    a=s1;
    c=a+b;*/
    this.setData({
      state: this.data.shu1,
      })
    var that = this //创建一个名为that的变量来保存this当前的值  
    wx.request({
      url: 'http://api.heclouds.com/devices/562758194/datapoints?type=3',
      method: 'post',
      data: {
        //if(c = 6) {
          jidianqi: '1'
        /*},
        if(c = 5) {
          kongtiao: '2'
        },
        if(c = 4) {
          kongtiao: '3'
        },
        if(c = 7) {
          kongtiao: '4'
         }*/ //这里是发送给服务器的参数（参数名：参数值）  
      },
      header: {
        'content-type': 'application/json',
        'api-key': 'mCfv=tI1p9KAr1g6tFfWXRYf=Kk='
      },
      success: function (res) {
        that.setData({ //这里是修改data的值  
          test: res.data //test等于服务器返回来的数据  
        });
        console.log(res.data)
      }
    })

    1; setTimeout(function () {
      var that = this //创建一个名为that的变量来保存this当前的值  
      var that = this //创建一个名为that的变量来保存this当前的值  
      wx.request({
        url: 'http://api.heclouds.com/devices/562758194/datapoints?type=3',
        method: 'post',
        data: {
          jidianqi: '1'  //这里是发送给服务器的参数（参数名：参数值）  
        },
        header: {
          'content-type': 'application/json',
          'api-key': 'mCfv=tI1p9KAr1g6tFfWXRYf=Kk='
        },
        success: function (res) {
          that.setData({ //这里是修改data的值  
            test: res.data //test等于服务器返回来的数据  
          });
          console.log(res.data)
        }
      }) //你需要执行的代码
    }, 6000)

  },
  guanbi: function () {
     // var a=2,b=5;
    this.setData({
      state: this.data.shu2,
      //a: this.data.s2,
      //c: this.data.a+b
      })
    var that = this //创建一个名为that的变量来保存this当前的值  
    wx.request({
      url: 'http://api.heclouds.com/devices/562758194/datapoints?type=3',
      method: 'post',
      data: {
        /*if(c = 6) {
          kongtiao: '1'
        } ,*/
        //if(c = 5) {
          jidianqi: '2'
       /* } ,
        if(c = 4) {
          kongtiao: '3'
        } ,
        if(c = 7){
        kongtiao: '4'
        } */ //这里是发送给服务器的参数（参数名：参数值）  
      },
      header: {
        'content-type': 'application/json',
        'api-key': 'mCfv=tI1p9KAr1g6tFfWXRYf=Kk='
      },
      success: function (res) {
        that.setData({ //这里是修改data的值  
          test: res.data //test等于服务器返回来的数据  
        });
        console.log(res.data)
      }
    })

    2; setTimeout(function () {
      var that = this //创建一个名为that的变量来保存this当前的值  
      wx.request({
        url: 'http://api.heclouds.com/devices/562758194/datapoints?type=3',
        method: 'post',
        data: {
          jidianqi: '2'  //这里是发送给服务器的参数（参数名：参数值）  
        },
        header: {
          'content-type': 'application/json',
          'api-key': 'mCfv=tI1p9KAr1g6tFfWXRYf=Kk='
        },
        success: function (res) {
          that.setData({ //这里是修改data的值  
            test: res.data //test等于服务器返回来的数据  
          });
          console.log(res.data)
        }
      }) //你需要执行的代码
    }, 6000)
  },
  
  dakai2: function () {
    //var a = 2, b = 5;
    this.setData({
      state: this.data.shu3,
      //b: this.data.s3,
      //c: this.data.a + b
      })
    var that = this //创建一个名为that的变量来保存this当前的值  
    wx.request({
      url: 'http://api.heclouds.com/devices/562758194/datapoints?type=3',
      method: 'post',
      data: {
        /*if(c = 6) {
          kongtiao: '1'
        },
        if(c = 5) {
          kongtiao: '2'
        },
        if(c = 4) {*/
          jidianqi: '3'
        /*},
        if(c = 7) {
          kongtiao: '4'
        } */ //这里是发送给服务器的参数（参数名：参数值）  
      },
      header: {
        'content-type': 'application/json',
        'api-key': 'mCfv=tI1p9KAr1g6tFfWXRYf=Kk='
      },
      success: function (res) {
        that.setData({ //这里是修改data的值  
          test: res.data //test等于服务器返回来的数据  
        });
        console.log(res.data)
      }
    })

    3; setTimeout(function () {
      var that = this //创建一个名为that的变量来保存this当前的值  
      var that = this //创建一个名为that的变量来保存this当前的值  
      wx.request({
        url: 'http://api.heclouds.com/devices/562758194/datapoints?type=3',
        method: 'post',
        data: {
          jidianqi: '3'  //这里是发送给服务器的参数（参数名：参数值）  
        },
        header: {
          'content-type': 'application/json',
          'api-key': 'mCfv=tI1p9KAr1g6tFfWXRYf=Kk='
        },
        success: function (res) {
          that.setData({ //这里是修改data的值  
            test: res.data //test等于服务器返回来的数据  
          });
          console.log(res.data)
        }
      }) //你需要执行的代码
    }, 6000)

  },
  guanbi2: function () {
    //var a = 2, b = 5;
    this.setData({
      state: this.data.shu4,
      //b: this.data.s4,
      //c: this.data.a + b
      })
    var that = this //创建一个名为that的变量来保存this当前的值  
    wx.request({
      url: 'http://api.heclouds.com/devices/562758194/datapoints?type=3',
      method: 'post',
      data: {
        /*if(c = 6) {
          kongtiao: '1'
        },
        if(c = 5) {
          kongtiao: '2'
        },
        if(c = 4) {
          kongtiao: '3'
        },
        if(c = 7) {*/
          jidianqi: '4'
        //}  //这里是发送给服务器的参数（参数名：参数值）  
      },
      header: {
        'content-type': 'application/json',
        'api-key': 'mCfv=tI1p9KAr1g6tFfWXRYf=Kk='
      },
      success: function (res) {
        that.setData({ //这里是修改data的值  
          test: res.data //test等于服务器返回来的数据  
        });
        console.log(res.data)
      }
    })

    4; setTimeout(function () {
      var that = this //创建一个名为that的变量来保存this当前的值  
      wx.request({
        url: 'http://api.heclouds.com/devices/562758194/datapoints?type=3',
        method: 'post',
        data: {
          jidianqi: '4'  //这里是发送给服务器的参数（参数名：参数值）  
        },
        header: {
          'content-type': 'application/json',
          'api-key': 'mCfv=tI1p9KAr1g6tFfWXRYf=Kk='
        },
        success: function (res) {
          that.setData({ //这里是修改data的值  
            test: res.data //test等于服务器返回来的数据  
          });
          console.log(res.data)
        }
      }) //你需要执行的代码
    }, 6000)

  }
})
