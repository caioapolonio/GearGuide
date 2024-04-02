import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { supabase } from "../db/supabaseClient";

const SignUp = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (e) => {
    const { email, username, password } = e;
    try {
      const { data, error } = await supabase
        .from("user")
        .select("username")
        .eq("username", username);
      if (error) {
        console.error("Error checking username availability:", error);
        setErrorMessage(
          "An error occurred while checking username availability.",
        );
        return; // Prevent further execution if username check fails
      }
      if (data.length > 0) {
        setErrorMessage(
          "Username already exists. Please choose a different one.",
        );
        return; // Prevent further execution if username is taken
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
        .from("user")
        .update([{ username: username }])
        .eq("id", data.user.id);

      if (error) {
        console.error("Error updating profile:", error.message);
      } else {
        console.log("Profile updated successfully");
      }
      console.log("EVENT", e);
      console.log("DATA", data);
    }
  };

  return (
    <div className="mx-auto flex h-screen w-full flex-row bg-[#373545]">
      <div className="flex w-2/3 items-center overflow-hidden">
        <img
          className="center w-full"
          src="/src/assets/images/Image.svg"
          alt=""
        />
      </div>
      <div className="flex w-1/3 flex-col items-center justify-center">
        <img src="/src/assets/images/Frame_74.svg" alt="" />
        <div className="w-96">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col">
              <label className="text-white" htmlFor="email">
                E-mail
              </label>
              <input
                className="rounded-md border border-[#171524] bg-neutral-200 p-2 outline-none"
                placeholder="E-mail"
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
                className="rounded-md border border-[#171524] bg-neutral-200 p-2 outline-none"
                placeholder="Username"
                name="username"
                type="text"
                {...register("username", {
                  required: {
                    value: true,
                    message: "O campo de username deve ser preenchido",
                  },
                  minLength: {
                    value: 4,
                    message: "O username deve ter no mínimo 4 caracteres",
                  },
                })}
              />
              {errors.username && (
                <p className="text-sm text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-white" htmlFor="senha">
                Senha
              </label>
              <input
                className="rounded-md border border-[#171524] bg-neutral-200 p-2 outline-none"
                placeholder="Senha"
                name="password"
                type="password"
                {...register("password", {
                  required: {
                    value: true,
                    message: "Preencha o campo de senha",
                  },
                  minLength: {
                    value: 6,
                    message: "A senha precisa ter no mínimo 6 dígitos",
                  },
                })}
              />
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
              <div className="flex justify-between">
                <a
                  href=""
                  className="w-fit text-white underline hover:text-neutral-300"
                >
                  Esqueci minha senha
                </a>
                <Link
                  to="/"
                  className="w-fit text-white underline hover:text-neutral-300"
                >
                  Login
                </Link>
              </div>
            </div>

            <button
              className="rounded-md bg-violet-400 p-2 text-white"
              type="submit"
            >
              Entrar
            </button>
            {errorMessage && <div className="text-red-600">{errorMessage}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
