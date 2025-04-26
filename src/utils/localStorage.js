const saveStorage = (name, data) => {
  const JSONdata = JSON.stringify(data);
  localStorage.setItem(name, JSONdata);
};

const getStorage = (name) => {
  const JSONdata = localStorage.getItem(name);
  const data = JSON.parse(JSONdata);
  return data;
};

export { saveStorage, getStorage };
