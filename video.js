// GET VIDEO ID FROM URL
const params = new URLSearchParams(window.location.search);
const videoIdFromUrl = params.get("id");

// ELEMENT SELECTORS
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


// VIDEO DATA FROM LOCALSTORAGE ONLY
const videoData = JSON.parse(localStorage.getItem("videos")) || [];


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

    mainVideoSrc.src = video.src || video.videoURL;
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


// RENDER VIDEO LIST




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
async function fetchVideosByTag() {

    const url = `https://skillharvest-backend.onrender.com/api/video`;

    try {
        const res = await fetch(url);

        if (!res.ok)
            throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        console.log("Videos:", data);

        // TODO: If you want to replace your static videoData with API videos:
        videoData.push(...data.videos);

        return data;

    } catch (err) {
        console.error("Error fetching videos:", err);
    }
}

// request videos initially



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
        if (e.target.value!=="") handleSearch(query.trim().toLowerCase());
    }
});



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

function loadVideoFromURL() {
    if (!videoIdFromUrl) return; // do nothing if no video ID in URL

    const selectedVideo = videoData.find(
        v => String(v.id) === String(videoIdFromUrl)
    );

    if (!selectedVideo) return; // do nothing if ID not found in videoData

    videoData.forEach(v => v.isPlaying = false);
    selectedVideo.isPlaying = true;
    mainScreenUpdate(selectedVideo);
}

// Run after page load
window.addEventListener("load", loadVideoFromURL);




