import { addLike, dropNewPost, getPosts, getPostsOfUser, removeLike } from "./api.js";
import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from "./routes.js";
import { renderPostsPageComponent } from "./components/posts-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";
import { renderHeaderComponent } from "./components/header-component.js";

export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];

export const clickToLike = () => {
  const likeButtons = document.querySelectorAll(".like-button");
  for (const likeButton of likeButtons) {
    likeButton.addEventListener("click", () => {
      getPosts({ token: getToken() }).then((response) => {
        for (let i = 0; i < response.length; i++) {
          if (response[i].id === likeButton.dataset.likeid) {
            response[i].isLiked === false ? addLike({ idPost: likeButton.dataset.likeid, token: getToken() }) : removeLike({ idPost: likeButton.dataset.likeid, token: getToken() });
          }
        }
      });
    });
  }
};

export const getToken = () => {
  const token = user ? `Bearer ${user.token}` : undefined;
  return token;
};

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

/**
 * Включает страницу приложения
 */
export const goToPage = (newPage, data) => {
  if (
    [
      POSTS_PAGE,
      AUTH_PAGE,
      ADD_POSTS_PAGE,
      USER_POSTS_PAGE,
      LOADING_PAGE,
    ].includes(newPage)
  ) {
    if (newPage === ADD_POSTS_PAGE) {
      // Если пользователь не авторизован, то отправляем его на авторизацию перед добавлением поста
      page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
      return renderApp();
    }

    if (newPage === POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();

      return getPosts({ token: getToken() })
        .then((newPosts) => {
          page = POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(POSTS_PAGE);
        });
    }

    if (newPage === USER_POSTS_PAGE) {
      const getUserPosts = () => {
        getPosts({ token: getToken() })
          .then((response) => {
            const postsOfUser = [];
            response.forEach((element) => {
              element.user.id === data.userId
                ? postsOfUser.push(element)
                : element;
            });
            return postsOfUser;
          })
          .then((response) => {
            posts = response;
            page = USER_POSTS_PAGE;
            return renderApp();
          });
      };
      getUserPosts();
    }
    page = newPage;
    renderApp();
    return;
  }

  throw new Error("страницы не существует");
};

export const renderApp = () => {
  const appEl = document.getElementById("app");
  if (page === LOADING_PAGE) {
    return renderLoadingPageComponent({
      appEl,
      user,
      goToPage,
    });
  } else if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        user = newUser;
        saveUserToLocalStorage(user);
        goToPage(POSTS_PAGE);
      },
      user,
      goToPage,
    });
  } else if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick({ description, imageUrl }) {
        dropNewPost({ description, imageUrl, token: getToken() });
        goToPage(POSTS_PAGE);
      },
    });
  } else if (page === POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
    });
  } else {
    getPostsOfUser({ idUserPosts: posts[0].user.id, token: getToken() })
      .then((response) => {
        return response.json();
      }).then((response) => {
        let postsUser;
        return postsUser = response;
      })
      .then((postsUser) => {
      appEl.innerHTML = `
      <div class="page-container">
        <div class="header-container" id="header">
        </div>
        <div class="post-header user-logo" data-user-id="${postsUser.posts[0].user.id}">
          <img src="${postsUser.posts[0].user.imageUrl}" class="user-logo post-header__user-image">
          <p class="user-logo post-header__user-name">${postsUser.posts[0].user.name}</p>
        </div>
        <ul class="posts" id="listContainer">
        </ul>
      </div>`;
      const headerContainer = document.getElementById("header");
      renderHeaderComponent({ element: headerContainer });
      const listContainer = document.getElementById("listContainer");
      listContainer.innerHTML = postsUser.posts
        .map((post) => {
          return (post = `<li class="post">
        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}">
        </div>
        <div class="post-likes">
          <button class="like-button" data-likeid='${post.id}'>
            <img src="./assets/images/${post.isLiked === true ? "like-active.svg" : "like-not-active.svg"
            }">
          </button>
          <p class="post-likes-text">
            Нравится: <strong>
            ${
            post.likes.length > 0 ? `${post.likes[post.likes.length - 1].name}` : `0`
            }
            ${ 
            post.likes.length > 1 ? `и ещё ${post.likes.length - 1}` : ``
            }
            </strong>
          </p>
        </div>
        <p class="post-text">
          <span class="user-name">${post.user.name}</span>
          ${post.description}
        </p>
        <p class="post-date">
          ${post.createdAt}
        </p>
      </li>`);
        })
        .join("");
      clickToLike();
      return;
    })
  }
};

goToPage(POSTS_PAGE);
