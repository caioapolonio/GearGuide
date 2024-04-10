import { Table } from "@radix-ui/themes";
import { Button, Modal, Flex, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { supabase } from "../db/supabaseClient";
import { useForm } from "react-hook-form";

const GameRow = ({
  game,
  errorMessage,
  setErrorMessage,
  successMessage,
  setSuccessMessage,
  fetchGamesData,
  handleInputChange,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [opened, { open, close }] = useDisclosure(false);

  const handleDeleteGame = async (gameId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this game?",
    );
    if (confirmed) {
      const { data, error } = await supabase
        .from("games")
        .delete()
        .eq("game_id", gameId);
      if (error) {
        console.error("Error deleting game:", error.message);
      } else {
        fetchGamesData();
        console.log("Game deleted successfully:", data);
      }
    }
  };

  const handleUpdateGame = async (e) => {
    const { game_id, name, image_url } = e;
    const { data, error } = await supabase
      .from("games")
      .update({ name: name, image_url: image_url })
      .eq("game_id", game_id)
      .select();
    if (error) {
      console.log("ERROR", error);
      setErrorMessage(error.message);
      return;
    }
    setSuccessMessage("Game edited successfully!");
    fetchGamesData();
    console.log("EVENT", e);
    console.log("DATA", data);
  };

  return (
    <>
      <Table.Row align={"center"}>
        <Table.RowHeaderCell>{game.name}</Table.RowHeaderCell>
        <Table.Cell>{game.image_url}</Table.Cell>
        <Table.Cell>
          <Button variant="outline" onClick={open}>
            Edit
          </Button>
        </Table.Cell>
        <Table.Cell>
          <Button
            variant="outline"
            color="red"
            onClick={() => handleDeleteGame(game.game_id)}
          >
            Delete
          </Button>
        </Table.Cell>
      </Table.Row>

      <Modal opened={opened} onClose={close} title="Edit Game" centered>
        <form
          onSubmit={handleSubmit(handleUpdateGame)}
          onChange={handleInputChange}
        >
          <TextInput
            label="ID"
            defaultValue={game.game_id}
            readOnly
            {...register("game_id", {
              required: {
                value: true,
                message: "Preencha o campo de nome",
              },
              validate: (value) => value.trim() !== "" || "Campo obrigatório",
            })}
          />
          <TextInput
            label="Name"
            placeholder="Name"
            mt="sm"
            defaultValue={game.name}
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
            defaultValue={game.image_url}
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
          <Flex justify="center" align="center">
            <Button fullWidth type="submit" mt="sm">
              Edit Game
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
    </>
  );
};

export default GameRow;
