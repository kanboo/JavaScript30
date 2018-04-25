let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

function timer(seconds) {
  // 因要重新倒數，清除之前設定
  clearInterval(countdown);

  // 取得 現在時間
  const now = Date.now();
  // 取得 現在時間 + 計時秒數
  const then = now + seconds * 1000;

  // 顯示倒數時間
  displayTimeLeft(seconds);
  // 顯示結束時間
  displayEndTime(then);

  // 每秒執行一次，刷新資料
  // 將 setInterval 設定在 countdown變數，
  // 以便於後面可用程式指定結束 setInterval。
  countdown = setInterval(() => {
    // 計算 倒數的總秒數
    const secondsLeft = Math.round((then - Date.now()) / 1000);

    // 倒數完畢後，結束 setInterval
    if(secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }

    // 顯示倒數時間
    displayTimeLeft(secondsLeft);
  }, 1000);
}


// 顯示倒數時間
function displayTimeLeft(seconds) {
  // 取得 分
  const minutes = Math.floor(seconds / 60);
  // 取得 秒
  const remainderSeconds = seconds % 60;

  // 在顯示 秒數 部份，若小於10，在個位數前面補零
  const display = `${minutes}:${remainderSeconds < 10 ? '0' : '' }${remainderSeconds}`;

  // 顯示至畫面上
  document.title = display;
  timerDisplay.textContent = display;
}

// 顯示結束時間
function displayEndTime(timestamp) {
  // 將 總秒數 轉換為 時間格式
  const end = new Date(timestamp);

  // 取得 小時
  const hour = end.getHours();
  // 將 小時 轉換 12小時制
  const adjustedHour = hour > 12 ? hour - 12 : hour;
  // 取得 分鐘
  const minutes = end.getMinutes();

  // 在顯示 分鐘 部份，若小於10，在個位數前面補零
  endTime.textContent = `Be Back At ${adjustedHour}:${minutes < 10 ? '0' : ''}${minutes}`;
}


// 啟動 倒數時間
function startTimer() {
  // 取得 data-time 的數值
  const seconds = parseInt(this.dataset.time);
  // 傳入 計時函式
  timer(seconds);
}

// 遍歷按鈕 並加上 監聽事件
buttons.forEach(button => button.addEventListener('click', startTimer));

// 客制自訂時間倒數
document.customForm.addEventListener('submit', function(e) {
  // 取消 submit 後，頁面跳轉
  e.preventDefault();
  // 取得 時間
  const mins = this.minutes.value;
  // 傳入 計時函式
  timer(mins * 60);
  // 清空欄位
  this.reset();
});