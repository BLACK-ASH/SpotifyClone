console.log("i am runnig");
let track;
let currentMusic = new Audio(`/music/Alan%20Walker,%20Sabrina%20Carpenter%20&amp;%20Farruko%20-%20On%20My%20Way.mp3`);

async function getSongs() {
    let m = await fetch('http://127.0.0.1:3000/music');
    m = await m.text()
    // console.log(m)
    let div = document.createElement("div");
    div.innerHTML = m;
    let b = div.getElementsByTagName("a")
    let songs = [];
    for (let i = 0; i < b.length; i++) {
        const element = b[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href)
        }
    }
    return songs
}
function playMusic(e) {
    currentMusic.src ="/music/"+ e + ".mp3"
    currentMusic.play()
    document.querySelector(".songName").innerHTML=e;
}
function convertSecondsToMinutes(seconds) {
    // Calculate the number of minutes and seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Pad the minutes and seconds with leading zeros if necessary
    const paddedMinutes = Math.round(minutes)
    const paddedSeconds = Math.round(remainingSeconds)
    // Return the formatted time string
    return `${paddedMinutes}:${paddedSeconds}`;
}

async function main() {
    let songs = await getSongs()
    let list = document.querySelector(".yourDownloadsList")
    // console.log(list)
    songs.forEach(song => {
        function getSongName(url) {
            // Extract the filename from the URL
            const filename = url.substring(url.lastIndexOf('/') + 1);

            // Decode the URI to handle encoded characters
            const decodedFilename = decodeURIComponent(filename);

            // Remove the file extension
            const songName = decodedFilename.replace('.mp3', '');

            return songName;
        }

        let url = song;
        let songName = getSongName(url);

        list.innerHTML += `
      <li class="music round  p1 m1">
                         <div class="songNameList">
                        <img  src="/logos/music.svg" alt="Logo">
                       <div class="song"> ${songName}  </div>
                       </div>
                    </li>`
    });
    // to play music
    const song = document.querySelectorAll(".music")
    song.forEach(element => {
        // console.log( element.innerHTML)
        element.addEventListener("click", e => {
            //    console.log(element.querySelector(".song").innerHTML)
            playMusic(element.querySelector(".song").innerHTML.trim())
            document.querySelector(".playImg").src = "/logos/pause.svg"
            // console.log(element)
        })
    });
    currentMusic.addEventListener("timeupdate",()=>{
        
        document.querySelector(".duration").innerHTML=convertSecondsToMinutes(currentMusic.currentTime)+"/"+convertSecondsToMinutes(currentMusic.duration);
        document.querySelector(".circle").style.left=currentMusic.currentTime/currentMusic.duration*100+"%"
    })

    document.querySelector(".playImg").addEventListener("click",()=>{
        if(currentMusic.paused){
            currentMusic.play()
          document.querySelector(".playImg").src = "/logos/pause.svg"
        }else{
            currentMusic.pause()
            document.querySelector(".playImg").src = "/logos/play1.svg"
        }
    })
    document.querySelector(".seekbar").addEventListener("click",(e)=>{
        document.querySelector(".circle").style.left=e.offsetX/e.target.getBoundingClientRect().width*100+"%"
       currentMusic.currentTime= currentMusic.duration*e.offsetX/e.target.getBoundingClientRect().width
    })
}
main()
