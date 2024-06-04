import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../db/supabaseClient";
import { Button, Modal } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const SignUpBtn = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [openSignUp, setOpenSignUp] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let navigate = useNavigate();

  const onSubmit = async (e) => {
    const { email, username, password } = e;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username);
      if (error) {
        console.error("Error checking username availability:", error);
        setErrorMessage(
          "An error occurred while checking username availability.",
        );
        return;
      }

      if (data.length > 0) {
        setErrorMessage(
          "Username already exists. Please choose a different one.",
        );
        return;
      }
    } catch (error) {
      console.error("Error checking username availability:", error);
      setErrorMessage(
        "An error occurred while checking username availability.",
      );
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) {
      console.log(error);
      setErrorMessage(error.message);
    } else {
      const { error } = await supabase
        .from("profiles")
        .update([{ username: username }])
        .eq("id", data.user.id);

      if (error) {
        console.error("Error updating profile:", error.message);
      } else {
        console.log("Profile updated successfully");
      }
      console.log("EVENT", e);
      console.log("DATA", data);
      navigate("/");
    }
  };
  return (
    <>
      <Button color="violet" onClick={() => setOpenSignUp(true)}>
        Sign Up
      </Button>

      <Modal
        opened={openSignUp}
        onClose={() => setOpenSignUp(false)}
        centered
        title="Sign Up"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="flex flex-col">
            <label className="text-white" htmlFor="email">
              E-mail
            </label>
            <input
              className="rounded-md border border-[#171524] bg-neutral-200 p-2 text-black outline-none"
              name="email"
              type="email"
              {...register("email", {
                required: {
                  value: true,
                  message: "O campo de e-mail deve ser preenchido",
                },
                pattern: {
                  value: /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i,
                  message: "E-mail inválido",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-white" htmlFor="username">
              Username
            </label>
            <input
              className="rounded-md border border-[#171524] bg-neutral-200 p-2 text-black outline-none"
              name="username"
              type="text"
              {...register("username", {
                required: {
                  value: true,
                  message: "O campo de username deve ser preenchido",
                },
                minLength: {
                  value: 4,
                  message: "O username deve ter no mínimo 4 caractéres",
                },
              })}
            />
            {errors.username && (
              <p className="text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-white" htmlFor="senha">
              Senha
            </label>
            <input
              className="rounded-md border border-[#171524] bg-neutral-200 p-2 text-black outline-none"
              name="password"
              type="password"
              {...register("password", {
                required: {
                  value: true,
                  message: "Preencha o campo de senha",
                },
                minLength: {
                  value: 6,
                  message: "O username deve ter no mínimo 6 caractéres",
                },
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <button
            className="rounded-md bg-purple-700 p-2 text-white shadow-xl"
            type="submit"
          >
            Entrar
          </button>
          {errorMessage && <div className="text-red-600">{errorMessage}</div>}
        </form>
      </Modal>
    </>
  );
};

export default SignUpBtn;
