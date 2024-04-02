import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../db/supabaseClient";

const Login = ({ setSession, session }) => {
  console.log("SESSION ON LOGIN PAGE", session);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let navigate = useNavigate();

  const onSubmit = async (e) => {
    const { email, password } = e;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log("DATA", data);
    if (error) {
      console.log("ERROR", error);
      setErrorMessage(error.message);
    } else {
      setSession(data);
      navigate("/home");
      console.log("EVENTO", e);
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
                  to="/signup"
                  className="w-fit text-white underline hover:text-neutral-300"
                >
                  Criar conta
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

export default Login;
