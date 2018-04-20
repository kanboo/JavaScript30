const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

/*
實作步驟：
1. 取得鏡頭影像
2. MediaStream影像資料 寫入 canvas
3. 新增拍照功能
4. 新增濾鏡效果
*/


/* step 1. 取得鏡頭影像 */
function getVideo() {
  // 取得 user 的視訊裝置，並且回傳 Promise 狀態
  navigator.mediaDevices.getUserMedia({
      video: true, // 鏡頭
      audio: false // 聲音
    })
    /* 回傳 MediaStream 的資料 */
    .then(localMediaStream => {
      console.log(localMediaStream);
      /* 將 MediaStream 寫進 html的video標籤 */
      video.src = window.URL.createObjectURL(localMediaStream);
      /* 讓鏡頭持續運作 */
      video.play();
    })
    .catch(err => {
      console.error(`!!Error!!`, err);
    });
}

/* 補充：HTML5 的 Object URL
https://medium.com/@kf99916/html5-%E7%A5%9E%E5%A5%87%E7%9A%84-object-url-%E4%B8%8D%E7%94%A8%E5%BE%8C%E7%AB%AF-%E5%89%8D%E7%AB%AF%E4%BE%BF%E8%83%BD%E7%94%A2%E7%94%9F%E7%8D%B2%E5%8F%96%E6%8C%87%E5%AE%9A%E7%89%A9%E4%BB%B6%E7%9A%84%E7%B6%B2%E5%9D%80-6df283d58505
*/

/* step 2. MediaStream 寫入 canvas */
function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  // 用setInterval來持續取得目前的影像資訊
  return setInterval(() => {
    // 在 canvas 設置drawImage參數為 (資料來源video, 起始位置X軸, 起始位置Ｙ軸, 長, 寬)
    ctx.drawImage(video, 0, 0, width, height);
    // ctx.drawImage(video, 0, 0, 200, 200);

    /* 4. 新增濾鏡效果 */
    // 透過 getImageData 取得 canvans 中所有的像素點(r,g,b,alpha的資訊)
    let pixels = ctx.getImageData(0, 0, width, height);
    // console.log(pixels);

    // 透用濾鏡效果
    // pixels = redEffect(pixels);  // 4.1 濾鏡效果(紅色)
    pixels = rgbSplit(pixels);  // 4.2 濾鏡效果(三原色)
    // ctx.globalAlpha = 0.1;  // canvas 透明度
    // pixels = greenScreen(pixels);  // 4.3濾鏡效果(綠色)

    // 寫入 濾鏡效果
    ctx.putImageData(pixels, 0, 0);

  }, 16)
}

/* step 3. 新增拍照功能 */
function takePhoto() {
  // 將聲音切到 第0秒 並 播放
  snap.currentTime = 0;
  snap.play();

  // 將 canvas的內容 轉為 base64的圖檔資訊
  const data = canvas.toDataURL('image/jpeg');
  // console.log(data);

  // 用 createElemamnt 來建立一個新的 a 元素
  const link = document.createElement('a');
  // 設定連結為 base64圖檔
  link.href = data;
  // 設定屬性為：下載
  link.setAttribute('download', 'picture');
  // a元素裡新增一個 img
  link.innerHTML = `<img src="${data}" alt="picture" />`;

  // 將 a元素 新增至 strip圖片區塊（在第一筆的位置）
  strip.insertBefore(link, strip.firstChild);
}


/* step 4-1. 濾鏡效果(紅色) */
function redEffect(pixels) {
  for(let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
  }
  return pixels;
}

/* step 4-2. 濾鏡效果(三原色) */
function rgbSplit(pixels) {
  for(let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

/* step 4-3. 濾鏡效果(綠色) */
function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

// 啟動鏡頭
getVideo();

/* 監聽video事件，是否啟動 鏡頭 了嗎 */
video.addEventListener('canplay', paintToCanvas);