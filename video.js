/* LOAD SELECTED VIDEO FROM HOME PAGE*/
document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = "https://skillharvest-backend.onrender.com/api";
    let videoData = [];
    let currentAuthorId = null;
    const params = new URLSearchParams(window.location.search);
    const videoURL = params.get("videoURL");
    const upload = document.querySelector('.upload')
    const title = params.get("title");
    const description = params.get("desc");
    const videoId = params.get("id");
    const token = localStorage.getItem("token");
    const authorId = params.get("authorId");
    const authorName = params.get("authorName");
    const author = document.querySelector('.authorsName');
    const location = document.getElementById('location');

    const mainVideo = document.getElementById('play-screen');
    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('sidebar');
    let isSubmitting = false;
    let bookmarkTimeout;
    const closeSidebar = document.getElementById('closeBtn');
    const playBtn = document.getElementById('playBtn');
    const authorsDetails = document.getElementById('authorsDetails');
    const commentInput = document.getElementById('comment-input');
    const commentBox = document.getElementById('commentBox');
    const commentBtn = document.getElementById('submit-comment');
    const mainVideoSrc = document.getElementById('main-screen-src');
    const videoList = document.getElementById("videoList");
    // Modal Elements
    const customModal = document.getElementById('customModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalCancel = document.getElementById('modalCancel');
    const modalConfirm = document.getElementById('modalConfirm');
    const closeModal = document.getElementById('closeModal');
     let bookmarksFetched = false;


    if (videoURL) {
        const videoPlayer = document.getElementById("play-screen");
        const videoSource = document.getElementById("main-screen-src");

        videoSource.src = videoURL;
        document.getElementById("video-title").textContent = title;
        document.getElementById("video-description").textContent = description;

        if (authorName) author.textContent = authorName;
        currentAuthorId = authorId;

        const userInfo = localStorage.getItem("skillHarvestUser");
        if (userInfo) {
            const user = JSON.parse(userInfo);
            location.textContent = user.farmLocation || "Unknown Location";
        }
        videoPlayer.load();
        incrementVideoViews(videoId);
        // Initial sync of follow status
        if (authorId) syncFollowStatus(authorId);
    }



    

    // SHOW / HIDE VIDEO DESCRIPTION
    authorsDetails.addEventListener("click", () => {
        document.getElementById('moreDescription').classList.remove("hidden");
        document.getElementById('showless').classList.remove("hidden");
    });

    document.getElementById('showless').addEventListener("click", () => {
        document.getElementById('moreDescription').classList.add("hidden");
        document.getElementById('showless').classList.add("hidden");
    });

  

    async function incrementVideoViews(id) {
        try {
            await fetch(`${API_BASE_URL}/video/${id}/views`, { method: "POST" });
        } catch (err) {
            console.error("Failed to increment views:", err);
        }
    }


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
   



    // RENDER COMMENT ITEM
    const createCommentElement = (comment) => {
        const item = document.createElement('li');
        item.id = `comment-${comment.id}`;
        item.classList.add(
            "w-full", "py-3", "px-4", "max-w-full",
            "break-words", "whitespace-normal",
            "overflow-hidden", "bg-[#2e7d32]",
            "rounded-lg", "mb-3", "text-white",
            "relative", "group"
        );

        const header = document.createElement("div");
        header.classList.add("flex", "items-center", "mb-2", "gap-2");

        const img = document.createElement("img");
        img.classList.add("size-8", "rounded-full", "bg-green-900");
        img.src = "./Videocard/assets/ooui_user-avatar-outline.png";
        img.alt = "User Icon";

        const authorName = document.createElement("span");
        authorName.classList.add("font-bold", "text-sm");
        authorName.textContent = comment.user?.name || "User";

        const date = document.createElement("span");
        date.classList.add("text-xs", "text-green-200");
        date.textContent = new Date(comment.createdAt).toLocaleDateString();

        header.appendChild(img);
        header.appendChild(authorName);
        header.appendChild(date);

        const content = document.createElement("div");
        content.classList.add("text-sm", "mt-1", "comment-content");
        content.textContent = comment.content;

        item.appendChild(header);
        item.appendChild(content);

        // AUTHOR ACTIONS (Edit/Delete)
        const currentUser = JSON.parse(localStorage.getItem("skillHarvestUser"));
        if (currentUser && currentUser.id === comment.userId) {
            const actions = document.createElement("div");
            actions.classList.add("absolute", "top-2", "right-2", "flex", "gap-2", "opacity-0", "group-hover:opacity-100", "transition-opacity");

            const deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt text-xs"></i>';
            deleteBtn.classList.add("hover:text-red-400");
            deleteBtn.onclick = () => handleDeleteComment(comment.id);

            const editBtn = document.createElement("button");
            editBtn.innerHTML = '<i class="fas fa-edit text-xs"></i>';
            editBtn.classList.add("hover:text-blue-400");
            editBtn.onclick = () => handleEditComment(comment.id, comment.content, content);

            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);
            item.appendChild(actions);
        }

        return item;
    };

    /** ===========================
     *  COMMENT ACTIONS
     * =========================== */
    async function fetchComments(videoId) {
        try {
            const res = await fetch(`${API_BASE_URL}/comments/${videoId}`);
            const data = await res.json();
            if (data.success) {
                commentBox.innerHTML = "";
                data.comments.forEach(c => {
                    commentBox.appendChild(createCommentElement(c));
                });
                updateCommentCount(data.count);
            }
        } catch (err) {
            console.error("Error fetching comments:", err);
        }
    }




    async function handleAddComment() {
        
        if (isSubmitting) return;
        isSubmitting = true;
    
        if (!token) {
            showNotification("Please login to comment", "error");
            isSubmitting = false;
            return;
        }
    
        const activeVideo = videoData.find(v => v.isPlaying);
        if (!activeVideo) {
            isSubmitting = false;
            return;
        }
    
        const content = commentInput.value.trim();
        if (!content) {
            isSubmitting = false;
            return;
        }
    
        try {
            const res = await fetch(`${API_BASE_URL}/comments/${activeVideo.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ content })
            });
        
            const data = await res.json();
        
            if (res.ok) {
                commentBox.append(createCommentElement(data.comment));
                commentInput.value = "";
            
                const currentCount =
                    parseInt(document.querySelector(".comments").innerText) || 0;
                updateCommentCount(currentCount + 1);
            
                showNotification("Comment posted", "success");
            } else {
                showNotification(data.message || "Failed to post comment", "error");
            }
        } catch (err) {
            console.error("Error posting comment:", err);
        } finally {
            isSubmitting = false;
        }
    }

    /** ===========================
     *  CUSTOM MODAL LOGIC
     * =========================== */
    function showCustomModal({ title, body, confirmText, confirmClass, onConfirm, isPrompt, defaultValue }) {
        modalTitle.textContent = title;
        modalConfirm.textContent = confirmText || "Confirm";
        modalConfirm.className = `modal-btn ${confirmClass || 'confirm'}`;

        modalBody.innerHTML = "";
        let inputEl = null;

        if (isPrompt) {
            inputEl = document.createElement('textarea');
            inputEl.className = "modal-textarea";
            inputEl.value = defaultValue || "";
            modalBody.appendChild(inputEl);
        } else {
            const p = document.createElement('p');
            p.textContent = body;
            modalBody.appendChild(p);
        }

        customModal.classList.add('active');

        const cleanup = () => {
            customModal.classList.remove('active');
            modalConfirm.onclick = null;
            modalCancel.onclick = null;
            closeModal.onclick = null;
        };

        modalConfirm.onclick = () => {
            const value = inputEl ? inputEl.value.trim() : true;
            if (isPrompt && !value) return; // Don't allow empty prompts
            onConfirm(value);
            cleanup();
        };

        modalCancel.onclick = cleanup;
        closeModal.onclick = cleanup;
    }

    async function handleDeleteComment(commentId) {
        showCustomModal({
            title: "Delete Comment",
            body: "Are you sure you want to delete this comment? This action cannot be undone.",
            confirmText: "Delete",
            confirmClass: "delete",
            onConfirm: async () => {
                try {
                    const res = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
                        method: "DELETE",
                        headers: { "Authorization": `Bearer ${token}` }
                    });

                    if (res.ok) {
                        const el = document.getElementById(`comment-${commentId}`);
                        if (el) el.remove();
                        const currentCount = parseInt(document.querySelector(".comments").innerText.trim()) || 0;
                        updateCommentCount(currentCount - 1);
                        showNotification("Comment deleted", "info");
                    }
                } catch (err) {
                    console.error("Error deleting comment:", err);
                }
            }
        });
    }

    async function handleEditComment(commentId, oldContent, contentEl) {
        showCustomModal({
            title: "Edit Comment",
            isPrompt: true,
            defaultValue: oldContent,
            confirmText: "Update",
            confirmClass: "confirm",
            onConfirm: async (newContent) => {
                if (newContent === oldContent) return;
                try {
                    const res = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({ content: newContent })
                    });

                    if (res.ok) {
                        contentEl.textContent = newContent;
                        showNotification("Comment updated", "success");
                    }
                } catch (err) {
                    console.error("Error updating comment:", err);
                }
            }
        });
    }

    function updateCommentCount(count) {
        const commentBadge = document.querySelector(".comments");
        if (commentBadge) {
            commentBadge.innerHTML = `<i class="fa-regular fa-comment px-2"></i> ${count}`;
        }
    }


    // ENTER KEY SUBMIT
    commentInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter' && commentInput.value.trim() !== '') {
            handleAddComment();
        }
    });

    // BUTTON SUBMIT
    commentBtn.addEventListener('click', () => {
        if ( commentInput.value.trim() !== '') {
        handleAddComment();
        }
         return; 
    });

    // PLAY / PAUSE BUTTON OVERLAY
    playBtn.addEventListener('click', () => {
        if (mainVideo.paused) {
            playBtn.classList.remove("max-md:hidden")
            mainVideo.play();
            playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            // Increment views when user starts playing
            // if (videoId) incrementVideoViews(videoId);
        } else {
            mainVideo.pause();
            playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            setTimeout(() => { playBtn.classList.add("max-md:hidden")}, 400); // Small delay to prevent rapid toggling
        }
    });


    // UPDATE MAIN SCREEN
    const mainScreenUpdate = (video) => {

        // Fetch comments from backend
        fetchComments(video.id);
        updateCommentCount(video.commentCount || 0);

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
        document.getElementById("shareBtn").onclick = () => shareVideo(video);
        currentAuthorId = video.authorId;
        updateFollowBtnState(video.isFollowing);

        document.getElementById('video-description').innerHTML = `${video.description || "No description provided." }`

        const isMarked = getBookmarks().some(v => v.id === video.id);
        updateBookmarkBtn(isMarked);

        // Sync follow status for the current author
        syncFollowStatus(video.authorId);

    };


    // LIKE BUTTON
    const addToLikes = async (video) => {
        if (!token) {
            showNotification("Please login to like videos", "error");
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
                    showNotification("Video liked!", "success");
                } else {
                    video.likes--;
                    showNotification("Like removed", "info");
                }

                document.getElementById('likes').innerHTML = `
                    <i class="fa-regular fa-thumbs-up px-2"></i>
                    ${video.likes}
                `;
            } else {
                showNotification(data.message || "Error liking video", "error");
            }
        } catch (error) {
            console.error("Error liking video:", error);
        }
    };

    document.getElementById('likes').addEventListener("click", () => {
        const activeVideo = videoData.find(v => v.isPlaying);
        if (activeVideo) addToLikes(activeVideo);
    });

    // FOLLOW BUTTON
    const followBtn = document.getElementById('followBtn');

    async function toggleFollowAuthor() {
        if (!token) {
            showNotification("Please login to follow creators", "error");
            return;
        }
        if (!currentAuthorId) return;

        try {
            const res = await fetch(`${API_BASE_URL}/follow/${currentAuthorId}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();

            if (res.ok) {
                updateFollowBtnState(data.following);
                const activeVideo = videoData.find(v => v.isPlaying);
                if (activeVideo) activeVideo.isFollowing = data.following;

                showNotification(data.following ? "Following creator" : "Unfollowed creator", "success");
            } else {
                showNotification(data.message || "Error toggling follow", "error");
            }
        } catch (error) {
            console.error("Error following creator:", error);
            showNotification("Connection error", "error");
        }
    }

    function updateFollowBtnState(isFollowing) {
        if (!followBtn) return;
        if (isFollowing) {
            followBtn.textContent = "Following";
            followBtn.classList.replace('bg-[#2e7d32]', 'bg-gray-500');
        } else {
            followBtn.textContent = "Follow";
            followBtn.classList.replace('bg-gray-500', 'bg-[#2e7d32]');
        }
    }

    async function syncFollowStatus(targetId) {
        if (!token || !targetId) return;
        try {
            const res = await fetch(`${API_BASE_URL}/follow/${targetId}/status`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                updateFollowBtnState(data.isFollowing);
                // Update local status in videoData
                const activeVideo = videoData.find(v => v.id === (params.get("id") || (videoData.find(v => v.isPlaying)?.id)));
                if (activeVideo && activeVideo.authorId === targetId) {
                    activeVideo.isFollowing = data.isFollowing;
                }
            }
        } catch (err) {
            console.error("Error syncing follow status:", err);
        }
    }

    if (followBtn) {
        followBtn.addEventListener('click', toggleFollowAuthor);
    }




    const allVideos = (videoData) => {
        const newVideos = videoData.slice(0,-9).map(video => video)
        const actualData  = videoData.length<10? videoData : newVideos;
        actualData.forEach(video => {
            const card = document.createElement("div");

            card.className = "block bg-white rounded-xl shadow overflow-hidden lg:h-[10em] transform transition-transform hover:scale-[1.02]";

            card.innerHTML = `
                <div class = "lg:flex lg:flex-row lg:gap-4 lg:h-[10em]">
                <div class="relative lg:w-[17em] lg:h-full pb-[56.25%]">
                <video 
                 src="${video.src}" 
                    class="absolute top-0 left-0 w-full h-full lg:h-[10em] object-cover"
                     muted
                    onmouseover="this.play()"
                     onmouseout="this.pause(); this.currentTime = 0;"
                 ></video>
                 <div class="absolute bottom-2 lg:h-5 right-2 lg:right-1 lg:top-32 flex gap-2">
                    <div class="bg-black/60 text-white text-[10px] px-2 py-1 rounded flex items-center gap-1">
                         <svg class="w-3 h-3 fill-white" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                         ${video?.likes || 0}
                    </div>
                    <div class="bg-black/60 text-white text-[10px] px-2 py-1 rounded">
                         ${video.views || 0} views
                    </div>
                 </div>
                </div>

                <div class="p-4 lg:pl-0 lg:w-full">
                  <h3 class="font-semibold text-lg line-clamp-1">${video.title}</h3>
                  <p class="text-sm text-gray-600 line-clamp-2 mt-1">${video.description}</p>
                  <div class="flex items-center justify-between mt-3 text-xs text-gray-500">
                    <span>By ${video?.author || "Farmer"}</span>
                    <span>${new Date(video.date).toLocaleDateString()}</span>
                  </div>
                </div> 
                </div>`;

            card.onclick = () => {
                mainScreenUpdate(video);
            };

            videoList.appendChild(card);

            document.getElementById("bookmarkBtn").onclick = () => {
            const status = toggleBookmark(video);
            fetchBookmarksDebounced();
            updateBookmarkBtn(status);           
        };
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
        const activeVideo = videoData.find(v =>v.isPlaying===true);
    
        if (activeVideo) {
            fetchSimilarVideos(activeVideo.id);
            searchSimilar(videoData, activeVideo.author)
        }
    });

    document.getElementById("trendingVideos").addEventListener("click", () => {
        videoList.innerHTML = "";
        fetchTrendingVideos();
        trendingSearch(videoData)
    });

    // DOWNLOAD BUTTON
 async function downloadVideoFile(url, filename) {
    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!response.ok) {
            throw new Error("Video download failed");
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        a.remove();
        URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error(error);
        showNotification("Unable to download video", "error");
    }
}

document.getElementById('downloadVideo').addEventListener('click', () => {
    const videoUrl = mainVideoSrc.src;
    const title = document.getElementById("video-title").innerText || "video";

    downloadVideoFile(videoUrl, `${title}.mp4`);
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
                    authorId: v.userId,
                    views: v.views,
                    date: new Date(v.createdAt).toLocaleDateString(),
                    src: v.videoUrl,
                    description: v.description,
                    location: user?.farmLocation || "N/A",
                    commentCount: v._count?.comments || 0,
                    likes: v._count?.likes || 0,
                    isPlaying: false,
                    isFollowing: false
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
                    authorId: v.userId,
                    views: v.views,
                    date: new Date(v.createdAt).toLocaleDateString(),
                    src: v.videoUrl,
                    location: v.user?.farmLocation || "N/A",
                    commentCount: v._count?.comments || 0,
                    likes: v._count?.likes || 0,
                    isPlaying: false,
                    isFollowing: false
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
                    description: v.description,
                    author: v.user?.name || "Unknown Author",
                    authorId: v.userId,
                    views: v.views,
                    date: new Date(v.createdAt).toLocaleDateString(),
                    src: v.videoUrl,
                    location: v.user?.farmLocation || "N/A",
                    commentCount: v._count?.comments || 0,
                    likes: v._count?.likes || 0,
                    isPlaying: false,
                    isFollowing: false
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
        const found = videoData.slice(0,-10).filter(v =>
            v.isTrending === true
        );

        // Clear current list
        videoList.innerHTML = "";
       
        if (found.length===0) {
            videoList.innerHTML = `
                <p class="text-gray-300 text-center hidden p-4">No videos found.</p>
            `;
            return;
        }
         allVideos(found)
    }

     function searchSimilar(videoData, currentAuthor) {
    
        // 🔎 LOCAL SEARCH WITHIN videoData
        const found = videoData.filter(v => v.author === currentAuthor
        );
        console.log(found)
        // Clear current list
        videoList.innerHTML = "";
       
        if (found.length===0) {
            videoList.innerHTML = `
                <p class="text-gray-300 text-center hidden p-4">No videos found.</p>
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

    function fetchBookmarksDebounced() {
    bookmarkTimeout = setTimeout(fetchBookmarks, 500);
    clearTimeout(bookmarkTimeout);
    }

    // Get all bookmarks from API
    async function fetchBookmarks() {
        if (!token || bookmarksFetched) return;
         bookmarksFetched = true;
        try {
            const res = await fetch(`${API_BASE_URL}/bookmarks`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
         if (!res.ok) {
            const text = await res.text();
            console.error("Server error:", text);
            return;
            }
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
            showNotification("Please login to bookmark videos", "error");
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
                    showNotification("Added to bookmarks", "success");
                    bookmarkedVideos.push(video); // Optimistic update or refetch
                    return true;
                } else {
                    showNotification("Removed from bookmarks", "success");
                    bookmarkedVideos = bookmarkedVideos.filter(v => v.id !== video.id);
                    document.getElementById("bookmarkBtn").innerHTML= `<i
                            class="fa-regular fa-bookmark"></i>`

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
        fetchBookmarksDebounced()
        return bookmarkedVideos;
    }

    // Update UI (icon change)
    function updateBookmarkBtn(isBookmarked) {
        const btn = document.getElementById("bookmarkBtn");
        if (!btn) return;

        const bookMarkbtnhtmlExist = "<i class= 'fa-solid text-red-700 fa-bookmark'></i>";
        const bookMarkbtnhtml = "<i class='fa-regular fa-bookmark'></i>";
        btn.innerHTML = isBookmarked ? bookMarkbtnhtmlExist : bookMarkbtnhtml;
    }




    // ---------- SHARE SYSTEM ----------
    function shareVideo(video) {
        const shareUrl = `${window.location.origin}/video.html?id=${video.id}&title=${encodeURIComponent(video.title)}&desc=${encodeURIComponent(video.description)}&videoURL=${encodeURIComponent(video.src)}&authorId=${encodeURIComponent(video.authorId)}&authorName=${encodeURIComponent(video.author)}`;
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
            showNotification("Link copied to clipboard!", "success");
        }
    }


    // function getSocialShareLinks(videoId, title) {
    //     const url = encodeURIComponent(`${location.origin}/watch?video=${videoId}`);
    //     const text = encodeURIComponent(title);

    //     return {
    //         whatsapp: `https://wa.me/?text=${text}%20${url}`,
    //         facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    //         twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`
    //     };
    // }


})