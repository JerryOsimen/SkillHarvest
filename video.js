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










authorsDetails.addEventListener("click", ()=>{ 
    document.getElementById('moreDescription').classList.remove("hidden") 
    document.getElementById('showless').classList.remove("hidden")
}) 

document.getElementById('showless').addEventListener("click",()=>{
    document.getElementById('moreDescription').classList.add("hidden")
    document.getElementById('showless').classList.add("hidden")
})


playBtn.addEventListener('click', () => { 

    if (mainVideo.paused) { 
        mainVideo.play(); 
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>'
        ; } else { 
            mainVideo.pause(); 
            playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
         } });
         
closeSidebar.addEventListener('click', () => { 
    sideMenu.classList.add('hidden'); 
    menuItems.classList.add("max-md:items-center"); 
    mainVideo.controls = true; });
    
menuBtn.addEventListener('click', () => { 
    sideMenu.classList.toggle('hidden'); 
    mainVideo.controls = !mainVideo.controls; 
        }); 



const updatecommentField = (commentfield) => { 

    const usersImg = document.createElement('img'); 
    usersImg.src = "./Videocard/assets/ooui_user-avatar-outline.png";
    usersImg.alt = "User Icon";
    commentfield.comments.push({
        comment:commentInput.value,
        commentorsImg:usersImg.src
    })

    usersImg.classList.add("size-8", "rounded-full", "mr-2", "bg-green-900"); 
    const newComment = document.createElement('li');
    newComment.innerText = commentInput.value; 
    newComment.classList.add( 
        "w-full",
        "py-2", "px-4",
        "max-w-full",
        "break-words", "whitespace-normal",
        "overflow-hidden",
        "bg-green-800",
        "rounded-lg", "mb-2", "text-white"
    );
    newComment.prepend(usersImg); 
    
    if(newComment.innerText.length > 0 && newComment.innerText.length <= 200){ 
        commentBox.appendChild(newComment); 
    } 
    commentInput.value = ""; 
}
    

commentInput.addEventListener('keydown', (event) => { 
        if (event.key === 'Enter'&& commentInput.value.trim() !== '') {   
            videoData.forEach((video)=>{
                if(video.isPlaying){
                    updatecommentField(video); 
                    document.querySelector(".comments").innerHTML = `
                     <i class="fa-regular fa-comment px-2"></i>
                     ${video.comments.length}
                    `
                    console.log(video)
                }    
            })
            
            } });



commentBtn.addEventListener('click',()=>{ if (commentInput.value.trim() !== '') {
         videoData.forEach((video)=>{
                if(video.isPlaying){
                    updatecommentField(video);
                     document.querySelector(".comments").innerHTML = `
                     <i class="fa-regular fa-comment px-2"></i>
                     ${video.comments.length}
                    `
                    console.log(video) 
                }    
            })
            
        } 
    } ); 



const videoData = [ 
    { 
     src: "./Videocard/assets/Prisma.error.mp4", 
     title: "How to Fix Prisma Error",
     author: "Dev Musa",
     comments:[
     ],
     likes:10,
     location:"Enugu",
     views: "1.2k",
     date: "2 days ago",
     isPlaying:false, 
    }, 
     { 
      src: "./Videocard/assets/Figmatutorial.mp4", 
      title: "Figma Tutorial", 
      author:"UI John",
      comments:[
     ],
      likes:20,
      location:"Osun", 
      views: "900", 
      date: "1 day ago",
      isPlaying:false, 
      }, 
      { 
        src: "./Videocard/assets/Figmatutorial.mp4", 
        title: "Figma Tutorial", 
        location:"Oyo",
        author: "UI John",
        comments:[
    
     ], 
        likes:900,
        views: "900", 
        date: "1 day ago" ,
        isPlaying:false, 
        },
        , 
      { 
        src: "./Videocard/assets/Figmatutorial.mp4", 
        title: "Figma Tutorial", 
        location:"Oyo",
        author: "UI John",
        comments:[

     ], 
        likes:900,
        views: "900", 
        date: "1 day ago" ,
        isPlaying:false, 
        }
    
   ]; 
        

const mainScreenUpdate = (video)=>{

        
        video.comments.forEach((value)=>{
            
            // Reset commentBox
            
            const existingComment = document.createElement('li')
            existingComment.classList.add( 
                "w-full",
                "py-2", "px-4",
                "max-w-full",
                "break-words", "whitespace-normal",
                "overflow-hidden",
                "bg-green-800",
                "rounded-lg", "mb-2", "text-white"
            ); 

            const imgNew = document.createElement("img")
            imgNew.classList.add("size-8", "rounded-full", "mr-2", "bg-green-900"); 
            imgNew.src = value.commentorsImg
            imgNew.alt = "User Icon"
            existingComment.innerText = value.comment
            existingComment.prepend(imgNew) 
            commentBox.appendChild(existingComment)
        })

        // Reset all isPlaying flags

         videoData.forEach(v => v.isPlaying = false);
         video.isPlaying = true;
         mainVideoSrc.src = video.src;
         mainVideo.load(); 
         mainVideo.play(); 
         mainVideo.title = video.title 

         document.getElementById("location").innerText = video.location;
         document.querySelectorAll(".authorsName").forEach(authorName=>{
            authorName.innerText = video.author;
         })
         document.querySelector(".comments").innerHTML = `
         <i class="fa-regular fa-comment px-2"></i>
         ${video.comments.length}
         `
         document.querySelectorAll(".uploadDate").forEach(uploadDate => {
            uploadDate.innerText = video.date
         });
         document.getElementById('views').innerHTML = `<i class="fa-regular fa-eye  px-2"></i> ${video.views}`
         document.getElementById('video-title').innerText = video.title; 
         document.getElementById('likes').innerHTML = `
          <i class="fa-regular fa-thumbs-up px-2"></i>
          ${String(video.likes)}
          `
} 


const addToLikes = (video)=>{
        video.likes++
        document.getElementById('likes').innerHTML = `
          <i class="fa-regular fa-thumbs-up px-2"></i>
          ${String(video.likes)}
          `
}

document.getElementById('likes').addEventListener("click",()=>{
        videoData.forEach(video=>{
            if(video.isPlaying){
            addToLikes(video)
            }
        })
        
}
)

        
videoData.forEach(video => { 
     
     const card = document.createElement("div");
     card.className = "video-card text-white grid h-32 max-lg:h-full grid-cols-[1fr_2fr] max-lg:grid-cols-[1fr] bg-[#2e7d32] hover:bg-[#1b5e20] rounded-3xl gap-2 p-3"; 
     card.innerHTML = 
     `<video muted class="object-cover h-full rounded-xl max-lg:rounded-t-xl"> 
     <source src="${video.src}"> 
     </video> 
     <div class="flex-col justify-center max-lg:items-center px-10  max-lg:px-2 max-lg:text-center"> 
     <h3 class="font-bold">${video.title}</h3> 
     <p class="text-sm">${video.author}</p> 
     <p class="text-sm">${video.views} views</p> 
     <p class="text-sm">${video.date}</p> 
     </div>` ; 
     
     // Clicking card loads main video 
     card.onclick = () => {
        commentBox.innerHTML = ""
        mainScreenUpdate(video)
        }; videoList.appendChild(card); 
    }); 

// Download video functionality 
document.getElementById('downloadVideo').addEventListener('click', () => { 
        const videoSrc = mainVideoSrc.src; 
        const link = document.createElement('a'); 
        link.href = videoSrc; 
        link.download = 'video.mp4';
        document.body.appendChild(link); 
         link.click(); 
        document.body.removeChild(link); 
        }); 
        


const videoContainer = document.getElementById("Video-screen"); 

        
videoContainer.addEventListener("mousemove", () => { 
            playBtn.classList.remove("hidden"); 
            const timer = setTimeout(() => { 
                playBtn.classList.add("hidden"); }, 2000);
            clearTimeout(timer); 
            });
      
mainVideo.addEventListener('mouseleave', ()=>{
     playBtn.classList.add('hidden'); 
    });



// const useApi = async()=>{

//     try{
//         const response = await fetch ("https://skillharvest-backend.onrender.com/API/videos/upload")
//         const data = await response.json()

//         console.log(data)
//     }catch{
//         console.error();    
//     }

// }

// useApi()


( 
 ()=>{
    const updatemain = [videoData[0]]
    videoData[0].isPlaying = true;
    updatemain.forEach(value=>{
        mainScreenUpdate(value)
    })
 }
)()

const searchBut = document.getElementById("searchBut")

const searchForm = document.getElementById("searchForm")

searchBut.addEventListener('click',(e)=>{
    e.preventDefault();
    console.log(e)
})

    