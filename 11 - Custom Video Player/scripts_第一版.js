/* 1.取得所有video DOM元素 */

const video = document.querySelector('.viewer');
const toggleBtn = document.querySelector('.toggle');
const progress = document.querySelector('.progress');
const progressBar = document.querySelector('.progress__filled');
const volume = document.querySelector('[name="volume"]');
const playbackRate = document.querySelector('[name="playbackRate"]');
const skipButtons = document.querySelectorAll('[data-skip]');




/* 2.相關function */
function togglePlay(e){
    if (video.paused === true){
        toggleBtn.textContent = "❚ ❚";
        video.play();
    }else{
        toggleBtn.textContent = "►";
        video.pause();
    } 
}


function handleVolume(e){
    // console.log(this.value);
    video.volume = this.value
}

function handlePlaybackRate(e){
    // console.log(this.value);
    video.playbackRate = this.value
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

// 進度條更新目前播放時間
video.addEventListener('timeupdate', handleProgress);

// 進度條監聽是否有切換video播放時間
let mousedown = false; //判斷滑鼠是否有點擊
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

// 調整聲音
volume.addEventListener('change', handleVolume);
// 調整播放倍數
playbackRate.addEventListener('change', handlePlaybackRate);

// 快進、快退(+5 or -5)
skipButtons.forEach(button => button.addEventListener('click', skip));
