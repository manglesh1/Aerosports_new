import { notFound } from "next/navigation";

export const fetchData = async (url) => {
  try {
    const response = await fetch(url); 
    if (!response.ok) notFound();

    const data = await response.json();
    if (!data || (Array.isArray(data) && data.length === 0)) notFound();

    return data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    notFound();
  }
};
