import { loginUser, registerUser } from '../api.js'
import { renderHeaderComponent } from './header-component.js'
import { renderUploadImageComponent } from './upload-image-component.js'

export function renderAuthPageComponent({ appEl, setUser }) {
    let isLoginMode = true
    let imageUrl = ''

    const renderForm = () => {
        const appHtml = `
      <div class="page-container">
          <div class="header-container"></div>
          <div class="form">
              <h3 class="form-title">
                ${
                    isLoginMode
                        ? 'Вход в&nbsp;Instapro'
                        : 'Регистрация в&nbsp;Instapro'
                }
                </h3>
              <div class="form-inputs">
    
                  ${
                      !isLoginMode
                          ? `
                      <div class="upload-image-container"></div>
                      <input type="text" id="name-input" class="input" placeholder="Имя" />
                      `
                          : ''
                  }
                  
                  <input type="text" id="login-input" class="input" placeholder="Логин" />
                  <input type="password" id="password-input" class="input" placeholder="Пароль" />
                  
                  <div class="form-error"></div>
                  
                  <button class="button" id="login-button">${
                      isLoginMode ? 'Войти' : 'Зарегистрироваться'
                  }</button>
              </div>
            
              <div class="form-footer">
                <p class="form-footer-title">
                  ${isLoginMode ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
                  <button class="link-button" id="toggle-button">
                    ${isLoginMode ? 'Зарегистрироваться.' : 'Войти.'}
                  </button>
                </p> 
               
              </div>
          </div>
      </div>    
`

        appEl.innerHTML = appHtml

        const passwordValidation = document.getElementById('password-input')
        const passwordToValidation = () => {
            passwordValidation.addEventListener('input', () => {
                if (passwordValidation.value.length <= 2) {
                    document.getElementById('login-button').disabled = true
                    document.getElementById(
                        'login-button',
                    ).style.backgroundColor = `#6d73ff`
                    document.querySelector(
                        '.form-error',
                    ).textContent = `Пароль должен быть не короче 3х символов`
                } else {
                    document.getElementById('login-button').disabled = false
                    document.getElementById(
                        'login-button',
                    ).style.backgroundColor = `#565eef`
                    document.querySelector('.form-error').textContent = ``
                }
            })
        }

        // Не вызываем перерендер, чтобы не сбрасывалась заполненная форма
        // Точечно обновляем кусочек дом дерева
        const setError = (message) => {
            appEl.querySelector('.form-error').textContent = message
        }

        renderHeaderComponent({
            element: document.querySelector('.header-container'),
        })

        const uploadImageContainer = appEl.querySelector(
            '.upload-image-container',
        )

        if (uploadImageContainer) {
            renderUploadImageComponent({
                element: appEl.querySelector('.upload-image-container'),
                onImageUrlChange(newImageUrl) {
                    imageUrl = newImageUrl
                },
            })
        }

        passwordToValidation()

        document
            .getElementById('login-button')
            .addEventListener('click', () => {
                setError('')
                if (isLoginMode) {
                    const login = document.getElementById('login-input').value
                    const password =
                        document.getElementById('password-input').value

                    if (!login) {
                        alert('Введите логин')
                        return
                    }

                    if (!password) {
                        alert('Введите пароль')
                        return
                    }

                    loginUser({
                        login: login
                            .replaceAll('&', '&amp;')
                            .replaceAll('<', '&lt;')
                            .replaceAll('>', '&gt;')
                            .replaceAll('"', '&quot;'),
                        password: password
                            .replaceAll('&', '&amp;')
                            .replaceAll('<', '&lt;')
                            .replaceAll('>', '&gt;')
                            .replaceAll('"', '&quot;'),
                    })
                        .then((user) => {
                            setUser(user.user)
                        })
                        .catch((error) => {
                            if (
                                String(error) === 'TypeError: Failed to fetch'
                            ) {
                                console.warn(
                                    (error =
                                        'потеряно соединение с интернетом'),
                                )
                                alert(`${error}`)
                            } else {
                                throw new Error('Неверный логин или пароль')
                            }
                        })
                        .catch((error) => {
                            setError(error.message)
                        })
                } else {
                    const login = document.getElementById('login-input').value
                    const name = document.getElementById('name-input').value
                    const password =
                        document.getElementById('password-input').value
                    if (!name) {
                        alert('Введите имя')
                        return
                    }
                    if (!login) {
                        alert('Введите логин')
                        return
                    }

                    if (!password) {
                        alert('Введите пароль, не короче 3х символов')
                        return
                    }

                    if (!imageUrl) {
                        alert('Не выбрана фотография')
                        return
                    }

                    registerUser({
                        login: login
                            .replaceAll('&', '&amp;')
                            .replaceAll('<', '&lt;')
                            .replaceAll('>', '&gt;')
                            .replaceAll('"', '&quot;'),
                        password: password
                            .replaceAll('&', '&amp;')
                            .replaceAll('<', '&lt;')
                            .replaceAll('>', '&gt;')
                            .replaceAll('"', '&quot;'),
                        name: name
                            .replaceAll('&', '&amp;')
                            .replaceAll('<', '&lt;')
                            .replaceAll('>', '&gt;')
                            .replaceAll('"', '&quot;'),
                        imageUrl,
                    })
                        .then((user) => {
                            setUser(user.user)
                        })
                        .catch((error) => {
                            if (
                                String(error) === 'TypeError: Failed to fetch'
                            ) {
                                throw new Error('упс, кажется нет интернета')
                            } else if (
                                String(error) ===
                                String(
                                    "TypeError: Cannot read properties of undefined (reading 'user')",
                                )
                            ) {
                                throw new Error(
                                    'такой пользователь уже существует',
                                )
                            }
                        })
                        .catch((error) => {
                            setError(error.message)
                        })
                }
            })

        document
            .getElementById('toggle-button')
            .addEventListener('click', () => {
                isLoginMode = !isLoginMode
                renderForm()
            })
    }
    renderForm()
}
