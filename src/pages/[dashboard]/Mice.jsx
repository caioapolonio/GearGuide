import { Button, Table } from "@radix-ui/themes";
import * as Dialog from "@radix-ui/react-dialog";
import Dashboard from "../../components/Dashboard";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../../db/supabaseClient";
import { CircleXIcon } from "lucide-react";
import MouseRow from "../../components/MouseRow";

const Mice = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [miceData, setMiceData] = useState([]);

  const handleInputChange = () => {
    setSuccessMessage("");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (e) => {
    const { name, image_url } = e;
    const { data, error } = await supabase
      .from("mice")
      .insert({ name: name, image_url: image_url });

    if (error) {
      console.log("ERROR", error);
      setErrorMessage(error.message);
    } else {
      setSuccessMessage("Mouse added successfully!");
      reset();
      fetchMiceData();
      console.log("EVENTO", e);
      console.log("DATA", data);
    }
  };

  async function fetchMiceData() {
    try {
      const { data, error } = await supabase.from("mice").select("*");
      if (error) {
        throw error;
      }
      console.log(data);
      setMiceData(data);
    } catch (error) {
      console.error("Erro ao recuperar dados:", error.message);
    }
  }

  useEffect(() => {
    fetchMiceData();
  }, []);

  return (
    <Dashboard>
      <Dialog.Root>
        <div className="flex justify-end pb-4">
          <Dialog.Trigger asChild>
            <Button variant="outline">Add Mouse</Button>
          </Dialog.Trigger>
        </div>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-zinc-800 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <Dialog.Title className="flex items-center justify-center text-2xl  font-medium text-white">
              Add Mouse
            </Dialog.Title>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-3"
            >
              <div className="flex flex-col">
                <label className="text-white">Name</label>
                <input
                  className="rounded-md border border-[#171524] bg-neutral-200 p-2 outline-none"
                  name="name"
                  type="text"
                  {...register("name", {
                    required: {
                      value: true,
                      message: "Preencha o campo de nome",
                    },
                    validate: (value) =>
                      value.trim() !== "" || "Campo obrigatório",
                  })}
                  onChange={handleInputChange}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-white">Image</label>
                <input
                  className="rounded-md border border-[#171524] bg-neutral-200 p-2 outline-none"
                  name="image"
                  type="text"
                  {...register("image_url", {
                    required: {
                      value: true,
                      message: "Preencha o campo de imagem",
                    },
                    validate: (value) =>
                      value.trim() !== "" || "Campo obrigatório",
                  })}
                  onChange={handleInputChange}
                />
                {errors.image_url && (
                  <p className="text-sm text-red-600">
                    {errors.image_url.message}
                  </p>
                )}
              </div>

              <button
                className="rounded-md bg-purple-700 p-2 text-white shadow-xl"
                type="submit"
              >
                Adicionar
              </button>
              {errorMessage && (
                <div className="text-red-600">{errorMessage}</div>
              )}
              {successMessage && ( // Conditionally render success message
                <p className="text-green-500">{successMessage}</p>
              )}
            </form>

            <div className="mt-[25px] flex justify-end"></div>
            <Dialog.Close asChild>
              <button
                className="absolute right-[10px] top-[10px] inline-flex appearance-none items-center justify-center "
                aria-label="Close"
              >
                <CircleXIcon color="white" size={33} />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <Table.Root variant="surface" size={3} layout={"fixed"}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Image</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {miceData.map((mouse) => (
            <MouseRow
              key={mouse.id}
              mouse={mouse}
              miceData={miceData}
              setMiceData={setMiceData}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              successMessage={successMessage}
              setSuccessMessage={setSuccessMessage}
              fetchMiceData={fetchMiceData}
            />
          ))}
        </Table.Body>
      </Table.Root>
    </Dashboard>
  );
};

export default Mice;
