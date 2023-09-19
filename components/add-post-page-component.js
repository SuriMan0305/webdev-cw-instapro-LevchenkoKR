import { renderHeaderComponent } from './header-component.js'
import { renderUploadImageComponent } from './upload-image-component.js'

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
    const render = () => {
        // TODO: Реализовать страницу добавления поста
        const appHtml = `
    <div class = "page-container">
      <div class="page-header">
        <h1 class="logo">instapro</h1>
        <button class="header-button add-or-login-button">
        <button class="header-button logout-button">Выйти</button>
        </button> 
      </div>
    </div>
    <div class="page-container">
    <h3 class="form-title">
      Добавить пост
    </h3>
    <div class="file-upload-image-container">
      <div class="upload-image-container">
        <label class="file-upload-label secondary-button">
                  <input
                    type="file"
                    class="file-upload-input"
                    style="display:none"
                  />
                  Выберите фото
        </label>
        </div>
        <label class="description">
          Опишите фотографию:
            <textarea class="input textarea" id="description" rows="4"></textarea>
        </label>
        <button class="button" id="add-button">Добавить</button>
    </div>
    </div>
  `

        appEl.innerHTML = appHtml

        const pageHeader = document.querySelector('.page-container')
        renderHeaderComponent({ element: pageHeader })

        const uploadImageContainer = appEl.querySelector(
            '.upload-image-container',
        )

        if (uploadImageContainer) {
            document
                .getElementById('add-button')
                .addEventListener('click', () => {
                    if (
                        uploadImageContainer.textContent.trim() ===
                        'Выберите фото'
                    ) {
                        alert('добавьте фото')
                    } else if (
                        document.getElementById('description').value === ''
                    ) {
                        alert('добавьте описание')
                    }
                })
            renderUploadImageComponent({
                element: appEl.querySelector('.upload-image-container'),
                onImageUrlChange(newImageUrl) {
                    document
                        .getElementById('add-button')
                        .addEventListener('click', () => {
                            onAddPostClick({
                                description:
                                    document.getElementById('description')
                                        .value,
                                imageUrl: newImageUrl,
                            })
                        })
                },
            }) //////////
        }
    }
    render()
}
