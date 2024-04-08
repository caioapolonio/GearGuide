import { Table } from "@radix-ui/themes";
import {
  Button,
  Modal,
  Flex,
  TextInput,
  MultiSelect,
  NativeSelect,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { supabase } from "../db/supabaseClient";
import { useForm } from "react-hook-form";

const PlayerRow = ({
  player,
  playersData,
  setPlayersData,
  errorMessage,
  setErrorMessage,
  successMessage,
  setSuccessMessage,
  fetchPlayersData,
  games,
  monitors,
  mice,
  keyboards,
  headsets,
  mousepads,
  earphones,
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
          .from("players")
          .delete()
          .eq("player_id", playerId)
          .select();
        if (error) {
          console.error("Error deleting player:", error.message);
        } else {
          fetchPlayersData();
          console.log("Player deleted successfully:", data);
        }
      } catch (error) {
        console.error("Error deleting player:", error.message);
      }
    }
  };

  const handleUpdatePlayer = async (e) => {
    const { id, name, image_url } = e;
    const { data, error } = await supabase
      .from("players")
      .update({ name: name, image_url: image_url })
      .eq("player_id", id);
    if (error) {
      console.log("ERROR", error);
      setErrorMessage(error.message);
      return;
    }
    setSuccessMessage("Player edited successfully!");
    fetchPlayersData();
    console.log("EVENTO", e);
    console.log("DATA", data);
  };
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Table.Row align={"center"}>
        <Table.RowHeaderCell>{player.name}</Table.RowHeaderCell>
        <Table.Cell>{player.image_url}</Table.Cell>
        <Table.Cell>
          <Button variant="outline" onClick={open}>
            Edit
          </Button>
        </Table.Cell>

        <Table.Cell>
          <Button
            variant="outline"
            color="red"
            onClick={() => handleDeletePlayer(player.player_id)}
          >
            Delete
          </Button>
        </Table.Cell>
      </Table.Row>
      <Modal opened={opened} onClose={close} title="Edit Player" centered>
        <form onSubmit={handleSubmit(handleUpdatePlayer)}>
          <TextInput
            label="ID"
            defaultValue={player.player_id}
            readOnly
            mt="sm"
            {...register("player_id", {
              required: {
                value: true,
                message: "Preencha o campo de nome",
              },
              validate: (value) => value.trim() !== "" || "Campo obrigatório",
            })}
          />
          <MultiSelect
            data={games}
            label="Game"
            placeholder="Select game"
            mt="sm"
            searchable
            {...register("game_id")}
            onChange={(i) => {
              setValue("game_id", i);
            }}
          />
          <TextInput
            label="Name"
            placeholder="Name"
            mt="sm"
            defaultValue={player.name}
            {...register("name", {
              required: {
                value: true,
                message: "Preencha o campo de nome",
              },
              validate: (value) => value.trim() !== "" || "Campo obrigatório",
            })}
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
          <TextInput
            label="Image"
            placeholder="Image url"
            mt="sm"
            defaultValue={player.image_url}
            {...register("image_url", {
              required: {
                value: true,
                message: "Preencha o campo de imagem",
              },
              validate: (value) => value.trim() !== "" || "Campo obrigatório",
            })}
          />
          {errors.image_url && (
            <p className="text-sm text-red-600">{errors.image_url.message}</p>
          )}
          <NativeSelect
            label="Monitor"
            mt="sm"
            data={monitors}
            defaultValue={player.monitor_id}
            {...register("monitor_id")}
          />
          <NativeSelect
            label="Mouse"
            mt="sm"
            data={mice}
            defaultValue={player.mouse_id}
            {...register("mouse_id")}
          />
          <NativeSelect
            label="Keyboard"
            mt="sm"
            data={keyboards}
            {...register("keyboard_id")}
          />
          <NativeSelect
            label="Headset"
            mt="sm"
            data={headsets}
            {...register("headset_id")}
          />
          <NativeSelect
            label="Mousepad"
            mt="sm"
            data={mousepads}
            {...register("mousepad_id")}
          />
          <NativeSelect
            label="Earphone"
            mt="sm"
            data={earphones}
            {...register("earphone_id")}
          />

          <Flex justify="center" align="center">
            <Button fullWidth type="submit" mt="sm">
              Add player
            </Button>
          </Flex>
          <Flex>
            {errorMessage && <div className="text-red-600">{errorMessage}</div>}
            {successMessage && (
              <p className="text-green-500">{successMessage}</p>
            )}
          </Flex>
        </form>
      </Modal>

      <>
        {/* <Dialog.Root open={editing} onOpenChange={setEditing}>
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
                      defaultValue={player.player_id}
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
          </Dialog.Root> */}
      </>
    </>
  );
};

export default PlayerRow;
