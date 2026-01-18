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
    const logout = document.querySelector('.logout')

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

    // Modal Elements
    const customModal = document.getElementById('customModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalCancel = document.getElementById('modalCancel');
    const modalConfirm = document.getElementById('modalConfirm');
    const closeModal = document.getElementById('closeModal');


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
            // Increment views when user starts playing
            if (videoId) incrementVideoViews(videoId);
        } else {
            mainVideo.pause();
            playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        }
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
    logout.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Logging out...', 'info');
        localStorage.removeItem("token");
        localStorage.removeItem("skillHarvestUser")
        setTimeout(() => window.location.replace('signup.html'), 1000);
    })



    // RENDER COMMENT ITEM
    const createCommentElement = (comment) => {
        const item = document.createElement('li');
        item.id = `comment-${comment.id}`;
        item.classList.add(
            "w-full", "py-3", "px-4", "max-w-full",
            "break-words", "whitespace-normal",
            "overflow-hidden", "bg-green-800",
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
        if (!token) {
            showNotification("Please login to comment", "error");
            return;
        }

        const activeVideo = videoData.find(v => v.isPlaying);
        if (!activeVideo) return;

        const content = commentInput.value.trim();
        if (!content) return;

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
                commentBox.prepend(createCommentElement(data.comment));
                commentInput.value = "";
                // Refresh count
                const currentCount = parseInt(document.querySelector(".comments").innerText.trim()) || 0;
                updateCommentCount(currentCount + 1);
                showNotification("Comment posted", "success");
            } else {
                showNotification(data.message || "Failed to post comment", "error");
            }
        } catch (err) {
            console.error("Error posting comment:", err);
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
    commentInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && commentInput.value.trim() !== '') {
            handleAddComment();
        }
    });

    // BUTTON SUBMIT
    commentBtn.addEventListener('click', () => {
        handleAddComment();
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
        incrementVideoViews(video.id);

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

        currentAuthorId = video.authorId;
        updateFollowBtnState(video.isFollowing);

        const isMarked = getBookmarks().some(v => v.id === video.id);
        updateBookmarkBtn(isMarked);

        // Sync follow status for the current author
        syncFollowStatus(video.authorId);

        document.getElementById("bookmarkBtn").onclick = () => {
            const status = toggleBookmark(video);
            updateBookmarkBtn(status);
        };

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
                    authorId: v.userId,
                    views: v.views,
                    date: new Date(v.createdAt).toLocaleDateString(),
                    src: v.videoUrl,
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
            showNotification("Link copied to clipboard!", "success");
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