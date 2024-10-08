export const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

   // console.log('fetchdata'+url);
    return data;
  } catch (error) {
    throw error;
  }
};
