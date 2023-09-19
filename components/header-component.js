import { goToPage, logout, user } from '../index.js'
import {
    ADD_POSTS_PAGE,
    AUTH_PAGE,
    POSTS_PAGE,
    USER_POSTS_PAGE,
} from '../routes.js'

export function renderHeaderComponent({ element }) {
    element.innerHTML = `
  <div class="page-header">
  <h1 class="logo">instapro</h1>
      <button class="header-button add-or-login-button">
      ${
          user
              ? `<div title="Добавить пост" class="add-post-sign" id="add-post-button"></div>`
              : 'Войти'
      }
      </button>
      ${
          user
              ? `<button title="${user.name}" class="header-button logout-button">Выйти</button>`
              : ''
      }  
  </div>
  ${
      user
          ? `<div class="myAccountContainer"><img class='myAccountPhoto' data-user-id="${
                user._id
            }" src="${user ? user.imageUrl : ''}"></img>
  <span class='myAccountText'>${user ? user.name : ''}</span></div>`
          : ``
  }
  
`
    element
        .querySelector('.add-or-login-button')
        .addEventListener('click', () => {
            if (user) {
                goToPage(ADD_POSTS_PAGE)
            } else {
                goToPage(AUTH_PAGE)
            }
        })

    element.querySelector('.logo').addEventListener('click', () => {
        goToPage(POSTS_PAGE)
    })

    element.querySelector('.logout-button')?.addEventListener('click', logout)

    if (user) {
        element
            .querySelector('.myAccountPhoto')
            .addEventListener('click', () => {
                goToPage(USER_POSTS_PAGE)
            })
    }

    return element
}
