console.log("EENIE MINNIE MINI MO LOVER")
let currentSong = new Audio();
let songs;
let currFolder;
let songUl;
//chatgpt is used for this tbh
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function GetSongs(folder) {
    currFolder=folder
    let a = await fetch(`/${folder}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
     songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }


          //show all the songs in the playlist
     songUl = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUl.innerHTML=""
    for (const song of songs) {

        songUl.innerHTML = songUl.innerHTML +
                    `<li>
                        <img class="invert" src="../img/music.svg" >
                        <div class="info">
                            <div>${song.replaceAll("%20", " ")}</div>   
                        </div>
                        <div class="playnow">
                            <span>Play Now</span>
                        <img class="invert" src="../img/play2.svg" >
                        </div>      
                     </li>`;

    }
    
    //attach an event listner to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=> {
        e.addEventListener("click",element=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    
    return songs

}
const playMusic= (track)=>{
    currentSong.src=`/${currFolder}/` + track
    currentSong.play();
    play.src="../img/pause.svg";
    document.querySelector(".songinfo").innerHTML = track    
    document.querySelector(".songtime").innerHTML =  "00:00 / 00:00" ;  
}

async function main() {
    //It will give the list of all songs
     await GetSongs("songs/eng")

    //attach an event listner to play,previous and next
    play.addEventListener("click",()=>{

        if(currentSong.paused){
            currentSong.play()
            play.src="../img/pause.svg";
        }
        else{
            currentSong.pause()
            play.src="../img/play.svg";
        }
    }) 

    //listens for time update event
    currentSong.addEventListener("timeupdate",()=>{
            document.querySelector(".songtime").innerHTML= `${secondsToMinutesSeconds(currentSong.currentTime)} : ${secondsToMinutesSeconds(currentSong.duration)}`
            document.querySelector(".circle2").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // add an event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        //rectwala use kiya hai from the msscode
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle2").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    //add an event listner for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0";
    })

    //add an event listner toclose hamburger
    document.querySelector(".cross").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%";
    })

    //add an event listner to previous
    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("previous clicked")
        let index= songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1) >= 0){
            playMusic(songs[index-1])
        }
        
    })

    //add an event listner to next
    next.addEventListener("click",()=>{
        currentSong.pause()
        console.log("next clicked")

        let index= songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        if((index+1) < songs.length){
            playMusic(songs[index+1])
        }
    })

    //add an event to volume buttons
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log("Setting volume to",e.target.value)
        currentSong.volume= parseInt(e.target.value)/100
    })

    //to load songs playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
            e.addEventListener("click", async item=>{
                songs = await GetSongs(`songs/${item.currentTarget.dataset.folder}`)
                playMusic(songs[0])
                
            })
    })

    //add event listner to mute the volume
        document.querySelector(".volume>img").addEventListener("click",e=>{
            if(e.target.src.includes("../img/volume.svg")){
                e.target.src= e.target.src.replace("../img/volume.svg","../img/mute.svg")
                currentSong.volume=0;
                document.querySelector(".range").getElementsByTagName("input")[0].value=0;
            }
            else{
                e.target.src= e.target.src.replace("../img/mute.svg","../img/volume.svg")
                currentSong.volume=.1;
                document.querySelector(".range").getElementsByTagName("input")[0].value=10;
            }
        })
}

main()