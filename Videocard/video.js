const mainVideo = document.getElementById('play-screen');
const menuBtn = document.getElementById('menuBtn');
const sideMenu = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeBtn');
const menuItems = document.getElementById('menuItems');
const playBtn = document.getElementById('playBtn');
const playOverlay = document.getElementById('playOverlay');
const authorsDetails = document.getElementById('authorsDetails')
const commentInput = document.getElementById('comment-input');
const commentBox = document.getElementById('commentBox');
const commentBtn = document.getElementById('submit-comment');
const mainVideoSrc = document.getElementById('main-screen-src'); 
const videoList = document.getElementById("videoList");



authorsDetails.addEventListener("click", ()=>{
    document.getElementById('moreDescription').classList.toggle("hidden")  
})




playBtn.addEventListener('click', () => {
    if (mainVideo.paused) {
       mainVideo.play();
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else {
       mainVideo.pause();
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    } 
        
});

closeSidebar.addEventListener('click', () => {
    sideMenu.classList.add('hidden');
    menuItems.classList.add("max-md:items-center");
   mainVideo.controls = true;
});



menuBtn.addEventListener('click', () => {
    sideMenu.classList.toggle('hidden');
   mainVideo.controls = !mainVideo.controls;
});

const updatecommentField = () => {
    const commentValue = commentInput.value;
    const usersImg = document.createElement('img');
    usersImg.src = "./assets/ooui_user-avatar-outline.png";
    usersImg.alt = "User Icon";
    usersImg.classList.add("size-8", "rounded-full", "mr-2", "bg-green-900");
    const newComment = document.createElement('li')
    newComment.innerText = commentValue;
    newComment.classList.add(
    "py-2", "px-4", "gap-2", 
    "w-full", 
    "max-w-full",
    "break-words",
    "whitespace-normal", "flex", 
    "flex-wrap", "overflow-hidden", 
    "bg-green-900", "rounded-lg", "mb-2", 
    "text-white");   
    newComment.prepend(usersImg);
    commentBox.appendChild(newComment);   
    console.log(newComment,usersImg)  ;
    // commentBox.appendChild(newCommet);
    commentInput.value = "";
}

commentInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter'&& commentInput.value.trim() !== '') {
        updatecommentField();
    } 
});

commentBtn.addEventListener('click',()=>{
    if (commentInput.value.trim() !== '')   {
        updatecommentField();
    }
} );   


const videoData = [
    {
        src: "./assets/Prisma.error.mp4",
        title: "How to Fix Prisma Error",
        author: "Dev Musa",
        views: "1.2k",
        date: "2 days ago"
    },
    {
        src: "./assets/Figmatutorial.mp4",
        title: "Figma Tutorial",
        author: "UI John",
        views: "900",
        date: "1 day ago"
    },
     {
        src: "./assets/Figmatutorial.mp4",
        title: "Figma Tutorial",
        author: "UI John",
        views: "900",
        date: "1 day ago"
    }
];



videoData.forEach(video => {
    const card = document.createElement("div");
    card.className = "video-card text-white grid h-32 max-lg:h-full grid-cols-[1fr_2fr] max-lg:grid-cols-[1fr] bg-green-800 hover:bg-green-700 rounded-3xl gap-2 p-3";

    card.innerHTML = `
        <video muted class="object-cover h-full rounded-xl max-lg:rounded-t-xl">
            <source src="${video.src}">
        </video>

        <div class="flex-col justify-center max-lg:items-center max-lg:text-center">
            <h3 class="font-bold">${video.title}</h3>
            <p class="text-sm">${video.author}</p>
            <p class="text-sm">${video.views} views</p>
            <p class="text-sm">${video.date}</p>
        </div>
    `;

    // Clicking card loads main video
    card.onclick = () => {
        
        console.log(mainVideoSrc.src)
        mainVideoSrc.src = video.src;
        console.log(mainVideoSrc.src)
        mainVideo.load();
        mainVideo.play();
    };

    videoList.appendChild(card);
});


console.log(videoList, videoData);