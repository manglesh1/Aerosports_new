export const fetchData = async (url, options = {}) => {
  try {
    //console.log(`Fetching data from: ${url}`); // Log the URL being called
console.log('url:' +url)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // You can add other headers like Authorization if needed
        ...options.headers,
      },
      ...options, // Merge in other fetch options if necessary
    },{cache: 'no-store'});

    // Log status and response headers for debugging
    //console.log(`Response status: ${response.status}`);
    //console.log(`Response headers: ${JSON.stringify([...response.headers])}`);

    if (!response.ok) {
      // Log full response if it's not ok
      const errorText = await response.text(); // Get the response body in case of error
      console.error(`Error response body: ${errorText}`);
      //throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();

    // Log the data received
    //console.log('Data received:', data);
    return data;

  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
};
