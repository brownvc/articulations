const postWithUsername = (url, body, method = 'POST') => {
  const username = window.localStorage.getItem('username') || 'unspecified';
  // eslint-disable-next-line no-param-reassign
  body.username = username;
  return fetch(url, {
    method,
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(body),
  });
};

export default postWithUsername;
