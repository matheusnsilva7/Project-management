import axios from "../../node_modules/axios/index";
import { showAlert } from "./alerts";

const btn = document.querySelector(".button");

export const login = async (data, type) => {
  try {
    const url =
      type === "login" ? "/api/v1/users/login" : "/api/v1/users/signup";

    const res = await axios({
      method: "POST",
      url,
      data,
    });

    if (res.data.status === "success") {
      showAlert(
        "success",
        `${type === "login" ? "Logged in" : "Sign up"} succesfully!`
      );
      window.setTimeout(() => {
        location.assign("/projects");
      }, 1000);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
    type === "login"
      ? (btn.textContent = "Login")
      : (btn.textContent = "create");

    btn.disabled = false;
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/v1/users/logout",
    });

    if (res.data.status === "success") location.assign("/");
  } catch (err) {
    showAlert("error", "Error logging out! Try again.");
  }
};

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === "password"
        ? "/api/v1/users/updateMyPassword"
        : "/api/v1/users/updateMe";
    const res = await axios({
      method: "PATCH",
      url,
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", `${type.toUpperCase()} updated successfully!`);
      if (type !== "password") {
        window.setTimeout(() => {
          location.reload(true);
        }, 1000);
      }
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
    document.querySelector(".update").textContent = "Update";
    document.querySelector(".update").disabled = false;
  }
};
