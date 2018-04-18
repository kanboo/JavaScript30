/* 1.取得所有video DOM元素 */
const video = document.querySelector('.viewer');
const toggleBtn = document.querySelector('.toggle');
const progress = document.querySelector('.progress');
const progressBar = document.querySelector('.progress__filled');
const ranges = document.querySelectorAll('.player__slider');
const skipButtons = document.querySelectorAll('[data-skip]');



/* 2.相關function */
function togglePlay(e){
    const method = video.paused ? 'play' : 'pause';
    video[method]();
}

function updateButton() {
    const icon = this.paused ? '►' : '❚ ❚';
    // console.log(icon);
    toggleBtn.textContent = icon;
}


function handleRangeUpdate() {
    video[this.name] = this.value;
}

function handleProgress(e){
    // video.currentTime 目前播放時間
    // video.duration 屬性返回當前音頻/視頻的長度，以秒計。
    const percent = (video.currentTime / video.duration) * 100;
    // console.log(video.currentTime, video.duration, percent);
    progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
    // e.offsetX 取得滑鼠點擊的位置
    // progress.offsetWidth 進度條的總寬度
    // video.duration 屬性返回當前音頻/視頻的長度，以秒計。
    // console.log(e.offsetX, progress.offsetWidth, video.duration);

    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}


function skip() {
    video.currentTime += parseFloat(this.dataset.skip);
}



/* 3.監聽DOM元素 */
// video 播放或暫停
video.addEventListener('click',togglePlay);
toggleBtn.addEventListener('click',togglePlay);

// 監聽是否切換播放的icon
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);

// 進度條更新目前播放時間
// video.addEventListener('timeupdate', handleProgress);
video.addEventListener('progress', handleProgress);

// 進度條監聽是否有切換video播放時間
let mousedown = false; //判斷滑鼠是否有點擊
progress.addEventListener('click', scrub);

/* 此段程式碼，可簡寫為下面程式碼
progress.addEventListener('mousemove', (e) => {
    if (mousedown) {
        scrub(e);
    }
});
*/
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));

progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

// 調整 聲音、播放倍數
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));


// 快進、快退(+5 or -5)
skipButtons.forEach(button => button.addEventListener('click', skip));
