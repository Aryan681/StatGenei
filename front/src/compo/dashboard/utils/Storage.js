// storage.js
const TTL_MINUTES = 5;
const DATA_KEY = "dashboardData";
const TIMESTAMP_KEY = "dashboardDataTimestamp";

export const getStoredData = () => {
  try {
    const savedData = localStorage.getItem(DATA_KEY);
    const savedTimestamp = localStorage.getItem(TIMESTAMP_KEY);

    if (savedData && savedTimestamp) {
      const currentTime = new Date().getTime();
      const expirationTime = parseInt(savedTimestamp, 10) + TTL_MINUTES * 60 * 1000;

      if (currentTime < expirationTime) {
        return JSON.parse(savedData);
      } else {
        localStorage.removeItem(DATA_KEY);
        localStorage.removeItem(TIMESTAMP_KEY);
      }
    }
    return null;
  } catch (error) {
    console.error("Failed to parse data from localStorage", error);
    return null;
  }
};

export const setStoredData = (data) => {
  if (data) {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
    localStorage.setItem(TIMESTAMP_KEY, new Date().getTime().toString());
  } else {
    localStorage.removeItem(DATA_KEY);
    localStorage.removeItem(TIMESTAMP_KEY);
  }
};