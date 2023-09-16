import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";
  const render = () => {
    // TODO: Реализовать страницу добавления поста
    const appHtml = `
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
  `;

    appEl.innerHTML = appHtml;

    const uploadImageContainer = appEl.querySelector(".upload-image-container");

    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: appEl.querySelector(".upload-image-container"),
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
          document.getElementById("add-button").addEventListener("click", () => {
            onAddPostClick({
              description: document.getElementById("description").value,
              imageUrl: imageUrl,
            });
          });
        },
      });
    }
  };

  render();
}
