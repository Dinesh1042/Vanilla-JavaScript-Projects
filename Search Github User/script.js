const searchResultContEl = document.getElementById("searchResultCont");

const formEl = document.getElementById("form");

formEl.addEventListener("submit", searchData);

function searchData(e) {
  e.preventDefault();
  let userInput = this.querySelector("input");

  userInput.addEventListener("click", () => userInput.select());
  getData(userInput.value);
}

async function getData(userInput) {
  const baseUrl = `https://api.github.com/users/`;
  searchResultContEl.innerHTML = ``;
  const fetchData = await fetch(baseUrl + userInput);
  const res = await fetchData.json();
  const fetchRepos = await fetch(baseUrl + userInput + `/repos?sort=created`);
  const reposJson = await fetchRepos.json();
  console.log(res);

  if (fetchData.ok) return createUserEl(res, reposJson);
  else ErrorData();
}

function ErrorData() {
  const errorObj = {
    avatar_url: "./Images/404.jpg",
    followers: `---`,
    following: `---`,
    bio: `404 Error - Bio not found`,
    login: `User Not Found`,
    public_repos: `---`,
  };

  createUserEl(errorObj, []);
}

function createUserEl(userData, reposJson) {
  const gibhubCont = document.createElement("div");
  gibhubCont.classList.add("githubCont");

  // Github user cont
  const githubUserCont = document.createElement("div");
  githubUserCont.classList.add("githubUserCont");

  gibhubCont.appendChild(githubUserCont);

  // UserTop
  const userTop = document.createElement("div");
  userTop.classList.add("userTop");

  const imgCont = document.createElement("div");
  imgCont.classList.add("imgCont");
  userTop.appendChild(imgCont);
  const userProfile = document.createElement("img");
  userProfile.src = userData.avatar_url; //
  imgCont.appendChild(userProfile);
  githubUserCont.appendChild(userTop);
  // textCont
  const textCont = document.createElement("div");
  textCont.classList.add("textCont");
  userTop.appendChild(textCont);
  // UserName

  const usernameEl = document.createElement("div");
  usernameEl.classList.add("username");
  const userName = document.createElement("a");
  userName.innerHTML = userData.login; //
  userName.href = userData.html_url; //
  userName.target = `_blank`;
  usernameEl.appendChild(userName);
  textCont.appendChild(usernameEl);

  // Bio
  const bioEl = document.createElement("div");
  bioEl.classList.add("bio");
  const bio = document.createElement("p");
  bio.innerHTML = userData.bio; //
  bioEl.appendChild(bio);
  textCont.appendChild(bioEl);

  // reposFollow
  const repos_follow = document.createElement("div");
  repos_follow.classList.add("repos_follow");

  // Repos

  const reposEl = document.createElement("div");
  reposEl.classList.add("repos");
  const repoTitle = document.createElement("p");
  repoTitle.innerHTML = `Repositories`; //
  const repos = document.createElement("p");
  repos.innerHTML = userData.public_repos; //

  reposEl.appendChild(repoTitle);
  reposEl.appendChild(repos);
  repos_follow.appendChild(reposEl);

  // Following
  const followingEl = document.createElement("div");
  followingEl.classList.add("following");
  const followingTitle = document.createElement("p");
  followingTitle.innerHTML = `Following`; //
  const following = document.createElement("p");
  following.innerHTML = userData.following; //

  followingEl.appendChild(followingTitle);
  followingEl.appendChild(following);
  repos_follow.appendChild(followingEl);

  // Followers

  const followerEl = document.createElement("div");
  followerEl.classList.add("followers");
  const followersTitle = document.createElement("p");
  followersTitle.innerHTML = `Followers`; //
  const followers = document.createElement("p");
  followers.innerHTML = userData.followers; //

  followerEl.appendChild(followersTitle);
  followerEl.appendChild(followers);
  repos_follow.appendChild(followerEl);

  githubUserCont.appendChild(repos_follow);
  searchResultContEl.appendChild(gibhubCont);

  const repoList = document.createElement("div");
  repoList.classList.add("repoLists");
  githubUserCont.appendChild(repoList);
  if (reposJson.length) {
    const Repositories = reposJson.slice(0, 5);
    Repositories.forEach((repo) => {
      const projectLinkEl = document.createElement("a");
      projectLinkEl.innerHTML = repo.name;
      projectLinkEl.href = repo.html_url;
      projectLinkEl.target = `_blank`;
      repoList.appendChild(projectLinkEl);
    });
  }
}
