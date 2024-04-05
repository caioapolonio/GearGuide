import { Button, Table } from "@radix-ui/themes";
import { useState } from "react";
import { supabase } from "../db/supabaseClient";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { CircleXIcon } from "lucide-react";

const PlayerRow = ({
  player,
  playersData,
  setPlayersData,
  errorMessage,
  setErrorMessage,
  successMessage,
  setSuccessMessage,
  fetchPlayersData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [editing, setEditing] = useState(false);

  const handleDeletePlayer = async (playerId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this player?",
    );
    if (confirmed) {
      try {
        const { data, error } = await supabase
          .from("mice")
          .delete()
          .eq("id", playerId);
        if (error) {
          console.error("Error deleting player:", error.message);
        } else {
          fetchMiceData();
          console.log("Player deleted successfully:", data);
        }
      } catch (error) {
        console.error("Error deleting player:", error.message);
      }
    }
  };

  const onUpdatePlayer = async (e) => {
    const { id, name, image_url } = e;
    const { data, error } = await supabase
      .from("mice")
      .update({ name: name, image_url: image_url })
      .eq("id", id);
    if (error) {
      console.log("ERROR", error);
      setErrorMessage(error.message);
      return;
    }
    setSuccessMessage("Player edited successfully!");
    fetchMiceData();
    console.log("EVENTO", e);
    console.log("DATA", data);
  };

  return (
    <>
      <Table.Row key={player.id} align={"center"}>
        <Table.RowHeaderCell>{player.name}</Table.RowHeaderCell>
        <Table.Cell>{player.image_url}</Table.Cell>
        <Table.Cell>
          <Button onClick={() => setEditing(!editing)}>Edit</Button>
        </Table.Cell>

        <Table.Cell>
          <Button onClick={() => handleDeletePlayer(player.id)}>Delete</Button>
        </Table.Cell>
      </Table.Row>
      {editing && (
        <>
          <Dialog.Root open={editing} onOpenChange={setEditing}>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0" />
              <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-zinc-800 p-6 drop-shadow-md focus:outline-none">
                <Dialog.Title className="flex items-center justify-center text-2xl  font-medium text-white">
                  Edit Player
                </Dialog.Title>
                <form
                  onSubmit={handleSubmit(onUpdatePlayer)}
                  className="flex flex-col gap-3"
                >
                  <div className="flex flex-col">
                    <label className="text-white">ID</label>
                    <input
                      className="rounded-md border border-[#171524] bg-neutral-200 p-2 outline-none"
                      name="id"
                      type="text"
                      defaultValue={player.id}
                      readOnly
                      {...register("id", {
                        required: {
                          value: true,
                          message: "O campo de id deve ser preenchido",
                        },
                      })}
                    />
                    <label className="text-white">Name</label>
                    <input
                      className="rounded-md border border-[#171524] bg-neutral-200 p-2 outline-none"
                      name="name"
                      type="text"
                      defaultValue={player.name}
                      {...register("name", {
                        required: {
                          value: true,
                          message: "O campo de nome deve ser preenchido",
                        },
                        validate: (value) =>
                          value.trim() !== "" || "Campo obrigatório",
                      })}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}

                    <label className="text-white">Image</label>
                    <input
                      className="rounded-md border border-[#171524] bg-neutral-200 p-2 outline-none"
                      name="image_url"
                      type="text"
                      defaultValue={player.image_url}
                      {...register("image_url", {
                        required: {
                          value: true,
                          message: "O campo de imagem deve ser preenchido",
                        },
                        validate: (value) =>
                          value.trim() !== "" || "Campo obrigatório",
                      })}
                    />
                    {errors.image_url && (
                      <p className="text-sm text-red-600">
                        {errors.image_url.message}
                      </p>
                    )}
                    {successMessage && (
                      <p className="text-green-500">{successMessage}</p>
                    )}
                  </div>

                  <button
                    className="rounded-md bg-purple-700 p-2 text-white drop-shadow-md"
                    type="submit"
                  >
                    Editar
                  </button>
                  {errorMessage && (
                    <div className="text-red-600">{errorMessage}</div>
                  )}
                </form>

                <div className="mt-[25px] flex justify-end"></div>
                <Dialog.Close asChild>
                  <button
                    className="absolute right-[10px] top-[10px] inline-flex items-center justify-center rounded-full "
                    aria-label="Close"
                  >
                    <CircleXIcon color="white" size={33} />
                  </button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </>
      )}
    </>
  );
};

export default PlayerRow;
