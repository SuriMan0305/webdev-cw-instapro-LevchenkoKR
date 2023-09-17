// Замени на свой, чтобы получить независимый от других набор данных.
import { renderApp } from "./index.js";

// "боевая" версия инстапро лежит в ключе prod
const personalKey = "levchenkoK";
const baseHost = "https://wedev-api.sky.pro";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .catch((error) => {
      if (String(error) === "TypeError: Failed to fetch") {
        console.warn("потеряно соединение с интернетом");
        throw new Error("упс, кажется нет интернета");
      }
    })
    .then((response) => {
      if (response.status === 401) {
        throw new Error(
          "Вы не авторизованы, если хотите поставить лайк войдите или зарегистрируйтесь в instapro"
        );
      }
      return response.json();
    })
    .catch((error) => {
      alert(`${error}`);
    })
    .then((data) => {
      return data.posts;
    });
}

// https://github.com/GlebkaF/webdev-hw-api/blob/main/pages/api/user/README.md#%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%D1%81%D1%8F
export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  })
    .catch((error) => {
      if (String(error) === "TypeError: Failed to fetch") {
        console.warn("потеряно соединение с интернетом");
        throw new Error("упс, кажется нет интернета");
      }
    })
    .then((response) => {
      if (response.status === 400) {
        throw new Error("Такой пользователь уже существует");
      }
      return response.json();
    })
    .catch((error) => {
      alert(`${error}`);
    });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  })
    .then((response) => {
      if (response.status === 400) {
        throw new Error("Неверный логин или пароль");
      }
      return response.json();
    })
    .then((response) => {
      return response;
    }).catch((error) => {
      alert(`${error}`)
    });
}

export const dropNewPost = ({ description, imageUrl, token }) => {
  fetch(postsHost, {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: JSON.stringify({
      description: `${description
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')}`,
      imageUrl: `${imageUrl
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')}`,
    }),
  });
};

export const getPostsOfUser = ({idUserPosts, token}) => {
  return fetch(postsHost + `/user-posts/${idUserPosts}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
}

export const addLike = ({ idPost, token }) => {
  return fetch(postsHost + `/${idPost}/like`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("пожалуйста авторизируйтесь, или зарегистрируйтесь в instapro, чтобы продолжить")
      }
      return response.json();
    })
    .then(() => {
      return renderApp();
    }).catch((error) => {
      if (String(error) === "Error: пожалуйста авторизируйтесь, или зарегистрируйтесь в instapro, чтобы продолжить") {
        alert(`${error}`)
      } else {
        alert("упс, кажется нет интернета")
      }
    });
};

export const removeLike = ({ idPost, token }) => {
  return fetch(postsHost + `/${idPost}/dislike`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("пожалуйста авторизируйтесь, или зарегистрируйтесь в instapro, чтобы продолжить")
      }
      return response.json();
    })
    .then(() => {
      return renderApp();
    }).catch((error) => {
      if (String(error) === "Error: пожалуйста авторизируйтесь, или зарегистрируйтесь в instapro, чтобы продолжить") {
        alert(`${error}`)
      } else {
        alert("упс, кажется нет интернета")
      }
    });
};

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  });
}
