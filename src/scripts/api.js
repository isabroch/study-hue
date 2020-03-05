const api = (() => {
  const bridge = "192.168.8.100";
  const user = "5aIa9hv76PEvOsVjL2wrpYzDKxQWBpcH9L5SQUbh";
  return `http://${bridge}/api/${user}`;
})();

const postData = async (url = "", data = {}) => {
  const response = await fetch(api + url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await response.json();
};

const putData = async (url = "", data = {}) => {
  const response = await fetch(api + url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await response.json();
};

const getData = async (url = "") => {
  const response = await fetch(api + url);
  return await response.json();
};

export { postData as post, putData as put, getData as get };
