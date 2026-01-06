import axiosClient from "@/api/axiosClient";

export const authService = {
  login: (email, password) => {
    return axiosClient.post("/auth/login", { EMAIL: email, PASSWORD: password });
  },
  register: (data) => {
    return axiosClient.post("/auth/signup", {
      FULL_NAME: data.fullName,
      EMAIL: data.email,
      PASSWORD: data.password,
      PHONE: data.phone,
      DATE_OF_BIRTH: data.dateOfBirth,
      GENDER: data.gender
    });
  },
  getCurrentUser: () => {
    return axiosClient.get("/users/get_current_user");
  },
  logout: () => {
    return axiosClient.post("/auth/logout");
  }
};