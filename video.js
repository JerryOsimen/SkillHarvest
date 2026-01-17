/* LOAD SELECTED VIDEO FROM HOME PAGE*/
document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = "http://127.0.0.1:5000/api";
    let videoData = [];
    const params = new URLSearchParams(window.location.search);
    const videoURL = params.get("videoURL");
    const upload = document.querySelector('.upload')
    const title = params.get("title");
    const description = params.get("desc");
    const videoId = params.get("id");
    const token = localStorage.getItem("token");
    const author = document.querySelector('.authorsName');
    const location = document.getElementById('location');
    const logout = document.querySelector('.logout')

    if (videoURL) {
        const videoPlayer = document.getElementById("play-screen");
        const videoSource = document.getElementById("main-screen-src");

        videoSource.src = videoURL;
        document.getElementById("video-title").textContent = title;
        document.getElementById("video-description").textContent = description;
        // author.textContent = authorName;
        const userInfo = localStorage.getItem("skillHarvestUser");
        const user = JSON.parse(userInfo);
        author.textContent = user.name;
        location.textContent = user.farmLocation;
        console.log(user);
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

    
    
    upload.addEventListener('click', (e) => {
        // 1. Stop the anchor tag from navigating automatically
        e.preventDefault();
    
        if (!token) {
            // 2. Redirect to signup if no token
            window.location.href = 'signup.html';
        } else {
            // 3. Only redirect to upload if token exists
            window.location.href = 'upload.html';
        }
    });
    logout.addEventListener('click', (e) => {
        e.preventDefault();
        alert('logging out')
        localStorage.removeItem("token");
        localStorage.removeItem("skillHarvestUser")
        window.location.replace('signup.html');
    })



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
    < i class="fa-regular fa-comment px-2" ></i >
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
    const addToLikes = async (video) => {
        if (!token) {
            alert("Please login to like videos");
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/video/${video.id}/like`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();

            if (res.ok) {
                
                if (data.liked) {
                    video.likes++;
                } else {
                    video.likes--;
                }

                document.getElementById('likes').innerHTML = `
                    <i class="fa-regular fa-thumbs-up px-2"></i>
                    ${video.likes}
                `;
            } else {
                alert(data.message || "Error liking video");
            }
        } catch (error) {
            console.error("Error liking video:", error);
        }
    };

    document.getElementById('likes').addEventListener("click", () => {
        const activeVideo = videoData.find(v => v.isPlaying);
        if (activeVideo) addToLikes(activeVideo);
    });




    const allVideos = (videoData) => {
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

    // Initial fetch
    fetchBookmarks().then(() => {
        fetchGlobalVideos().then(() => {
            // If there's a video in the URL params, it might have been loaded already
            // But we want to sync it with videoData if possible
            const params = new URLSearchParams(window.location.search);
            const videoId = params.get("id");
            if (videoId && videoData.length > 0) {
                const video = videoData.find(v => v.id === videoId);
                if (video) mainScreenUpdate(video);
            } else if (videoData.length > 0) {
                mainScreenUpdate(videoData[0]);
            }
        });
    });

    document.getElementById("totalVideos").addEventListener("click", () => {
        videoList.innerHTML = "";
        allVideos(videoData);
    });

    document.getElementById("similarVideos").addEventListener("click", () => {
        videoList.innerHTML = "";
        const activeVideo = videoData.find(v => v.isPlaying);
        if (activeVideo) {
            fetchSimilarVideos(activeVideo.id);
        }
    });

    document.getElementById("trendingVideos").addEventListener("click", () => {
        videoList.innerHTML = "";
        fetchTrendingVideos();
    });

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
     *  FETCH VIDEOS FROM BACKEND
     * =========================== */
    async function fetchGlobalVideos() {
        try {
            const userInfo = localStorage.getItem("skillHarvestUser");
            const user = JSON.parse(userInfo);

            const res = await fetch(`${API_BASE_URL}/video`);
            const data = await res.json();
            if (data.success) {
                videoData = data.videos.map(v => ({
                    id: v.id,
                    title: v.title,
                    author: v.user?.name || "Unknown Author",
                    views: v.views,
                    date: new Date(v.createdAt).toLocaleDateString(),
                    src: v.videoUrl,
                    location: user.farmLocation,
                    comments: v.comments?.map(c => ({
                        comment: c.content,
                        commentorsImg: "./Videocard/assets/ooui_user-avatar-outline.png"
                    })) || [],
                    likes: v._count?.likes || 0,
                    isPlaying: false
                }));
                allVideos(videoData);
            }
        } catch (err) {
            console.error("Error fetching global videos:", err);
        }
    }

    async function fetchTrendingVideos() {
        try {
            const res = await fetch(`${API_BASE_URL}/video/trending`);
            const data = await res.json();
            if (data.success) {
                const trendingData = data.videos.map(v => ({
                    id: v.id,
                    title: v.title,
                    author: v.user?.name || "Unknown Author",
                    views: v.views,
                    date: new Date(v.createdAt).toLocaleDateString(),
                    src: v.videoUrl,
                    location: v.user?.farmLocation || "N/A",
                    comments: v.comments?.map(c => ({
                        comment: c.content,
                        commentorsImg: "./Videocard/assets/ooui_user-avatar-outline.png"
                    })) || [],
                    likes: v._count?.likes || 0,
                    isPlaying: false
                }));
                allVideos(trendingData);
            }
        } catch (err) {
            console.error("Error fetching trending videos:", err);
        }
    }

    async function fetchSimilarVideos(videoId) {
        if (!videoId) return;
        try {
            const res = await fetch(`${API_BASE_URL}/video/${videoId}/similar`);
            const data = await res.json();
            if (data.success) {
                const similarData = data.videos.map(v => ({
                    id: v.id,
                    title: v.title,
                    author: v.user?.name || "Unknown Author",
                    views: v.views,
                    date: new Date(v.createdAt).toLocaleDateString(),
                    src: v.videoUrl,
                    location: v.user?.farmLocation || "N/A",
                    comments: v.comments?.map(c => ({
                        comment: c.content,
                        commentorsImg: "./Videocard/assets/ooui_user-avatar-outline.png"
                    })) || [],
                    likes: v._count?.likes || 0,
                    isPlaying: false
                }));
                allVideos(similarData);
            }
        } catch (err) {
            console.error("Error fetching similar videos:", err);
        }
    }


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
            if (e.target.value !== "") handleSearch(query);
        }
    });



    // ---------- BOOKMARK SYSTEM ----------
    let bookmarkedVideos = [];

    // Get all bookmarks from API
    async function fetchBookmarks() {
        if (!token) return;
        try {
            const res = await fetch(`${API_BASE_URL}/bookmarks`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                bookmarkedVideos = data.bookmarks;
            }
        } catch (error) {
            console.error("Error fetching bookmarks:", error);
        }
    }

    // Toggle bookmark for a video
    async function toggleBookmark(video) {
        if (!token) {
            alert("Please login to bookmark videos");
            return false;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/${video.id}/bookmark`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success) {
                if (data.bookmarked) {
                    alert("Added to bookmarks");
                    bookmarkedVideos.push(video); // Optimistic update or refetch
                    return true;
                } else {
                    alert("Removed from bookmarks");
                    bookmarkedVideos = bookmarkedVideos.filter(v => v.id !== video.id);
                    return false;
                }
            }
        } catch (error) {
            console.error("Error toggling bookmark:", error);
        }
        return false;
    }

    // Initial fetch
    // fetchBookmarks() called at the end of the file in chain

    function getBookmarks() { // Helper to keep compatibility with existing calls
        return bookmarkedVideos;
    }

    // Update UI (icon change)
    function updateBookmarkBtn(isBookmarked) {
        const btn = document.getElementById("bookmarkBtn");
        if (!btn) return;

        const bookMarkbtnhtmlExist = "<i class= 'fa-solid text-red-700 fa-bookmark'></i>";
        const bookMarkbtnhtml = "<i class= 'fa-regular fa-bookmark'></i>";
        btn.innerHTML = isBookmarked ? bookMarkbtnhtmlExist : bookMarkbtnhtml;
    }




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


})