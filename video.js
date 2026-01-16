
/* LOAD SELECTED VIDEO FROM HOME PAGE*/
const params = new URLSearchParams(window.location.search);
<<<<<<< HEAD
const videoURL = params.get("videoURL");
const title = params.get("title");
const description = params.get("desc");
=======
const videoIndex = params.get("id");

const videos = JSON.parse(localStorage.getItem("videos")) || [];
>>>>>>> parent of bebbcf6 (updated)

if (videoURL) {
    const videoPlayer = document.getElementById("play-screen");
    const videoSource = document.getElementById("main-screen-src");

    videoSource.src = videoURL;
    document.getElementById("video-title").textContent = title;
    document.getElementById("video-description").textContent = description;

    videoPlayer.load();
}


const mainVideo = document.getElementById('play-screen'); 
const menuBtn = document.getElementById('menuBtn'); 
const sideMenu = document.getElementById('sidebar'); 

const closeSidebar = document.getElementById('closeBtn');
const menuItems = document.getElementById('menuItems');
const playBtn = document.getElementById('playBtn');
const playOverlay = document.getElementById('playOverlay');
const authorsDetails = document.getElementById('authorsDetails');
const commentInput = document.getElementById('comment-input');
const commentBox = document.getElementById('commentBox');
const commentBtn = document.getElementById('submit-comment');
const mainVideoSrc = document.getElementById('main-screen-src');
const videoList = document.getElementById("videoList");


// SHOW / HIDE VIDEO DESCRIPTION
authorsDetails.addEventListener("click", () => {
    document.getElementById('moreDescription').classList.remove("hidden");
    document.getElementById('showless').classList.remove("hidden");
});

document.getElementById('showless').addEventListener("click", () => {
    document.getElementById('moreDescription').classList.add("hidden");
    document.getElementById('showless').classList.add("hidden");
});


// PLAY / PAUSE BUTTON OVERLAY
playBtn.addEventListener('click', () => {
    if (mainVideo.paused) {
        mainVideo.play();
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else {
        mainVideo.pause();
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
});


// SIDEBAR
closeSidebar.addEventListener('click', () => {
    sideMenu.classList.add('hidden');
    mainVideo.controls = true;
});

menuBtn.addEventListener('click', () => {
    sideMenu.classList.toggle('hidden');
    mainVideo.controls = !mainVideo.controls;
});


// VIDEO DATA
const videoData = [
    {
        id:"1",
        src: "./Videocard/assets/Prisma.error.mp4",
        title: "How to Fix Prisma Error",
        author: "Dev Musa",
        comments: [],
        isTrending:false,
        likes: 10,
        location: "Enugu",
        views: "1.2k",
        date: "2 days ago",
        isPlaying: false,
    },
    {
        id:"2",
        src: "./Videocard/assets/Figmatutorial.mp4",
        title: "Figma Tutorial",
        author: "UI John",
        comments: [],
        isTrending:true,
        likes: 20,
        location: "Osun",
        views: "900",
        date: "1 day ago",
        isPlaying: false,
    },
    {
        id:"3",
        src: "./Videocard/assets/Figmatutorial.mp4",
        title: "Figma Tutorial",
        author: "UI John",
        comments: [],
        isTrending:false,
        likes: 900,
        location: "Oyo",
        views: "900",
        date: "1 day ago",
        isPlaying: false,
    },
    {
        id:"4",
        src: "./Videocard/assets/Figmatutorial.mp4",
        title: "Figma Tutorial",
        author: "UI John",
        isTrending:true,
        comments: [],
        likes: 900,
        location: "Oyo",
        views: "900",
        date: "1 day ago",
        isPlaying: false,
    }
];


// RENDER COMMENT ITEM
const createCommentElement = (value) => {
    const item = document.createElement('li');
    item.classList.add(
        "w-full", "py-2", "px-4", "max-w-full",
        "break-words", "whitespace-normal",
        "overflow-hidden", "bg-green-800",
        "rounded-lg", "mb-2", "text-white"
    );

    const img = document.createElement("img");
    img.classList.add("size-8", "rounded-full", "mr-2", "bg-green-900");
    img.src = value.commentorsImg;
    img.alt = "User Icon";

    item.appendChild(img);
    item.appendChild(document.createTextNode(value.comment));
    return item;
};


// ADD COMMENT
const updateCommentField = (video) => {
    const commentText = commentInput.value.trim();
    if (commentText === "") return;

    const newComment = {
        comment: commentText,
        commentorsImg: "./Videocard/assets/ooui_user-avatar-outline.png"
    };

    video.comments.push(newComment);
    commentBox.appendChild(createCommentElement(newComment));

    document.querySelector(".comments").innerHTML = `
        <i class="fa-regular fa-comment px-2"></i>
        ${video.comments.length}
    `;

    commentInput.value = "";
};

// ENTER KEY SUBMIT
commentInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && commentInput.value.trim() !== '') {
        const activeVideo = videoData.find(v => v.isPlaying);
        if (activeVideo) updateCommentField(activeVideo);
    }
});

// BUTTON SUBMIT
commentBtn.addEventListener('click', () => {
    const activeVideo = videoData.find(v => v.isPlaying);
    if (activeVideo) updateCommentField(activeVideo);
});


// UPDATE MAIN SCREEN
const mainScreenUpdate = (video) => {

    // Reset comments area
    commentBox.innerHTML = "";

    // Load existing comments
    video.comments.forEach(c => {
        commentBox.appendChild(createCommentElement(c));
    });

    videoData.forEach(v => v.isPlaying = false);
    video.isPlaying = true;

    mainVideoSrc.src = video.src;
    mainVideo.load();
    mainVideo.play();

    // Update UI text
    document.getElementById("location").innerText = video.location;

    document.querySelectorAll(".authorsName").forEach(n => {
        n.innerText = video.author;
    });

    document.querySelector(".comments").innerHTML = `
        <i class="fa-regular fa-comment px-2"></i>
        ${video.comments.length}
    `;

    document.querySelectorAll(".uploadDate").forEach(d => {
        d.innerText = video.date;
    });

    document.getElementById('views').innerHTML = `
        <i class="fa-regular fa-eye px-2"></i> 
        ${video.views}
    `;

    document.getElementById('video-title').innerText = video.title;

    document.getElementById('likes').innerHTML = `
        <i class="fa-regular fa-thumbs-up px-2"></i>
        ${video.likes}
    `;

    const isMarked = getBookmarks().some(v => v.id === video.id);
    updateBookmarkBtn(isMarked);

    document.getElementById("bookmarkBtn").onclick = () => {
    const status = toggleBookmark(video);
    updateBookmarkBtn(status);
};

};


// LIKE BUTTON
const addToLikes = (video) => {
    video.likes++;
    document.getElementById('likes').innerHTML = `
        <i class="fa-regular fa-thumbs-up px-2"></i>
        ${video.likes}
    `;
};

document.getElementById('likes').addEventListener("click", () => {
    const activeVideo = videoData.find(v => v.isPlaying);
    if (activeVideo) addToLikes(activeVideo);
});


<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD







const allVideos = (videoData)=>{
    videoData.forEach(video => {
    const card = document.createElement("div");
    card.className = "video-card text-white grid h-32 max-lg:h-full grid-cols-[1fr_2fr] max-lg:grid-cols-[1fr] bg-[#2e7d32] hover:bg-[#1b5e20] rounded-3xl gap-2 p-3";

    card.innerHTML = `
        <video muted class="object-cover h-full rounded-xl max-lg:rounded-t-xl">
            <source src="${video.src}">
        </video>
        <div class="flex flex-col justify-center max-lg:items-center px-10 max-lg:px-2 max-lg:text-center">
            <h3 class="font-bold">${video.title}</h3>
            <p class="text-sm">${video.author}</p>
            <p class="text-sm">${video.views} views</p>
            <p class="text-sm">${video.date}</p>
        </div>
    `;

   document.getElementById("shareBtn").onclick = () => shareVideo(video);

    card.onclick = () => {
        mainScreenUpdate(video);
    };

    videoList.appendChild(card);
});
}
=======
=======
>>>>>>> parent of bebbcf6 (updated)
=======
>>>>>>> parent of bebbcf6 (updated)
( 
 ()=>{
    const updatemain = [videoData[0]]
    videoData[0].isPlaying = true;
    updatemain.forEach(value=>{
        mainScreenUpdate(value)
    })
 }
)()
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> parent of bebbcf6 (updated)
=======
>>>>>>> parent of bebbcf6 (updated)
=======
>>>>>>> parent of bebbcf6 (updated)

allVideos(videoData)

document.getElementById("totalVideos").addEventListener("click",()=>{
    videoList.innerHTML = ""
    allVideos(videoData)
})

document.getElementById("similarVideos").addEventListener("click",()=>{
     videoList.innerHTML = ""
    similarVideos(videoData)
})

document.getElementById("trendingVideos").addEventListener("click",()=>{
    videoList.innerHTML = ""
    trendingSearch(videoData)
})

// DOWNLOAD BUTTON
document.getElementById('downloadVideo').addEventListener('click', () => {
    const videoUrl = mainVideoSrc.src;

    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = "video.mp4";
    a.click();
});

/** ===========================
 *  SHOW / HIDE PLAY BUTTON
 * =========================== */
const videoContainer = document.getElementById("Video-screen");

videoContainer.addEventListener("mousemove", () => {
    playBtn.classList.remove("hidden");

    // Proper timeout handling
    if (window.hidePlayBtnTimer) clearTimeout(window.hidePlayBtnTimer);

    window.hidePlayBtnTimer = setTimeout(() => {
        playBtn.classList.add("hidden");
    }, 2000);
});

mainVideo.addEventListener('mouseleave', () => {
    playBtn.classList.add('hidden');
});


/** ===========================
 *  DUMMY ASYNC FUNCTION
 * =========================== */


/** ===========================
 *  FETCH VIDEOS BY TAG
 * =========================== */
// async function fetchVideosByTag(tagName="John", page = 1, limit = 2) {

//     const url = `https://skillharvest-backend.onrender.com/api/video/tag/${tagName}?page=${page}&limit=${limit}`;

//     try {
//         const res = await fetch(url);

//         if (!res.ok)
//             throw new Error(`HTTP error! status: ${res.status}`);

//         const data = await res.json();
//         console.log("Videos:", data);

//         // TODO: If you want to replace your static videoData with API videos:
//         videoData = data.videos;

//         return data;

//     } catch (err) {
//         console.error("Error fetching videos:", err);
//     }
// }

// request videos initially
// fetchVideosByTag(1,2);


/** ===========================
 *  INITIALIZE MAIN VIDEO ON LOAD
 * =========================== */


/** ===========================
 *  SEARCH HANDLING
 * =========================== */
const searchBut = document.getElementById("searchBut");
const searchForm = document.getElementById("searchForm");

searchBut.addEventListener('click', (e) => {
    e.preventDefault();

    const formData = new FormData(searchForm);
    const query = formData.get("search")?.trim().toLowerCase();

    if (!query) return;

    console.log("Searching:", query);

    handleSearch(query);
});


/** ===========================
 *  SEARCH FUNCTION
 * =========================== */
function handleSearch(query) {
    // 🔎 LOCAL SEARCH WITHIN videoData
    const found = videoData.filter(v =>
        v.title.toLowerCase().includes(query) ||
        v.author.toLowerCase().includes(query) ||
        v.location.toLowerCase().includes(query)
    );

    // Clear current list
    videoList.innerHTML = "";

    if (found.length === 0) {
        videoList.innerHTML = `
            <p class="text-gray-300 text-center p-4">No videos found.</p>
        `;
        return;
    }

    // Re-render found videos
    allVideos(found)
}


function trendingSearch(videoData) {
    // 🔎 LOCAL SEARCH WITHIN videoData
    const found = videoData.filter(v =>
        v.isTrending === true
    );

    // Clear current list
    videoList.innerHTML = "";

    if (found.length === 0) {
        videoList.innerHTML = `
            <p class="text-gray-300 text-center p-4">No videos found.</p>
        `;
        return;
    }
    allVideos(found)
}


const searchInput = document.getElementById("search-bar")

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const query = e.target.value
        query.trim().toLowerCase();
        if (e.target.value!=="") handleSearch(query);
    }
});



// ---------- BOOKMARK SYSTEM ----------
const BOOKMARK_KEY = "bookmarkedVideos";

// Get all bookmarks
function getBookmarks() {
    return JSON.parse(localStorage.getItem(BOOKMARK_KEY)) || [];
}

// Save updated list
function saveBookmarks(list) {
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(list));
}

// Toggle bookmark for a video
function toggleBookmark(video) {
    let bookmarks = getBookmarks();

    const exists = bookmarks.some(v => v.id === video.id);

    if (exists) {
        // Remove
        bookmarks = bookmarks.filter(v => v.id !== video.id);
        saveBookmarks(bookmarks);
        alert("Removed from bookmarks");
        return false;
    } else {
        // Add
        bookmarks.push(video);
        saveBookmarks(bookmarks);
        alert("Added to bookmarks");
        return true;
    }
}

// Update UI (icon change)
// function updateBookmarkBtn(isBookmarked) {
//     const btn = document.getElementById("bookmarkBtn");
//     if (!btn) return;

//     const bookMarkbtnhtmlExist ="<i class= 'fa-regular text-red-700 fa-bookmark'></i>"
//     const bookMarkbtnhtml ="<i class= 'fa-regular fa-bookmark'></i>"
//     btn.textContent = isBookmarked ? `${btn.innerHTML= bookMarkbtnhtmlExist}` : `${btn.innerHTML= bookMarkbtnhtml}`;
// }




// document.querySelectorAll(".bookmarkCardBtn").forEach(btn => {
//     btn.addEventListener("click", () => {
//         const id = btn.dataset.videoid;
//         const video = videoData.find(v => v.id == id);

//         if (!video) return;

//         toggleBookmark(video);
//     });
// });



// ---------- SHARE SYSTEM ----------
function shareVideo(video) {
    const shareUrl = `${window.location.origin}/watch?video=${video.id}`;
    const shareText = `Watch this: ${video.title}`;

    if (navigator.share) {
        navigator.share({
            title: video.title,
            text: shareText,
            url: shareUrl
        })
        .catch(err => console.log("Share cancelled", err));
    } else {
        // Fallback for desktop
        navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
    }
}


function getSocialShareLinks(videoId, title) {
    const url = encodeURIComponent(`${location.origin}/watch?video=${videoId}`);
    const text = encodeURIComponent(title);

    return {
        whatsapp: `https://wa.me/?text=${text}%20${url}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`
    };
}


