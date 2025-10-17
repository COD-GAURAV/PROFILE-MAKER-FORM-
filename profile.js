const fileBtn = document.getElementById("upload");
const file = document.getElementById("file");
const username = document.getElementById("username");
const role = document.getElementById("role");
const bio = document.getElementById("textarea");
const form = document.getElementById("form");
const img = document.querySelector("img");
const addUserBtn = document.getElementById("adduser");
const result = document.getElementById("result");

let users = JSON.parse(localStorage.getItem("users")) || [];
console.log(users);

let urlClone = "";

fileBtn.addEventListener("click", (e) => {
  file.click();
});

// compress process of photo

file.addEventListener("change", (e) => {
  e.preventDefault();
  let files = e.target.files[0];
  fileBtn.textContent = files.name;
  if (files) {
    const reader = new FileReader();
    reader.onload = function (ev) {
      const image = new Image();
      image.onload = (ev) => {
        const canvas = document.createElement("canvas");
        const cxt = canvas.getContext("2d");
        const MAX_WIDHT = 200;
        const scaleSize = MAX_WIDHT / image.width;
        canvas.width = MAX_WIDHT;
        canvas.height = scaleSize * image.height;
        cxt.drawImage(image, 0, 0, canvas.width, canvas.height);
        const compressedData = canvas.toDataURL("image/jpeg", 0.6);
        urlClone = compressedData;
      };
      image.src = ev.target.result;
    };
    reader.readAsDataURL(files);
  }
});

// Form submission

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (username.value.trim() === "") {
    result.textContent = `PLEASE ENTER YOUR NAME`;
  } else if (role.value.trim() === "") {
    result.textContent = `PLEASE ENTER YOUR BIO`;
  } else if (bio.value.trim() === "") {
    result.textContent = `PLEASE ENTER YOUR BIO`;
  } else if (file.value === "") {
    result.textContent = `PLEASE SELECT YOUR PHOTO`;
  } else {
    const userList = {
      Name: username.value.toUpperCase(),
      roleOfUser: role.value.toUpperCase(),
      Url: urlClone,
      bio: bio.value.toUpperCase(),
    };

    users.push(userList);
    console.log(users);
    renderName(users);
    localStorage.setItem("users", JSON.stringify(users));
    document.getElementById("input-section").style.display = `none`;
    document.getElementById("profilesection").style.display = `flex`;
    fileBtn.textContent = `UPLOAD`;
    addUserBtn.style.display = `flex`;
    document.getElementById("nav").style.display = `flex`;
    form.reset();
    document.querySelector(".popup-box").style.display = "flex";
    document.querySelector("#ser").textContent = `Success!`;
    document.querySelector(
      "#data"
    ).textContent = `Your data has been saved successfully.`;
    setTimeout(function () {
      window.location.reload();
      document.querySelector(".popup-box").style.display = "none";
    },2000);
  }
});

function renderName(arr) {
  document.getElementById("profilesection").innerHTML = "";
  // Create main container
  arr.forEach((val) => {
    const partProfile = document.createElement("div");
    partProfile.id = "Part-Profile";
    partProfile.className = `profilePart`;

    // 1️⃣ Profile Image
    const divImg = document.createElement("div");
    divImg.classList.add("profile");

    const img = document.createElement("img");
    img.src = val.Url;
    img.alt = "";
    img.width = 100;
    img.height = 100;
    divImg.appendChild(img);

    // 2️⃣ Profile Name
    const divName = document.createElement("div");
    divName.classList.add("profile");
    const name = document.createElement("h3");
    name.id = "profilehed";
    name.className = `name`;
    name.textContent = val.Name;
    divName.appendChild(name);

    // 3️⃣ Profile Role
    const divRole = document.createElement("div");
    divRole.classList.add("profile");
    const role = document.createElement("p");
    role.id = "profilerole";
    role.textContent = val.roleOfUser;
    role.className = `role`;
    divRole.appendChild(role);

    // 4️⃣ Profile Bio
    const divBio = document.createElement("div");
    divBio.classList.add("profile");
    const bio = document.createElement("p");
    bio.id = "profilebio";
    bio.textContent = val.bio;
    divBio.appendChild(bio);

    const divDelete = document.createElement("div");
    divDelete.classList.add("profile");
    const deleteB = document.createElement("p");
    deleteB.className = "delete";
    deleteB.id = `profileDelete`;
    deleteB.textContent = `DELETE YOUR ACCOUNT`;
    divDelete.appendChild(deleteB);

    // Append all parts to main container
    partProfile.append(divImg, divName, divRole, divBio, divDelete);

    // Finally, add to the document body (or another container)
    document.getElementById("profilesection").appendChild(partProfile);
  });
}

//Search Section

const search = document.getElementById("search");

search.addEventListener("input", (e) => {
  const filter = users.filter((val) => {
    return val.Name.toLowerCase().startsWith(search.value);
  });
  renderName(filter);
});

// if length is 0 then input Section will appear and length is more then 1 then profile section appear

if (users.length > 0) {
  document.getElementById("input-section").style.display = `none`;
  document.getElementById("profilesection").style.display = `flex`;
  addUserBtn.style.display = `flex`;
  document.getElementById("nav").style.display = `flex`;
  renderName(users);
} else {
  document.getElementById("input-section").style.display = `flex`;
  document.getElementById("profilesection").style.display = `none`;
  addUserBtn.style.display = `none`;
  document.getElementById("nav").style.display = `none`;
}

addUserBtn.addEventListener("click", (e) => {
  document.getElementById("input-section").style.display = `flex`;
  document.getElementById("profilesection").style.display = `none`;
  document.getElementById("nav").style.display = `none`;
  addUserBtn.style.display = `none`;
});

const p = document.querySelectorAll(".delete");

p.forEach((val) => {
  val.addEventListener("click", (e) => {
    let respone = confirm("DO YOU WANT TO DELETE YOUR ACCOUNT");
    if (respone) {
      const name = e.target.offsetParent.childNodes[1].textContent;
      const role = e.target.offsetParent.childNodes[2].textContent;
      const deleteIndex = users.findIndex((val) => {
        return (
          val.Name.toLowerCase() === name.toLowerCase() ||
          val.roleOfUser.toLowerCase() === role.toLowerCase()
        );
      });
      
      const progressFill = document.querySelector(".progress-fill");
      document.getElementById("delete-popup").style.display = `flex`  
      let fillPercentage = 0;
      
      let interval = setInterval(function () {
        fillPercentage++;
        if (fillPercentage > 100) {
          fillPercentage = 0;
          clearInterval(interval);
          document.getElementById("delete-popup").style.display = `none`
          document.querySelector(".popup-box").style.display = "flex";
          document.querySelector("#ser").textContent = `DELETED SUCCESSFULLY`;
          document.querySelector("#data").textContent = ``;
          document.getElementById("profilesection").style.opacity = `1`
          users.splice(deleteIndex, 1);
          renderName(users);
        } else {
          progressFill.style.width = `${fillPercentage}%`;
          console.log(fillPercentage);
          document.getElementById("profilesection").style.opacity = `0`
        }
      }, 30);
      
      
      setTimeout(function () {
        localStorage.setItem("users", JSON.stringify(users));
        window.location.reload();
        document.querySelector(".popup-box").style.display = "none"; 
      }, 5000);
    } else {
    }

       
  });
});
