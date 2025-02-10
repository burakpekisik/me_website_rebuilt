import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL

export const fetchContents = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/content`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
};

export const fetchContentsBySlug = async (slug) => {
  try {
    const response = await axios.get(`${BASE_URL}/content`);
    return response.data.find((post) => post.slug === slug);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
};
