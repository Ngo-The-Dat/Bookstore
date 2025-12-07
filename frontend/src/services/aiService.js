import axiosClient from "@/api/axiosClient";

export const aiService = {
  chat: (message) => {
    return axiosClient.post("/AI/converse", { message });
  }
};