import { USER_POSTS_PAGE } from '../routes.js'
import { renderHeaderComponent } from './header-component.js'
import { goToPage, getToken, clickToLike } from '../index.js'
import { getPosts } from '../api.js'
import { formatDistance } from 'date-fns'
import { ru } from 'date-fns/locale'

export function renderPostsPageComponent({ appEl }) {
    // TODO: реализовать рендер постов из api
    getPosts({ token: getToken() })
        .then((response) => {
            return response
                .map((post) => {
                    return `<li class="post">
      <div class="post-header" data-user-id="${post.user.id}">
          <img src="${post.user.imageUrl}" class="post-header__user-image">
          <p class="post-header__user-name">${post.user.name}</p>
      </div>
      <div class="post-image-container">
        <img class="post-image" src="${post.imageUrl}">
      </div>
      <div class="post-likes">
        <button data-likeid="${post.id}" class="like-button">
          <img src="./assets/images/${
              post.isLiked === true ? 'like-active.svg' : 'like-not-active.svg'
          }">
        </button>
        <p class="post-likes-text">
          Нравится: <strong>
          ${
              post.likes.length > 0
                  ? `${post.likes[post.likes.length - 1].name}`
                  : `0`
          }
            ${post.likes.length > 1 ? `и ещё ${post.likes.length - 1}` : ``}
          </strong>
        </p>
      </div>
      <p class="post-text">
        <span class="user-name">${post.user.name}</span>
        ${post.description}
      </p>
      <p class="post-date">
        ${formatDistance(new Date(), new Date(post.createdAt), {
            locale: ru,
        })} назад
      </p>
    </li>`
                })
                .join('')
        })
        .then((listPosts) => {
            return `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts" id="listContainer">
        ${listPosts}
      </ul>
    </div>`
        })
        .then((appHtml) => {
            appEl.innerHTML = appHtml

            renderHeaderComponent({
                element: document.querySelector('.header-container'),
            })

            clickToLike()

            for (let userEl of document.querySelectorAll('.post-header')) {
                userEl.addEventListener('click', () => {
                    goToPage(USER_POSTS_PAGE, {
                        userId: userEl.dataset.userId,
                    })
                })
            }
        })
    /**
     * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
     * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
     */
}
