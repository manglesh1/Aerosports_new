import { notFound } from "next/navigation";
import NodeCache from "node-cache";

// Initialize cache with a TTL of 4 hours (14400 seconds)
const cache = new NodeCache({ stdTTL: 14400 }); // 4 hours

export const fetchData = async (url) => {
  try {
    // Check if data is already cached
    const cachedData = cache.get(url);
    if (cachedData) {
      console.log(`Serving data from cache for ${url}`);
      return cachedData;
    }

    // Fetch fresh data if not cached or cache expired
    const response = await fetch(url);
    if (!response.ok) notFound();

    const data = await response.json();

    // Check if data is empty or invalid
    if (!data || (Array.isArray(data) && data.length === 0)) notFound();

    // Cache the fetched data
    cache.set(url, data);
    console.log(`Caching data for ${url}`);

    return data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    notFound();
  }
};
