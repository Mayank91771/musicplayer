const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");


let musicIndex = Math.floor(Math.random() * allMusic.length + 1);
console.log(musicIndex);

window.addEventListener("load", ()=>{
    loadMusic(musicIndex); //call load music function once window loaded.
    playingNow();
})

//load music function
function loadMusic(indexNum){
    musicName.innerHTML = allMusic[indexNum-1].name;
    musicArtist.innerHTML = allMusic[indexNum-1].artist;
    musicImg.src = `images/${allMusic[indexNum-1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNum - 1].src}.mp3`;
}

//play music function
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}
//pauseMusic
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

//next music function
function nextMusic(){
    musicIndex++;
    // if the list reach last then change music index back to 1
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

function prevMusic(){
    musicIndex--;
    // if the musicIndex is less than 1 then musicIndex will be array length so that last song will play. 
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

playPauseBtn.addEventListener("click", ()=>{
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
});

nextBtn.addEventListener("click", ()=>{
    nextMusic(); //calling function
});

prevBtn.addEventListener("click", ()=>{
    prevMusic(); //calling function
    
});

//update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e)=>{
    const currentTime = e.target.currentTime; //current time
    const duration = e.target.duration; //total duration
    let progressWidth = (currentTime/duration) * 100;
    progressBar.style.width = `${progressWidth}%`


    
    let musicCurrentTime = wrapper.querySelector(".current");
    let musicDuration = wrapper.querySelector(".duration");
    
    mainAudio.addEventListener("loadeddata",()=>{ //loaded data event used to get the audio details before playing the audio
        

        //update song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){ // adding 0 if seconds are less than 10
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
        
    })
    // updating current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec < 10){ // adding 0 if seconds are less than 10
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

//Update playing song current time according to progress bar width
progressArea.addEventListener("click", (e)=>{
    let progressWidthVal = progressArea
    .clientWidth; //getting with of progress bar
    let clickedOffSetX = e.offsetX; //getting offset x value
    let songDuration = mainAudio.duration //total song duration

    mainAudio.currentTime = (clickedOffSetX / progressWidthVal) * songDuration;
    playMusic();
})

//Repeat option
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click",()=>{
    //first get the inner text of the icon and change it accordingly
    let getText = repeatBtn.innerText;
    //do different changes on different icon clock using switch
    switch(getText){
        case "repeat": 
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped");
            break;
        case "repeat_one": 
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffle");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped");
            break;

    }
});

//After the song ended
mainAudio.addEventListener("ended", ()=>{
    // according to what user selected play the song i.e., shuffle/playback/repeat all
    let getText = repeatBtn.innerText;

    switch(getText){
        case "repeat": 
            nextMusic();
            playMusic();
            break;
        case "repeat_one": 
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let randomIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do{
                randomIndex = Math.floor((Math.random() * allMusic.length) + 1);
            }while(musicIndex == randomIndex); //this loop will run until next random index and music index wont be same 
            musicIndex = randomIndex;
            loadMusic(musicIndex);
            playMusic();
            playingNow();
            break;

    }
})

showMoreBtn.addEventListener("click", ()=>{
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", ()=>{
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

//lets create li according to array length
console.log(allMusic.length);
for(let i = 0; i < allMusic.length; i++){
    // below increasing i with 1 because we have already decrased i with -1 before in loadMusic.
    let liTag = `<li li-index="${i + 1}">  
                    <div class="row">
                    <span>${allMusic[i].name}</span>
                    <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
    let liAudioDuaration = ulTag.querySelector(`#${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", ()=>{ //loaded data event used to get the audio details before playing the audio
        //update song total duration
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){ // adding 0 if seconds are less than 10
            totalSec = `0${totalSec}`;
        }
        liAudioDuaration.innerText = `${totalMin}:${totalSec}`;
        liAudioDuaration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
}

//lets work on play particular song on clicked
const allLiTags = ulTag.querySelectorAll("li"); // console.log(allLiTags);
function playingNow(){
    for(let j = 0; j < allLiTags.length; j++){

        let audioTag = allLiTags[j].querySelector(".audio-duration")

        // remove playing class from current song if another song is selected
        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }
        // if there is an li tag which li-index is equal to musicIndex then this music is playing and lets style it
        if(allLiTags[j].getAttribute("li-index") == musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }
    
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
}

//play song on li click
function clicked(element){
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; //passing li index to music index
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}